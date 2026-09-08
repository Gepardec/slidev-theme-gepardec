<script setup lang="ts">
import GepardecLogo from '../components/GepardecLogo.vue'
import CornerSpots from '../components/CornerSpots.vue'

/* Slidev's built-in `two-cols` hands `class` to both columns and `layoutClass`
   to the layout root. Decks written against it expect that, so this one takes
   the same two props. */
const props = defineProps<{
  class?: string
  layoutClass?: string
}>()
</script>

<template>
  <div class="gepardec-two-cols gepardec-headline slidev-layout" :class="props.layoutClass">
    <!--
      Slot flow is Slidev's own `two-cols` contract: the default slot and
      `::left::` both fill the left column, `::right::` fills the right one.
      There is no headline slot above the columns — that is Slidev's separate
      `two-cols-header` layout.
    -->
    <div class="col-left gepardec-content" :class="props.class">
      <slot />
      <slot name="left" />
    </div>
    <div class="col-right gepardec-content" :class="props.class">
      <slot name="right" />
    </div>

    <CornerSpots />
    <GepardecLogo />
  </div>
</template>

<style scoped>
.gepardec-two-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.col-left,
.col-right {
  min-width: 0;
}
</style>
