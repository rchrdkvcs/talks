import type { Talk } from './domain.ts'
import fs from 'node:fs/promises'
import { dirname } from 'node:path'
import process from 'node:process'
import { execa } from 'execa'
import { root, talkPdfPath } from './paths.ts'

let browserSetup: Promise<unknown> | undefined

async function preparePdfBrowser() {
  // Workers Builds downloads Chromium during pnpm install, but its Ubuntu
  // image does not include all the shared libraries needed to launch it.
  if (process.env.WORKERS_CI !== '1')
    return

  browserSetup ??= execa('pnpm', ['exec', 'playwright', 'install', '--with-deps', 'chromium'], {
    cwd: root,
    stdio: 'inherit',
  })
  await browserSetup
}

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
  await preparePdfBrowser()
  const output = talkPdfPath(talk.slug)
  await fs.mkdir(dirname(output), { recursive: true })
  console.log(`Exporting ${talk.slug} to ${output}`)
  await execa('pnpm', ['exec', 'slidev', 'export', '--per-slide', '--output', output], {
    cwd: talk.dir,
    stdio: 'inherit',
  })
}
