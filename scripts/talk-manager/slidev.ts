import type { Talk } from './domain.ts'
import fs from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { execa } from 'execa'
import { root, talkPdfPath } from './paths.ts'

let browserSetup: Promise<Record<string, string>> | undefined

async function prepareCloudflareBrowser() {
  const prefix = resolve(root, 'node_modules', '.cache', 'pdf-browser')
  console.log('Preparing Chromium libraries without root privileges')
  await execa('bash', [resolve(root, 'scripts/prepare-chromium.sh'), prefix], {
    cwd: root,
    stdio: 'inherit',
  })
  await execa('pnpm', ['exec', 'playwright', 'install', 'chromium'], {
    cwd: root,
    stdio: 'inherit',
  })
  return {
    LD_LIBRARY_PATH: [
      resolve(prefix, 'root/usr/lib/x86_64-linux-gnu'),
      resolve(prefix, 'root/lib/x86_64-linux-gnu'),
      process.env.LD_LIBRARY_PATH,
    ].filter(Boolean).join(':'),
  }
}

async function preparePdfBrowser() {
  // Workers Builds downloads Chromium during pnpm install, but its Ubuntu
  // image does not include all the shared libraries needed to launch it.
  if (process.env.WORKERS_CI !== '1')
    return

  browserSetup ??= prepareCloudflareBrowser()
  return browserSetup
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
  const browserEnv = await preparePdfBrowser()
  const output = talkPdfPath(talk.slug)
  await fs.mkdir(dirname(output), { recursive: true })
  console.log(`Exporting ${talk.slug} to ${output}`)
  await execa('pnpm', ['exec', 'slidev', 'export', '--per-slide', '--output', output], {
    cwd: talk.dir,
    env: browserEnv,
    stdio: 'inherit',
  })
}
