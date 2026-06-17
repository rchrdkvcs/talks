import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { execa } from 'execa'
import fg from 'fast-glob'
import prompts from 'prompts'
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml'

type TalkStatus = 'draft' | 'ready' | 'archived'
type TalkTemplate = 'minimal' | 'conference' | 'workshop' | 'internal'

interface TalkMetadata {
  title: string
  slug: string
  date: string
  lang: string
  description: string
  status: TalkStatus
  event?: string
  speaker?: string
  venue?: string
  duration?: string
  tags: string[]
  links: Record<string, string>
  source?: string
}

interface Talk {
  slug: string
  dir: string
  slidesPath: string
  metadata: TalkMetadata
}

interface ValidationError {
  talk: string
  field: string
  message: string
}

interface CommandOptions {
  slug?: string
  yes: boolean
  noOpen: boolean
  template?: TalkTemplate
  title?: string
  event?: string
  date?: string
  lang?: string
  status?: TalkStatus
  publicOnly: boolean
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const talksDir = resolve(root, 'talks')
const catalogDir = resolve(root, 'docs', 'catalog')
const distDir = resolve(root, 'dist')

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const statuses: TalkStatus[] = ['draft', 'ready', 'archived']
const templates: TalkTemplate[] = ['minimal', 'conference', 'workshop', 'internal']

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function parseCommandArgs(args: string[]): CommandOptions & { positional: string[] } {
  const parsed = parseArgs({
    args,
    allowPositionals: true,
    options: {
      'all': { type: 'boolean' },
      'date': { type: 'string' },
      'event': { type: 'string' },
      'help': { type: 'boolean', short: 'h' },
      'lang': { type: 'string' },
      'no-open': { type: 'boolean' },
      'public': { type: 'boolean' },
      'slug': { type: 'string' },
      'status': { type: 'string' },
      'template': { type: 'string', short: 't' },
      'title': { type: 'string' },
      'yes': { type: 'boolean', short: 'y' },
    },
  })

  const template = typeof parsed.values.template === 'string' && templates.includes(parsed.values.template as TalkTemplate)
    ? parsed.values.template as TalkTemplate
    : undefined
  const status = typeof parsed.values.status === 'string' && statuses.includes(parsed.values.status as TalkStatus)
    ? parsed.values.status as TalkStatus
    : undefined

  return {
    positional: parsed.positionals,
    slug: typeof parsed.values.slug === 'string' ? parsed.values.slug : parsed.positionals[0],
    title: typeof parsed.values.title === 'string' ? parsed.values.title : undefined,
    event: typeof parsed.values.event === 'string' ? parsed.values.event : undefined,
    date: typeof parsed.values.date === 'string' ? parsed.values.date : undefined,
    lang: typeof parsed.values.lang === 'string' ? parsed.values.lang : undefined,
    status,
    template,
    yes: Boolean(parsed.values.yes),
    noOpen: Boolean(parsed.values['no-open']),
    publicOnly: Boolean(parsed.values.public),
  }
}

function readFrontmatter(markdown: string) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match)
    return {}

  const parsed = parseYaml(match[1])
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
    return {}

  return parsed as Record<string, unknown>
}

function stringValue(value: unknown) {
  if (value === undefined || value === null)
    return undefined
  if (value instanceof Date)
    return value.toISOString().slice(0, 10)
  return String(value)
}

function stringArray(value: unknown) {
  if (Array.isArray(value))
    return value.map(item => String(item)).filter(Boolean).sort((a, b) => a.localeCompare(b))
  if (typeof value === 'string' && value.trim())
    return value.split(',').map(item => item.trim()).filter(Boolean).sort((a, b) => a.localeCompare(b))
  return []
}

function stringRecord(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    return {}

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, item]) => item !== undefined && item !== null && String(item).trim())
      .map(([key, item]) => [key, String(item)]),
  )
}

