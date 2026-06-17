# Validated Talk Metadata and Catalog

Talk Metadata in `slides.md` frontmatter is the editorial source of truth for each Talk.

The Talk Manager validates this metadata before listing, building, exporting, syncing, or publishing Talks. Required fields are `title`, `slug`, `date`, `lang`, `description`, and `status`. Slugs must be lowercase kebab-case, match the Talk folder name, and be unique. Dates must be valid `YYYY-MM-DD` values. Status is limited to `draft`, `ready`, or `archived`.

The Talk Catalog is generated from validated metadata. Repository-facing catalog files live in `docs/catalog/`, while public build output writes a web index to `dist/index.html`. Generated PDF artifacts live under `dist/artifacts/` so publication paths are predictable and generated files stay out of version control unless deliberately copied elsewhere.
