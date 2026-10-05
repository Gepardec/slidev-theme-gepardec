<script setup lang="ts">
import type { ClicksInfo } from '@slidev/types'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useSlideContext } from '@slidev/client'
import GepardecLogo from '../components/GepardecLogo.vue'
import CornerSpots from '../components/CornerSpots.vue'

/*
  THE DOSSIER — a long markdown document, one section at a time.

  An index rail down the left, one section on stage at reading size. The rail
  is the document's own table of contents: every `##` is a numbered entry, and
  the current one unfolds its `###` children beneath it. A click steps to the
  next section.

  The author pastes the document into `::doc::` as plain markdown. The layout
  partitions it at the headings it finds in the rendered flow, so the document
  is the whole model — there is no second outline to keep in sync with it.

  Which is also why this layout registers its own clicks. A pasted document is
  prose with nothing for a `v-click` to sit on, and asking for a wrapper around
  every section would be asking for the document to be rewritten before it can
  be shown. `$clicksContext.register` from `onMounted` is how Slidev's own
  `VClickGap` and `CodeBlockWrapper` do it — an official binding, not a way
  around one.

  The count has to be structural, never measured: it is fixed at mount, and a
  click total that moved when the web fonts landed would renumber the slide
  under the presenter. So the layout never repaginates a section. What it does
  instead, when a section will not fit, is give it the room — see `decideRail`.
*/
const props = withDefaults(defineProps<{
  /** Caption in the status line — a filename, a change id, a date. A label only: the layout reads no file. */
  source?: string
  /** How deep the document is cut into steps. `3` (the default) gives every `###` a step of its own; `2` keeps a `##` whole; `4` steps through `####` too, which is what a spec file of `#### Scenario` blocks wants. */
  depth?: number
  /** Force the index rail on or off. Left out, the layout measures the document and keeps the rail whenever every section fits beside it and the rail fits its column. */
  rail?: boolean
}>(), {
  depth: 3,
  /* Vue casts an absent Boolean prop to `false`, which here would read as the
     author having asked for no rail on every slide that never mentions one.
     Declaring the default is what keeps "not stated" distinguishable from
     "stated false" — the whole difference between measuring and obeying. */
  rail: undefined,
})

const { $clicks, $clicksContext, $nav } = useSlideContext()

const root = ref<HTMLElement>()
const railEl = ref<HTMLElement>()
const flow = ref<HTMLElement>()

/* `#` is not a boundary. A document pasted with its own title opens with it,
   and as a section that title would be a click with nothing under it and a
   rail entry pointing at that blank stage. Left out of this map it is body
   copy before the first heading, which rides with the first section. */
const HEADING_LEVEL: Record<string, number> = { H2: 2, H3: 3, H4: 4 }

/** One entry in the index rail: a `##`, with its `###` children. */
interface Group {
  text: string
  children: string[]
}

/** One click: the nodes it puts on stage, and where the rail should point. */
interface Step {
  /** Index into `groups`, or -1 before the document's first heading. */
  group: number
  /** Index into that group's `children`, or -1 when the step is the group itself. */
  child: number
  /** Deepest heading level the step opens at — 2, 3, 4, or 0 for a bodiless preamble. */
  level: number
  /** The heading above the step's own title — the eyebrow once the rail has
      folded, when nothing else on the slide names it. Empty for a `##` step,
      whose title is the top of the document's outline. */
  parent: string
  nodes: HTMLElement[]
}

const groups = ref<Group[]>([])
const steps = shallowRef<Step[]>([])
const clickInfo = shallowRef<ClicksInfo | null>(null)

/* Whether the rail is folded away and the stage has the full slide width.
   An explicit `rail:` prop settles it; otherwise `decideRail` measures. */
const folded = ref(props.rail === false)

/* A string is a valid ClicksElement, so the registration needs no DOM node and
   no import from Slidev's internals to mint an id. */
const clickId = `gepardec-document-${Math.random().toString(36).slice(2)}`

/* Slidev's export navigates a real page per click, so everything below runs
   there as it does live — but an animation caught mid-flight would be baked
   into the PDF as a half-faded section. */
