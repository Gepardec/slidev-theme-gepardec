<script setup lang="ts">
import { computed } from 'vue'

/* One message in an agent session — what the `conversation` layout stacks
   on its tape. Authored straight in the markdown flow:

     <ChatTurn role="user">

     Fix the build.

     </ChatTurn>

   The blank lines matter — they are what makes markdown-it parse the body
   as markdown instead of raw HTML. */
const props = withDefaults(defineProps<{
  /** Who is speaking. Drives the whole visual treatment. */
  role?: 'user' | 'agent' | 'tool'
  /** Override the role cap, e.g. `who="Oliver"` or `who="Claude"`. */
  who?: string
  /** Small muted note next to the cap — a timestamp, a model, a token count. */
  meta?: string
}>(), {
  role: 'agent',
})

const CAPS: Record<string, string> = {
  user: 'You',
  agent: 'Agent',
  tool: 'Tool',
}

const cap = computed(() => props.who ?? CAPS[props.role])
</script>

<template>
  <div class="chat-turn" :class="`chat-turn--${props.role}`">
    <div class="chat-turn__cap">
      <span class="chat-turn__role">{{ cap }}</span>
      <span v-if="props.meta" class="chat-turn__meta">{{ props.meta }}</span>
    </div>
    <div class="chat-turn__body">
      <slot />
    </div>
  </div>
</template>
