# Complete Personal Slidev Talk Manager

## Problem Statement

The current repository has been reset into a clean personal Slidev Talk Manager with one Example Talk, a Shared Presentation System, and basic commands for creating, listing, running, building, and exporting Talks. This is enough to validate the direction, but it is not yet a fully reliable day-to-day tool for managing real talks over time.

As the author, I need the Talk Manager to become dependable enough that I can create new Talks, maintain Talk Metadata, browse a Talk Catalog, export artifacts, and publish presentations without relying on fragile conventions or manual cleanup. The tool should make the repository easy to understand months later, while preserving the minimal Presentation Identity and subtle animated background style chosen during the reset.

## Solution

Build the next functional layer of the Talk Manager around validated Talk Metadata, a generated Talk Catalog, stronger CLI commands, richer Talk creation templates, a more complete Shared Presentation System, and a clear publication/export workflow.

The Talk Slug remains the stable identifier for a specific published edition of a Talk. Talk Metadata remains the editorial source of truth. Talk READMEs and any generated catalog output are derived from or aligned with that metadata. The Shared Presentation System should provide reusable visual conventions and layouts without absorbing Talk-specific content.

The result should be a repository that can be used as a practical presentation manager: create a Talk, validate it, run it locally, export it, build the complete public site, and understand all available Talks from a generated catalog.

## User Stories

