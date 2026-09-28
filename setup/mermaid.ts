import { defineMermaidSetup } from '@slidev/types'

/**
 * Mermaid in brand colours, set once here so no diagram carries `style` lines
 * of its own. Black ground, grey node borders, yellow edges.
 *
 * The colours are literals rather than the `--gepardec-*` tokens: Mermaid's
 * `base` theme derives its shades from these strings in JavaScript, where a
 * CSS variable is not a colour it can parse.
 *
 * `look`, `layout` and `flowchart` are explicit because Mermaid 12 (from
 * Slidev 53) otherwise defaults to `neo` (drop shadows), `elk` (angular edges,
 * a wider layout) and a 120 px minimum node width — and diagrams run off the
 * slide. `minNodeWidth` is a Mermaid 12 key; older versions ignore it.
 */
export default defineMermaidSetup(() => ({
  theme: 'base',
  look: 'classic',
  layout: 'dagre',
  flowchart: {
    minNodeWidth: 0,
    wrappingWidth: 200,
  },
  themeVariables: {
    darkMode: true,
    background: '#000000',

    // Nodes
    primaryColor: '#111111',
    primaryBorderColor: '#8a8a8a',
    primaryTextColor: '#ffffff',
    mainBkg: '#111111',
    nodeBorder: '#8a8a8a',
    nodeTextColor: '#ffffff',

    // Edges and their labels
    lineColor: '#FFC800',
    textColor: '#d6d6d6',
    edgeLabelBackground: '#000000',

    // Subgraphs
    clusterBkg: '#0a0a0a',
    clusterBorder: '#3a3a3a',

    // Sequence diagrams: messages yellow like the edges, lifelines dimmed so
    // they do not cut through the message text
    actorBkg: '#111111',
    actorBorder: '#8a8a8a',
    actorTextColor: '#ffffff',
    actorLineColor: '#3a3a3a',
    signalColor: '#FFC800',
    signalTextColor: '#d6d6d6',

    fontFamily: "'Barlow Semi Condensed', system-ui, sans-serif",
    fontSize: '16px',
  },
}))
