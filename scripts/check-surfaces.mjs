#!/usr/bin/env node
/*
  Surface drift check.

  The theme's API lives in layouts/ and components/. Four places describe that
  API to a human or to an agent, and they rot silently when a prop is renamed:

    gallery.md                                  every layout, every slot
    skills/…/references/layouts.md              the authoring contract
    README.md                                   representative usage
    example.md                                  a narrative sample deck

  Only the first two are exhaustive *by construction* — a gallery slide cannot
  demonstrate `::three::` without containing the string, and the contract doc
  names every prop by design. So only those two are asserted here. README and
  example.md are representative on purpose; checking them would mean flagging
  prose that is deliberately not a full enumeration, and the noise would train
  everyone to skip the check. They are a human step in the
  gepardec-slidev-theme-dev skill instead.

  Assertions are name-existence only. Against the contract doc they match the
  backticked code span `name`, not the bare word — every layout name and all 28
  props are already written that way, and a loose substring match let a new
  `model` prop pass because the prose happened to contain the word "model".
  A new prop documented without backticks fails here; adding them is the fix.

  Even tightened, this under-reports: a doc can name a prop and still describe
  it wrongly. That is the intended direction to fail — silence beats crying
  wolf, and the skill's checklist covers the half a string match cannot see.
*/
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(ROOT, p), 'utf8')

/* The contract doc writes every layout name and prop as a code span. Matching
   the span rather than the bare word keeps prose from masking a real gap. */
const documents = (doc, name) => doc.includes(`\`${name}\``)

const GALLERY = 'gallery.md'
const CONTRACT = 'skills/gepardec-slidev-authoring/references/layouts.md'
const SKILL = 'skills/gepardec-slidev-authoring/SKILL.md'

/*
  Components split in two: the ones a deck author writes by hand carry public
  props, the rest are internal plumbing a layout mounts. Adding a component
  means classifying it here — an unclassified file is a hard failure, because
  it means new API surface arrived and nobody decided whether it is public.
*/
const COMPONENTS = {
  'ChatTurn.vue': 'public',
  'CheetahSujet.vue': 'internal',
  'CornerSpots.vue': 'internal',
  'GepardecLogo.vue': 'internal',
  'SocialLinks.vue': 'internal',
}

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven',
  'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen']

/*
  Pull prop and slot names out of an SFC.

  Deliberately strict: an unbalanced `defineProps<{` throws rather than
  returning a short list, because a parser that quietly finds no props would
  turn every check below into a silent pass.
*/
function parseSfc(src, file) {
  const props = []
  const slots = new Set()

  const open = src.match(/defineProps<\{/)
  if (open) {
    let i = open.index + open[0].length
    let depth = 1
    let body = ''
    while (i < src.length) {
      const c = src[i]
      if (c === '{') depth++
      else if (c === '}' && --depth === 0) break
      body += c
      i++
    }
    if (depth !== 0) throw new Error(`${file}: unbalanced defineProps<{ … }> — cannot read the prop list`)

    // Drop nested object literals so `locations?: { label: string }[]` does not
    // contribute `label` as a top-level prop, then strip doc comments.
    let nest = 0
    let flat = ''
    for (const c of body) {
      if (c === '{') nest++
      else if (c === '}') nest--
      else if (nest === 0) flat += c
    }
    flat = flat.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '')

    for (const line of flat.split('\n')) {
      const m = line.match(/^\s*([A-Za-z_$][\w$]*)\s*\??\s*:/)
      if (m) props.push(m[1])
    }
  }

  for (const m of src.matchAll(/<slot\s+name="([^"]+)"/g)) slots.add(m[1])

  return { props, slots: [...slots] }
}

const failures = []
const fail = (surface, msg) => failures.push({ surface, msg })

const layoutFiles = readdirSync(join(ROOT, 'layouts')).filter((f) => f.endsWith('.vue')).sort()
const componentFiles = readdirSync(join(ROOT, 'components')).filter((f) => f.endsWith('.vue')).sort()

const gallery = read(GALLERY)
const contract = read(CONTRACT)
const skill = read(SKILL)

for (const file of layoutFiles) {
  const name = file.replace(/\.vue$/, '')
  const { props, slots } = parseSfc(read(`layouts/${file}`), `layouts/${file}`)

  if (!new RegExp(`^layout:\\s*${name}\\s*$`, 'm').test(gallery))
    fail(GALLERY, `layout '${name}' has no slide — add one with 'layout: ${name}' in its frontmatter`)

  if (!documents(contract, name))
    fail(CONTRACT, `layout '${name}' is never mentioned — add its section`)

  for (const p of props)
    if (!documents(contract, p))
      fail(CONTRACT, `${name}: prop '${p}' is undocumented (as a \`${p}\` code span)`)

  for (const s of slots)
    if (!gallery.includes(`::${s}::`))
      fail(GALLERY, `${name}: slot '::${s}::' is never demonstrated on a slide`)
}

for (const file of componentFiles) {
  const kind = COMPONENTS[file]
  if (!kind) {
    fail('scripts/check-surfaces.mjs', `component '${file}' is unclassified — add it to COMPONENTS as 'public' or 'internal'`)
    continue
  }
  if (kind !== 'public') continue

  const tag = file.replace(/\.vue$/, '')
  const { props } = parseSfc(read(`components/${file}`), `components/${file}`)

  if (!contract.includes(`<${tag}`))
    fail(CONTRACT, `component '<${tag}>' is never shown — add its usage`)

  for (const p of props)
    if (!documents(contract, p))
      fail(CONTRACT, `<${tag}>: prop '${p}' is undocumented (as a \`${p}\` code span)`)
}

/*
  The authoring skill's own description hardcodes the layout count. Get it wrong
  and the skill stops triggering for the layout that was just added — drift no
  reviewer would catch, because nothing renders differently.
*/
const expected = NUMBER_WORDS[layoutFiles.length] ?? String(layoutFiles.length)
if (!skill.includes(`${expected} layouts`))
  fail(SKILL, `description should read "${expected} layouts" — ${layoutFiles.length} layout files exist`)

if (failures.length === 0) {
  console.log(`surfaces in sync — ${layoutFiles.length} layouts, ${componentFiles.length} components`)
  process.exit(0)
}

console.error(`\nThe theme's API changed but its surfaces did not.\n`)
for (const surface of [...new Set(failures.map((f) => f.surface))]) {
  console.error(`  ${surface}`)
  for (const f of failures.filter((x) => x.surface === surface)) console.error(`    · ${f.msg}`)
  console.error('')
}
console.error(`README.md and example.md are not checked here and may also need updating.`)
console.error(`Ask Claude to run the gepardec-slidev-theme-dev skill, or fix the above by hand.\n`)
process.exit(1)