1. As the Talk author, I want Talk Metadata to be validated, so that invalid Talks fail early before build or publication.
2. As the Talk author, I want required Talk Metadata fields, so that every Talk has enough information to appear in the Talk Catalog.
3. As the Talk author, I want optional Talk Metadata fields for speaker, venue, tags, duration, links, and status, so that real conference and workshop contexts are represented accurately.
4. As the Talk author, I want Talk Metadata to support `draft`, `ready`, and `archived` statuses, so that incomplete Talks are not confused with publishable Talks.
5. As the Talk author, I want Talk Slugs to be validated, so that public paths stay stable and predictable.
6. As the Talk author, I want duplicate Talk Slugs to be rejected, so that two Talks cannot accidentally target the same public path.
7. As the Talk author, I want invalid dates to be rejected, so that sorting and catalog generation remain reliable.
8. As the Talk author, I want the Talk Manager to parse frontmatter robustly, so that quoted strings, empty fields, and richer YAML are handled correctly.
9. As the Talk author, I want a `validate` command, so that I can check all Talks before building or publishing.
10. As the Talk author, I want validation errors to name the failing Talk and field, so that I can fix issues quickly.
11. As the Talk author, I want a stronger CLI interface, so that commands are predictable and documented.
12. As the Talk author, I want to run a specific Talk by slug, so that I can skip the interactive picker when I know what I want.
13. As the Talk author, I want to export a specific Talk by slug, so that I can generate one PDF without selecting it interactively.
14. As the Talk author, I want to build a specific Talk by slug, so that I can test a single public output quickly.
15. As the Talk author, I want to build all ready Talks, so that the public site can be generated in one command.
16. As the Talk author, I want `--yes` and non-interactive modes, so that scripts and CI can use the Talk Manager reliably.
17. As the Talk author, I want a `--no-open` option for local development, so that automated runs do not open a browser.
18. As the Talk author, I want clear help output, so that I can discover the available commands without reading the implementation.
19. As the Talk author, I want command failures to return non-zero exit codes, so that CI can catch them.
20. As the Talk author, I want a generated Talk Catalog, so that all Talks can be discovered from one source.
21. As a website visitor, I want to browse the Talk Catalog, so that I can find available presentations.
22. As a website visitor, I want Talks sorted by date, so that recent Talks are easy to find.
23. As a website visitor, I want to filter Talks by language, so that I can find Talks I can read or watch.
24. As a website visitor, I want to filter Talks by tag, so that I can find Talks on a topic.
25. As a website visitor, I want to see Talk status, so that drafts are not mistaken for final presentations.
26. As a website visitor, I want links to slides, PDF, and source where available, so that I can choose the right format.
27. As the Talk author, I want the Talk Catalog to be generated from Talk Metadata, so that the README is not a fragile source of truth.
28. As the Talk author, I want generated catalog data as structured output, so that future pages or tools can consume it.
29. As the Talk author, I want a generated web index, so that publication can expose all ready Talks.
30. As the Talk author, I want the Talk Catalog to exclude archived or draft Talks when requested, so that public output can be curated.
31. As the Talk author, I want Talk README files to be generated or synchronized, so that repository browsing stays accurate.
32. As the Talk author, I want a `sync` command, so that derived files can be refreshed after metadata changes.
33. As the Talk author, I want generated README content to include commands, metadata, and useful links, so that each Talk remains understandable on its own.
34. As the Talk author, I want generated files to be deterministic, so that diffs stay small and reviewable.
35. As the Talk author, I want multiple creation templates, so that different Talk types start with useful structure.
36. As the Talk author, I want a minimal template, so that small talks stay lightweight.
37. As the Talk author, I want a conference template, so that event talks start with intro, sections, and thanks slides.
38. As the Talk author, I want a workshop template, so that hands-on sessions can include agenda and exercise sections.
39. As the Talk author, I want an internal template, so that private team presentations have a simple structure.
40. As the Talk author, I want template selection to work interactively, so that creating Talks is comfortable in a terminal.
41. As the Talk author, I want template selection to work with arguments, so that creating Talks can be automated.
42. As the Talk author, I want new Talks to include a wrapper for shared visual layers, so that the Presentation Identity is active by default.
43. As the Talk author, I want new Talks to include local component and media folders, so that Talk-specific content has an obvious home.
44. As the Talk author, I want new Talks to include a valid initial README, so that repository browsing works immediately.
45. As the Talk author, I want new Talks to include a local style entrypoint, so that shared styles can be imported consistently.
46. As the Talk author, I want the Shared Presentation System to provide common layouts, so that Talks feel consistent without repeated markup.
47. As the Talk author, I want a reusable cover layout, so that Talk titles have a polished first slide.
48. As the Talk author, I want a reusable intro layout, so that speaker context can be added consistently.
49. As the Talk author, I want a reusable section layout, so that narrative transitions are visually consistent.
50. As the Talk author, I want a reusable quote layout, so that quoted material has a clear visual treatment.
51. As the Talk author, I want a reusable thanks layout, so that Talks close consistently.
52. As the Talk author, I want a reusable footer option, so that event or Talk context can be visible when appropriate.
53. As the Talk author, I want shared typography and spacing tokens, so that the minimal Presentation Identity is maintained.
54. As the Talk author, I want shared glow presets, so that animated backgrounds can vary without copying implementation details.
55. As the Talk author, I want `glow`, `glowSeed`, `glowOpacity`, and `glowHue` documented, so that I can use the background system intentionally.
56. As the Talk author, I want the Shared Presentation System to avoid Talk-specific content, so that Talks remain portable and understandable.
57. As the Talk author, I want build output paths derived from Talk Slugs, so that public URLs remain predictable.
58. As the Talk author, I want export output paths to be predictable, so that PDFs can be linked from the Talk Catalog.
59. As the Talk author, I want exported PDFs to be generated into a stable artifact location, so that publication can include them.
60. As the Talk author, I want build and export commands to work both per Talk and across all Talks, so that local and release workflows are efficient.
61. As the Talk author, I want a publication build command, so that public deployment has one clear entry point.
62. As the Talk author, I want the publication target to be explicit, so that deployment setup is understandable.
63. As the Talk author, I want CI to run validation, linting, type checking, and build, so that regressions are caught before publication.
64. As the Talk author, I want browser-level smoke checks for built Talks, so that empty or broken Slidev output is caught.
65. As the Talk author, I want generated artifacts to stay out of version control unless deliberately published, so that the repository remains clean.
66. As a future maintainer, I want the Talk Manager architecture documented, so that I can safely evolve it.
67. As a future maintainer, I want implementation decisions captured where they are hard to reverse, so that surprising choices are not accidentally undone.
68. As the Talk author, I want the Example Talk to continue validating conventions, so that changes to the manager have a reliable baseline.

