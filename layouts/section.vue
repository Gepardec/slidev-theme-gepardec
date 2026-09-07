<script setup lang="ts">
import GepardecLogo from '../components/GepardecLogo.vue'
import CornerSpots from '../components/CornerSpots.vue'
import defaultCheetah from '../assets/cheetah-sujet.webp'

defineProps<{
  /**
   * Optional override for the section image.
   * Defaults to the cheetah sujet bundled with the theme.
   */
  image?: string
}>()
</script>

<template>
  <div class="gepardec-section slidev-layout">
    <!-- Same sujet placement as the cover — the master reuses one background
         for the title slide and the "Zwischenfolie". -->
    <img
      class="section-image"
      :src="image ?? defaultCheetah"
      alt=""
      aria-hidden="true"
    />

    <div class="section-content">
      <slot />
    </div>

    <CornerSpots />
    <GepardecLogo />
  </div>
</template>

<style scoped>
/* Geometry measured off the corporate "Zwischenfolie": same cheetah sujet and
   text column as the title slide, but with the heading centred vertically. */
.gepardec-section {
  padding: 0;
  height: 100%;
  position: relative;
  background-color: var(--gepardec-black);
}

.section-image {
  position: absolute;
  left: -30.25%;
  top: 4%;
  width: 60.4%;
  height: auto;
  z-index: 0;
  pointer-events: none;
  user-select: none;
}

.section-content {
  position: relative;
  z-index: 3;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  /* The bottom padding nudges the optical centre up to the master's baseline. */
  padding: 0 8% 0.46rem 33.44%;
}

.section-content :deep(h1) {
  font-size: 5.742rem;
  line-height: 1;
  color: var(--gepardec-yellow);
  font-weight: 400;
  margin: 0;
}

/* Not in the master — an optional second line for decks that want one. */
.section-content :deep(h2) {
  font-size: 3.19rem;
  line-height: 1.1;
  color: var(--gepardec-white);
  font-weight: 400;
  margin: 1.6rem 0 0;
}

.section-content :deep(p) {
  color: var(--gepardec-white);
  font-size: 1.404rem;
  line-height: 1.522;
  margin: 1.2rem 0 0;
}
</style>