const printing = computed(() => !!$nav.value?.isPrintMode)

const stepCount = computed(() => Math.max(1, steps.value.length))

const active = computed(() => {
  const info = clickInfo.value
  if (!info)
    return 0
  return Math.min(Math.max(0, $clicks.value - info.start + 1), stepCount.value - 1)
})

const activeGroup = computed(() => steps.value[active.value]?.group ?? -1)

/*
  `2 / 4` beside the eyebrow — where a step sits among its siblings.

  A `####` step counts inside its own `###`, so the presenter can see how many
  scenarios are left in the requirement they are reading. Anything shallower
  counts the group's children, which is what the rail is showing unfolded.
*/
function positionOf(step: Step) {
  const group = groups.value[step.group]
  if (!group)
    return null

  if (step.level === 4) {
    const sibs = steps.value.filter(s => s.level === 4 && s.group === step.group && s.child === step.child)
    return sibs.length > 1 ? { i: sibs.indexOf(step) + 1, n: sibs.length } : null
  }

  if (step.child < 0 || group.children.length < 2)
    return null
  return { i: step.child + 1, n: group.children.length }
}

/* Every step's status, not just the current one's — see the status line in
   the template for why all of them are rendered. */
const positions = computed(() => steps.value.map(positionOf))

/*
  Read the document out of the rendered flow.

  A heading opens a step when it is no deeper than `depth`: `##` always, `###`
  from 3, `####` from 4. Everything else belongs to the step above it. The rail
  indexes `##` and `###` only — a `####` is a step without a row of its own,
  because a rail that listed every scenario would be the document again rather
  than an index of it.
*/
function scan() {
  const el = flow.value
  if (!el)
    return

  const cut = Math.min(4, Math.max(2, Math.round(props.depth)))
  const nextGroups: Group[] = []
  const nextSteps: Step[] = []

  let current: Step | null = null
  /* The open step when it is still nothing but a heading — `## Decisions`
     followed straight by a `###`, or a `###` followed straight by a `####`.
     Those two are one beat, not two: a click that shows a heading and nothing
     else is a click spent on a page the audience has already read off the
     rail. Cleared as soon as the step is given a body. */
  let bare: Step | null = null
  /* The `###` currently open, which is what a `####` step sits under. */
  let child = -1
  let childText = ''

  for (const node of Array.from(el.children) as HTMLElement[]) {
    const level = HEADING_LEVEL[node.tagName] ?? 0
    const text = (node.textContent ?? '').trim()

    node.classList.add('doc-node')
    node.classList.remove('doc-node--lifted')

    if (level === 2) {
      nextGroups.push({ text, children: [] })
      child = -1
      childText = ''
      current = { group: nextGroups.length - 1, child: -1, level: 2, parent: '', nodes: [node] }
      nextSteps.push(current)
      bare = current
      continue
    }

    if (level === 3 && cut >= 3 && nextGroups.length) {
      const group = nextGroups[nextGroups.length - 1]
      group.children.push(text)
      child = group.children.length - 1
      childText = text
      if (current && bare === current) {
        /* Rides with the bare `##` above it and becomes the section's title on
           stage. A step has one title, so the `##` is lifted: the rail names
           it, or the eyebrow once the rail has folded. */
        current.child = child
        current.level = 3
        current.parent = group.text
        current.nodes[current.nodes.length - 1].classList.add('doc-node--lifted')
        current.nodes.push(node)
      }
      else {
        current = { group: nextGroups.length - 1, child, level: 3, parent: group.text, nodes: [node] }
        nextSteps.push(current)
      }
      bare = current
      continue
    }

    if (level === 4 && cut >= 4 && child >= 0) {
      if (current && bare === current) {
        /* Rides with the bare `###` above it, and becomes the first of that
           requirement's scenarios: counted with its siblings, with the `###`
           as its parent — lifted, the way a bare `##` is. */
        current.level = 4
        current.parent = childText
        current.nodes[current.nodes.length - 1].classList.add('doc-node--lifted')
        current.nodes.push(node)
        bare = null
      }
      else {
        current = { group: nextGroups.length - 1, child, level: 4, parent: childText, nodes: [node] }
        nextSteps.push(current)
        bare = current
      }
      continue
    }

    if (!current) {
      current = { group: -1, child: -1, level: 0, parent: '', nodes: [] }
      nextSteps.push(current)
    }
    current.nodes.push(node)
    bare = null
  }

  /* A preamble before the first heading has no rail entry to point at, so it
     rides with the first section rather than spending a click of its own. */
  if (nextSteps.length > 1 && nextSteps[0].group === -1) {
    nextSteps[1].nodes.unshift(...nextSteps[0].nodes)
    nextSteps.shift()
  }

  groups.value = nextGroups
  steps.value = nextSteps
}

