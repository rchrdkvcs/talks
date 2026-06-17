import type { Talk, TalkMetadata, TalkStatus, ValidationError } from './domain.ts'
import fs from 'node:fs/promises'
import fg from 'fast-glob'
import { parse as parseYaml } from 'yaml'
import { compareTalks, isValidDate, slugPattern, statuses } from './domain.ts'
import { talkDir, talksDir, talkSlidesPath } from './paths.ts'

export function readFrontmatter(markdown: string) {
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
    return ''
  if (value instanceof Date)
    return value.toISOString().slice(0, 10)
  return String(value)
}

function optionalStringValue(value: unknown) {
  const normalized = stringValue(value)
  return normalized || undefined
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

export function metadataFromFrontmatter(fm: Record<string, unknown>): TalkMetadata {
  return {
    title: stringValue(fm.title),
    slug: stringValue(fm.slug),
    date: stringValue(fm.date),
    lang: stringValue(fm.lang),
    description: stringValue(fm.description),
    status: stringValue(fm.status),
    event: optionalStringValue(fm.event),
    speaker: optionalStringValue(fm.speaker),
    venue: optionalStringValue(fm.venue),
    duration: optionalStringValue(fm.duration),
    tags: stringArray(fm.tags),
    links: stringRecord(fm.links),
    source: optionalStringValue(fm.source),
  }
}

export async function discoverTalks(): Promise<Talk[]> {
  const files = await fg('*/slides.md', {
    cwd: talksDir,
    onlyFiles: true,
  })

  const talks = await Promise.all(files.map(async (file) => {
    const slug = file.split('/')[0]
    const slidesPath = talkSlidesPath(slug)
    const markdown = await fs.readFile(slidesPath, 'utf-8')
    const metadata = metadataFromFrontmatter(readFrontmatter(markdown))

    return { slug, dir: talkDir(slug), slidesPath, metadata }
  }))

  return talks.sort(compareTalks)
}

export function validateTalks(talks: Talk[]) {
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
    if (!statuses.includes(metadata.status as TalkStatus))
      errors.push({ talk: talk.slug, field: 'status', message: `must be one of ${statuses.join(', ')}` })

    if (metadata.slug)
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

export async function loadValidTalks() {
  const talks = await discoverTalks()
  const errors = validateTalks(talks)
  if (errors.length)
    throw validationFailure(errors)
  return talks
}

export function validationFailure(errors: ValidationError[]) {
  const error = new Error(errors.map(item => `- ${item.talk}.${item.field}: ${item.message}`).join('\n'))
  error.name = 'Validation failed'
  return error
}
