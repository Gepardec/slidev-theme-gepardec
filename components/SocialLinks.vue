<script setup lang="ts">
/**
 * Social channel row for the `contact` layout — white organic "spot" badges
 * carrying black glyphs, mirroring the Gepardec Kontakt slide.
 *
 * Glyphs are inlined so the theme carries no icon-set dependency, and each one
 * gets a viewBox cropped to its own outline plus an optical height, so a wide
 * mark ("in") and a tall one ("f") read as the same size.
 */
const props = defineProps<{
  linkedin?: string
  xing?: string
  facebook?: string
  instagram?: string
}>()

const CHANNELS = [
  {
    key: 'linkedin',
    label: 'LinkedIn',
    viewBox: '6.8 6.8 19 18',
    size: '0.85rem',
    /* Bare "in" — no enclosing square, as on the reference slide. */
    glyph:
      '<path fill="currentColor" d="M11.1 24.4H7.6V13h3.5zm-1.7-13c-1.1 0-2.1-.9-2.1-2.1s.9-2.1 2.1-2.1c1.1 0 2.1.9 2.1 2.1s-1 2.1-2.1 2.1m15.1 12.9H21v-5.6c0-1.3 0-3.1-1.9-3.1S17 17.1 17 18.5v5.7h-3.5V13h3.3v1.5h.1c.5-.9 1.7-1.9 3.4-1.9c3.6 0 4.3 2.4 4.3 5.5v6.2z"/>',
  },
  {
    key: 'xing',
    label: 'Xing',
    viewBox: '3 2 25.5 28.5',
    size: '1.05rem',
    glyph:
      '<path fill="currentColor" d="M11.42 8.29a1.25 1.25 0 0 0-1.13-.76h-4a.65.65 0 0 0-.55.25a.63.63 0 0 0 0 .62l2.73 4.73l-4.3 7.59a.6.6 0 0 0 0 .62a.58.58 0 0 0 .52.28h4a1.22 1.22 0 0 0 1.1-.78l4.36-7.71zm16.41-5.41a.65.65 0 0 0 0-.62a.61.61 0 0 0-.53-.26h-4.08a1.19 1.19 0 0 0-1.08.77s-8.7 15.43-9 15.93l5.74 10.53A1.26 1.26 0 0 0 20 30h4a.59.59 0 0 0 .54-.26a.62.62 0 0 0 0-.62l-5.69-10.4Z"/>',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    viewBox: '13.2 6.9 11.6 21.6',
    size: '1.15rem',
    /* Bare "f" — the same outline carbon carves out of its square. */
    glyph:
      '<path fill="currentColor" d="M16.82 28v-9.28H13.7v-3.63h3.12v-2.67c0-3.1 1.89-4.79 4.67-4.79c.93 0 1.86 0 2.79.14V11h-1.91c-1.51 0-1.8.72-1.8 1.77v2.31h3.6l-.47 3.63h-3.13V28z"/>',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    viewBox: '4 4 24 24',
    size: '1.1rem',
    glyph:
      '<circle cx="22.406" cy="9.594" r="1.44" fill="currentColor"/><path fill="currentColor" d="M16 9.838A6.162 6.162 0 1 0 22.162 16A6.16 6.16 0 0 0 16 9.838M16 20a4 4 0 1 1 4-4a4 4 0 0 1-4 4"/><path fill="currentColor" d="M16 6.162c3.204 0 3.584.012 4.849.07a6.6 6.6 0 0 1 2.228.413a3.98 3.98 0 0 1 2.278 2.278a6.6 6.6 0 0 1 .413 2.228c.058 1.265.07 1.645.07 4.85s-.012 3.583-.07 4.848a6.6 6.6 0 0 1-.413 2.228a3.98 3.98 0 0 1-2.278 2.278a6.6 6.6 0 0 1-2.228.413c-1.265.058-1.645.07-4.849.07s-3.584-.012-4.849-.07a6.6 6.6 0 0 1-2.228-.413a3.98 3.98 0 0 1-2.278-2.278a6.6 6.6 0 0 1-.413-2.228c-.058-1.265-.07-1.645-.07-4.849s.012-3.584.07-4.849a6.6 6.6 0 0 1 .413-2.228a3.98 3.98 0 0 1 2.278-2.278a6.6 6.6 0 0 1 2.228-.413c1.265-.058 1.645-.07 4.849-.07M16 4c-3.259 0-3.668.014-4.948.072a8.8 8.8 0 0 0-2.912.558a6.14 6.14 0 0 0-3.51 3.51a8.8 8.8 0 0 0-.558 2.913C4.014 12.333 4 12.74 4 16s.014 3.668.072 4.948a8.8 8.8 0 0 0 .558 2.912a6.14 6.14 0 0 0 3.51 3.51a8.8 8.8 0 0 0 2.913.558c1.28.058 1.688.072 4.947.072s3.668-.014 4.948-.072a8.8 8.8 0 0 0 2.913-.558a6.14 6.14 0 0 0 3.51-3.51a8.8 8.8 0 0 0 .557-2.913C27.986 19.667 28 19.26 28 16s-.014-3.668-.072-4.948a8.8 8.8 0 0 0-.558-2.912a6.14 6.14 0 0 0-3.51-3.51a8.8 8.8 0 0 0-2.913-.557C19.667 4.013 19.26 4 16 4"/>',
  },
] as const

/* One tight corner per badge turns the ellipse into a brand "spot" — the same
   irregular silhouette as the corner cluster. */
const BLOBS = [
  '60% 40% 25% 55% / 55% 60% 40% 45%',
  '45% 45% 20% 60% / 50% 55% 45% 50%',
  '55% 35% 45% 50% / 60% 50% 40% 45%',
  '50% 55% 35% 45% / 45% 50% 55% 50%',
]

/* The reference slide is print — the icons are decorative there. Passing a URL
   turns a badge into a real link; without one it renders as a plain badge. */
const items = CHANNELS.map((c, i) => ({ ...c, blob: BLOBS[i], href: props[c.key] }))
</script>

<template>
  <div class="gepardec-social">
    <component
      v-for="item in items"
      :key="item.key"
      :is="item.href ? 'a' : 'span'"
      class="social-badge"
      :style="{ borderRadius: item.blob }"
      :href="item.href"
      :target="item.href ? '_blank' : undefined"
      :rel="item.href ? 'noreferrer' : undefined"
      :aria-label="item.label"
    >
      <svg
        :viewBox="item.viewBox"
        :style="{ height: item.size }"
        aria-hidden="true"
        v-html="item.glyph"
      />
    </component>
  </div>
</template>

<style scoped>
.gepardec-social {
  display: flex;
  gap: 0.5rem;
}

.social-badge {
  display: grid;
  place-items: center;
  width: 2.15rem;
  height: 1.95rem;
  flex: none;
  background: var(--gepardec-white);
  color: var(--gepardec-black);
  border-bottom: 0; /* beat the theme's global link underline */
}

.social-badge svg {
  width: auto;
}

a.social-badge:hover {
  background: var(--gepardec-yellow);
}
</style>