function metadataFromFrontmatter(slug: string, fm: Record<string, unknown>): TalkMetadata {
  const status = stringValue(fm.status) as TalkStatus | undefined

  return {
    title: stringValue(fm.title) || slug,
    slug: stringValue(fm.slug) || slug,
    date: stringValue(fm.date) || '',
    lang: stringValue(fm.lang) || '',
    description: stringValue(fm.description) || '',
    status: status && statuses.includes(status) ? status : 'draft',
    event: stringValue(fm.event),
    speaker: stringValue(fm.speaker),
    venue: stringValue(fm.venue),
    duration: stringValue(fm.duration),
    tags: stringArray(fm.tags),
    links: stringRecord(fm.links),
    source: stringValue(fm.source),
  }
}

function compareTalks(a: Talk, b: Talk) {
  const date = b.metadata.date.localeCompare(a.metadata.date)
  return date || a.metadata.title.localeCompare(b.metadata.title) || a.slug.localeCompare(b.slug)
}

async function discoverTalks(): Promise<Talk[]> {
  const files = await fg('*/slides.md', {
    cwd: talksDir,
    onlyFiles: true,
  })

  const talks = await Promise.all(files.map(async (file) => {
    const slug = file.split('/')[0]
    const dir = resolve(talksDir, slug)
    const slidesPath = resolve(dir, 'slides.md')
    const markdown = await fs.readFile(slidesPath, 'utf-8')
    const metadata = metadataFromFrontmatter(slug, readFrontmatter(markdown))

    return { slug, dir, slidesPath, metadata }
  }))

  return talks.sort(compareTalks)
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false
  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
}

function validateTalks(talks: Talk[]) {
  const errors: ValidationError[] = []
  const slugs = new Map<string, string[]>()

  for (const talk of talks) {
    const metadata = talk.metadata
    const required: Array<keyof TalkMetadata> = ['title', 'slug', 'date', 'lang', 'description', 'status']

    for (const field of required) {
      const value = metadata[field]
      if (typeof value !== 'string' || !value.trim())
        errors.push({ talk: talk.slug, field, message: 'is required' })
    }

    if (!slugPattern.test(talk.slug))
      errors.push({ talk: talk.slug, field: 'slug', message: 'folder name must be lowercase kebab-case' })
    if (!slugPattern.test(metadata.slug))
      errors.push({ talk: talk.slug, field: 'slug', message: 'metadata slug must be lowercase kebab-case' })
    if (metadata.slug !== talk.slug)
      errors.push({ talk: talk.slug, field: 'slug', message: `metadata slug must match folder name "${talk.slug}"` })
    if (!isValidDate(metadata.date))
      errors.push({ talk: talk.slug, field: 'date', message: 'must be a valid YYYY-MM-DD date' })
    if (!statuses.includes(metadata.status))
      errors.push({ talk: talk.slug, field: 'status', message: `must be one of ${statuses.join(', ')}` })

    slugs.set(metadata.slug, [...(slugs.get(metadata.slug) || []), talk.slug])
  }

  for (const [slug, duplicates] of slugs) {
    if (duplicates.length > 1) {
      for (const talk of duplicates)
        errors.push({ talk, field: 'slug', message: `duplicates metadata slug "${slug}"` })
    }
  }

  return errors
}

async function loadValidTalks() {
  const talks = await discoverTalks()
  const errors = validateTalks(talks)
  if (errors.length)
    throw validationFailure(errors)
  return talks
}

function validationFailure(errors: ValidationError[]) {
  const error = new Error(errors.map(item => `- ${item.talk}.${item.field}: ${item.message}`).join('\n'))
  error.name = 'Validation failed'
  return error
}

function visibleTalks(talks: Talk[], publicOnly: boolean) {
  return publicOnly
    ? talks.filter(talk => talk.metadata.status === 'ready')
    : talks.filter(talk => talk.metadata.status !== 'archived')
}

function labelTalk(talk: Talk) {
  const meta = [
    talk.metadata.status,
    talk.metadata.date,
    talk.metadata.event,
    talk.metadata.lang,
  ].filter(Boolean).join(' | ')

  return `${talk.slug} - ${talk.metadata.title} (${meta})`
}

