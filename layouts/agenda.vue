<script setup lang="ts">
import GepardecLogo from '../components/GepardecLogo.vue'
import CornerSpots from '../components/CornerSpots.vue'
</script>

<template>
  <div class="gepardec-agenda gepardec-headline slidev-layout">
    <!--
      Slot flow mirrors the corporate Agenda slide:
      h1 = the headline, the following list = the agenda entries.
      Both bullet lists and ordered lists render as "// n" rows.
    -->
    <div class="agenda-content gepardec-content">
      <slot />
    </div>

    <CornerSpots />
    <GepardecLogo />
  </div>
</template>

<style scoped>
/* Geometry measured off the corporate Agenda slide. The master is authored on a
   1280x720 px canvas; every value below is that measurement scaled to Slidev's
   980 px canvas (factor 0.765625), so the slide is a 1:1 rebuild.

   The master lays the entries out in a table but its own first row says to set
   that table transparent once it is filled in, so the rules are geometry here,
   not strokes: nothing is drawn, the columns and the row pitch just place the
   text where the master puts it. */
.gepardec-agenda {
  /* Entry's left edge to the start of its text — 95.75 px in the master. */
  --agenda-number-width: 4.581rem;
  /* The master's row pitch. */
  --agenda-row-height: 2.928rem;

  /* The master's side margins are the theme's; only the bottom differs — the
     entry table runs to the slide edge. */
  padding-bottom: 0;
}

.agenda-content {
  height: 100%;
}

/* --- Headline ------------------------------------------------------------ */
/* Treatment comes from `gepardec-headline`; the master's gap below it and the
   text inset that lines its glyphs up with the "//" markers are this slide's. */
.agenda-content :deep(h1) {
  margin: 0 0 3.394rem var(--gepardec-text-inset);
}

/* --- Entries ------------------------------------------------------------- */
.agenda-content :deep(ul),
.agenda-content :deep(ol) {
  display: grid;
  grid-auto-rows: minmax(var(--agenda-row-height), auto);
  list-style: none;
  margin: 0;
  padding: 0;
  counter-reset: agenda-item;
}

/* Six entries is what the master fits in a column. A seventh splits the table
   into two halves and keeps filling the left one first — the reference slide
   numbers 1-6 down the left column and 7-12 down the right.
   The row tracks are shared, so a wrapped entry deepens its row across both
   halves, exactly as a table row would. */
.agenda-content :deep(ul:has(> li:nth-child(7))),
.agenda-content :deep(ol:has(> li:nth-child(7))) {
  /* The master's halves are not an even split of the text column — the left
     one is 570.95 px wide, which is where entry 7 starts. */
  grid-template-columns: 27.321rem 1fr;
  grid-template-rows: repeat(6, minmax(var(--agenda-row-height), auto));
  grid-auto-flow: column;
}

.agenda-content :deep(li) {
  display: grid;
  grid-template-columns: var(--agenda-number-width) 1fr;
  column-gap: var(--gepardec-text-inset);
  align-items: center;
  margin: 0;
  /* The master's text inset on the closing edge too, so a wrapped entry stops
     short of the next half instead of running into it. */
  padding: 0 var(--gepardec-text-inset) 0 0;
  font-size: 1.978rem;
  font-style: italic;
  font-weight: 400;
  line-height: 1.15;
  color: var(--gepardec-white);
  counter-increment: agenda-item;
}

.agenda-content :deep(li)::before {
  content: '// ' counter(agenda-item);
  /* bullets.css pins its marker into the text's left padding; here the marker
     is a column of its own. */
  position: static;
  padding-left: var(--gepardec-text-inset);
  color: var(--gepardec-yellow);
  font-family: var(--gepardec-font-display);
  font-style: italic;
  font-weight: 400;
  /* Not the tightened marker from bullets.css — the master keeps the space
     between the slashes and the number open. */
  letter-spacing: normal;
}

/* Loose markdown lists wrap each entry in a <p>. */
.agenda-content :deep(li > p) {
  margin: 0;
}
</style>
