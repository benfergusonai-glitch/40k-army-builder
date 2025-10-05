# 40k Army Builder — Developer README

This is a small React (Create React App) project that builds a Warhammer 40k army list from static JSON data in `public/data`.

Quickstart

- Install dependencies (if needed) and start the dev server:

```powershell
npm install
npm start
```

- The app runs with react-scripts and serves static JSON from `public/data` paths (so `public/data` must exist locally for the app to load units/enhancements).

## What to edit (key files)
- `src/index.js` — Bootstraps React and wraps `<App />` with the global context providers.
- `src/App.js` — Manages the main three-column layout and column visibility state.
- `src/context/GameDataContext.js` — Fetches all static JSON data when the app loads.
- `src/context/ArmyContext.js` — Global state for the user's army list and the `useArmy()` hook. All army mutations go through this provider.
- `src/components/` — UI components. Notable files:
    - `UnitList.js` — The far-left column for browsing and adding available units.
    - `ArmyDisplay.js` — The central column that shows a summary of the current army list.
    - `ArmyUnitRow.js` — The compact, clickable summary row for a single unit within the `ArmyDisplay`.
    - `UnitDetailView.js` — The far-right column for displaying and editing a selected unit's details (stats, wargear, enhancements, rules, etc.).
- `public/data/units/manifest.json` — Lists the unit data files that are loaded; keep it accurate when adding new unit JSON files.

## Important project conventions
- Unit instances are created with a unique `id` set to `${unit.name}-${Date.now()}` in `ArmyContext.addUnit`. Use `id` when updating/removing units.
- Unit `points` can be a number or an array of objects. The `getUnitDisplayPoints` helper shows the canonical way to read a displayable cost.
- `addUnit` deep-copies unit data using `JSON.parse(JSON.stringify(...))` to avoid shared references between unit instances.
- State immutability is enforced. All updates to the `army` array in `ArmyContext` must return a new array.

## Troubleshooting
- App shows "Loading game data...": ensure `public/data/units/manifest.json` exists and the listed files are present.
- Fetch errors in the browser console: check the dev server URL and that `public/data` files are reachable.
- UI doesn't update after an action: check the relevant function in `ArmyContext` to ensure it's returning a new array/object.