async function pickTalk(talks: Talk[], options: CommandOptions) {
  if (!talks.length)
    throw new Error('No talks found in ./talks')

  if (options.slug) {
    const talk = talks.find(talk => talk.slug === options.slug)
    if (!talk)
      throw new Error(`Talk not found: ${options.slug}`)
    return talk
  }

  if (options.yes)
    return talks[0]

  const result = await prompts({
    type: 'select',
    name: 'slug',
    message: 'Pick a talk',
    choices: talks.map(talk => ({
      title: labelTalk(talk),
      value: talk.slug,
    })),
  })

  const talk = talks.find(talk => talk.slug === result.slug)
  if (!talk)
    throw new Error('No talk selected')

  return talk
}

async function runDev(args: string[]) {
  const options = parseCommandArgs(args)
  const talks = visibleTalks(await loadValidTalks(), false)
  const talk = await pickTalk(talks, options)
  const slidevArgs = ['exec', 'slidev']

  if (!options.noOpen)
    slidevArgs.push('--open')

  await execa('pnpm', slidevArgs, {
    cwd: talk.dir,
    stdio: 'inherit',
  })
}

async function buildTalk(talk: Talk) {
  console.log(`Building ${talk.slug}`)
  await execa('pnpm', ['run', 'build'], {
    cwd: talk.dir,
    stdio: 'inherit',
  })
}

async function buildCommand(args: string[]) {
  const options = parseCommandArgs(args)
  const talks = visibleTalks(await loadValidTalks(), true)

  if (options.slug) {
    await buildTalk(await pickTalk(talks, options))
    return
  }

  await fs.rm(distDir, { recursive: true, force: true })
  await generateCatalog(talks, true)
  await generateWebIndex(talks)

  for (const talk of talks)
    await buildTalk(talk)
}

async function exportTalk(talk: Talk) {
  const output = resolve(distDir, 'artifacts', `${talk.slug}.pdf`)
  await fs.mkdir(dirname(output), { recursive: true })
  console.log(`Exporting ${talk.slug} to ${output}`)
  await execa('pnpm', ['exec', 'slidev', 'export', '--per-slide', '--output', output], {
    cwd: talk.dir,
    stdio: 'inherit',
  })
}

async function exportCommand(args: string[]) {
  const options = parseCommandArgs(args)
  const talks = visibleTalks(await loadValidTalks(), true)

  if (options.slug) {
    await exportTalk(await pickTalk(talks, options))
    return
  }

  if (!options.yes) {
    await exportTalk(await pickTalk(talks, options))
  }
  else {
    for (const talk of talks)
      await exportTalk(talk)
  }
}

function frontmatterFor(metadata: TalkMetadata, template: TalkTemplate) {
  const base: Record<string, unknown> = {
    theme: 'default',
    title: metadata.title,
    slug: metadata.slug,
    event: metadata.event || undefined,
    date: metadata.date,
    lang: metadata.lang,
    description: metadata.description,
    status: metadata.status,
    speaker: metadata.speaker || undefined,
    venue: metadata.venue || undefined,
    duration: metadata.duration || undefined,
    tags: metadata.tags,
    links: metadata.links,
    template,
    highlighter: 'shiki',
    css: 'unocss',
    colorSchema: 'dark',
    transition: 'fade-out',
    mdc: true,
    layout: 'cover',
    glowSeed: metadata.slug,
  }

  return stringifyYaml(base, {
    lineWidth: 0,
    sortMapEntries: false,
  }).replace(/\n([a-z][\w-]*): \n/g, '\n$1:\n')
}