/*
  Put one step on stage, take every other node out of the flow, and unfold
  that step's group in the rail.

  The rail's unfolding is set here rather than bound in the template so that
  `worstOverflow` can lay out every step's rail in the same synchronous pass it
  lays out every step's section — a Vue binding would only catch up on the next
  tick, after the measurement is over.
*/
function paint(index: number) {
  const el = flow.value
  if (!el)
    return

  const group = steps.value[index]?.group ?? -1
  for (const block of railEl.value?.querySelectorAll<HTMLElement>('.doc-children') ?? [])
    block.classList.toggle('doc-children--open', Number(block.dataset.group) === group)

  const nodes = steps.value[index]?.nodes ?? []
  const shown = new Set(nodes)
  /* The section's first visible node closes up against the head rule. It is
     not `:first-child` — the whole document is still in the flow above it — so
     the class has to say so. */
  const lead = nodes.find(n => !n.classList.contains('doc-node--lifted'))

  for (const node of Array.from(el.children) as HTMLElement[]) {
    node.classList.toggle('doc-node--on', shown.has(node))
    node.classList.toggle('doc-node--lead', node === lead)
  }
}

function apply() {
  paint(active.value)
  if (import.meta.env.DEV)
    nextTick(warnOverflow)
}

/** How far the worst step runs past its column, in px — the section past the
    stage, or the rail, with that step's group unfolded, past its own. */
function worstOverflow() {
  const el = flow.value
  if (!el)
    return 0

  const rl = railEl.value
  const keep = active.value
  let worst = 0
  for (let i = 0; i < steps.value.length; i++) {
    paint(i)
    const bottom = steps.value[i].nodes.reduce(
      (y, n) => Math.max(y, n.offsetTop + n.offsetHeight),
      0,
    )
    worst = Math.max(worst, bottom - el.clientHeight)
    if (rl)
      worst = Math.max(worst, rl.scrollHeight - rl.clientHeight)
  }
  paint(keep)
  return worst
}

/*
  Does the rail stay? Measured rather than asked, because the answer depends
  on how the prose happens to wrap: every step is laid out with the rail, and
  if any section or the rail itself overruns, the rail folds. Once for the
  whole document, so it cannot blink in and out as the presenter clicks.

  Measuring is safe here in a way that measuring the click count is not. The
  number of steps is fixed at mount either way; all this moves is whether a
  column is drawn. A pass that landed on the wrong answer would at worst draw
  a rail that should have folded — never renumber the slide under anyone.

  Which is the whole reason this waits for two things rather than running once.
  `onMounted` fires for every slide in the deck at once, and Slidev gives a
  slide a box only when it is navigated to — every other one measures 0x0, and
  against a stage of no height every section overflows and every document
  would fold a rail it did not need to. The web fonts are the second: measured
  in the fallback face, text sets wider than it will, and a document that fits
  is told it does not.

  So the answer is only taken when the stage has a real box and the fonts have
  landed, and it is taken again whenever that box changes — which is what the
  observer below is for, and what each page of a `slidev export` needs. The
  signature is read with the rail put back first, so it describes the geometry
  being judged rather than the one last chosen; that is also what stops the
  observer from answering its own writes, since folding changes the width it
  would otherwise re-trigger on.

  The class is written to the element before the ref is committed, so the
  second measurement sees the folded geometry in the same frame and Vue's
  render puts back the class that is already there. Nothing paints in between.
*/
let fontsReady = false
let decidedAt = ''

