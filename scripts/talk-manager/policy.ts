import type { CommandOptions, Talk } from './domain.ts'
import prompts from 'prompts'

export function selectAuthoringTalks(talks: Talk[]) {
  return talks.filter(talk => talk.metadata.status !== 'archived')
}

export function selectPublicTalks(talks: Talk[]) {
  return talks.filter(talk => talk.metadata.status === 'ready')
}

export function labelTalk(talk: Talk) {
  const meta = [
    talk.metadata.status,
    talk.metadata.date,
    talk.metadata.event,
    talk.metadata.lang,
  ].filter(Boolean).join(' | ')

  return `${talk.slug} - ${talk.metadata.title} (${meta})`
}

export async function pickTalk(talks: Talk[], options: CommandOptions) {
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
