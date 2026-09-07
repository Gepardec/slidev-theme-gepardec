<script setup lang="ts">
import GepardecLogo from '../components/GepardecLogo.vue'
import CornerSpots from '../components/CornerSpots.vue'
import CheetahSujet from '../components/CheetahSujet.vue'

defineProps<{
  /**
   * Optional override for the cover image.
   * Pass a path relative to your deck's public/ directory (e.g. "/my-cover.jpg").
   * Defaults to the cheetah asset bundled with the theme.
   */
  image?: string
}>()
</script>

<template>
  <div class="gepardec-cover slidev-layout">
    <CheetahSujet :image="image" />

    <!--
      Slot flow mirrors the corporate title slide:
      h1 = Titel, h2 = Untertitel, any following paragraphs = Name / Datum,
      which are pushed down to the bottom-left meta position.
    -->
    <div class="cover-content gepardec-content">
      <slot />
    </div>

    <CornerSpots />
    <GepardecLogo />
  </div>
</template>

<style scoped>
/* Geometry measured off the corporate PowerPoint title slide (16:9):
   cheetah sujet bleeding off the left edge, title column starting at 33.4%,
   meta lines sitting ~7% above the bottom edge. */
.gepardec-cover {
  padding: 0;
}

.cover-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 var(--gepardec-margin-x) 1.99rem 33.44%;
}

/* Vertical spacer — puts the title baseline at 44.7% of the slide height, as in
   the master (the percentage resolves against the padded content box, not the
   slide), and gives way first when a title needs more than two lines. */
.cover-content::before {
  content: '';
  flex: 0 1 31.54%;
}

/* Not the master content headline — the title slide sets its Titel far larger.
   The case follows the same token, so a deck that opts out of caps opts out
   here too. */
.cover-content :deep(h1) {
  font-size: 5.742rem;
  line-height: 1;
  text-transform: var(--gepardec-headline-transform);
  color: var(--gepardec-yellow);
  font-weight: 400;
  margin: 0;
}

/* The master sets the Untertitel in caps as well. */
.cover-content :deep(h2) {
  font-size: 3.19rem;
  line-height: 1.1;
  text-transform: var(--gepardec-headline-transform);
  color: var(--gepardec-white);
  font-weight: 400;
  margin: 3.26rem 0 0;
}

/* Name / Datum block — pinned to the bottom of the title column. */
.cover-content :deep(p) {
  color: var(--gepardec-white);
  font-size: 1.404rem;
  font-weight: 400;
  line-height: 1.522;
  margin: 0;
}

.cover-content :deep(p:first-of-type) {
  margin-top: auto;
}
</style>
