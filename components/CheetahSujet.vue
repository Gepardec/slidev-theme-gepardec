<script setup lang="ts">
// The master uses one background image for the title slide, the "Zwischenfolie"
// and the "Kontakt" slide, so its placement lives here rather than in each of
// the three layouts. Bundled through Vite's asset pipeline so it resolves
// wherever the theme is consumed from.
import defaultCheetah from '../assets/cheetah-sujet.webp'

defineProps<{
  /**
   * Optional override. Pass a path relative to your deck's public/ directory
   * (e.g. "/my-cover.jpg"). Defaults to the cheetah asset bundled with the theme.
   */
  image?: string
}>()
</script>

<template>
  <!-- The face's centre line sits on the left slide edge and the artwork's own
       alpha falloff dissolves it into the black canvas. -->
  <img
    class="gepardec-sujet"
    :src="image ?? defaultCheetah"
    alt=""
    aria-hidden="true"
  />
</template>
