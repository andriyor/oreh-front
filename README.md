# OREH

Personal task graph and time tracker. Tasks are nodes in a tree you can edit, check off, schedule and track time against. Time entries are tagged and summarized on a dashboard, a calendar and tag charts.

Frontend only. The backend is [oreh-backend](https://github.com/andriyor/oreh-backend); run it first, it serves the API at `http://localhost:3000` (see `src/api/index.ts`).

## Stack

React 19, TypeScript, Vite, React Flow (`@xyflow/react`) + dagre, TanStack Query & Router, Zustand, MUI, Tailwind.

## Getting up and running

```bash
pnpm install
pnpm dev
```

While the dev server is running, code changes are reflected in the browser automatically. Other scripts: `pnpm build`, `pnpm lint`, `pnpm preview`.

## TODO

- [ ] graph
  - [x] render tree view
  - [x] text input for node
  - [x] add node
  - [x] delete node
  - [ ] track time node
    - [x] start timer from node
    - [x] show total time for node
    - [x] show time entries of node
    - [x] highlight currentry running node
    - [ ] calculate total based on month/week/day
    - [ ] stop timer from node?
  - [ ] show/expand
    - [x] show/expand node
    - [x] show/expand node button
    - [ ] hide show/expand button when no children
    - [ ] show/expand by nesting level?
  - [x] checkbox
  - [x] hide done node
  - [x] change source of node
  - [x] due day
  - [x] recurring task
  - [ ] goals
  - [ ] habbits positive/negative
  - [ ] priority
  - [ ] change color of node
  - [ ] store node created time
- [ ] time entry
  - [x] edit
  - [x] highlight in tree
  - [x] srart
  - [x] delete
  - [x] tags
    - [ ] prevent update when no changes
  - [x] group by day
  - [x] total time by day
  - [ ] only one timer can be runned at the same time
  - [ ] not refetch whole list after update of single entry
- [ ] tags
  - [x] tags state
  - [x] store tags state in local storage
  - [x] create
  - [x] edit
  - [x] delete
  - [ ] change type
- [ ] dashboard
  - [x] nodes done by today
    - [x] show consumed time
  - [ ] chart by node time
    - [x] basic chart
    - [ ] show percengage and time
  - [ ] chart by tag time
    - [x] basic chart
    - [ ] show percengage and time
  - [ ] task for today/week/month
  - [ ] insights
  - [ ] cal-heatmap
- [ ] layout
  - [x] adaptive graph/time entries lise
  - [ ] better style
- [ ] calendat
  - [ ] for time enries
  - [x] for compleated tasks in day
- [ ] auth

bugs:

- [ ] order changed after add node

tech:

- [x] use zustand
- [ ] rect query
  - [x] use react query
  - [x] update entries by pisemistic update
  - [x] use fetch wrapper
- [ ] cleanup code
  - [ ] fix typescript
  - [ ] strict eslint rules
  - [ ] import order
- [ ] use react compiler
- [ ] add tests
- [ ] better structure

## Credits

Bootstrapped from the [React Flow starter (Vite + TS)](https://github.com/xyflow/vite-react-flow-template).

- [React Flow – Docs](https://reactflow.dev)
- [React Flow – Custom Nodes](https://reactflow.dev/learn/customization/custom-nodes)
- [React Flow – Layouting](https://reactflow.dev/learn/layouting/layouting)
- [React Flow – Theming / overriding built-in classes](https://reactflow.dev/learn/customization/theming#overriding-built-in-classes)
- [React Flow – Discord](https://discord.com/invite/Bqt6xrs)
