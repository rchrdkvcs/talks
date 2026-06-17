import { basename } from 'node:path'
import process from 'node:process'
import { x } from 'tinyexec'
import { talkBuildOutput, talkPublicBase } from './talk-manager/paths.ts'

const cwd = process.cwd()
const slug = basename(cwd)
const base = talkPublicBase(slug)
const out = talkBuildOutput(slug)

await x('pnpm', ['exec', 'slidev', 'build', '--base', base, '--out', out, ...process.argv.slice(2)], {
  nodeOptions: {
    cwd,
    stdio: 'inherit',
  },
})
