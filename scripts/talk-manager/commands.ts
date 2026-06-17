import fs from 'node:fs/promises'
import { resolve } from 'node:path'
import { parseCommandArgs } from './args.ts'
import { generateCatalog, generateWebIndex, talkReadme } from './catalog.ts'
import { createTalk } from './create-talk.ts'
import { discoverTalks, loadValidTalks, validateTalks, validationFailure } from './metadata.ts'
import { distDir } from './paths.ts'
import { labelTalk, pickTalk, selectAuthoringTalks, selectPublicTalks } from './policy.ts'
import { buildTalk, exportTalk, runTalkDev } from './slidev.ts'

export async function runDevCommand(args: string[]) {
  const options = parseCommandArgs(args)
  const talks = selectAuthoringTalks(await loadValidTalks())
  const talk = await pickTalk(talks, options)

  await runTalkDev(talk, options.noOpen)
}

export async function buildCommand(args: string[]) {
  const options = parseCommandArgs(args)
  const talks = selectPublicTalks(await loadValidTalks())

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

export async function exportCommand(args: string[]) {
  const options = parseCommandArgs(args)
  const talks = selectPublicTalks(await loadValidTalks())

  if (options.slug) {
    await exportTalk(await pickTalk(talks, options))
    return
  }

  if (!options.yes) {
    await exportTalk(await pickTalk(talks, options))
    return
  }

  for (const talk of talks)
    await exportTalk(talk)
}

export async function syncCommand(args: string[]) {
  const options = parseCommandArgs(args)
  const talks = await loadValidTalks()

  for (const talk of talks)
    await fs.writeFile(resolve(talk.dir, 'README.md'), talkReadme(talk), 'utf-8')

  const selectedTalks = await generateCatalog(talks, options.publicOnly)
  console.log(`Synced ${talks.length} talk README file(s) and ${selectedTalks.length} catalog item(s)`)
}

export async function catalogCommand(args: string[]) {
  const options = parseCommandArgs(args)
  const talks = await loadValidTalks()
  const selectedTalks = await generateCatalog(talks, options.publicOnly)
  console.log(`Generated catalog for ${selectedTalks.length} talk(s)`)
}

export async function publishCommand() {
  const talks = selectPublicTalks(await loadValidTalks())

  await fs.rm(distDir, { recursive: true, force: true })
  await generateCatalog(talks, true)
  await generateWebIndex(talks)

  for (const talk of talks) {
    await buildTalk(talk)
    await exportTalk(talk)
  }
}

export async function validateCommand() {
  const talks = await discoverTalks()
  const errors = validateTalks(talks)
  if (errors.length)
    throw validationFailure(errors)

  console.log(`Validated ${talks.length} talk(s)`)
}

export async function printList(args: string[]) {
  const options = parseCommandArgs(args)
  const talks = options.publicOnly
    ? selectPublicTalks(await loadValidTalks())
    : selectAuthoringTalks(await loadValidTalks())

  for (const talk of talks)
    console.log(labelTalk(talk))
}

export { createTalk }
