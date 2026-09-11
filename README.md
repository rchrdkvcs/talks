# Talks

Personal Slidev talk manager.

## Structure

```text
talks/{talk-slug}/
  README.md
  package.json
  slides.md
  global-bottom.vue
  components/
  public/
shared/
  components/
  style.css
scripts/
```

Each talk is a standalone Slidev presentation. The talk slug is the source of truth for the folder name and public build path.

## Commands

```bash
pnpm install
pnpm talks
pnpm validate
pnpm sync
pnpm dev -- example-talk --no-open
pnpm build -- example-talk
pnpm build
pnpm export -- example-talk
pnpm publish
pnpm new my-talk-slug --title "My Talk" --event "My Event" --date 2026-11-06 --lang fr --template conference
```

## Conventions

- Talk metadata lives in the frontmatter of `slides.md`.
- Required metadata: `title`, `slug`, `date`, `lang`, `description`, and `status`.
- Supported statuses: `draft`, `ready`, and `archived`.
- Generated catalog files live in `docs/catalog/`.
- `package.json` inside a talk stays focused on technical scripts.
- Shared identity and layouts live in `shared`.
- Talk-specific components and media stay inside their talk folder.
- Public paths are derived as `/{talk-slug}/`.
- PDF artifacts are exported to `dist/artifacts/{talk-slug}.pdf`.

## PDF downloads and deployment

`pnpm build` generates the homepage, slides, and a PDF for every ready talk.
`pnpm build -- <slug>` builds the slides and PDF for one talk; `pnpm publish`
is an alias for the full build. Deploy the complete `dist/` directory, including
`dist/artifacts/`. Cloudflare can keep using `pnpm build` as its build command.

The homepage PDF button downloads the generated file directly. PDFs use Slidev's
per-slide export to preserve backgrounds, with one page per slide and click
reveals expanded (without separate pages for each animation).

PDF export requires Playwright Chromium, installed by `playwright-chromium` during
`pnpm install`. If browser installation was skipped, run
`pnpm exec playwright install chromium`. On a Linux machine missing browser system
libraries, install them with `pnpm exec playwright install-deps chromium`.
An export failure fails the build so a deployment cannot silently ship missing PDFs.