function slidesFor(metadata: TalkMetadata, template: TalkTemplate) {
  const cover = `---
${frontmatterFor(metadata, template)}---

# ${metadata.title}

${metadata.event || 'Event to be announced'}
`

  const intro = `---
layout: intro
glow: left
---

# About

- ${metadata.speaker || 'Speaker'}
- ${metadata.venue || metadata.event || 'Context'}
`

  const section = (title: string, body: string) => `---
layout: section
glow: center
---

# ${title}

${body}
`

  const quote = `---
layout: quote
glow: right
---

> Add a short quote or framing statement here.
`

  const thanks = `---
layout: thanks
glow: top
---

# Thanks
`

  const bodies: Record<TalkTemplate, string[]> = {
    minimal: [
      section('First Idea', 'Start shaping the narrative here.'),
      thanks,
    ],
    conference: [
      intro,
      section('Context', 'Set up the problem and why it matters.'),
      section('Main Thread', 'Develop the core argument.'),
      quote,
      thanks,
    ],
    workshop: [
      intro,
      section('Agenda', '1. Setup\n2. Exercise\n3. Review'),
      section('Exercise', 'Add hands-on instructions and checkpoints here.'),
      thanks,
    ],
    internal: [
      section('Status', 'Summarize the current state.'),
      section('Decision', 'Name the recommendation or next step.'),
      thanks,
    ],
  }

  return `${cover}\n${bodies[template].join('\n')}`
}

function layoutWrapper(name: string) {
  return `<script setup lang="ts">
import SharedSlideLayout from '../../../shared/components/SharedSlideLayout.vue'
</script>

<template>
  <SharedSlideLayout variant="${name}">
    <slot />
  </SharedSlideLayout>
</template>
`
}

function packageJsonFor(slug: string) {
  return `{
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "slidev --open",
    "build": "tsx ../../scripts/build.ts",
    "export": "slidev export --per-slide --output ../../dist/artifacts/${slug}.pdf"
  }
}
`
}

function globalBottomVue() {
  return `<script setup lang="ts">
import SharedGlowBackground from '../../shared/components/SharedGlowBackground.vue'
</script>

<template>
  <SharedGlowBackground />
</template>
`
}

function styleCss() {
  return `@import '../../shared/style.css';
`
}

function readmeFor(talk: Talk) {
  const metadata = talk.metadata
  const lines = [
    `# ${metadata.title}`,
    '',
    metadata.description,
    '',
    '## Metadata',
    '',
    `- Slug: ${metadata.slug}`,
    `- Status: ${metadata.status}`,
    `- Date: ${metadata.date}`,
    `- Language: ${metadata.lang}`,
  ]

  if (metadata.event)
    lines.push(`- Event: ${metadata.event}`)
  if (metadata.speaker)
    lines.push(`- Speaker: ${metadata.speaker}`)
  if (metadata.venue)
    lines.push(`- Venue: ${metadata.venue}`)
  if (metadata.duration)
    lines.push(`- Duration: ${metadata.duration}`)
  if (metadata.tags.length)
    lines.push(`- Tags: ${metadata.tags.join(', ')}`)

  lines.push('', '## Links', '', `- Slides: /talks/${metadata.slug}/`, `- PDF: /artifacts/${metadata.slug}.pdf`, `- Source: talks/${metadata.slug}/slides.md`)

  for (const [label, url] of Object.entries(metadata.links))
    lines.push(`- ${label}: ${url}`)

  lines.push('', '## Commands', '', '```bash', `pnpm dev -- ${metadata.slug}`, `pnpm build -- ${metadata.slug}`, `pnpm export -- ${metadata.slug}`, '```', '')

  return lines.join('\n')
}

