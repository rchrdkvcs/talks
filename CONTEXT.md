# Talks

This repository is a personal presentation manager for authoring, running, exporting, and publishing talks.

## Language

**Talk**:
A standalone presentation with its own slides, assets, specific components, and specific media.
_Avoid_: Deck template, dated folder, nested source folder

**Shared Presentation System**:
The reusable identity, layouts, and presentation conventions shared across Talks.
_Avoid_: Global talk content, shared talk-specific components

**Presentation Identity**:
The visual and interaction style shared by Talks: minimal composition, clean typography, and subtle animated backgrounds.
_Avoid_: Upstream personal branding, content-specific decoration

**Talk Slug**:
A stable, human-readable identifier for a specific published edition of a Talk.
_Avoid_: Date folder, event date, topic-only slug

**Talk Catalog**:
The repository-level list of available Talks used for local selection, publishing, and project overview.
_Avoid_: README as source of truth, folder scan only

**Talk Manager**:
The repository-level workflow for creating, selecting, running, building, and exporting Talks.
_Avoid_: Raw Slidev commands as the primary interface

**Talk Metadata**:
The editorial information that describes a Talk, such as title, event, date, language, and description.
_Avoid_: Package scripts metadata, duplicated README metadata

**Talk README**:
A human-readable summary of a Talk for repository browsing, derived from or aligned with Talk Metadata.
_Avoid_: Metadata source of truth, hand-maintained catalog entry

**Example Talk**:
A minimal Talk used to validate and demonstrate the repository conventions after reset.
_Avoid_: Real talk, archived upstream talk
