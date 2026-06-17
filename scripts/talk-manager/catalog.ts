import type { Talk } from './domain.ts'
import fs from 'node:fs/promises'
import { resolve } from 'node:path'
import { catalogDir, distDir, talkPdfHref, talkPublicBase, talkSourceHref } from './paths.ts'
import { selectPublicTalks } from './policy.ts'

interface CatalogTalk {
  slug: string
  title: string
  description: string
  status: string
  date: string
  lang: string
  event: string | null
  speaker: string | null
  venue: string | null
  duration: string | null
  tags: string[]
  links: Record<string, string>
}

function catalogTalk(talk: Talk): CatalogTalk {
  const slug = talk.metadata.slug

  return {
    slug,
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
      slides: talkPublicBase(slug),
      pdf: talkPdfHref(slug),
      source: talkSourceHref(slug),
      ...talk.metadata.links,
    },
  }
}

export function catalogData(talks: Talk[]) {
  return talks.map(catalogTalk)
}

export function talkReadme(talk: Talk) {
  const item = catalogTalk(talk)
  const lines = [
    `# ${item.title}`,
    '',
    item.description,
    '',
    '## Metadata',
    '',
    `- Slug: ${item.slug}`,
    `- Status: ${item.status}`,
    `- Date: ${item.date}`,
    `- Language: ${item.lang}`,
  ]

  if (item.event)
    lines.push(`- Event: ${item.event}`)
  if (item.speaker)
    lines.push(`- Speaker: ${item.speaker}`)
  if (item.venue)
    lines.push(`- Venue: ${item.venue}`)
  if (item.duration)
    lines.push(`- Duration: ${item.duration}`)
  if (item.tags.length)
    lines.push(`- Tags: ${item.tags.join(', ')}`)

  lines.push('', '## Links', '', `- Slides: ${item.links.slides}`, `- PDF: ${item.links.pdf}`, `- Source: ${item.links.source}`)

  for (const [label, url] of Object.entries(item.links)) {
    if (!['slides', 'pdf', 'source'].includes(label))
      lines.push(`- ${label}: ${url}`)
  }

  lines.push('', '## Commands', '', '```bash', `pnpm dev -- ${item.slug}`, `pnpm build -- ${item.slug}`, `pnpm export -- ${item.slug}`, '```', '')

  return lines.join('\n')
}

function catalogMarkdown(items: CatalogTalk[]) {
  const lines = [
    '# Talk Catalog',
    '',
    'Generated from Talk Metadata. Run `pnpm sync` to refresh.',
    '',
  ]

  for (const item of items) {
    lines.push(`## ${item.title}`, '')
    lines.push(`- Slug: ${item.slug}`)
    lines.push(`- Status: ${item.status}`)
    lines.push(`- Date: ${item.date}`)
    lines.push(`- Language: ${item.lang}`)
    if (item.event)
      lines.push(`- Event: ${item.event}`)
    if (item.tags.length)
      lines.push(`- Tags: ${item.tags.join(', ')}`)
    lines.push(`- Slides: ${item.links.slides}`)
    lines.push(`- PDF: ${item.links.pdf}`)
    lines.push('', item.description, '')
  }

  return lines.join('\n')
}

export async function generateCatalog(talks: Talk[], publicOnly: boolean) {
  const selectedTalks = publicOnly ? selectPublicTalks(talks) : talks
  const items = catalogData(selectedTalks)

  await fs.mkdir(catalogDir, { recursive: true })
  await fs.writeFile(resolve(catalogDir, 'talks.json'), `${JSON.stringify(items, null, 2)}\n`, 'utf-8')
  await fs.writeFile(resolve(catalogDir, 'README.md'), catalogMarkdown(items), 'utf-8')

  return selectedTalks
}

export async function generateWebIndex(talks: Talk[]) {
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
    :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, sans-serif; background: #f8fbff; color: #101828; }
    body { margin: 0; min-height: 100vh; background: radial-gradient(circle at 18% 0%, #0f53ff1c 0, transparent 34rem), radial-gradient(circle at 92% 12%, #ff6b5f24 0, transparent 28rem), linear-gradient(135deg, #f8fbff 0%, #f6f0ff 48%, #fff7f3 100%); }
    main { width: min(1080px, calc(100% - 32px)); margin: 0 auto; padding: 56px 0; }
    h1 { margin: 0 0 12px; font-size: clamp(2rem, 6vw, 4rem); line-height: 1; letter-spacing: 0; }
    .filters { display: flex; flex-wrap: wrap; gap: 8px; margin: 32px 0; }
    button { border: 1px solid #c7d2e5; border-radius: 8px; padding: 8px 12px; background: #ffffffbf; color: inherit; cursor: pointer; }
    button[aria-pressed="true"] { background: #0f53ff; border-color: #0f53ff; color: #ffffff; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
    article { border: 1px solid #c7d2e5a6; border-radius: 8px; padding: 20px; background: #ffffffd9; box-shadow: 0 18px 48px #24416f14; }
    h2 { margin: 0 0 8px; font-size: 1.25rem; letter-spacing: 0; }
    p { color: #566579; line-height: 1.55; }
    .meta, .links { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
    span, a { border: 1px solid #c7d2e5a6; border-radius: 999px; padding: 4px 8px; color: #24416f; background: #ffffff99; font-size: .875rem; text-decoration: none; }
    a { color: #0f53ff; }
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