async function createTalk(args: string[]) {
  const options = parseCommandArgs(args)
  const initialSlug = options.slug || ''
  const initialTitle = options.title || ''
  const initialEvent = options.event || ''
  const initialDate = options.date || ''
  const initialLang = options.lang || 'fr'
  const initialStatus = options.status || 'draft'
  const initialTemplate = options.template

  const answers = await prompts([
    {
      type: initialTitle ? null : 'text',
      name: 'title',
      message: 'Talk title',
    },
    {
      type: initialSlug ? null : 'text',
      name: 'slug',
      message: 'Talk slug',
      initial: (_previous: unknown, values: { title?: string }) => slugify(values.title || initialTitle),
    },
    {
      type: initialTemplate ? null : 'select',
      name: 'template',
      message: 'Template',
      choices: templates.map(template => ({ title: template, value: template })),
      initial: 0,
    },
    {
      type: initialEvent ? null : 'text',
      name: 'event',
      message: 'Event',
    },
    {
      type: initialDate ? null : 'date',
      name: 'date',
      message: 'Date',
      mask: 'YYYY-MM-DD',
    },
    {
      type: initialLang ? null : 'text',
      name: 'lang',
      message: 'Language',
      initial: initialLang,
    },
  ])

  const title = initialTitle || answers.title
  const slug = slugify(initialSlug || answers.slug || title)
  const template = initialTemplate || answers.template || 'minimal'
  const event = initialEvent || answers.event || ''
  const dateValue = initialDate || (answers.date instanceof Date ? answers.date.toISOString().slice(0, 10) : '')
  const lang = initialLang || answers.lang || 'fr'

  if (!title)
    throw new Error('A title is required')
  if (!slug)
    throw new Error('A slug is required')

  const metadata: TalkMetadata = {
    title,
    slug,
    date: dateValue,
    lang,
    description: `${title} presentation.`,
    status: initialStatus,
    event,
    tags: [],
    links: {},
  }

  const target = resolve(talksDir, slug)
  if (existsSync(target))
    throw new Error(`Talk already exists: ${slug}`)

  const validationErrors = validateTalks([{ slug, dir: target, slidesPath: resolve(target, 'slides.md'), metadata }])
  if (validationErrors.length)
    throw validationFailure(validationErrors)

  await fs.mkdir(resolve(target, 'components'), { recursive: true })
  await fs.mkdir(resolve(target, 'public'), { recursive: true })
  await fs.mkdir(resolve(target, 'layouts'), { recursive: true })

  await fs.writeFile(resolve(target, 'slides.md'), slidesFor(metadata, template), 'utf-8')
  await fs.writeFile(resolve(target, 'package.json'), packageJsonFor(slug), 'utf-8')
  await fs.writeFile(resolve(target, 'global-bottom.vue'), globalBottomVue(), 'utf-8')
  await fs.writeFile(resolve(target, 'style.css'), styleCss(), 'utf-8')
  await Promise.all(['intro', 'section', 'quote', 'thanks'].map(layout =>
    fs.writeFile(resolve(target, 'layouts', `${layout}.vue`), layoutWrapper(layout), 'utf-8'),
  ))
  await fs.writeFile(resolve(target, 'README.md'), readmeFor({ slug, dir: target, slidesPath: resolve(target, 'slides.md'), metadata }), 'utf-8')

  console.log(`Created talks/${slug}`)
}

function catalogData(talks: Talk[]) {
  return talks.map(talk => ({
    slug: talk.metadata.slug,
    title: talk.metadata.title,
    description: talk.metadata.description,
    status: talk.metadata.status,
    date: talk.metadata.date,
    lang: talk.metadata.lang,
    event: talk.metadata.event || null,
    speaker: talk.metadata.speaker || null,
    venue: talk.metadata.venue || null,
    duration: talk.metadata.duration || null,
    tags: talk.metadata.tags,
    links: {
      slides: `/talks/${talk.metadata.slug}/`,
      pdf: `/artifacts/${talk.metadata.slug}.pdf`,
      source: `talks/${talk.metadata.slug}/slides.md`,
      ...talk.metadata.links,
    },
  }))
}

function catalogMarkdown(talks: Talk[]) {
  const lines = [
    '# Talk Catalog',
    '',
    'Generated from Talk Metadata. Run `pnpm sync` to refresh.',
    '',
  ]

  for (const talk of talks) {
    const metadata = talk.metadata
    lines.push(`## ${metadata.title}`, '')
    lines.push(`- Slug: ${metadata.slug}`)
    lines.push(`- Status: ${metadata.status}`)
    lines.push(`- Date: ${metadata.date}`)
    lines.push(`- Language: ${metadata.lang}`)
    if (metadata.event)
      lines.push(`- Event: ${metadata.event}`)
    if (metadata.tags.length)
      lines.push(`- Tags: ${metadata.tags.join(', ')}`)
    lines.push(`- Slides: /talks/${metadata.slug}/`)
    lines.push(`- PDF: /artifacts/${metadata.slug}.pdf`)
    lines.push('', metadata.description, '')
  }

  return lines.join('\n')
}

