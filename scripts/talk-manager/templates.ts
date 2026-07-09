import type { TalkMetadata, TalkTemplate } from './domain.ts'
import { stringify as stringifyYaml } from 'yaml'
import { talkPackagePdfOutput } from './paths.ts'

export function frontmatterFor(metadata: TalkMetadata, template: TalkTemplate) {
  const base: Record<string, unknown> = {
    theme: 'default',
    title: metadata.title,
    slug: metadata.slug,
    event: metadata.event || undefined,
    date: metadata.date,
    lang: metadata.lang,
    description: metadata.description,
    status: metadata.status,
    speaker: metadata.speaker || undefined,
    venue: metadata.venue || undefined,
    duration: metadata.duration || undefined,
    tags: metadata.tags,
    links: metadata.links,
    template,
    highlighter: 'shiki',
    css: 'unocss',
    colorSchema: 'light',
    transition: 'fade-out',
    mdc: true,
    fonts: {
      sans: 'DM Sans',
      serif: 'Bodoni Moda',
    },
    layout: 'cover',
    glowSeed: metadata.slug,
  }

  return stringifyYaml(base, {
    lineWidth: 0,
    sortMapEntries: false,
  }).replace(/\n([a-z][\w-]*): \n/g, '\n$1:\n')
}

// Presentation Identity — les blocs générés suivent le design language
// documenté dans docs/adr/0003 : une idée par slide, hiérarchie par
// opacité, révélations v-click, grilles icône → flèche → description,
// chips translucides et séparateurs serif.
export function slidesFor(metadata: TalkMetadata, template: TalkTemplate) {
  const cover = `---
${frontmatterFor(metadata, template)}---

<div text-sm op50 tracking-widest uppercase mb-4>${metadata.event || 'Event to be announced'}</div>

# ${metadata.title}

<div op50 text-xl mt-4>
One-line promise of the talk.
</div>

<div mt-10 flex="~ gap-2 wrap">
  <div class="chip"><div i-ph-sparkle-duotone text-blue-600 /> Topic A</div>
  <div class="chip"><div i-ph-lightning-duotone text-amber-600 /> Topic B</div>
</div>
`

  const intro = `---
layout: intro
glow: left
---

<div text-4xl>${metadata.speaker || 'Speaker'}</div>
<div op50 text-xl mt-2>${metadata.venue || metadata.event || 'Context'}</div>
`

  const statement = (line: string, accent: string, support: string) => `---
layout: center
glow: bottom
class: text-center
---

<div text-4xl leading-relaxed>
${line} <span text-rose-600>${accent}</span>
</div>

<div op50 text-xl mt-6 v-click>
${support}
</div>
`

  const divider = (kicker: string, title: string, subtitle: string) => `---
layout: center
glow: left
---

<div flex="~ col gap-2 items-center" text-center>
  <div op50 text-sm tracking-widest uppercase>${kicker}</div>
  <div text-5xl class="module-word" mt2>${title}</div>
  <div op50 text-xl mt3>${subtitle}</div>
</div>
`

  const iconGrid = (title: string) => `---
class: text-2xl
glow: right
---

# ${title}

<div grid="~ cols-[max-content_min-content_auto] items-center gap-x-10 gap-y-10" py10>
  <div flex="~ gap-2 items-center" text-blue-600 v-click>
    <div i-ph-magnifying-glass-duotone text-2xl />
    <span>First point</span>
  </div>
  <div i-ph-arrow-right-duotone op50 v-click />
  <div text-lg op75 v-after>supporting detail, kept short</div>

  <div flex="~ gap-2 items-center" text-lime-600 v-click>
    <div i-ph-rocket-launch-duotone text-2xl />
    <span>Second point</span>
  </div>
  <div i-ph-arrow-right-duotone op50 v-click />
  <div text-lg op75 v-after>supporting detail, kept short</div>

  <div flex="~ gap-2 items-center" text-purple-600 v-click>
    <div i-ph-arrows-clockwise-duotone text-2xl />
    <span>Third point</span>
  </div>
  <div i-ph-arrow-right-duotone op50 v-click />
  <div text-lg op75 v-after>supporting detail, kept short</div>
</div>
`

  const quote = `---
layout: quote
glow: right
---

> Add a short quote or framing statement here.
`

  const thanks = `---
layout: center
glow: top
class: text-center
---

<h1 class="module-word" important-text-3em>Thanks</h1>

<div op50 mt-4>${metadata.title}</div>
`

  const bodies: Record<TalkTemplate, string[]> = {
    minimal: [
      statement('One idea per slide, with', 'one accent', 'Supporting line, revealed on click.'),
      divider('Part 1', 'First Idea', 'Start shaping the narrative here'),
      iconGrid('Key points'),
      thanks,
    ],
    conference: [
      intro,
      statement('Name the problem, then make it', 'concrete', 'Why it matters, revealed on click.'),
      divider('Part 1', 'Context', 'Set up the problem and why it matters'),
      iconGrid('Main thread'),
      quote,
      thanks,
    ],
    workshop: [
      intro,
      divider('Agenda', 'Hands-on', 'Setup · Exercise · Review'),
      iconGrid('Exercise checkpoints'),
      thanks,
    ],
    internal: [
      statement('Summarize the current state in', 'one line', 'The signal behind it, revealed on click.'),
      iconGrid('Decision points'),
      thanks,
    ],
  }

  return `${cover}\n${bodies[template].join('\n')}`
}

export function layoutWrapper(name: string) {
  return `<script setup lang="ts">
import SharedSlideLayout from '../../../shared/components/SharedSlideLayout.vue'
</script>

<template>
  <SharedSlideLayout variant="${name}">
    <slot />
  </SharedSlideLayout>
</template>
`
}

export function packageJsonFor(slug: string) {
  return `{
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "slidev --open",
    "build": "tsx ../../scripts/build.ts",
    "export": "slidev export --per-slide --output ${talkPackagePdfOutput(slug)}"
  }
}
`
}

export function globalBottomVue() {
  return `<script setup lang="ts">
import SharedGlowBackground from '../../shared/components/SharedGlowBackground.vue'
</script>

<template>
  <SharedGlowBackground />
</template>
`
}

export function styleCss() {
  return `@import '../../shared/style.css';
`
}