function decideRail() {
  const el = root.value
  const fl = flow.value
  if (!el || !fl || props.rail !== undefined)
    return

  const was = el.classList.contains('gepardec-document--folded')
  el.classList.remove('gepardec-document--folded')

  const sig = `${fl.clientWidth}x${fl.clientHeight}`
  if (!fontsReady || fl.clientWidth < 1 || fl.clientHeight < 1 || sig === decidedAt) {
    el.classList.toggle('gepardec-document--folded', was)
    return
  }
  decidedAt = sig

  if (worstOverflow() > 1)
    el.classList.add('gepardec-document--folded')

  folded.value = el.classList.contains('gepardec-document--folded')
}

/* The same section is re-measured on every click and after every resize, and
   each pass would otherwise log the same line again. */
let warned = ''

/*
  The last resort. A section that still does not fit once the rail has folded
  runs off the bottom edge, on screen and in the PDF alike — the click count is
  fixed at mount, so there is no second click to carry the rest. A rail kept
  with `rail: true` that outgrows its column is clipped the same way.

  Dev only: `import.meta.env.DEV` is false in `slidev build` and in the page
  `slidev export` drives, so neither of these can reach a deck or a PDF.
*/
function warnOverflow() {
  const el = flow.value
  /* Not before the layout has settled: a section measured in the fallback face,
     or before the rail has been given its answer, would be reported against a
     geometry it is never going to be shown at — and told to fix it by splitting
     a section that fits. */
  if (!el || !fontsReady)
    return

  const nodes = steps.value[active.value]?.nodes ?? []
  const bottom = nodes.reduce((y, n) => Math.max(y, n.offsetTop + n.offsetHeight), 0)
  const over = bottom - el.clientHeight

  for (const node of nodes)
    node.classList.toggle('gepardec-doc-oversized', over > 1)

  const rl = railEl.value
  const railOver = folded.value || !rl ? 0 : rl.scrollHeight - rl.clientHeight

  const seen = `${active.value}:${Math.round(over)}:${Math.round(railOver)}`
  if (seen === warned)
    return
  warned = seen

  if (over > 1) {
    console.warn(
      `[gepardec-theme] section ${active.value + 1} of the document is ${Math.round(over)}px `
      + `taller than the stage — its foot runs off the slide`
      + `${folded.value ? ', and the index rail has already folded away to give it the width' : ''}. `
      + `Split it by giving it a heading one level deeper, and raise 'depth' so that level `
      + `becomes a step of its own.`,
      nodes[0],
    )
  }

  if (railOver > 1) {
    console.warn(
      `[gepardec-theme] the index rail is ${Math.round(railOver)}px taller than its `
      + `column, so its last entries are cut off. Drop 'rail: true' to let it fold away, `
      + `set 'depth: 2' to stop indexing '###', or split the document across two slides.`,
      rl,
    )
  }
}

/*
  Fix the click count at mount, before Slidev's own clicks context mounts — the
  window its builtins register in. The first section is on screen when the
  slide arrives, so the document needs one click fewer than it has sections.
*/
function registerClicks() {
  const needed = steps.value.length - 1
  clickInfo.value = needed > 0 ? $clicksContext.calculateSince('+1', needed) : null
  $clicksContext.register(clickId, clickInfo.value)
}

/* Watches for the stage getting a height — which is when this slide is first
   navigated to, and again in each page `slidev export` drives. */
let watcher: ResizeObserver | null = null

/* Both gates are open: take the decision, then say whatever is still wrong. */
function settle() {
  fontsReady = true
  decideRail()
  if (import.meta.env.DEV)
    warnOverflow()
}

