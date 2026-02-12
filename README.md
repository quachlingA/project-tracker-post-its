# Post-Its

A single-page kanban-style task board that runs entirely in the browser. Organize work by workstreams, track goals, and export/import your data so nothing gets lost.

## Run it

1. Clone or download this repo.
2. Open `index.html` in a modern browser (Chrome, Firefox, Safari, Edge).

No build step or server required. Data is stored in your browser’s local storage. Use **Actions → Export backup** to save a `.json` file; use **Actions → Import backup** to restore it (e.g. on another device or after clearing data).

## Features

- **Board & Backlog** – Drag-and-drop columns (To Do, In Progress, Done + custom). Items without status or priority live in Backlog.
- **Workstreams** – Switch between workstreams (e.g. Work, Personal). Add workstreams via **Actions → + Add workstream** or **+ Add workstream** at the bottom of the workstream picker dropdown.
- **Dashboard** – KPIs across all workstreams, per-workstream donut charts, and a goals section with a weekly “goal met” tracker.
- **Items** – Name, priority, status, notes, stakeholders, resource links, due date. Full history and changelog in the detail view.
- **Export / Import** – Download a backup (Actions → Export backup) or restore from a file (Actions → Import backup). Great for sharing or moving between browsers.
- **Light/dark theme** – Toggle in the header; preference is saved.

## Quick start

1. Open `index.html`.
2. Use **Actions** (top right) to **+ Add item**, **+ Add column**, or **+ Add workstream**.
3. On the **Board**, pick a workstream, then drag cards between columns.
4. On the **Dashboard**, set a “Done” goal per workstream and mark whether you met it this week.
5. Use **Actions → Export backup** periodically; use **Import backup** to restore on another machine or after clearing the browser.
