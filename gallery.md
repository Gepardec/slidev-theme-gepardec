---
theme: ./
title: Gepardec Theme — Layout Gallery
info: |
  Every layout in slidev-theme-gepardec, rendering itself and its own rules.
  The README is the canonical reference; this deck is what those rules look like.
drawings:
  persist: false
layout: cover
---

# Layout gallery

## Every layout, every slot

slidev-theme-gepardec

Rendered from the theme source

---
layout: default
class: gepardec-text-sm
---

# Cover

Each layout in this deck renders itself. Where a layout has no room for prose — `cover`, `section`, `contact` — the slide after it carries the source.

```md
---
layout: cover
---

# Layout gallery

## Every layout, every slot
```

- The first heading is the *Titel*, the second the *Untertitel* — both uppercased by the layout
- Every paragraph after them drops to the bottom-left *Name / Datum* block
- The cheetah bleeds off the left edge; the title column starts at ~34%

---
layout: agenda
---

# Agenda

- Cover and section
- Agenda
- Quadrants
- Default content
- Two columns
- Two columns with a headline
- Statement
- Contact
- The rules, on every slide that has room

---
layout: default
class: gepardec-text-sm
---

# Agenda

Nine entries, so the slide before this one already split: `// 1` to `// 6` down the left, the rest down the right.

```md
---
layout: agenda
---

# Agenda

- Cover and section
- Agenda
```

- Six entries fill one column; twelve is the maximum, and each half is only ~27rem wide
- Bullet lists and ordered lists render identically — the number is the position

---
layout: agenda
---

# Twelve entries

- Six fill the left column
- Seven starts the right
- Numbers follow position
- Reordering renumbers
- Bullets or ordered alike
- Nothing to configure
- Twelve is the maximum
- A long entry wraps and deepens its row
- Both halves share tracks
- So the one opposite follows
- As a table row behaves
- Split longer agendas

---
layout: section
---

# Section

## variant: cheetah

---
layout: section
variant: ascii
---

# Section

## variant: ascii

---
layout: default
class: gepardec-text-sm
---

# Section

The divider shares the title slide's background. `variant` picks which of the two official renderings it carries.

```md
---
layout: section
variant: ascii
---

# Section
```

- `cheetah` is the default; `ascii` is the same face, cropped flush to the left edge
- There is no third value — the sujet is brand artwork, not a per-slide choice
- The heading is centred vertically and set at the *Titel* size, not the content headline

---
layout: default
---

# Default

The standard content slide. The first heading is the headline; everything after it flows as ordinary Markdown.

- Bullets take the yellow `//` marker
  - Nested bullets step down a size and dim their marker