onMounted(() => {
  scan()
  registerClicks()
  /* After the rail has rendered the groups `scan` just found, so `paint` has
     their children to unfold. */
  nextTick(apply)

  if (props.rail === undefined && flow.value && typeof ResizeObserver !== 'undefined') {
    watcher = new ResizeObserver(() => decideRail())
    watcher.observe(flow.value)
  }

  // Web fonts land after first paint and move every box with them. Without the
  // API — there is no browser Slidev runs in that lacks it, but a test harness
  // is a browser too — the rail is judged on whatever face is up rather than
  // never being judged at all.
  if (document.fonts)
    document.fonts.ready.then(settle)
  else
    settle()
})

/* Nothing here watches the slot for later changes, and it does not need to:
   editing the markdown in `slidev dev` invalidates the slide module, which
   remounts this layout, so the scan and the registration both run again on the
   edited document. Checked by watching `onMounted` fire on a heading added to
   a live deck. */
onBeforeUnmount(() => {
  watcher?.disconnect()
  $clicksContext.unregister(clickId)
})

watch(active, apply, { flush: 'post' })
</script>

<template>
  <div
    ref="root"
    class="gepardec-document slidev-layout"
    :class="{ 'gepardec-document--folded': folded }"
  >
    <!-- The status line, in two rows, each with the counter for what it names.
         The top row is the document: the slide's heading, the source caption,
         and the step count through the whole of it. The second is where in it
         you are — the title's parent heading, and the count among that
         parent's children — and it is drawn only once the rail has folded.
         Beside the rail it would repeat the entry the rail already lights.

         The heading stays a real `h1` from the markdown flow, so Slidev still
         reads the slide's title from it. It is set in the caption face rather
         than as the master's content headline: it never changes while the
         document is stepped through, and every rem it stood tall was a rem
         taken from the stage on every section.

         Every step's second row is rendered, stacked in one grid cell with
         only the current one visible, so the row is as tall as the longest of
         them on every click. A parent heading too long for one line wraps
         rather than being cut, and the stage under it still never moves. -->
    <div class="doc-head gepardec-content">
      <div class="gepardec-caption doc-head__row">
        <div class="doc-head__name">
          <span class="doc-head__title"><slot /></span>
          <span v-if="props.source" class="doc-head__source">{{ props.source }}</span>
        </div>
        <span class="doc-head__count"><strong>{{ active + 1 }}</strong> / {{ stepCount }}</span>
      </div>

      <div v-if="steps.some(s => s.parent)" class="gepardec-caption doc-head__where">
        <div
          v-for="(step, i) in steps"
          :key="i"
          class="doc-head__row doc-head__state"
          :class="{ 'doc-head__state--on': i === active }"
          :aria-hidden="i !== active"
        >
          <span class="doc-head__eyebrow">{{ step.parent }}</span>
          <span v-if="positions[i]" class="doc-head__count">
            <strong>{{ positions[i]!.i }}</strong> / {{ positions[i]!.n }}
          </span>
        </div>
      </div>
    </div>

    <div class="doc-body gepardec-content">
      <!-- The index. Groups are always listed; only the current one unfolds,
           so the rail shows the whole document's shape and the detail of the
           part being read. Which one is unfolded is `paint`'s to say, not a
           binding's — see there. Kept in the DOM when folded rather than
           removed, so the fold can be measured and undone without the document
           being scanned again. -->
      <div ref="railEl" class="doc-rail">
        <div class="doc-rail__index">
          <div
            v-for="(group, gi) in groups"
            :key="gi"
            class="doc-entry"
            :class="{
              'doc-entry--current': gi === activeGroup,
              'doc-entry--prior': gi < activeGroup,
            }"
          >
            <div class="doc-entry__row">
              <span class="doc-entry__num">{{ String(gi + 1).padStart(2, '0') }}</span>
              <span class="doc-entry__text">{{ group.text }}</span>
            </div>

            <div v-if="group.children.length" class="doc-children" :data-group="gi">
              <div
                v-for="(child, ci) in group.children"
                :key="ci"
                class="doc-child"
                :class="{ 'doc-child--current': ci === steps[active]?.child }"
              >
                <span class="doc-child__num">{{ gi + 1 }}.{{ ci + 1 }}</span>
                <span class="doc-child__text">{{ child }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- The stage. The whole document is in the flow at all times; every
           section but the current one is out of it, so nothing below the fold
           is holding space open. -->
      <div class="doc-stage">
        <div ref="flow" class="doc-flow" :class="{ 'doc-flow--static': printing }">
          <slot name="doc" />
        </div>
      </div>
    </div>

    <CornerSpots />
    <GepardecLogo />
  </div>
</template>

<style scoped>
.gepardec-document {
  /* Width of the index column. Entries wrap within it rather than being cut,
     so this sets how many lines a long heading takes, not how much of it
     shows. At the slide's width every rem here is a rem the stage loses. */
  --doc-rail-width: 14rem;
  --doc-gutter: 1.6rem;
  /* The stage's own body copy, a step below the slide's. A document section is
     read, not declaimed, and this is the step at which a `## Context` of two
     paragraphs and a `## Tests` of eight items both land inside the stage. */
  --doc-body: var(--gepardec-text-sm);
  /* The footer logo's own box, off the master: it is inset 3% from the bottom
     and stands 11% of the slide tall, so its top edge is at 14% and its
     baseline at 3%. The stage runs down to that baseline and reserves the
     corner the logo occupies — see `.doc-flow::before`. */
  --doc-logo-clear-w: 6.7rem;
  --doc-logo-clear-h: 4.2rem;

  display: flex;
  flex-direction: column;
  /* The shared bottom margin clears the logo by stopping above it, which costs
     this layout 55px of reading height across the full width of the slide to
     keep a 137px-wide mark company. A document is the one thing here with more
     to say than a slide's worth, so it runs down to the logo's baseline
     instead and steps around the logo itself. */
  padding-bottom: 1.03rem;
}

/* --- The status line ---------------------------------------------------- */
.doc-head {
  flex: none;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding-bottom: 0.35rem;
  margin-bottom: 0.7rem;
  border-bottom: 1px solid var(--gepardec-rule);
}

/* A name on the left, its counter on the right edge — so the two counters
   stand in one column, one above the other, each beside what it counts. */
.doc-head__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1.4rem;
}

