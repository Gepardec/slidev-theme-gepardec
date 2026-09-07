<script setup lang="ts">
import GepardecLogo from '../components/GepardecLogo.vue'
import CornerSpots from '../components/CornerSpots.vue'
</script>

<template>
  <div class="gepardec-statement slidev-layout">
    <div class="statement-content gepardec-content">
      <slot />
    </div>

    <CornerSpots />
    <GepardecLogo />
  </div>
</template>

<style scoped>
.gepardec-statement {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
}

.statement-content {
  max-width: 75%;
}

/* A statement is a sentence, not a master headline: set upright in white, with
   the emphasis carrying the brand yellow. */
.statement-content :deep(h1) {
  font-size: 3.5rem;
  line-height: 1.1;
  color: var(--gepardec-white);
  font-weight: 400;
}

.statement-content :deep(h1 strong),
.statement-content :deep(strong) {
  color: var(--gepardec-yellow);
  font-weight: 500;
}

.statement-content :deep(p) {
  font-size: 1.2rem;
  color: var(--gepardec-white);
  margin-top: 1.5rem;
}
</style>
