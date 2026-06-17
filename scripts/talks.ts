import process from 'node:process'
import {
  buildCommand,
  catalogCommand,
  createTalk,
  exportCommand,
  printList,
  publishCommand,
  runDevCommand,
  syncCommand,
  validateCommand,
} from './talk-manager/commands.ts'

function printHelp() {
  console.log(`Talk Manager

Usage:
  pnpm talks [--public]
  pnpm validate
  pnpm sync [--public]
  pnpm catalog [--public]
  pnpm dev [slug] [--no-open] [-y]
  pnpm build [slug]
  pnpm export [slug] [-y]
  pnpm publish
  pnpm new [slug] --title <title> --date <YYYY-MM-DD> [--template minimal|conference|workshop|internal]

Commands:
  list       List Talks sorted by date
  validate   Validate Talk structure and metadata
  sync       Regenerate Talk READMEs and catalog files
  catalog    Regenerate structured and Markdown catalog files
  dev        Run one Talk locally
  build      Build one Talk, or all ready Talks when no slug is given
  export     Export one Talk PDF, or all ready Talks with --yes
  publish    Build catalog, all ready Talks, and PDF artifacts
  new        Create a Talk from a template
`)
}

async function main() {
  const [command = 'list', ...args] = process.argv.slice(2)

  if (args.includes('--help') || args.includes('-h') || command === 'help' || command === '--help' || command === '-h') {
    printHelp()
    return
  }

  switch (command) {
    case 'list':
      await printList(args)
      break
    case 'validate':
      await validateCommand()
      break
    case 'sync':
      await syncCommand(args)
      break
    case 'catalog':
      await catalogCommand(args)
      break
    case 'dev':
      await runDevCommand(args)
      break
    case 'build':
      await buildCommand(args)
      break
    case 'export':
      await exportCommand(args)
      break
    case 'publish':
      await publishCommand()
      break
    case 'new':
      await createTalk(args)
      break
    default:
      throw new Error(`Unknown command: ${command}`)
  }
}

try {
  await main()
}
catch (error) {
  console.error(error instanceof Error ? `${error.name}: ${error.message}` : error)
  process.exitCode = 1
}
