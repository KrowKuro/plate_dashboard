# Dashboard Boilerplate

A ready-to-fork **React + Vite + Tailwind v4** dashboard starter with a small
Express/JSON backend. It ships the shell, design system and data plumbing so a
new project starts at "build the feature" instead of "wire the app".

Derived from a production GIS app with all domain-specific code stripped out.

## What's included

- **Dark/light theming** that follows the device automatically (`prefers-color-scheme`),
  switching live, with a `data-theme` escape hatch to force either mode.
- **App shell** — collapsible sidebar, top bar, mobile drawer, toast channel,
  loading and error states.
- **Design system** (`src/components/ui/`) — buttons, inputs, selects, toggles,
  sliders, badges, panels, popovers, empty states, spinner, ~35 inline icons.
- **Charts** (`src/components/charts/`) — stat tiles, bar chart, donut chart,
  built on a validated, colour-blind-aware palette.
- **CRUD reference screens** — sortable/filterable table, side-panel editor,
  search with `Ctrl/Cmd+K`, reports with CSV + print-to-PDF export.
- **Backend** — Express REST API over an atomic JSON file store, with an
  offline read-only fallback so the frontend runs without it.
- **Shared domain logic** in `src/lib/` imported by *both* browser and server,
  so derived values never disagree.

## Quick start

```bash
npm install
npm run dev      # Vite (5173) + API (5174) together
```

Other scripts:

```bash
npm run web      # frontend only (read-only, uses the static JSON)
npm run server   # API only
npm run seed     # regenerate public/data/items.json
npm run build
npm run lint
```

## Making it yours

The example domain is a generic **Item** (`name`, `category`, `status`, `value`,
`notes`). To adapt:

1. **Rename the domain** — edit `src/lib/item.js`: change the fields in
   `deriveItem()`, the `CATEGORIES`/`STATUSES` lists, and the aggregates in
   `computeStats()`. Everything downstream reads from here.
2. **Rename the resource** — `server/index.js` routes, `src/api/items.js`, and
   `DATA_FILE` in `server/store.js`.
3. **Add screens** — drop a page in `src/pages/`, then register it in
   `src/App.jsx` and the `NAV` array in `src/components/layout/Sidebar.jsx`.
4. **Rebrand** — the palette lives in the `@theme` block at the top of
   `src/index.css`; light-mode values are in the override block below it.
5. **Swap storage** — replace `server/store.js` with your database. Keep the
   exported function signatures (`list`, `get`, `create`, `update`, `remove`)
   and nothing above it changes.

## Layout

```
server/
  index.js             REST routes + validation
  store.js             atomic JSON persistence (swap for a DB)
scripts/seed.js        regenerates the demo dataset
src/
  lib/
    item.js            domain record, aggregates, search  ← start here
    format.js          number/date formatters
    exporters.js       CSV + JSON download helpers
    useColorScheme.js  device light/dark detection
  api/                 Axios client + data access
  store/AppStore.jsx   app state: data, CRUD, settings, toasts
  components/
    ui/                design-system primitives
    charts/            stat tile, bar, donut
    layout/            shell: sidebar, topbar, toast
    panels/            search, record editor
  pages/               Dashboard, Items, Reports, Settings
```

## Notes

- **Storage path** — `public/data/items.json` lives under `public/` on purpose:
  Vite serves it directly, so the UI still renders (read-only) with the API off.
- **Charts** — categorical colours are assigned in fixed order and never cycled;
  colour is always paired with a text label so it never carries meaning alone.
- **State** — a single Context store keeps the boilerplate readable. Swap in
  Zustand/Redux Toolkit if a project outgrows it.