- **Bold** carries the brand yellow, *italic* stays white
- A [link](https://www.gepardec.com) is yellow with a dim underline
- `inline code` is set in JetBrains Mono

---
layout: default
---

# Ordered lists and tables

1. Ordered lists keep their numbers, tinted yellow
2. The marker is italic, like the entry

| Element    | Treatment                           |
|------------|-------------------------------------|
| `th`       | Yellow, with a yellow rule under it |
| `td`       | White, hairline rule                |

> A blockquote sets a line apart without a box.

---
layout: default
---

# Code

Shiki highlighting, at Slidev's own compact code sizing:

```java {4-5}
@ApplicationScoped
public class OrderService {

  @Inject
  Event<OrderPlaced> orderEvents;
}
```

- Write the highlight range in braces after the language: `java {4-5}`
- The band runs the length of the line and merges into the block's yellow edge
- Magic-move transitions keep a single border through the animation

---
layout: quadrants
---

# Quadrants

::one::

### ::one::
The headline is whatever precedes the first slot marker. The slashes in front
of this subheading are the layout's — write the text plain.

::two::

### ::two::
Blocks fill the 2x2 raster in reading order. Supply only `::one::` and
`::two::` and you get the top row, nothing else.

::three::

### ::three::
Copy is set at the dense step and paragraphs run with no gap between them.
That is the master's rhythm, not an oversight.

::four::

### ::four::
A block that outgrows the master's box deepens its row rather than spilling
over the one below it.

---
layout: default
class: gepardec-text-sm
---

# Quadrants

```md
---
layout: quadrants
---

# Quadrants

::one::

### Architecture
Strangler boundary around the JSF shell.

::two::
```

- Four named slots: `::one::` through `::four::`, filled in reading order
- Any heading level works as the subheading — the layout sets them all alike
- Use a second block or a `//` list when copy needs to be set apart

---
layout: two-cols
---

### two-cols

Everything before `::right::` fills this column. `::left::` is accepted as an
explicit name for it, exactly as in Slidev's own layout.

- No headline slot spans both columns
- That is `two-cols-header`, next slide

::right::

### The slot contract

```md
---
layout: two-cols
---

### Legacy

::right::

### Target
```

---
layout: two-cols-header
---

# two-cols-header

::left::

### The headline

The default slot — everything before `::left::` — spans both columns and is set
as the master's content headline.

::right::

### The columns

`::left::` and `::right::` are the two halves. Both take the same `class` prop
Slidev's built-in layout passes them.

::bottom::

`::bottom::` is an optional row underneath, anchored to the bottom of the slide. Leave it out and it costs no space.

---
layout: conversation
session: Flaky checkout suite
---

# conversation

::turns::

<ChatTurn role="user">

The checkout suite fails about one run in five on CI. Never locally.

</ChatTurn>

<ChatTurn role="agent" v-click>

The assertion races the toast animation. `getByRole` resolves the moment the node mounts, but the button stays `aria-disabled` until the transition ends.

</ChatTurn>

<ChatTurn role="tool" meta="npm test — 50 runs" v-click>

```
✗ checkout › places the order   9 failed, 41 passed
```

</ChatTurn>

<ChatTurn role="user" who="Oliver" meta="14:02" v-click>

Don't paper over it with a sleep. Wait on the state you actually care about.

</ChatTurn>

<ChatTurn role="agent" v-click>

Swapped the sleep for `toBeEnabled()`, which polls the attribute instead of the clock.

</ChatTurn>

<ChatTurn role="tool" meta="npm test — 50 runs" v-click>

```
✓ checkout › places the order   50 passed
```

</ChatTurn>

---
layout: default
class: gepardec-text-sm
---

# conversation

A fixed viewport onto a taller stack. Each click reveals the next turn and slides the stack up; history scrolls off under a gradient.

```md
---
layout: conversation
session: Flaky checkout suite
---

::turns::

<ChatTurn role="user">…</ChatTurn>
```

- `role` is `user`, `agent` or `tool`; `who` overrides the cap and `meta` adds a note
- Pacing is Slidev's own `v-click`; **export with `--with-clicks`** or the PDF gets one page

---
layout: statement
---

# Bold text takes the **Gepardec yellow.**

---
layout: contact
name: Defaults only
role: No photo, no socials
social: false
---

---
layout: default
class: gepardec-text-sm
---

# Contact

Everything except the person is filled in already.

| Prop                                  | Default                        |
|---------------------------------------|--------------------------------|
| `name` `role` `photo` `email` `phone` | —                              |
| `photoPath`                           | `public/contact.jpg`           |
| `company` `locations`                 | Gepardec IT Services GmbH, Wien + Linz |
| `web`                                 | `www.gepardec.com`             |

`social` is `true`; `false` drops the badges. A heading replaces `Kontakt`, and `::note::` adds a line underneath.

---
layout: contact
name: Günter Pirklbauer
role: CEO
email: guenter.pirklbauer@gepardec.com
phone: +43 664 1167 681
linkedin: https://www.linkedin.com/company/gepardec
xing: https://www.xing.com/pages/gepardec
locations:
  - { label: 'Wien', address: 'Ernst-Melchior-Gasse 24, 1020 Wien' }
  - { label: 'Linz', address: 'Europaplatz 4, 4020 Linz' }
  - { label: 'Graz', address: 'Beispielweg 1, 8010 Graz' }
---

# Get in touch

::note::

Badges with a URL become links; the rest stay plain, as in print.
