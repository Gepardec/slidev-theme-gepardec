# slidev-theme-gepardec

A [Slidev](https://sli.dev) theme matching the Gepardec brand:

- Pure black background, Gepardec yellow (`#FFC800`) accents
- Italic condensed typography (Barlow Semi Condensed) + JetBrains Mono for code
- `//` bullet markers in yellow, white content text
- `gepardec` logo and corner spots on every slide; cheetah sujet on cover/section/contact
- No bordered content boxes — clean, minimal aesthetic

## Layouts

| Layout       | Use for                                                   |
|--------------|-----------------------------------------------------------|
| `cover`      | Title slide. Cheetah bleeding off the left, title block right. |
| `section`    | Section breaks ("Zwischenfolie"). Sujet + centred title.  |
| `agenda`     | Agenda slide. Headline + numbered `// n` entries.         |
| `quadrants`  | Headline + four `//` subheading blocks on a 2x2 raster.   |
| `default`    | Standard content. Title + `//` bullets, minimal layout.   |
| `two-cols`   | Side-by-side content, Slidev's `two-cols` slot contract.   |
| `two-cols-header` | Headline spanning two columns, plus optional bottom row. |
| `statement`  | Big bold statement — no cheetah.                          |
| `contact`    | "Kontakt" slide — person, offices, channels, socials.     |
| `conversation` | Agent session as a rolling transcript window, paced with `v-click`. |

Every layout carries the footer logo and the corner spots, as the corporate
master does. `cover`, `section`, and `contact` add the cheetah sujet — all three
share the master's single background placement, from one `CheetahSujet`
component.

Every layout takes its headline from the markdown flow — the first heading on
the slide, before any `::slot::` marker. `default`, `agenda`, `quadrants` and
`contact` render it as the master's content headline: uppercase, 3.445rem,
weight 400. `cover` and `section` set their far larger *Titel* instead —
uppercase too on `cover`, as the master has it — and `statement` sets a
sentence, upright in white. `two-cols` is the exception: it follows Slidev's
own slot contract, which has no headline above the columns — use
`two-cols-header` when you want one.

Close a deck with `contact`, or with `statement` when there is no person to put
on it.

## Install

### Local (recommended while iterating)

Point `theme` at the folder that contains this theme, relative to your deck:

```yaml
---
theme: ./slidev-theme-gepardec
---
```

The bundled `example.md` uses `theme: ./` because it lives in the theme root.

### The two decks

| Deck          | What it is                                              | Scripts |
|---------------|---------------------------------------------------------|---------|
| `example.md`  | A realistic customer deck. Ships in the npm package — copy it and replace the content. | `dev`, `build`, `export`, `screenshot` |
| `gallery.md`  | Every layout rendering itself and its own rules, including the slots and props `example.md` has no reason to use. Not published. | `dev:gallery`, `build:gallery`, `screenshot:gallery` |

```bash
pnpm dev          # the example deck
pnpm dev:gallery  # the layout gallery
```

Change a layout's geometry and run the gallery — it puts every slot, variant
and prop of the theme on screen in twenty-one slides, so an overflow or a broken
slot shows up immediately.

### As an npm package

```bash
npm i @gepardec/slidev-theme-gepardec
```

```yaml
---
theme: '@gepardec/slidev-theme-gepardec'
---
```

## Brand assets

The official Gepardec assets are bundled inside the theme at `assets/`:

- `assets/cheetah-sujet.webp` — cheetah sujet for `cover`, `section` and
  `contact` (transparent PNG source, exported as WebP with its alpha intact)
- `assets/ascii-sujet.webp` — the same face rendered in ASCII, selectable on
  `section` slides with `variant: ascii`
- `assets/logo.png` — footer wordmark
- `assets/spots.png` — corner decoration

They are imported by the Vue components (`CheetahSujet`, `GepardecLogo`,
`CornerSpots`) and resolved through Vite's asset pipeline, so they work
transparently no matter where your slide deck lives.
To swap any of them, replace the file and rebuild.

The sujet is brand artwork, so it is not swappable per slide — `section` picks
between the two official renderings with `variant:` (see below), and `cover` and
`contact` always carry the photographic one.

## Usage

### Title slide

Mirrors the corporate PowerPoint title slide: the cheetah sujet bleeds off the
left edge — its centre line sits on the slide edge, so the right half of the
face shows — and the artwork's own alpha falloff dissolves it into the black
canvas. The title column starts at ~34% width. The first heading is the
*Titel*, the second the *Untertitel* — both uppercased by the layout, as in the
master — and any paragraphs after them are pushed to the bottom-left as the
*Name / Datum* block.

```md
---
layout: cover
---

# Java Enterprise Modernization

## Quarkus & Jakarta EE

Oliver Tod

March 2026
```

Titles are set at the master's size (~5.7rem) and in caps, which is wider than
it reads in the editor. A long title wraps inside the title column on its own,
and the layout compresses its top spacing before it overflows.

### Section break

```md
---
layout: section
---

# Part 2

## Implementation
```

The divider carries the same sujet as the title slide. Set `variant: ascii` in
the frontmatter to swap it for the ASCII rendering of the same face — cropped to
the half face, so it sits flush on the left slide edge:

```md
---
layout: section
variant: ascii
---

# Part 2

## Implementation
```

`variant` accepts `cheetah` (the default) and `ascii`; there is no third option.

### Agenda slide

A 1:1 rebuild of the corporate Agenda slide: the headline top-left, then the
entries numbered `// 1`, `// 2`, … in Gepardec yellow. The master lays them out
in a table, but its own first row is a note to set that table transparent once
it is filled in — so nothing is drawn here. The table survives only as geometry:
the column positions and the row pitch.

Write it as ordinary Markdown — the first heading is the headline, the list
below it becomes the entries:

```md
---
layout: agenda
---

# Agenda

- Why modernize now
- Our approach
- The migration path
- Tech stack comparison
```

The headline is uppercased by the layout, so `# Agenda` renders as `AGENDA`.
Bullet lists and ordered lists render identically — the number always comes from
the entry's position, so reordering the list renumbers it.

#### More than six entries

Six is what the master fits in a column. From the seventh entry on, the layout
splits into two halves and keeps filling the left one first, exactly as the
master's second page does — `// 1` through `// 6` down the left, `// 7` through
`// 12` down the right. Nothing to configure: write seven or more entries and
the split happens.

Twelve is where the master stops. Past that a third column would start off the
right edge of the slide, so split a longer agenda over two slides.

Entries need to be terser in two-column mode than in one: each half is only
~27rem wide, so an entry runs to a second line at around 30 characters. One or
two wrapped entries fit; a column of them overflows the slide.

A wordy entry wraps rather than being clipped, and deepens its row — in two
column mode both halves share their row tracks, so the entry opposite it moves
down with it, the way a table row behaves.

### Content slide

Just write standard Markdown — the first heading becomes the title and the
rest flows as content:

```md
---
layout: default
---

# Why modernize now?

- NIS2 compliance pressure
- Vendor support dropped
- Dependency drift = release risk
```

### Subheading blocks

A one-to-one rebuild of the corporate "Subheadings" slide: an uppercase yellow
headline over four text blocks on a 2x2 raster. The `//` in front of each
subheading is added by the layout, so write the subheading as plain text:

```md
---
layout: quadrants
---

# Modernization pillars

::one::

### Architecture
Strangler boundary around the JSF shell, Quarkus services behind it.

::two::

### Security
Keycloak-backed auth, integrated from the first service.

::three::

### Delivery
CI/CD with automated rollback, Renovate keeping dependencies current.

::four::

### Operations
OpenShift as the target platform, observability in place first.
```

The headline is whatever precedes `::one::`. Blocks fill the raster in order —
supply only `::one::` and `::two::` and you get the top row.

Inside a block, paragraphs run at the master's uniform line pitch with no gap
between them, exactly as in the reference slide. Use a second block or a `//`
list when copy needs to be set apart.

### Two columns

`two-cols` follows Slidev's own slot contract: everything before `::right::`
fills the left column, everything after it fills the right one. `::left::` is
accepted as an explicit name for the left column, as in Slidev.

```md
---
layout: two-cols
---

### Legacy
- Java EE 7
- Manual deploys

::right::

### Target
- Jakarta EE 10
- CI/CD
```

There is no headline slot spanning both columns — that is `two-cols-header`,
below.

### Two columns with a headline

`two-cols-header` follows Slidev's contract of the same name: the default slot
is the headline spanning both columns, `::left::` and `::right::` are the
columns, and `::bottom::` is an optional row underneath, anchored to the bottom
of the slide.

```md
---
layout: two-cols-header
---

# Tech stack comparison

::left::

### Legacy
- Java EE 7
- Manual deploys

::right::

### Target
- Jakarta EE 10
- CI/CD

::bottom::

Both stacks stay in production through the migration.
```

The headline is the master's content headline — uppercase, yellow. Leave
`::bottom::` out and it costs no space.

### Statement slide

`**bold**` text is highlighted in Gepardec yellow:

```md
---
layout: statement
---

# We only recommend **what we can technically justify.**
```

### Contact slide

A one-to-one rebuild of the Gepardec "Kontakt" slide: cheetah sujet on the left,
white uppercase headline, the person upright against the italic body copy, the
office block with yellow `//` markers, `WEB` / `MAIL` / `TEL` rows and the social
spots. Everything except the person is already filled in:

```md
---
layout: contact
name: Günter Pirklbauer
role: CEO
photo: /contact.jpg
email: guenter.pirklbauer@gepardec.com
phone: +43 664 1167 681
---
```

| Prop         | Default                                            |
|--------------|----------------------------------------------------|
| `name`       | —                                                  |
| `role`       | —                                                  |
| `photo`      | — (placeholder box, see below)                     |
| `photoPath`  | `public/contact.jpg` — the path the placeholder shows |
| `company`    | `Gepardec IT Services GmbH`                        |
| `locations`  | Wien + Linz office addresses                       |
| `web`        | `www.gepardec.com`                                 |
| `email`      | —                                                  |
| `phone`      | —                                                  |
| `social`     | `true` — set `false` to drop the badge row         |

`web`, `email`, and `phone` become `https:` / `mailto:` / `tel:` links.

#### The portrait

Drop the headshot into your deck's `public/` directory and point `photo` at it
with a leading slash — `public/contact.jpg` is referenced as `photo: /contact.jpg`.
A 3:4 portrait crop matches the reference slide.

Until then the slide renders a dashed placeholder in the portrait's place naming
the file it expects, so an unfinished deck says so out loud instead of showing a
silent gap. Use a different location by setting `photoPath`:

```md
---
layout: contact
photoPath: public/team/alice.jpg
---
```

#### Social badges

The four badges render unlinked by default, exactly like the printed original.
Pass a URL to turn one into a real link:

```md
---
layout: contact
linkedin: https://www.linkedin.com/company/gepardec
xing: https://www.xing.com/pages/gepardec
---
```

#### Offices and headline

`locations` replaces the two default office rows, and a heading replaces the
default `Kontakt` headline (which is uppercased, like every content headline).
A `::note::` slot adds a free-form line under the social badges:

```md
---
layout: contact
locations:
  - { label: 'Graz', address: 'Beispielweg 1, 8010 Graz' }
---

# Get in touch

::note::

Reach us any weekday before 18:00.
```

The headline and the person are white here, not yellow — that is the reference
slide, not an oversight.

### Walking through an agent session

`conversation` tells the story of a session with an AI agent. The problem it
solves is that a transcript is taller than a slide, and a scrollbar answers
that on screen only to crop the content in the PDF.

So the slide is a fixed viewport onto a taller stack of turns. Each click
reveals the next turn and slides the stack up so that turn sits flush with the
bottom; history scrolls off the top under a gradient, with a count of what went
above. Nothing is ever cropped *unseen* — every turn is fully visible at the
click that introduces it.

````md
---
layout: conversation
session: OrderService migration · 8 Sep
---

# Getting the build green

::turns::

<ChatTurn role="user">

The `order-service` module still won't build.

</ChatTurn>

<ChatTurn role="agent" v-click>

Reading the reactor first.

</ChatTurn>
````

`role` is `user`, `agent` or `tool` and drives the whole treatment — the user
speaks at the left margin behind a thick yellow rule, the agent is indented
behind a thin grey one, a tool call is mono on the code ground. `who` overrides
the role cap (`who="Oliver"`), `meta` adds a muted note beside it
(`meta="mvn -q verify"`). `session` is the label along the tape's foot.

Message bodies are set upright, against the master's italic: a paragraph of
transcript at this size is punishing in italic, so the italics stay on the caps
and headlines. Inline `code` also drops the master's yellow chip inside a turn —
one sentence of agent output can carry six of them, and six chips is a rash
rather than an emphasis.

The blank lines inside the tag are load-bearing — they are what makes the body
parse as Markdown rather than as raw HTML.

Pacing is Slidev's own `v-click`. The layout registers no clicks of its own; it
reads the classes the directive leaves on the DOM, so one turn per click, two
per click or a `v-click` range all work. The conversation is the only model —
there is no second description of it to keep in sync.

#### Exporting

**Export this layout with `--with-clicks`:**

```bash
slidev export slides.md --with-clicks
```

Every turn is fully visible at the click that introduces it, and `--with-clicks`
gives each of those clicks its own PDF page — so a reader flipping through the
PDF sees the conversation unfold the way the room did. Without the flag the
exporter renders the final state only, and the PDF shows a single page with the
history already scrolled off the top.

#### One thing to watch

A turn taller than the whole viewport can never be shown in full: the tape
scrolls its bottom into view and its top is gone, on screen and in the PDF
alike. It is the layout's only silent crop, so `slidev dev` outlines such a turn
and logs how far it overshoots — split it across two `<ChatTurn>` blocks on
consecutive clicks. The check never runs in a build or an export.

## Styled Markdown elements

Standard Markdown is themed automatically — no extra components required:

- **Bullet lists** render `//` markers in yellow (nested lists get a dimmer marker)
- **Ordered lists** keep their numbers, tinted yellow
- **Inline `code`** is yellow on a subtle yellow-tinted background
- **Code blocks** get a dark background with a yellow left border, syntax
  highlighting via Shiki (`vitesse-dark` / `vitesse-light`), and support
  line-highlight markers like ` ```java {1,3-5} `
- **Tables** get yellow header text and thin dividers
- **Blockquotes** get a yellow left border
- **Links** are yellow with a subtle underline

## Customization

### CSS variables

All theme colors and fonts are CSS variables defined in `styles/layout.css`:

```css
:root {
  --gepardec-yellow: #FFC800;
  --gepardec-black:  #000000;
  --gepardec-white:  #ffffff;
  --gepardec-font-display: 'Barlow Semi Condensed', system-ui, sans-serif;
  --gepardec-font-mono:    'JetBrains Mono', ui-monospace, monospace;
  /* ... */
}
```

Override them in a project-level `style.css`. One of them shapes the layouts
rather than the palette:

| Variable                        | Default    | Effect                                              |
|---------------------------------|------------|-----------------------------------------------------|
| `--gepardec-margin-x`           | `5.827%`   | The master's side margin — every layout aligns to it.|

## Run the example

```bash
npm i
npm run dev        # start the dev server and open the browser
npm run build      # build a static SPA
npm run export     # export to PDF
npm run screenshot # export each slide to PNG
```

Each script targets the bundled `example.md`, which exercises every layout —
including a `conversation` walkthrough of the migration it describes.

`npm run export` needs `playwright-chromium`, which is a dev dependency here.
It does **not** pass `--with-clicks`, so the conversation slide exports as a
single final-state page; add the flag when the transcript is the point:

```bash
npx slidev export example.md --with-clicks
```

## License

MIT — Gepardec IT Services GmbH
