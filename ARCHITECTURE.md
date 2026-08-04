# UI Patterns — technical direction

## Product model

UI Patterns is split into two loading layers. Gallery routes consume the lightweight catalog in `src/data/patterns.ts`; source code, installation notes, properties and live previews are loaded only from a pattern route. This avoids shipping hundreds of source files to the home page as the catalog grows.

Each pattern owns a folder in `src/patterns/<slug>` with its implementation, preview adapter, metadata and copyable source. A loader registry is the only integration point needed to publish a new pattern.

## Application layers

- `app`: routes, metadata, sitemap and route composition.
- `components`: reusable interface grouped by product concern.
- `data`: lightweight catalog and category taxonomy.
- `patterns`: isolated pattern packages and lazy registries.
- `providers`: theme and favorite persistence adapters.
- `types`: serializable product contracts.
- `lib`: pure helpers for search, filtering and class composition.

## Visual system

The identity uses an editorial canvas, ink typography, thin rules and category-specific pastel fields. Deep violet is reserved for meaningful actions. Radius, shadow and spacing tokens are centralized in `globals.css`; dark mode has its own low-contrast navy-plum surfaces rather than inverted colors.

## Interaction strategy

Motion is used to describe state: preview controls crossfade, cards reveal their affordances, and the detail story advances with native scroll plus sticky positioning. Every movement has a reduced-motion fallback. Interactive patterns expose keyboard controls and use semantic buttons, dialogs and navigation landmarks.

## Mobile strategy

Dense navigation collapses into an accessible menu. Gallery filters become horizontally scrollable, preview frames scale to the selected device within the available viewport, code tabs remain reachable, and content order follows the reading path without requiring horizontal page scrolling.