async function generateCatalog(talks: Talk[], publicOnly: boolean) {
  const selectedTalks = visibleTalks(talks, publicOnly)
  await fs.mkdir(catalogDir, { recursive: true })
  await fs.writeFile(resolve(catalogDir, 'talks.json'), `${JSON.stringify(catalogData(selectedTalks), null, 2)}\n`, 'utf-8')
  await fs.writeFile(resolve(catalogDir, 'README.md'), catalogMarkdown(selectedTalks), 'utf-8')
  return selectedTalks
}

async function generateWebIndex(talks: Talk[]) {
  const data = catalogData(talks)
  const tags = [...new Set(data.flatMap(talk => talk.tags))].sort((a, b) => a.localeCompare(b))
  const languages = [...new Set(data.map(talk => talk.lang))].sort((a, b) => a.localeCompare(b))

  await fs.mkdir(distDir, { recursive: true })
  await fs.writeFile(resolve(distDir, 'index.html'), `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Talk Catalog</title>
  <style>
    :root { color-scheme: dark; font-family: Inter, ui-sans-serif, system-ui, sans-serif; background: #050505; color: #f5f5f5; }
    body { margin: 0; min-height: 100vh; background: radial-gradient(circle at 20% 0%, #2a1746 0, transparent 34rem), #050505; }
    main { width: min(1080px, calc(100% - 32px)); margin: 0 auto; padding: 56px 0; }
    h1 { margin: 0 0 12px; font-size: clamp(2rem, 6vw, 4rem); line-height: 1; letter-spacing: 0; }
    .filters { display: flex; flex-wrap: wrap; gap: 8px; margin: 32px 0; }
    button { border: 1px solid #ffffff24; border-radius: 8px; padding: 8px 12px; background: #ffffff10; color: inherit; cursor: pointer; }
    button[aria-pressed="true"] { background: #ffffff; color: #050505; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
    article { border: 1px solid #ffffff18; border-radius: 8px; padding: 20px; background: #0d0d0dcc; }
    h2 { margin: 0 0 8px; font-size: 1.25rem; letter-spacing: 0; }
    p { color: #d4d4d4; line-height: 1.55; }
    .meta, .links { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
    span, a { border: 1px solid #ffffff18; border-radius: 999px; padding: 4px 8px; color: #e8e8e8; font-size: .875rem; text-decoration: none; }
  </style>
</head>
<body>
  <main>
    <h1>Talk Catalog</h1>
    <p>Presentations generated from repository Talk Metadata.</p>
    <div class="filters" aria-label="Filters">
      <button type="button" data-filter="all" aria-pressed="true">All</button>
      ${languages.map(lang => `<button type="button" data-lang="${lang}" aria-pressed="false">${lang}</button>`).join('\n      ')}
      ${tags.map(tag => `<button type="button" data-tag="${tag}" aria-pressed="false">${tag}</button>`).join('\n      ')}
    </div>
    <section class="grid">
      ${data.map(talk => `<article data-lang="${talk.lang}" data-tags="${talk.tags.join(' ')}">
        <h2>${talk.title}</h2>
        <p>${talk.description}</p>
        <div class="meta">
          <span>${talk.status}</span>
          <span>${talk.date}</span>
          <span>${talk.lang}</span>
          ${talk.event ? `<span>${talk.event}</span>` : ''}
        </div>
        <div class="links">
          <a href="${talk.links.slides}">Slides</a>
          <a href="${talk.links.pdf}">PDF</a>
          <a href="${talk.links.source}">Source</a>
        </div>
      </article>`).join('\n      ')}
    </section>
  </main>
  <script>
    const buttons = [...document.querySelectorAll('button')]
    const articles = [...document.querySelectorAll('article')]
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        buttons.forEach(item => item.setAttribute('aria-pressed', 'false'))
        button.setAttribute('aria-pressed', 'true')
        const lang = button.dataset.lang
        const tag = button.dataset.tag
        articles.forEach((article) => {
          const visible = !lang && !tag || article.dataset.lang === lang || article.dataset.tags.split(' ').includes(tag)
          article.hidden = !visible
        })
      })
    })
  </script>
</body>
</html>
`, 'utf-8')
}

