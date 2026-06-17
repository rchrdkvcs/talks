# Architecture Review

Generated on 2026-06-17.

## Context

This repository is a personal presentation manager for authoring, running, exporting, and publishing Talks.

The review uses the project vocabulary from `CONTEXT.md`:

- Talk
- Talk Metadata
- Talk Catalog
- Talk Manager
- Talk Slug
- Talk README
- Shared Presentation System

It also respects ADR-0002: Talk Metadata in `slides.md` frontmatter is the editorial source of truth, and the Talk Catalog is generated from validated metadata.

## Candidates

### 1. Deepen the Talk Metadata Intake Module

**Recommendation strength:** Strong

**Files**

- `scripts/talks.ts`
- `talks/example-talk/slides.md`
- `docs/adr/0002-validated-talk-metadata-and-catalog.md`

**Problem**

Talk Metadata rules are split across shallow helpers: frontmatter parsing, coercion, validation, duplicate detection, and validation error formatting. Invalid or missing `status` is currently normalized to `draft` before validation, which weakens ADR-0002.

**Solution**

Create one deep Talk Metadata intake module that owns parsing, normalization, validation, duplicate detection, and validation error formatting.

**Benefits**

- Locality: ADR-0002 rules concentrate in one module.
- Leverage: fixture tests hit one interface.
- The interface shrinks while the implementation absorbs parsing and validation details.

### 2. Deepen the Talk Catalog Projection Module

**Recommendation strength:** Strong

**Files**

- `scripts/talks.ts`
- `docs/catalog/talks.json`
- `docs/catalog/README.md`

**Problem**

Talk Catalog knowledge is split across Talk README rendering, catalog JSON rendering, catalog Markdown rendering, and web index rendering. Public paths, PDF paths, source paths, optional fields, and filtering leak into multiple string builders.

**Solution**

Create one Talk Catalog projection before rendering. Markdown, JSON, web index, and Talk README generation consume the same catalog-ready representation.

**Benefits**

- Locality: path rules change in one place.
- Leverage: four renderers share one projection.
- Tests assert the catalog interface instead of renderer internals.

### 3. Deepen Talk Manager Workflow Policy

**Recommendation strength:** Worth exploring

**Files**

- `scripts/talks.ts`

**Problem**

`visibleTalks(talks, publicOnly)` is shallow. The boolean hides one filter while each command still needs to know authoring versus publication policy.

**Solution**

Move authoring selection, public publication, interactive picking, and automation rules behind named workflow policy functions.

**Benefits**

- Locality: status policy concentrates.
- Leverage: commands stop passing ambiguous booleans.
- Tests cover workflow behaviour instead of flag choices.

### 4. Deepen Build and Export Artifact Path Ownership

**Recommendation strength:** Worth exploring

**Files**

- `scripts/build.ts`
- `scripts/talks.ts`
- `talks/example-talk/package.json`
- `README.md`

**Problem**

Public path and PDF artifact rules are spread across the Talk Manager, per-Talk scripts, `scripts/build.ts`, and documentation. `scripts/build.ts` infers the Talk Slug from `cwd`, so the seam leaks filesystem layout.

**Solution**

Centralize artifact path derivation so build output paths, public bases, PDF paths, and catalog links are derived from the Talk Slug in one module.

**Benefits**

- Locality: URL and artifact rules concentrate.
- Leverage: commands share one path implementation.
- Tests become less dependent on `cwd` conventions.

## Top Recommendation

Start with the Talk Metadata intake module. It protects ADR-0002, fixes a real validation leak, and gives the highest downstream leverage because Talk Catalog, Talk README, build, export, sync, and publish all depend on trustworthy Talk Metadata.
