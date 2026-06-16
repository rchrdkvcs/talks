import { basename, resolve } from 'node:path'
import process from 'node:process'
import { x } from 'tinyexec'

const cwd = process.cwd()
const slug = basename(cwd)
const base = `/talks/${slug}/`
const out = resolve(cwd, '../../dist', 'talks', slug)

await x('pnpm', ['exec', 'slidev', 'build', '--base', base, '--out', out, ...process.argv.slice(2)], {
  nodeOptions: {
    cwd,
    stdio: 'inherit',
  },
})
