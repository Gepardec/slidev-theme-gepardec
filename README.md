# slidev-theme-gepardec

A [Slidev](https://sli.dev) theme matching the Gepardec brand:

- Pure black background, Gepardec yellow (`#FFC800`) accents
- Italic condensed typography (Barlow Semi Condensed) + JetBrains Mono for code
- `//` bullet markers in yellow, white content text
- `gepardec` logo on every content slide; cheetah sujet + spot cluster on cover/section
- No bordered content boxes — clean, minimal aesthetic

## Layouts

| Layout       | Use for                                                   |
|--------------|-----------------------------------------------------------|
| `cover`      | Title slide. Cheetah bleeding off the left, title block right. |
| `section`    | Section breaks ("Zwischenfolie"). Sujet + centred title.  |
| `default`    | Standard content. Title + `//` bullets, minimal layout.   |
| `two-cols`   | Side-by-side content with a title above two columns.      |
| `statement`  | Big bold statement, logo only — no cheetah/spots.         |
| `contact`    | "Kontakt" slide — person, offices, channels, socials.     |
| `end`        | Closing slide. "Danke." by default.                       |
| `intro`      | Plain vertically-centered slot. No branding chrome.       |

`cover`, `section`, and `contact` render the cheetah sujet and corner spots —
all three share the master's single background placement.
`default`, `two-cols`, `statement`, and `end` show the footer logo only. `intro` is an
unstyled centered container — handy for full-bleed custom content.

## Install

### Local (recommended while iterating)

Point `theme` at the folder that contains this theme, relative to your deck:

```yaml
---
theme: ./slidev-theme-gepardec
---
```

The bundled `example.md` uses `theme: ./` because it lives in the theme root.

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
- `assets/logo.png` — footer wordmark
- `assets/spots.png` — corner decoration

They are imported by the Vue components and resolved through Vite's asset
pipeline, so they work transparently no matter where your slide deck lives.
To swap any of them, replace the file and rebuild.

### Overriding the cover image per slide

To use a different image on a specific `cover` or `section` slide, pass an
`image:` prop pointing at a file in **your own** `public/` directory:

```yaml
---
layout: cover
image: /my-custom-cover.jpg
---
```

## Usage

### Title slide

Mirrors the corporate PowerPoint title slide: the cheetah sujet bleeds off the
left edge — its centre line sits on the slide edge, so the right half of the
face shows — and the artwork's own alpha falloff dissolves it into the black
canvas. The title column starts at ~34% width. The first heading is the
*Titel*, the second the *Untertitel*, and any paragraphs after them are pushed
to the bottom-left as the *Name / Datum* block.

```md
---
layout: cover
---

# Java Enterprise<br/>Modernization

## Quarkus & Jakarta EE

Oliver Tod

March 2026
```

Titles are set at the master's size (~5.7rem), so break long titles with
`<br/>` — the layout compresses its top spacing before it overflows.

### Section break

```md
---
layout: section
---

# Part 2

## Implementation
```

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

### Two columns

```md
---
layout: two-cols
---

::title::

# Tech stack comparison

::left::

### Legacy
- Java EE 7
- Manual deploys

::right::

### Target
- Jakarta EE 10
- CI/CD
```

### Statement slide

`**bold**` text is highlighted in Gepardec yellow:

```md
---
layout: statement
---

# We only recommend<br/>**what we can technically justify.**
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
| `image`      | bundled cheetah asset                              |
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

`locations` replaces the two default office rows, and the `::title::` slot
replaces the headline (which is uppercased by the layout):

```md
---
layout: contact
locations:
  - { label: 'Graz', address: 'Beispielweg 1, 8010 Graz' }
---

::title::

# Get in touch
```

The headline and name are white on the reference slide. To put the brand yellow
back on them, override the two theme tokens in your deck's `style.css`:

```css
:root {
  --gepardec-contact-title-color: var(--gepardec-yellow);
  --gepardec-contact-name-color:  var(--gepardec-yellow);
}
```

### End slide

```md
---
layout: end
---

# Danke.
```

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

Override them in a project-level `style.css`.

### UnoCSS color scale

The brand yellow is also exposed as a full UnoCSS color scale (`uno.config.ts`),
so you can use it with any utility class, including opacity modifiers:

```html
<div class="bg-gepardec-500 text-black">…</div>
<span class="text-gepardec-300">accent</span>
<div class="border border-gepardec-500 bg-opacity-10">…</div>
```

Shades run from `gepardec-50` through `gepardec-900`, with `gepardec-500`
(`#FFC800`) as the brand default.

## Bullet style opt-out

All `<ul>` bullets render as `//` in Gepardec yellow. To opt out for a
single list, wrap it in `.no-slash-bullets`:

```md
<div class="no-slash-bullets">

- regular bullets here

</div>
```

## Run the example

```bash
npm i
npm run dev        # start the dev server and open the browser
npm run build      # build a static SPA
npm run export     # export to PDF
npm run screenshot # export each slide to PNG
```

Each script targets the bundled `example.md`.

## License

MIT — Gepardec IT Services GmbH
