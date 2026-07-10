# slidev-theme-gepardec

A [Slidev](https://sli.dev) theme matching the Gepardec brand:

- Pure black background, Gepardec yellow (`#FFC800`) accents
- Italic condensed typography (Barlow Semi Condensed) + JetBrains Mono for code
- `//` bullet markers in yellow, white content text
- `gepardec` logo on every content slide; cheetah image + spot cluster on cover/section
- No bordered content boxes — clean, minimal aesthetic

## Layouts

| Layout       | Use for                                                   |
|--------------|-----------------------------------------------------------|
| `cover`      | Title slide. Cheetah image on left, big title on right.   |
| `section`    | Section breaks. Same split visual style as `cover`.       |
| `default`    | Standard content. Title + `//` bullets, minimal layout.   |
| `two-cols`   | Side-by-side content with a title above two columns.      |
| `statement`  | Big bold statement, logo only — no cheetah/spots.         |
| `end`        | Closing slide. "Danke." by default.                       |
| `intro`      | Plain vertically-centered slot. No branding chrome.       |

`cover` and `section` render the cheetah image and corner spots. `default`,
`two-cols`, `statement`, and `end` show the footer logo only. `intro` is an
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
npm i slidev-theme-gepardec
```

```yaml
---
theme: gepardec
---
```

## Brand assets

The official Gepardec assets are bundled inside the theme at `assets/`:

- `assets/cheetah.jpg` — cover/section image
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

```md
---
layout: cover
---

# Java Enterprise<br/>Modernization

## Quarkus, Jakarta EE, OpenShift

March 2026
```

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