/* Both names wrap rather than being cut; the counters never do. */
.doc-head__name,
.doc-head__eyebrow {
  flex: 1 1 auto;
  min-width: 0;
  overflow-wrap: anywhere;
}

.doc-head__count {
  flex: none;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

/* The slide's heading, kept an `h1` and set in the caption face. Whatever else
   precedes `::doc::` runs on in the same line rather than opening a second. */
.doc-head__title :deep(*) {
  display: inline;
  margin: 0;
  font: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
}

.doc-head__title :deep(h1) {
  color: var(--gepardec-white);
}

.doc-head__title:empty {
  display: none;
}

.doc-head__title:not(:empty) + .doc-head__source::before {
  content: '·';
  margin: 0 0.6rem;
}

.doc-head__where {
  display: none;
  grid-template-columns: minmax(0, 1fr);
}

/* A class rather than a `v-if`, so the row is in or out of the geometry in the
   same synchronous pass `decideRail` measures — see there. */
.gepardec-document--folded .doc-head__where {
  display: grid;
}

.doc-head__state {
  grid-area: 1 / 1;
  visibility: hidden;
}

.doc-head__state--on {
  visibility: visible;
}

.doc-head__eyebrow {
  color: var(--gepardec-yellow);
}

.doc-head__eyebrow:not(:empty)::before {
  content: '// ';
  letter-spacing: normal;
}

.doc-body {
  flex: 1 1 auto;
  /* Without this a flex item refuses to shrink below its content, and both
     columns here are meant to be bounded by the slide, not by their text. */
  min-height: 0;
  display: grid;
  grid-template-columns: var(--doc-rail-width) 1fr;
  column-gap: var(--doc-gutter);
}

/* The rail has folded: the stage is the slide. */
.gepardec-document--folded .doc-body {
  grid-template-columns: 1fr;
  column-gap: 0;
}

.gepardec-document--folded .doc-rail {
  display: none;
}

/* --- The index rail ------------------------------------------------------ */
.doc-rail {
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-right: 1px solid var(--gepardec-rule);
  padding-right: var(--doc-gutter);
  /* Not `auto`: a rail that scrolls would hide entries behind a gesture nobody
     makes mid-talk. It is clipped, and dev warns when it has to clip. */
  overflow: hidden;
}

.doc-rail__index {
  flex: 1 1 auto;
  min-height: 0;
}

.doc-entry {
  margin-bottom: 0.56rem;
}

.doc-entry__row {
  display: grid;
  grid-template-columns: 2.1rem 1fr;
  column-gap: 0.35rem;
  align-items: baseline;
  font-family: var(--gepardec-font-display);
  font-style: italic;
  font-weight: 500;
  font-size: var(--gepardec-text-xs);
  line-height: 1.25;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--gepardec-gray-muted);
  transition: color 200ms ease;
}

