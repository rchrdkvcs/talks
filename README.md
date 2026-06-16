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
pnpm dev
pnpm dev -- -y
pnpm build
pnpm export
pnpm new my-talk-slug --title "My Talk" --event "My Event" --date 2026-11-06 --lang fr
```

## Conventions

- Talk metadata lives in the frontmatter of `slides.md`.
- `package.json` inside a talk stays focused on technical scripts.
- Shared identity and layouts live in `shared`.
- Talk-specific components and media stay inside their talk folder.
- Public paths are derived as `/talks/{talk-slug}/`.
