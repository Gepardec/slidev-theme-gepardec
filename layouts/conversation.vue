<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useSlideContext } from '@slidev/client'
import GepardecLogo from '../components/GepardecLogo.vue'
import CornerSpots from '../components/CornerSpots.vue'

/*
  THE TAPE — a rolling transcript window.

  The slide is a fixed viewport onto a taller stack of turns. Each click
  reveals the next turn and slides the stack up so that turn is flush with
  the bottom of the viewport; history scrolls off the top under a gradient.

  Nothing is ever cropped unseen: every turn is fully visible at the click
  that introduces it. Export with `--with-clicks` and each of those clicks
  becomes its own PDF page, so the crop is temporal, not lossy.

  Turns are ordinary `<ChatTurn>` elements in the `::turns::` slot, paced
  with Slidev's own `v-click`. The layout never registers clicks itself —
  it reads the classes the directive leaves on the DOM, so whatever the
  author writes (one turn per click, two, a `v-click` range) is what the
  tape follows. There is no second description of the conversation to keep
  in sync with the turns themselves: the turns are the whole model.
*/
const props = defineProps<{
  /** Shown bottom-left beside the turn counter, e.g. a session date. */
  session?: string
}>()

const { $clicks, $nav } = useSlideContext()

const viewport = ref<HTMLElement>()
const stack = ref<HTMLElement>()

const offset = ref(0)
const revealed = ref(0)
const total = ref(0)
const above = ref(0)

/* Slidev's export navigates a real page per click, so measurement runs
   there exactly as it does live — but a half-finished transition would be
   captured as a half-finished slide. */
const printing = computed(() => !!$nav.value?.isPrintMode)

function measure() {
  const vp = viewport.value
  const st = stack.value
  if (!vp || !st)
    return

  const turns = Array.from(st.querySelectorAll<HTMLElement>('.chat-turn'))
  total.value = turns.length

  const shown = turns.filter(t => !t.classList.contains('slidev-vclick-hidden'))
  revealed.value = shown.length

  /* Dim the history from here rather than from Slidev's own `prior`/`current`
     classes: the opening turn carries no `v-click`, so it would never be
     tagged and would stay lit while every turn after it dimmed. */
  const current = shown[shown.length - 1]
  for (const turn of turns) {
    const isCurrent = turn === current
    turn.classList.toggle('is-current', isCurrent)
    turn.classList.toggle('is-prior', !isCurrent && !turn.classList.contains('slidev-vclick-hidden'))
  }

  if (!current) {
    offset.value = 0
    above.value = 0
    return
  }

  /* `offsetTop`/`offsetHeight` are layout coordinates inside the stack, so
     they are unaffected both by the translate this function sets (which
     would otherwise feed back on itself) and by the transform Slidev uses
     to scale the slide to the window. */
  const bottom = current.offsetTop + current.offsetHeight
  offset.value = Math.max(0, bottom - vp.clientHeight)

  above.value = turns.filter(t => t.offsetTop + t.offsetHeight <= offset.value).length

  if (import.meta.env.DEV)
    warnOversized(turns, vp.clientHeight)
}

/* The tape's one silent crop. A turn taller than the whole viewport can
   never be shown in full — the stack scrolls its bottom into view and its
   top is gone, on screen and in the PDF alike. Every other overflow here
   is deliberate, so this is the only thing worth warning about; split the
   turn into two `<ChatTurn>` blocks on consecutive clicks.

   Dev only: `import.meta.env.DEV` is false in `slidev build` and in the
   page `slidev export` drives, so this cannot fire during an export. */
function warnOversized(turns: HTMLElement[], viewportHeight: number) {
  for (const turn of turns) {
    const tall = turn.offsetHeight > viewportHeight
    turn.classList.toggle('gepardec-turn-oversized', tall)
    if (tall) {
      console.warn(
        `[gepardec-theme] a turn is ${Math.round(turn.offsetHeight - viewportHeight)}px `
        + `taller than the tape's viewport — its top can never be shown. `
        + `Split it across two <ChatTurn> blocks.`,
        turn,
      )
    }
  }
}

