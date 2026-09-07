<script setup lang="ts">
import GepardecLogo from '../components/GepardecLogo.vue'
import CornerSpots from '../components/CornerSpots.vue'
</script>

<template>
  <div class="gepardec-quadrants gepardec-headline slidev-layout">
    <div class="quadrants-content gepardec-content">
      <!--
        Slot flow mirrors the corporate "Subheadings" slide:
        the headline comes from the markdown flow and each of the four text
        blocks gets a named slot, filled in reading order.
      -->
      <div class="quadrants-title">
        <slot />
      </div>

      <div class="quadrants-grid">
        <div v-if="$slots.one" class="quadrant"><slot name="one" /></div>
        <div v-if="$slots.two" class="quadrant"><slot name="two" /></div>
        <div v-if="$slots.three" class="quadrant"><slot name="three" /></div>
        <div v-if="$slots.four" class="quadrant"><slot name="four" /></div>
      </div>
    </div>

    <CornerSpots />
    <GepardecLogo />
  </div>
</template>

<style scoped>
/* Geometry measured off the corporate "Subheadings" slide. The master is
   authored on a 1280x720 px canvas; every value below is that measurement
   scaled to Slidev's 980 px canvas (factor 0.765625), so the slide is a 1:1
   rebuild.

   The master is four text boxes on a 2x2 raster: two equal columns filling the
   text width with no gutter between them, and the PowerPoint text inset doing
   the visual separating. Nothing is drawn — the boxes only place the text. */
.gepardec-quadrants {
  /* Master box height (203.15 px) and the space between the two rows. */
  --quadrant-row-height: 9.721rem;
  --quadrant-row-gap: 1.652rem;
  /* Headline box bottom to the top of the first block row. */
  --quadrant-title-gap: 1.743rem;
  /* Block top to the top of the subheading's line box, so the subheading's
     baseline lands on the master's (34.344 px below the box top). */
  --quadrant-head-offset: 0.297rem;

  /* The master's side margins are the theme's; only the bottom differs — the
     block raster runs to the slide edge. */
  padding-bottom: 0;
}

.quadrants-content {
  height: 100%;
}

/* --- Headline ------------------------------------------------------------ */
/* Treatment comes from `gepardec-headline` — the master puts this slide's
   headline box a few pixels off the agenda's, and a headline that jumps
   between layouts reads worse than the difference is worth. */
.quadrants-title {
  margin: 0 0 var(--quadrant-title-gap);
}

.quadrants-title :deep(h1) {
  margin: 0 0 0 var(--gepardec-text-inset);
}

/* --- Blocks -------------------------------------------------------------- */
.quadrants-grid {
  display: grid;
  /* Two equal halves of the text column — the master splits it exactly down
     the middle and relies on the text inset for the gutter. */
  grid-template-columns: 1fr 1fr;
  /* A block that outgrows the master's box deepens its row instead of
     spilling over the one below. */
  grid-auto-rows: minmax(var(--quadrant-row-height), auto);
  row-gap: var(--quadrant-row-gap);
}

.quadrant {
  min-width: 0;
  padding: var(--quadrant-head-offset) var(--gepardec-text-inset) 0;
}

/* Subheading — "// " is the layout's, so the author writes plain text. */
.quadrant :deep(h1),
.quadrant :deep(h2),
.quadrant :deep(h3),
.quadrant :deep(h4) {
  font-size: 1.404rem;
  line-height: 1.15;
  font-weight: 400;
  font-style: italic;
  color: var(--gepardec-yellow);
  text-transform: none;
  margin: 0;
}

.quadrant :deep(h1)::before,
.quadrant :deep(h2)::before,
.quadrant :deep(h3)::before,
.quadrant :deep(h4)::before {
  content: '// ';
  font-family: var(--gepardec-font-display);
  /* Not the tightened marker from bullets.css — the master keeps the space
     between the slashes and the text open. */
  letter-spacing: normal;
}

/* Body copy. The master runs its paragraphs at one uniform 24 px pitch with no
   space between them, so `margin: 0` here is the master, not an oversight —
   use a second block or a `//` list when copy needs to be set apart. */
.quadrant :deep(p) {
  font-size: 1.085rem;
  /* 24 px pitch on 22.667 px type, straight off the master. */
  line-height: 1.0588;
  font-weight: 400;
  color: var(--gepardec-white);
  margin: 0;
}

.quadrant :deep(ul),
.quadrant :deep(ol) {
  font-size: 1.085rem;
  margin: 0;
}

.quadrant :deep(li) {
  line-height: 1.0588;
  margin: 0;
}
</style>
