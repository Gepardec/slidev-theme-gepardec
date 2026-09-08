<script setup lang="ts">
import GepardecLogo from '../components/GepardecLogo.vue'
import CornerSpots from '../components/CornerSpots.vue'

/* Slidev's built-in `two-cols-header` hands `class` to the three content areas
   and `layoutClass` to the layout root. Decks written against it expect that,
   so this one takes the same two props. */
const props = defineProps<{
  class?: string
  layoutClass?: string
}>()
</script>

<template>
  <div class="gepardec-two-cols-header gepardec-headline slidev-layout" :class="props.layoutClass">
    <!--
      Slot flow is Slidev's own `two-cols-header` contract: the default slot is
      the headline spanning both columns, `::left::` and `::right::` are the
      columns, and `::bottom::` is an optional row under them.
    -->
    <div class="col-header gepardec-content">
      <slot />
    </div>
    <div class="col-left gepardec-content" :class="props.class">
      <slot name="left" />
    </div>
    <div class="col-right gepardec-content" :class="props.class">
      <slot name="right" />
    </div>
    <div v-if="$slots.bottom" class="col-bottom gepardec-content" :class="props.class">
      <slot name="bottom" />
    </div>

    <CornerSpots />
    <GepardecLogo />
  </div>
</template>

<style scoped>
/* Two explicit rows — headline, then the columns. `::bottom::` lands in an
   implicit third row, so an unused bottom slot costs no space. */
.gepardec-two-cols-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  column-gap: 3rem;
  row-gap: 1.4rem;
}

.col-header {
  grid-column: 1 / 3;
}

.col-left,
.col-right {
  min-width: 0;
}

.col-bottom {
  grid-column: 1 / 3;
  align-self: end;
  min-width: 0;
}
</style>
