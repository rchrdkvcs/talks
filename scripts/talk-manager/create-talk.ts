import type { TalkMetadata } from './domain.ts'
import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import { resolve } from 'node:path'
import prompts from 'prompts'
import { parseCommandArgs } from './args.ts'
import { talkReadme } from './catalog.ts'
import { slugify, templates } from './domain.ts'
import { validateTalks, validationFailure } from './metadata.ts'
import { talkDir, talkSlidesPath } from './paths.ts'
import { globalBottomVue, layoutWrapper, packageJsonFor, slidesFor, styleCss } from './templates.ts'

export async function createTalk(args: string[]) {
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

  const target = talkDir(slug)
  if (existsSync(target))
    throw new Error(`Talk already exists: ${slug}`)

  const talk = { slug, dir: target, slidesPath: talkSlidesPath(slug), metadata }
  const validationErrors = validateTalks([talk])
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
  await fs.writeFile(resolve(target, 'README.md'), talkReadme(talk), 'utf-8')

  console.log(`Created talks/${slug}`)
}
