<script setup lang="ts">
// The master uses one background image for the title slide, the "Zwischenfolie"
// and the "Kontakt" slide, so its placement lives here rather than in each of
// the three layouts. Bundled through Vite's asset pipeline so it resolves
// wherever the theme is consumed from.
//
// The sujet is brand artwork, so a deck picks one of the two official
// renderings — it cannot supply an image of its own.
import defaultCheetah from '../assets/cheetah-sujet.webp'
import asciiCheetah from '../assets/ascii-sujet.webp'

const props = withDefaults(
  defineProps<{
    /**
     * Which sujet to show: the photographic cheetah of the master, or the
     * ASCII rendering of the same face.
     */
    variant?: 'cheetah' | 'ascii'
  }>(),
  { variant: 'cheetah' },
)

const sujets = { cheetah: defaultCheetah, ascii: asciiCheetah }
</script>

<template>
  <!-- Both sujets are right-half faces: the centre line sits on the left slide
       edge, and the artwork's own falloff dissolves it into the black canvas. -->
  <img
    class="gepardec-sujet"
    :class="`gepardec-sujet--${props.variant}`"
    :src="sujets[props.variant]"
    alt=""
    aria-hidden="true"
  />
</template>