## Implementation Decisions

- Keep Talk as the core domain concept: a standalone presentation with slides, specific components, and specific media.
- Keep Talk Slug as the stable identifier for a specific published edition of a Talk.
- Keep Talk Metadata in Slidev frontmatter as the editorial source of truth.
- Treat Talk READMEs and catalog outputs as derived or synchronized views, not canonical metadata stores.
- Add a real frontmatter parser instead of hand-parsing metadata line by line.
- Define a Talk Metadata schema with required and optional fields.
- Add a validation layer that checks Talk structure, metadata, slug format, duplicate slugs, and output-path safety.
- Replace the homegrown CLI parser with a maintained CLI library.
- Expose a clear Talk Manager command hierarchy for listing, creating, validating, running, building, exporting, syncing, and publishing Talks.
- Preserve interactive selection for local convenience.
- Add deterministic non-interactive commands for automation and CI.
- Generate a structured Talk Catalog from validated Talk Metadata.
- Generate a human-facing catalog page from the same validated source.
- Add a synchronization command for derived files such as Talk READMEs and catalog output.
- Keep the Shared Presentation System shared but content-neutral.
- Add shared layouts and visual primitives that encode the Presentation Identity without importing upstream personal branding.
- Keep subtle animated backgrounds as a first-class part of the Presentation Identity.
- Preserve the existing glow configuration vocabulary unless a later ADR intentionally replaces it.
- Add templates for common Talk types while keeping the minimal template available.
- Keep build public paths derived from Talk Slugs.
- Add a publication build workflow that combines Talk builds, catalog generation, and exported artifacts.
- Add CI once validation and catalog generation are deterministic.
- Do not reintroduce upstream talks, upstream Git history, or upstream personal assets.

## Testing Decisions

- Tests should cover external behavior through the Talk Manager CLI whenever possible, rather than implementation details inside helper functions.
- The highest-value seam is the Talk Manager command boundary: commands should be executed against fixture Talks and their outputs verified.
- Validation tests should use fixture Talks with valid metadata, missing required fields, invalid slugs, invalid dates, duplicate slugs, and malformed frontmatter.
- Catalog tests should verify generated structured output and generated human-facing catalog content from fixture metadata.
- Creation tests should verify that each template creates a complete Talk with valid metadata, local folders, shared visual wrapper, local style entrypoint, and generated README.
- Sync tests should verify deterministic README and catalog regeneration.
- Build tests should verify that a valid Example Talk builds to the slug-derived public path.
- Export tests should verify that a selected Talk can produce a PDF artifact in the expected location.
- Browser smoke tests should load built Talk output and verify that visible slide content and the shared animated background are present.
- CI should run validation, type checking, linting, and build before any deployment step.
- Existing prior art is the current manual verification flow: `typecheck`, `lint`, `talks`, `build`, `export`, generated Talk creation, and browser verification of the Example Talk.

## Out of Scope

- Reintroducing Anthony Fu's upstream talks, assets, Git history, branding, or deployment redirects.
- Building a full visual slide editor.
- Replacing Slidev as the presentation engine.
- Supporting multiple presentation engines.
- Creating a hosted backend or database.
- Implementing user accounts or collaboration.
- Publishing to every possible hosting provider in the first iteration.
- Designing every future Talk template in final form.
- Guaranteeing perfect PDF rendering for every possible custom Slidev component.
- Building a public website beyond the generated Talk Catalog and built Talk pages.

## Further Notes

- The repository currently has no configured remote or issue tracker, so this PRD is stored as a repository document and is ready to become an issue with the `ready-for-agent` label once an issue tracker is available.
- The first implementation slice should be validation plus robust frontmatter parsing, because every later capability depends on trustworthy Talk Metadata.
- The second implementation slice should be Talk Catalog generation, because it turns validated metadata into visible product value.
- The third implementation slice should be CLI hardening and template expansion, because that improves daily authoring ergonomics.
- Publication and CI should come after validation and catalog generation are deterministic.
