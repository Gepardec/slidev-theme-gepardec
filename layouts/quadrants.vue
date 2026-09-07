<script setup lang="ts">
import GepardecLogo from '../components/GepardecLogo.vue'
import CornerSpots from '../components/CornerSpots.vue'
</script>

<template>
  <div class="gepardec-quadrants slidev-layout">
    <div class="quadrants-content">
      <!--
        Slot flow mirrors the corporate "Subheadings" slide:
        the headline goes in the default slot (or `::title::`), and each of the
        four text blocks gets a named slot, filled in reading order.
      -->
      <div class="quadrants-title">
        <slot name="title" />
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
  /* PowerPoint's text inset. The headline shares it so its glyphs line up with
     the "//" markers below. */
  --quadrant-inset: 0.431rem;
  /* Master box height (203.15 px) and the space between the two rows. */
  --quadrant-row-height: 9.721rem;
  --quadrant-row-gap: 1.652rem;
  /* Headline box bottom to the top of the first block row. */
  --quadrant-title-gap: 1.743rem;
  /* Block top to the top of the subheading's line box, so the subheading's
     baseline lands on the master's (34.344 px below the box top). */
  --quadrant-head-offset: 0.297rem;

  padding: 0;
  height: 100%;
  position: relative;
  background-color: var(--gepardec-black);
}

.quadrants-content {
  position: relative;
  z-index: 3;
  height: 100%;
  /* The master's side margins: 5.827% of the slide width, left and right. */
  padding: 3.331rem 5.827% 0;
}

/* --- Headline ------------------------------------------------------------ */
/* Same treatment as the `agenda` layout: the two masters put their headline
   box a few pixels apart, and a headline that jumps between layouts reads
   worse than the difference is worth. */
.quadrants-title {
  margin: 0 0 var(--quadrant-title-gap);
}

.quadrants-title :deep(h1) {
  font-size: 3.445rem;
  line-height: 1;
  font-weight: 400;
  /* The master sets the headline in caps. */
  text-transform: uppercase;
  color: var(--gepardec-yellow);
  margin: 0 0 0 var(--quadrant-inset);
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
  padding: var(--quadrant-head-offset) var(--quadrant-inset) 0;
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