.doc-entry__num::before {
  content: '// ';
  color: inherit;
  letter-spacing: normal;
}

/*
  Entries wrap; they are never cut.

  A clamped entry reads fine until two siblings share their opening words — a
  spec's `Requirement: Payroll month is…` twice over — and then the rail shows
  the same line twice and indexes nothing. A wrapped one costs height instead,
  and height is what the layout measures: a rail that outgrows its column folds
  away, the way a section too tall for the stage makes it fold.
*/
.doc-entry__text,
.doc-child__text {
  /* A heading that opens with a long `code` span — `Decision:
     MonthEndTaskRepository.findOpenEmployeeTasks is sufficient` — has nothing
     to break on and would otherwise run out of the column. Breaking mid-token
     is the lesser evil in a column this narrow. */
  overflow-wrap: anywhere;
}

/* Read already: lit enough to count as ground covered, quiet enough that the
   cursor is the only thing the eye lands on. */
.doc-entry--prior .doc-entry__row {
  color: var(--gepardec-gray-text);
}

.doc-entry--current .doc-entry__row {
  color: var(--gepardec-yellow);
}

.doc-entry--current .doc-entry__num::before {
  color: var(--gepardec-yellow);
}

/* --- The current group's sub-sections ------------------------------------ */
.doc-children {
  display: none;
  margin: 0.3rem 0 0.1rem 0.36rem;
  border-left: 1px solid rgba(255, 255, 255, 0.16);
  padding-left: 0.55rem;
}

.doc-children--open {
  display: block;
}

.doc-child {
  display: grid;
  grid-template-columns: 1.6rem 1fr;
  column-gap: 0.3rem;
  align-items: baseline;
  font-family: var(--gepardec-font-display);
  font-style: italic;
  font-weight: 400;
  font-size: var(--gepardec-text-xs);
  line-height: 1.22;
  margin: 0.2rem 0;
  color: var(--gepardec-gray-muted);
  opacity: 0.75;
  transition: color 200ms ease, opacity 200ms ease;
}

.doc-child__num {
  color: var(--gepardec-yellow-dim);
}

.doc-child--current {
  color: var(--gepardec-white);
  opacity: 1;
}

.doc-child--current .doc-child__num {
  color: var(--gepardec-yellow);
}

/* --- The stage ----------------------------------------------------------- */
.doc-stage {
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
}

.doc-flow {
  flex: 1 1 auto;
  min-height: 0;
  position: relative;
  overflow: hidden;
  font-size: var(--doc-body);
  /* Blocks belong to the stage's scale, not the slide's. The size leaves through
     Slidev's own token — its rule outranks this selector, so a `font-size` on
     `pre` would be dead weight. */
  --slidev-code-font-size: 0.8em;
  --slidev-code-line-height: 1.4;
}

