<script setup lang="ts">
import { useNav } from '@slidev/client'
import seedrandom from 'seedrandom'
import { computed, ref, watch } from 'vue'

type Range = [number, number]

type Distribution
  = | 'full'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'center'

const { currentSlideRoute } = useNav()
const frontmatter = computed(() => (currentSlideRoute.value.meta?.slide as any)?.frontmatter || {})
const distribution = computed(() => (frontmatter.value.glow || 'full') as Distribution)
const opacity = computed(() => +(frontmatter.value.glowOpacity || 0.4))
const hue = computed(() => +(frontmatter.value.glowHue || 0))
const seed = computed(() => (frontmatter.value.glowSeed === 'false' || frontmatter.value.glowSeed === false)
  ? Date.now().toString()
  : frontmatter.value.glowSeed || 'default',
)

const overflow = 0.3
const disturb = 0.3
const disturbChance = 0.3

function intersection(a: Range, b: Range): Range {
  return [Math.max(a[0], b[0]), Math.min(a[1], b[1])]
}

function distributionToLimits(value: Distribution) {
  const min = -0.2
  const max = 1.2
  let x: Range = [min, max]
  let y: Range = [min, max]

  for (const limit of value.split('-')) {
    switch (limit) {
      case 'top':
        y = intersection(y, [min, 0.6])
        break
      case 'bottom':
        y = intersection(y, [0.4, max])
        break
      case 'left':
        x = intersection(x, [min, 0.6])
        break
      case 'right':
        x = intersection(x, [0.4, max])
        break
      case 'center':
        x = intersection(x, [0.25, 0.75])
        y = intersection(y, [0.25, 0.75])
        break
      case 'full':
        x = intersection(x, [0, 1])
        y = intersection(y, [0, 1])
        break
    }
  }

  return { x, y }
}

function distance2([x1, y1]: Range, [x2, y2]: Range) {
  return (x2 - x1) ** 2 + (y2 - y1) ** 2
}

function usePoly(number = 16) {
  function getPoints(): Range[] {
    const limits = distributionToLimits(distribution.value)
    const rng = seedrandom(`${seed.value}-${currentSlideRoute.value.no}`)
    const randomBetween = ([a, b]: Range) => rng() * (b - a) + a
    const applyOverflow = (random: number) => {
      const value = random * (1 + overflow * 2) - overflow
      return rng() < disturbChance ? value + (rng() - 0.5) * disturb : value
    }

    return Array.from({ length: number }, () => [
      applyOverflow(randomBetween(limits.x)),
      applyOverflow(randomBetween(limits.y)),
    ])
  }

  const points = ref(getPoints())
  const poly = computed(() => points.value.map(([x, y]) => `${x * 100}% ${y * 100}%`).join(', '))

  function jumpPoints() {
    const nextPoints = new Set(getPoints())
    points.value = points.value.map((current) => {
      let minDistance = Number.POSITIVE_INFINITY
      let closest: Range | undefined

      for (const next of nextPoints) {
        const distance = distance2(current, next)
        if (distance < minDistance) {
          minDistance = distance
          closest = next
        }
      }

      if (closest)
        nextPoints.delete(closest)

      return closest || current
    })
  }

  watch(currentSlideRoute, jumpPoints)

  return poly
}

const poly1 = usePoly(10)
const poly2 = usePoly(6)
const poly3 = usePoly(3)
</script>

<template>
  <div
    class="shared-glow-background"
    :style="{ filter: `blur(70px) hue-rotate(${hue}deg)` }"
    aria-hidden="true"
  >
    <div
      class="shared-glow-clip shared-glow-primary"
      :style="{ 'clip-path': `polygon(${poly1})`, 'opacity': opacity }"
    />
    <div
      class="shared-glow-clip shared-glow-secondary"
      :style="{ 'clip-path': `polygon(${poly2})`, 'opacity': opacity }"
    />
    <div
      class="shared-glow-clip shared-glow-accent"
      :style="{ 'clip-path': `polygon(${poly3})`, 'opacity': 0.2 }"
    />
  </div>
</template>

<style scoped>
.shared-glow-background,
.shared-glow-clip {
  transition: all 2.5s ease;
}

.shared-glow-background {
  position: absolute;
  inset: 0;
  z-index: -10;
  overflow: hidden;
  pointer-events: none;
  transform: translateZ(0);
}

.shared-glow-clip {
  clip-path: circle(75%);
  aspect-ratio: 16 / 9;
  position: absolute;
  inset: 0;
}

.shared-glow-primary {
  background-image: linear-gradient(to right, #9440e3, rgb(255 255 255 / 0.1));
}

.shared-glow-secondary {
  background-image: linear-gradient(to left, #41d1ff, rgb(255 255 255 / 0.1));
}

.shared-glow-accent {
  background-image: linear-gradient(to top, #dce354, rgb(255 255 255 / 0.1));
}

:global(.light) .shared-glow-clip {
  opacity: 1 !important;
}
</style>
