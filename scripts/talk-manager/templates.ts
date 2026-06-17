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
    colorSchema: 'dark',
    transition: 'fade-out',
    mdc: true,
    layout: 'cover',
    glowSeed: metadata.slug,
  }

  return stringifyYaml(base, {
    lineWidth: 0,
    sortMapEntries: false,
  }).replace(/\n([a-z][\w-]*): \n/g, '\n$1:\n')
}

export function slidesFor(metadata: TalkMetadata, template: TalkTemplate) {
  const cover = `---
${frontmatterFor(metadata, template)}---

# ${metadata.title}

${metadata.event || 'Event to be announced'}
`

  const intro = `---
layout: intro
glow: left
---

# About

- ${metadata.speaker || 'Speaker'}
- ${metadata.venue || metadata.event || 'Context'}
`

  const section = (title: string, body: string) => `---
layout: section
glow: center
---

# ${title}

${body}
`

  const quote = `---
layout: quote
glow: right
---

> Add a short quote or framing statement here.
`

  const thanks = `---
layout: thanks
glow: top
---

# Thanks
`

  const bodies: Record<TalkTemplate, string[]> = {
    minimal: [
      section('First Idea', 'Start shaping the narrative here.'),
      thanks,
    ],
    conference: [
      intro,
      section('Context', 'Set up the problem and why it matters.'),
      section('Main Thread', 'Develop the core argument.'),
      quote,
      thanks,
    ],
    workshop: [
      intro,
      section('Agenda', '1. Setup\n2. Exercise\n3. Review'),
      section('Exercise', 'Add hands-on instructions and checkpoints here.'),
      thanks,
    ],
    internal: [
      section('Status', 'Summarize the current state.'),
      section('Decision', 'Name the recommendation or next step.'),
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
