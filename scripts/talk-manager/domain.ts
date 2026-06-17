export type TalkStatus = 'draft' | 'ready' | 'archived'
export type TalkTemplate = 'minimal' | 'conference' | 'workshop' | 'internal'

export interface TalkMetadata {
  title: string
  slug: string
  date: string
  lang: string
  description: string
  status: string
  event?: string
  speaker?: string
  venue?: string
  duration?: string
  tags: string[]
  links: Record<string, string>
  source?: string
}

export interface Talk {
  slug: string
  dir: string
  slidesPath: string
  metadata: TalkMetadata
}

export interface ValidationError {
  talk: string
  field: string
  message: string
}

export interface CommandOptions {
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

export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
export const statuses: TalkStatus[] = ['draft', 'ready', 'archived']
export const templates: TalkTemplate[] = ['minimal', 'conference', 'workshop', 'internal']

export function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function compareTalks(a: Talk, b: Talk) {
  const date = b.metadata.date.localeCompare(a.metadata.date)
  return date || a.metadata.title.localeCompare(b.metadata.title) || a.slug.localeCompare(b.slug)
}

export function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false
  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
}
