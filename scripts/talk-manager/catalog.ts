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
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Présentations, conférences et supports de Richard Kovacs.">
  <title>Présentations — Richard Kovacs</title>
  <style>
    :root {
      color-scheme: light;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif;
      color: #171717;
      background: #f5f5f2;
      font-synthesis: none;
    }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; }
    a { color: inherit; }
    button, select { font: inherit; }
    [hidden] { display: none !important; }
    .shell { width: min(1180px, calc(100% - 40px)); margin: 0 auto; padding: 64px 0 112px; }
    .intro { display: grid; grid-template-columns: 1fr auto; align-items: end; gap: 32px; padding-bottom: 34px; border-bottom: 1px solid #d9d9d4; }
    .eyebrow { margin: 0 0 12px; color: #666; font-size: .75rem; font-weight: 700; letter-spacing: .11em; text-transform: uppercase; }
    h1 { max-width: 760px; margin: 0; font-size: clamp(2.6rem, 7vw, 6.5rem); font-weight: 520; letter-spacing: -.065em; line-height: .92; }
    .intro-copy { max-width: 360px; margin: 22px 0 0; color: #666; line-height: 1.55; }
    .filter { min-width: 210px; padding: 10px 34px 10px 12px; border: 1px solid #d2d2cc; border-radius: 7px; color: #333; background: #fafaf8; }
    .catalog { padding-top: 28px; }
    .catalog-heading { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 20px; }
    .catalog-heading h2 { margin: 0; font-size: .78rem; letter-spacing: .09em; text-transform: uppercase; }
    .count { color: #888; font-size: .78rem; }
    .talk-title { margin: 0; letter-spacing: -.025em; line-height: 1.08; }
    .talk-description { color: #666; line-height: 1.55; }
    .talk-meta { color: #777; font-size: .76rem; letter-spacing: .02em; text-transform: uppercase; }
    .talk-links { display: flex; gap: 16px; }
    .talk-links a { font-size: .82rem; font-weight: 650; text-underline-offset: 4px; }
    .talk-links a:first-child { text-decoration: none; }
    .talk-links a:first-child::after { content: " ↗"; }

    .library-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
    .library-talk { min-width: 0; }
    .library-cover { display: flex; aspect-ratio: 4 / 3; padding: 24px; align-items: flex-end; margin-bottom: 16px; border: 1px solid #d4d4cf; border-radius: 3px; text-decoration: none; background: #e9e9e4; transition: transform 160ms ease, background 160ms ease; }
    .library-talk:nth-child(2n) .library-cover { background: #deded8; }
    .library-talk:nth-child(3n) .library-cover { background: #ece9e3; }
    .library-cover:hover { transform: translateY(-3px); background: #171717; color: white; }
    .library-cover span { max-width: 95%; font-size: clamp(1.4rem, 2.35vw, 2.25rem); font-weight: 540; letter-spacing: -.045em; line-height: 1; }
    .library-details { display: grid; grid-template-columns: 1fr auto; gap: 14px; }
    .library-details .talk-description { margin: 9px 0 16px; font-size: .9rem; }

    @media (max-width: 800px) {
      .shell { width: min(100% - 28px, 1180px); padding-top: 34px; }
      .intro { grid-template-columns: 1fr; }
      .filter { width: 100%; }
      .library-grid { grid-template-columns: 1fr; }
      .library-grid { gap: 40px; }
    }
  </style>
  </head>
<body>
  <main class="shell">
    <div class="intro">
      <div>
        <p class="eyebrow">Présentations</p>
        <h1>Idées, systèmes<br>et retours d’expérience.</h1>
        <p class="intro-copy">Une sélection de supports autour du web, de l’architecture logicielle et de l’infrastructure.</p>
      </div>
      <label>
        <span class="eyebrow">Filtrer</span>
        <select class="filter" id="catalog-filter">
          <option value="all">Toutes les présentations</option>
          ${languages.map(lang => `<option value="lang:${lang}">Langue · ${lang.toUpperCase()}</option>`).join('\n          ')}
          ${tags.map(tag => `<option value="tag:${tag}">Sujet · ${tag}</option>`).join('\n          ')}
        </select>
      </label>
    </div>

    <section class="catalog">
      <div class="catalog-heading">
        <h2>Bibliothèque</h2>
        <span class="count">${data.length} présentations</span>
      </div>
      <div class="library-grid">
        ${data.map(talk => `<article class="library-talk" data-talk data-lang="${talk.lang}" data-tags="${talk.tags.join(' ')}">
          <a class="library-cover" href="${talk.links.slides}">
            <span>${talk.title}</span>
          </a>
          <div class="library-details">
            <div>
              <div class="talk-meta">${talk.date}${talk.event ? ` · ${talk.event}` : ''}</div>
              <p class="talk-description">${talk.description}</p>
              <div class="talk-links">
                <a href="${talk.links.slides}">Voir</a>
                <a href="${talk.links.pdf}">PDF</a>
              </div>
            </div>
          </div>
        </article>`).join('\n        ')}
      </div>
    </section>
  </main>

  <script>
    const filter = document.querySelector('#catalog-filter')

    function applyFilter() {
      const [type, value] = filter.value.split(':')
      document.querySelectorAll('[data-talk]').forEach((talk) => {
        const visible = type === 'all'
          || type === 'lang' && talk.dataset.lang === value
          || type === 'tag' && talk.dataset.tags.split(' ').includes(value)
        talk.hidden = !visible
      })
    }

    filter.addEventListener('change', applyFilter)
  </script>
</body>
</html>
`, 'utf-8')
}