/* The directive toggles its classes in a watcher of its own; `nextTick`
   puts this after that flush and after the DOM patch it causes. */
function remeasure() {
  nextTick(measure)
}

let observer: ResizeObserver | undefined

onMounted(() => {
  measure()
  // Web fonts land after first paint and move every box with them.
  document.fonts?.ready.then(measure)
  observer = new ResizeObserver(measure)
  if (stack.value)
    observer.observe(stack.value)
  if (viewport.value)
    observer.observe(viewport.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = undefined
})

watch($clicks, remeasure)
</script>

<template>
  <div class="gepardec-conversation gepardec-headline slidev-layout">
    <div class="conv-head gepardec-content">
      <slot />
    </div>

    <div ref="viewport" class="conv-viewport gepardec-content">
      <div
        ref="stack"
        class="conv-stack"
        :style="{
          transform: `translateY(${-offset}px)`,
          transition: printing ? 'none' : 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1)',
        }"
      >
        <slot name="turns" />
      </div>

      <!-- The history that has scrolled past. A gradient, not a hard edge:
           the audience should read it as "there is more above", which is
           true, rather than as a clipped box. -->
      <div class="conv-fade" :class="{ 'conv-fade--active': above > 0 }" />
      <div v-if="above > 0" class="conv-earlier chat-counter">
        <strong>{{ above }}</strong> earlier {{ above === 1 ? 'turn' : 'turns' }}
      </div>
    </div>

    <div class="conv-foot gepardec-content">
      <span v-if="props.session" class="chat-counter">{{ props.session }}</span>
      <span class="chat-counter conv-progress">
        Turn <strong>{{ revealed }}</strong> / {{ total }}
      </span>
    </div>

    <CornerSpots />
    <GepardecLogo />
  </div>
</template>

<style scoped>
/* Column flex rather than fixed heights: the viewport takes whatever the
   master's margins leave, so the layout stays correct if the headline
   wraps to two lines. */
.gepardec-conversation {
  display: flex;
  flex-direction: column;
}

.conv-head {
  flex: none;
  margin-bottom: 0.9rem;
}

.conv-head :deep(h1) {
  margin: 0;
}

.conv-viewport {
  flex: 1 1 auto;
  /* Without this a flex item refuses to shrink below its content, and the
     whole point of the tape is that it does. */
  min-height: 0;
  position: relative;
  overflow: hidden;
}

.conv-stack {
  /* `offsetTop` inside `measure()` is relative to the offset parent — this
     makes that the stack itself. */
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--gepardec-chat-gap);
  will-change: transform;
}

.conv-fade {
  position: absolute;
  inset: 0 0 auto 0;
  height: 3.2rem;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    var(--gepardec-black) 12%,
    rgba(0, 0, 0, 0.85) 45%,
    rgba(0, 0, 0, 0) 100%
  );
  opacity: 0;
  transition: opacity 240ms ease;
  z-index: 4;
}

.conv-fade--active {
  opacity: 1;
}

.conv-earlier {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 5;
  padding: 0.1rem 0 0.3rem 0.6rem;
  background: var(--gepardec-black);
}

.conv-foot {
  flex: none;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  margin-top: 0.7rem;
  padding-top: 0.45rem;
  border-top: 1px solid rgba(var(--gepardec-yellow-rgb), 0.25);
}

/* With no session label the counter still belongs on the right. */
.conv-progress {
  margin-left: auto;
}

/* Dev-only marker from `warnOversized`. The class is never applied in a
   build or an export, so this rule cannot reach a PDF. */
.conv-stack :deep(.gepardec-turn-oversized) {
  outline: 2px solid #ff3b30;
  outline-offset: 2px;
}
</style>
