<script setup lang="ts">
import GepardecLogo from '../components/GepardecLogo.vue'
import CornerSpots from '../components/CornerSpots.vue'
</script>

<template>
  <div class="gepardec-default slidev-layout">
    <div class="content">
      <slot />
    </div>

    <CornerSpots />
    <GepardecLogo />
  </div>
</template>

<style scoped>
.gepardec-default {
  padding: 3.5rem 4.5rem 4.5rem 4.5rem;
  height: 100%;
  overflow: hidden;
}

.content {
  position: relative;
  z-index: 3;
  /* Title and content sit naturally - no borders, no boxes.
     The first heading becomes the title, the rest is content. */
}

.content :deep(> h1:first-child),
.content :deep(> h2:first-child) {
  margin-bottom: 1.4rem;
}
</style>
