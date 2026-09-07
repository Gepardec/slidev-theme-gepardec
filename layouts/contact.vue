<script setup lang="ts">
import GepardecLogo from '../components/GepardecLogo.vue'
import CornerSpots from '../components/CornerSpots.vue'
import SocialLinks from '../components/SocialLinks.vue'
import CheetahSujet from '../components/CheetahSujet.vue'

const props = withDefaults(
  defineProps<{
    /** Left-hand image. Defaults to the cheetah asset bundled with the theme. */
    image?: string
    /** Portrait, e.g. "/contact.jpg" for a file in your deck's public/ dir. */
    photo?: string
    /** Path shown in the portrait placeholder while `photo` is unset. */
    photoPath?: string
    name?: string
    role?: string
    company?: string
    /** Office rows under the company name — rendered as "// <label>: <address>". */
    locations?: { label: string; address: string }[]
    web?: string
    email?: string
    phone?: string
    /** Social profile URLs. Omitted channels render as plain badges, as in print. */
    linkedin?: string
    xing?: string
    facebook?: string
    instagram?: string
    /** Set to false to drop the social badge row entirely. */
    social?: boolean
  }>(),
  {
    photoPath: 'public/contact.jpg',
    company: 'Gepardec IT Services GmbH',
    web: 'www.gepardec.com',
    social: true,
    locations: () => [
      { label: 'Wien', address: 'Ernst-Melchior-Gasse 24, 1020 Wien' },
      { label: 'Linz', address: 'Europaplatz 4, 4020 Linz' },
    ],
  },
)

const href = (url: string) => (/^https?:\/\//.test(url) ? url : `https://${url}`)
const tel = (n: string) => n.replace(/[^+\d]/g, '')

/* The placeholder box is narrow, so offer break opportunities after each "/"
   instead of letting a long path snap mid-filename. */
const segments = (path: string) =>
  path.split('/').map((seg, i, all) => (i < all.length - 1 ? `${seg}/` : seg))
</script>

<template>
  <div class="gepardec-contact gepardec-headline slidev-layout">
    <!-- The Kontakt slide shares the title slide's background in the master. -->
    <CheetahSujet :image="image" />

    <div class="contact-content gepardec-content">
      <div class="contact-head">
        <div class="contact-identity">
          <!-- Headline comes from the markdown flow, as in every other layout. -->
          <slot>
            <h1>Kontakt</h1>
          </slot>
          <p v-if="name" class="contact-name">{{ name }}</p>
          <p v-if="role" class="contact-role">{{ role }}</p>
        </div>

        <img v-if="photo" class="contact-photo" :src="photo" :alt="name ?? ''" />
        <!-- No portrait yet: tell the author exactly where the file goes. -->
        <div v-else class="contact-photo contact-photo-empty">
          <span class="ph-label">No photo</span>
          <span class="ph-path">
            <template v-for="(seg, i) in segments(photoPath)" :key="i">{{ seg }}<wbr /></template>
          </span>
          <span class="ph-hint">
            photo:
            <template v-for="(seg, i) in segments('/' + photoPath.replace(/^public\//, ''))" :key="i">{{ seg }}<wbr /></template>
          </span>
        </div>
      </div>

      <div v-if="company || locations.length" class="contact-block">
        <p v-if="company" class="contact-company">{{ company }}</p>
        <p v-for="loc in locations" :key="loc.label" class="contact-row">
          <span class="row-label"><span class="slash">//</span> {{ loc.label }}:</span>
          <span class="row-value">{{ loc.address }}</span>
        </p>
      </div>

      <div v-if="web || email || phone" class="contact-block contact-channels">
        <p v-if="web" class="contact-row">
          <span class="row-label row-label-key">Web</span>
          <span class="row-value"><a :href="href(web)" target="_blank" rel="noreferrer">{{ web }}</a></span>
        </p>
        <p v-if="email" class="contact-row">
          <span class="row-label row-label-key">Mail</span>
          <span class="row-value"><a :href="`mailto:${email}`">{{ email }}</a></span>
        </p>
        <p v-if="phone" class="contact-row">
          <span class="row-label row-label-key">Tel</span>
          <span class="row-value"><a :href="`tel:${tel(phone)}`">{{ phone }}</a></span>
        </p>
      </div>

      <SocialLinks
        v-if="social"
        :linkedin="linkedin"
        :xing="xing"
        :facebook="facebook"
        :instagram="instagram"
      />

      <div class="contact-extra">
        <slot name="note" />
      </div>
    </div>

    <CornerSpots />
    <GepardecLogo />
  </div>
</template>

<style scoped>
.gepardec-contact {
  /* Label gutter shared by the address and Web/Mail/Tel rows so both value
     columns line up, exactly as on the reference slide. */
  --contact-label-width: 4.6rem;

  padding: 0;
}

.contact-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  /* The reference slide is bottom-anchored, not centred. */
  justify-content: flex-end;
  padding: 2rem var(--gepardec-margin-x) 1.9rem 33.44%;
  min-width: 0;
}