/*
  The logo's corner, reserved.

  The stage now runs down to the logo's baseline, and the logo stands in its
  bottom-right corner. A right float spanning the stage, with a shape that is
  empty until the logo's top edge, excludes exactly that corner: a section's
  last lines wrap around the mark instead of running under it. Only the last
  four rem of the column are narrowed, so a section that ends higher up — which
  is nearly all of them — is laid out as if the float were not there.

  `shape-outside` shortens line boxes, so prose and list items wrap. A `<pre>`
  does not wrap and would still run under the logo; a code block at the very
  foot of a long section is the one thing to keep off the last line.
*/
.doc-flow::before {
  content: '';
  float: right;
  width: var(--doc-logo-clear-w);
  height: 100%;
  shape-outside: polygon(
    0 calc(100% - var(--doc-logo-clear-h)),
    100% calc(100% - var(--doc-logo-clear-h)),
    100% 100%,
    0 100%
  );
}

/* Every node of the document stays in the flow and keeps whatever display the
   theme gives it; all but the current section's are taken out of it, so
   nothing below the fold is holding space open. Stated as "hide what is not
   on" rather than "hide everything, show the section" so that a <table> or a
   list the theme lays out on a grid is never handed back a display it did not
   have. A lifted heading goes too: the rail or the eyebrow names it. */
.doc-flow :deep(.doc-node:not(.doc-node--on)),
.doc-flow :deep(.doc-node--lifted) {
  display: none;
}

/* The class arrives with the section, so this plays once per click without the
   flow needing a `key` — one that re-created the slot content would throw away
   the nodes `scan()` measured and classified. Print gets the settled state:
   `slidev export` photographs a page per click and would otherwise catch some
   of them mid-fade. */
.doc-flow:not(.doc-flow--static) :deep(.doc-node--on) {
  animation: doc-enter 260ms cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes doc-enter {
  from { opacity: 0; transform: translateY(0.55rem); }
  to   { opacity: 1; transform: none; }
}

/* --- The document's own markdown ----------------------------------------- */
/* A pasted document's own `#` title. It is not a boundary, so it opens the
   first section — set at the section-title size rather than as a second slide
   headline at the top of the scale. */
.doc-flow :deep(h1) {
  font-size: var(--gepardec-text-lg);
  line-height: 1.18;
  margin: 0 0 0.4rem;
}

/* A `##` that opens a step with a body of its own is that step's title, set
   as a `###` title is — white, not the yellow of a subhead — so the stage's
   title reads the same whichever level the step opens at. */
.doc-flow :deep(h2) {
  font-size: var(--gepardec-text-lg);
  color: var(--gepardec-white);
  line-height: 1.18;
  margin: 0 0 0.4rem;
}

/* `h3` does two jobs: the section's own title at the top of the stage, and —
   under `depth: 2`, where it is not a section boundary — a sub-heading inside
   one. So it carries the gap a sub-heading needs, and the node that opens the
   section gives it back. `h4` is the same story one level down, once `depth`
   is 4. */
.doc-flow :deep(h3) {
  font-size: var(--gepardec-text-lg);
  line-height: 1.18;
  margin: 0.9rem 0 0.4rem;
}

.doc-flow :deep(h4) {
  margin: 0.8rem 0 0.25rem;
}

.doc-flow :deep(.doc-node--lead) {
  margin-top: 0;
}

/* The document sets its own rhythm rather than the slide's: a section is a
   run of short paragraphs and lists, and at the slide's spacing four of them
   would not fit where six belong. */
.doc-flow :deep(p) {
  margin: 0 0 0.5em;
  line-height: 1.45;
  color: var(--gepardec-gray-text);
}

.doc-flow :deep(ul),
.doc-flow :deep(ol) {
  margin: 0.3em 0 0.5em;
}

.doc-flow :deep(li) {
  margin: 0.2em 0;
  line-height: 1.4;
}

.doc-flow :deep(blockquote) {
  margin: 0.55em 0;
}

.doc-flow :deep(pre) {
  margin: 0.4rem 0 0.55rem;
}

/* Dev-only marker from `warnOverflow`. The class is never applied in a build
   or an export, so this rule cannot reach a PDF. */
.doc-flow :deep(.gepardec-doc-oversized) {
  outline: 2px solid #ff3b30;
  outline-offset: 2px;
}
</style>
