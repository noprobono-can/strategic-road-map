# Grup Strateji Tuvali

Interaktif strateji tuvali for seven group companies. Select a company from the sidebar and fill in strategic canvas zones together during live working sessions.

## Features

- Left sidebar with seven group companies (fixed order)
- Visual strategy board with editable zone cards — not a long scrolling form
- Entity name and primary role pre-filled per company
- Canvas field data persisted in `localStorage` (survives refresh)
- Turkish UI labels with English company names and roles preserved
- Responsive layout: sidebar collapses into a mobile sheet on small screens

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui

## Local development

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:4317](http://127.0.0.1:4317).

## Build

```bash
npm run build
npm start
```

## Canvas zones

Each company canvas includes:

- Ambition (Niyet / Kuzey Yıldızı)
- Markets & customers
- Offerings
- How we win
- Now / Next / Later roadmap
- Group synergies
- Risks & constraints
- Success metrics
