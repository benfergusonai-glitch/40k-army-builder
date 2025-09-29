# 40k Army Builder — Developer README

This is a small React (Create React App) project that builds a Warhammer 40k army list from static JSON data in `public/data`.

Quickstart

- Install dependencies (if needed) and start the dev server:

```powershell
npm install
npm start
```

- The app runs with react-scripts and serves static JSON from `public/data` paths (so `public/data` must exist locally for the app to load units/enhancements).

What to edit (key files)
- `src/index.js` — bootstraps React and wraps `<App />` with `<ArmyProvider>`.
- `src/App.js` — loads game data from `public/data` (see `fetch('/data/units/manifest.json')`) and controls modal state.
- `src/context/ArmyContext.js` — global state and the `useArmy()` hook. All army mutations should go through this provider.
- `src/components/` — UI components. Notable files: `UnitList.js`, `UnitCard.js`, `ArmyDisplay.js`, `WargearModal.js`, `EnhancementsModal.js`.
- `public/data/units/manifest.json` — lists the unit data files that `App.js` loads; keep it accurate when adding new unit JSON files.

Important project conventions
- Unit instances are created with an `id` set to `${unit.name}-${Date.now()}` in `ArmyContext.addUnit`. Use `id` when updating/removing units.
- Unit `points` can be a number or an array. Helpers in `UnitList.js` and `UnitCard.js` show the canonical way to read a displayable cost.
- `addUnit` deep-copies unit data using `JSON.parse(JSON.stringify(...))` to avoid shared references.
- Changing the shape of `army` items (e.g., renaming `current_enhancement`) requires updating `ArmyContext` and any component that accesses those fields.

Troubleshooting
- App shows "Loading game data...": ensure `public/data/units/manifest.json` exists and the listed files are present under `public/data/units/`.
- Fetch errors in the browser console: check the dev server URL and that `public/data` files are reachable (CRA serves `public/` at root).
- If UI doesn't update after editing `ArmyContext`, ensure you return a new array/object (React state immutability patterns) — most updates use map/filter correctly.