async function syncCommand(args: string[]) {
  const options = parseCommandArgs(args)
  const talks = await loadValidTalks()

  for (const talk of talks)
    await fs.writeFile(resolve(talk.dir, 'README.md'), readmeFor(talk), 'utf-8')

  const selectedTalks = await generateCatalog(talks, options.publicOnly)
  console.log(`Synced ${talks.length} talk README file(s) and ${selectedTalks.length} catalog item(s)`)
}

async function catalogCommand(args: string[]) {
  const options = parseCommandArgs(args)
  const talks = await loadValidTalks()
  const selectedTalks = await generateCatalog(talks, options.publicOnly)
  console.log(`Generated catalog for ${selectedTalks.length} talk(s)`)
}

async function publishCommand() {
  const talks = visibleTalks(await loadValidTalks(), true)
  await fs.rm(distDir, { recursive: true, force: true })
  await generateCatalog(talks, true)
  await generateWebIndex(talks)

  for (const talk of talks) {
    await buildTalk(talk)
    await exportTalk(talk)
  }
}

async function validateCommand() {
  const talks = await discoverTalks()
  const errors = validateTalks(talks)
  if (errors.length)
    throw validationFailure(errors)

  console.log(`Validated ${talks.length} talk(s)`)
}

async function printList(args: string[]) {
  const options = parseCommandArgs(args)
  const talks = visibleTalks(await loadValidTalks(), options.publicOnly)
  for (const talk of talks)
    console.log(labelTalk(talk))
}

function printHelp() {
  console.log(`Talk Manager

Usage:
  pnpm talks [--public]
  pnpm validate
  pnpm sync [--public]
  pnpm catalog [--public]
  pnpm dev [slug] [--no-open] [-y]
  pnpm build [slug]
  pnpm export [slug] [-y]
  pnpm publish
  pnpm new [slug] --title <title> --date <YYYY-MM-DD> [--template minimal|conference|workshop|internal]

Commands:
  list       List Talks sorted by date
  validate   Validate Talk structure and metadata
  sync       Regenerate Talk READMEs and catalog files
  catalog    Regenerate structured and Markdown catalog files
  dev        Run one Talk locally
  build      Build one Talk, or all ready Talks when no slug is given
  export     Export one Talk PDF, or all ready Talks with --yes
  publish    Build catalog, all ready Talks, and PDF artifacts
  new        Create a Talk from a template
`)
}

async function main() {
  const [command = 'list', ...args] = process.argv.slice(2)

  if (args.includes('--help') || args.includes('-h') || command === 'help' || command === '--help' || command === '-h') {
    printHelp()
    return
  }

  switch (command) {
    case 'list':
      await printList(args)
      break
    case 'validate':
      await validateCommand()
      break
    case 'sync':
      await syncCommand(args)
      break
    case 'catalog':
      await catalogCommand(args)
      break
    case 'dev':
      await runDev(args)
      break
    case 'build':
      await buildCommand(args)
      break
    case 'export':
      await exportCommand(args)
      break
    case 'publish':
      await publishCommand()
      break
    case 'new':
      await createTalk(args)
      break
    default:
      throw new Error(`Unknown command: ${command}`)
  }
}

try {
  await main()
}
catch (error) {
  console.error(error instanceof Error ? `${error.name}: ${error.message}` : error)
  process.exitCode = 1
}
