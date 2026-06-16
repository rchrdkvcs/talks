import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { execa } from 'execa'
import fg from 'fast-glob'
import prompts from 'prompts'

interface TalkMetadata {
  title: string
  event?: string
  date?: string
  lang?: string
  description?: string
}

interface Talk {
  slug: string
  dir: string
  metadata: TalkMetadata
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const talksDir = resolve(root, 'talks')

function parseArgs(args: string[]) {
  const flags = new Map<string, string | boolean>()
  const positional: string[] = []

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--')
      continue
    if (arg === '-y') {
      flags.set('y', true)
      continue
    }
    if (!arg.startsWith('--')) {
      positional.push(arg)
      continue
    }

    const key = arg.slice(2)
    const next = args[i + 1]
    if (next && !next.startsWith('--')) {
      flags.set(key, next)
      i++
    }
    else {
      flags.set(key, true)
    }
  }

  return { flags, positional }
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function readFrontmatter(markdown: string) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/)
  const metadata: Record<string, string> = {}
  if (!match)
    return metadata

  for (const line of match[1].split('\n')) {
    const separator = line.indexOf(':')
    if (separator < 1)
      continue

    const key = line.slice(0, separator)
    if (!/^[a-z][\w-]*$/i.test(key))
      continue

    metadata[key] = line.slice(separator + 1).trim().replace(/^["']|["']$/g, '')
  }

  return metadata
}

async function listTalks(): Promise<Talk[]> {
  const files = await fg('*/slides.md', {
    cwd: talksDir,
    onlyFiles: true,
  })

  const talks = await Promise.all(files.map(async (file) => {
    const slug = file.split('/')[0]
    const dir = resolve(talksDir, slug)
    const markdown = await fs.readFile(resolve(dir, 'slides.md'), 'utf-8')
    const fm = readFrontmatter(markdown)

    return {
      slug,
      dir,
      metadata: {
        title: fm.title || slug,
        event: fm.event,
        date: fm.date,
        lang: fm.lang,
        description: fm.description,
      },
    }
  }))

  return talks.sort((a, b) => {
    const date = (b.metadata.date || '').localeCompare(a.metadata.date || '')
    return date || a.slug.localeCompare(b.slug)
  })
}

function labelTalk(talk: Talk) {
  const meta = [
    talk.metadata.date,
    talk.metadata.event,
    talk.metadata.lang,
  ].filter(Boolean).join(' | ')

  return meta
    ? `${talk.slug} - ${talk.metadata.title} (${meta})`
    : `${talk.slug} - ${talk.metadata.title}`
}

async function pickTalk(talks: Talk[], yes: boolean) {
  if (!talks.length)
    throw new Error('No talks found in ./talks')

  if (yes)
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

async function runTalkScript(command: string, args: string[]) {
  const { flags, positional } = parseArgs(args)
  const talks = await listTalks()
  const talk = positional[0]
    ? talks.find(talk => talk.slug === positional[0])
    : await pickTalk(talks, flags.has('y') || flags.has('yes'))

  if (!talk)
    throw new Error(`Talk not found: ${positional[0]}`)

  await execa('pnpm', ['run', command], {
    cwd: talk.dir,
    stdio: 'inherit',
  })
}

async function buildAll() {
  const talks = await listTalks()
  await fs.rm(resolve(root, 'dist'), { recursive: true, force: true })
  for (const talk of talks) {
    console.log(`\nBuilding ${talk.slug}`)
    await execa('pnpm', ['run', 'build'], {
      cwd: talk.dir,
      stdio: 'inherit',
    })
  }
}

function yamlString(value: string) {
  return JSON.stringify(value)
}

async function createTalk(args: string[]) {
  const { flags, positional } = parseArgs(args)
  const initialSlug = positional[0] || (typeof flags.get('slug') === 'string' ? flags.get('slug') as string : '')
  const initialTitle = typeof flags.get('title') === 'string' ? flags.get('title') as string : ''
  const initialEvent = typeof flags.get('event') === 'string' ? flags.get('event') as string : ''
  const initialDate = typeof flags.get('date') === 'string' ? flags.get('date') as string : ''
  const initialLang = typeof flags.get('lang') === 'string' ? flags.get('lang') as string : 'fr'

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
  const event = initialEvent || answers.event || ''
  const dateValue = initialDate || (answers.date instanceof Date ? answers.date.toISOString().slice(0, 10) : '')
  const lang = initialLang || answers.lang || 'fr'

  if (!title)
    throw new Error('A title is required')
  if (!slug)
    throw new Error('A slug is required')

  const target = resolve(talksDir, slug)
  if (existsSync(target))
    throw new Error(`Talk already exists: ${slug}`)

  await fs.mkdir(resolve(target, 'components'), { recursive: true })
  await fs.mkdir(resolve(target, 'public'), { recursive: true })

  await fs.writeFile(resolve(target, 'slides.md'), `---
theme: default
title: ${yamlString(title)}
event: ${yamlString(event)}
date: ${yamlString(dateValue)}
lang: ${yamlString(lang)}
description: ${yamlString('')}
highlighter: shiki
css: unocss
colorSchema: dark
transition: fade-out
mdc: true
layout: cover
glowSeed: ${yamlString(slug)}
---

# ${title}

${event || 'Event to be announced'}

---
layout: center
glow: bottom
---

# First Idea

Start shaping the narrative here.

---
layout: end
glow: top
---

# Thanks
`, 'utf-8')

  await fs.writeFile(resolve(target, 'package.json'), `{
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "slidev --open",
    "build": "tsx ../../scripts/build.ts",
    "export": "slidev export --per-slide --output ./${slug}.pdf"
  }
}
`, 'utf-8')

  await fs.writeFile(resolve(target, 'global-bottom.vue'), `<script setup lang="ts">
import SharedGlowBackground from '../../shared/components/SharedGlowBackground.vue'
</script>

<template>
  <SharedGlowBackground />
</template>
`, 'utf-8')

  await fs.writeFile(resolve(target, 'style.css'), `@import '../../shared/style.css';
`, 'utf-8')

  await fs.writeFile(resolve(target, 'README.md'), `# ${title}

${event ? `- Event: ${event}\n` : ''}${dateValue ? `- Date: ${dateValue}\n` : ''}- Language: ${lang}

## Commands

\`\`\`bash
pnpm dev
pnpm build
pnpm export
\`\`\`
`, 'utf-8')

  console.log(`Created talks/${slug}`)
}

async function printList() {
  const talks = await listTalks()
  for (const talk of talks)
    console.log(labelTalk(talk))
}

async function main() {
  const [command = 'list', ...args] = process.argv.slice(2)

  switch (command) {
    case 'list':
      await printList()
      break
    case 'dev':
      await runTalkScript('dev', args)
      break
    case 'build':
      if (args.length)
        await runTalkScript('build', args)
      else
        await buildAll()
      break
    case 'export':
      await runTalkScript('export', args)
      break
    case 'new':
      await createTalk(args)
      break
    default:
      throw new Error(`Unknown command: ${command}`)
  }
}

await main()
