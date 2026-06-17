<script setup lang="ts">
defineProps<{
  variant: 'intro' | 'section' | 'quote' | 'thanks'
}>()
</script>

<template>
  <section class="shared-slide-layout" :class="`shared-slide-layout-${variant}`">
    <div class="shared-slide-content">
      <slot />
    </div>
  </section>
</template>
