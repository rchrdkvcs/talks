import type { CommandOptions, TalkStatus, TalkTemplate } from './domain.ts'
import { parseArgs } from 'node:util'
import { statuses, templates } from './domain.ts'

export function parseCommandArgs(args: string[]): CommandOptions & { positional: string[] } {
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
