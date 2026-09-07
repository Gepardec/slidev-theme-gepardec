<script setup lang="ts">
import GepardecLogo from '../components/GepardecLogo.vue'
import CornerSpots from '../components/CornerSpots.vue'
</script>

<template>
  <div class="gepardec-default gepardec-headline slidev-layout">
    <div class="content gepardec-content">
      <slot />
    </div>

    <CornerSpots />
    <GepardecLogo />
  </div>
</template>

<style scoped>
/* Content slide: the master's margins come from the global `.slidev-layout`
   box and the headline from `gepardec-headline`, so all this layout adds is
   the gap under the title. */
.content :deep(> h1:first-child),
.content :deep(> h2:first-child) {
  margin-bottom: 1.4rem;
}
</style>
