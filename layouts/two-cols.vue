<script setup lang="ts">
import GepardecLogo from '../components/GepardecLogo.vue'
import CornerSpots from '../components/CornerSpots.vue'
</script>

<template>
  <div class="gepardec-two-cols gepardec-headline slidev-layout">
    <!-- Headline comes from the markdown flow, as in every other layout:
         whatever precedes the first `::left::` marker. -->
    <div class="title-area gepardec-content">
      <slot />
    </div>

    <div class="cols gepardec-content">
      <div class="col col-left">
        <slot name="left" />
      </div>
      <div class="col col-right">
        <slot name="right" />
      </div>
    </div>

    <CornerSpots />
    <GepardecLogo />
  </div>
</template>

<style scoped>
.gepardec-two-cols {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  flex: 1;
  min-height: 0;
}

.col {
  min-width: 0;
}
</style>