/* --- Headline, name, portrait ------------------------------------------- */
.contact-head {
  /* Fixed first track so the portrait lands at the same x as on the reference
     slide regardless of how long the name is. */
  display: grid;
  grid-template-columns: 15.6rem auto;
  align-items: start;
}

.contact-identity {
  min-width: 0;
}

/* Treatment comes from `gepardec-headline`; the master sets this one white
   rather than yellow. */
.contact-identity :deep(h1) {
  color: var(--gepardec-white);
  margin: 0 0 0.55rem 0;
}

.contact-name,
.contact-role {
  /* The reference sets the person upright against the italic body copy. */
  font-style: normal;
  font-weight: 300;
  font-size: 1.7rem;
  line-height: 1.22;
  color: var(--gepardec-white);
  margin: 0;
}

.contact-photo {
  width: 7rem;
  aspect-ratio: 3 / 4;
  flex: none;
  object-fit: cover;
}

.contact-photo-empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.4rem;
  text-align: center;
  border: 1px dashed var(--gepardec-yellow-dim);
  background: rgba(var(--gepardec-yellow-rgb), 0.04);
}

.ph-label {
  font-size: 0.55rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gepardec-yellow);
}

.ph-path,
.ph-hint {
  font-family: var(--gepardec-font-mono);
  font-style: normal;
  font-size: 0.5rem;
  line-height: 1.3;
  color: var(--gepardec-gray-muted);
  word-break: break-word;
}

.ph-path {
  color: var(--gepardec-gray-text);
}

/* --- Address + channel rows --------------------------------------------- */
.contact-block {
  margin-top: 1.43rem;
}

.contact-channels {
  margin-top: 1.67rem;
  margin-bottom: 0.65rem;
}

.contact-company {
  font-size: 1.3rem;
  font-weight: 300;
  line-height: 1.24;
  color: var(--gepardec-white);
  margin: 0;
}

.contact-row {
  display: grid;
  grid-template-columns: var(--contact-label-width) 1fr;
  font-size: 1.3rem;
  font-weight: 300;
  line-height: 1.24;
  color: var(--gepardec-white);
  margin: 0;
}

.row-label {
  color: var(--gepardec-white);
}

.slash {
  color: var(--gepardec-yellow);
  letter-spacing: -0.03em;
  margin-right: 0.12rem;
}

.row-label-key {
  color: var(--gepardec-yellow);
  text-transform: uppercase;
}

.row-value {
  min-width: 0;
}

.row-value :deep(a),
.row-value a {
  color: var(--gepardec-white);
  text-decoration: none;
  border-bottom: 0;
}

.row-value a:hover {
  color: var(--gepardec-yellow);
}

/* --- Optional free-form note -------------------------------------------- */
.contact-extra :deep(p) {
  font-size: 0.95rem;
  color: var(--gepardec-gray-text);
  margin: 0.9rem 0 0 0;
}
</style>
