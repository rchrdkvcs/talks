import type { Talk } from './domain.ts'
import fs from 'node:fs/promises'
import { dirname } from 'node:path'
import { execa } from 'execa'
import { talkPdfPath } from './paths.ts'

export async function runTalkDev(talk: Talk, noOpen: boolean) {
  const slidevArgs = ['exec', 'slidev']

  if (!noOpen)
    slidevArgs.push('--open')

  await execa('pnpm', slidevArgs, {
    cwd: talk.dir,
    stdio: 'inherit',
  })
}

export async function buildTalk(talk: Talk) {
  console.log(`Building ${talk.slug}`)
  await execa('pnpm', ['run', 'build'], {
    cwd: talk.dir,
    stdio: 'inherit',
  })
}

export async function exportTalk(talk: Talk) {
  const output = talkPdfPath(talk.slug)
  await fs.mkdir(dirname(output), { recursive: true })
  console.log(`Exporting ${talk.slug} to ${output}`)
  await execa('pnpm', ['exec', 'slidev', 'export', '--per-slide', '--output', output], {
    cwd: talk.dir,
    stdio: 'inherit',
  })
}
