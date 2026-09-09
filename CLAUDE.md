# slidev-theme-gepardec

A Slidev theme matching the Gepardec corporate master, published to npm as
`@gepardec/slidev-theme-gepardec`. The API is `layouts/*.vue`,
`components/*.vue` and the CSS variables in `styles/`.

Two decks live here and are not interchangeable: `example.md` is a narrative
sample deck, `gallery.md` is the exhaustive render of every layout and slot.

## Invariants

**Official Slidev bindings only.** No `!important` anywhere — the tree has zero
occurrences and the single textual match is a comment explaining how one was
avoided. Win a cascade fight with a legitimate, more specific selector instead:
Slidev redefines its code tokens under `html.dark`, so the theme declares them
on `.slidev-layout` to outrank it. `:deep()` inside a scoped block is fine — it
is the supported way to style the children markdown generates. Do not reach into
Slidev internals or invent escape hatches for a deck to override brand rules.

**A layout named after a Slidev built-in honours the built-in's contract
exactly.** `default`, `two-cols` and `two-cols-header` take `class` and
`layoutClass` and use Slidev's own slot flow, because decks written against the
built-ins expect it. Rename rather than diverge.

**Headlines come from the markdown flow.** The first heading on the slide,
before any `::slot::` marker. No layout has a `title:` prop and no new one gets
it. Slidev silently ignores frontmatter keys a layout does not declare, so an
invented prop fails quietly rather than loudly.

**Brand artwork is not author-supplyable.** The cheetah sujet is one of two
official renderings picked with `variant`; geometry is measured off the
corporate master, not chosen. Assets import through Vite's pipeline so they
resolve wherever the theme is consumed from — never reference a path.

## Commits and release

Conventional commits, enforced by commitlint on `commit-msg`. Pushing `feat:`
or `fix:` to `main` **publishes a new npm version** through semantic-release.
Use `chore(skills):` for anything under `skills/` — it is not part of the
published package and must not trigger a release.

`skills/gepardec-slidev-authoring/` is written for repos that *consume* the
published theme. It is deliberately not deployed to `.claude/skills/`, not in
`apm.yml` and not in the npm tarball, so it never triggers in here. It must stay
self-contained and free of real names and addresses.

## Before pushing

`pnpm check:surfaces` asserts that README, gallery and the authoring contract
still describe the API. It runs on pre-push for changes under `layouts/` or
`components/`. The `gepardec-slidev-theme-dev` skill carries the procedure.
