# Grup Strateji Tuvali

Interaktif strateji tuvali for seven group companies. Select a company from the sidebar and fill in strategic canvas zones together during live working sessions.

Canlı site (GitHub Pages): [noprobono-can.github.io/strategic-road-map](https://noprobono-can.github.io/strategic-road-map/)

Kaynak: [github.com/noprobono-can/strategic-road-map](https://github.com/noprobono-can/strategic-road-map)

## Features

- Left sidebar with seven group companies (fixed order)
- Visual strategy board with editable zone cards — not a long scrolling form
- Entity name and primary role pre-filled per company
- Canvas field data persisted in `localStorage` (survives refresh)
- Turkish UI labels with English company names and roles preserved
- Responsive layout: sidebar collapses into a mobile sheet on small screens
- Client-side access gate before the canvas (session-based; codes managed in source)

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

GitHub Pages static export:

```bash
npm run build:pages
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

## Web üzerinden düzenleme

**Strateji içeriği (canlı tuval):** Canlı sitede erişim kodu ile giriş yapın, şirket seçin, kartlara yazın. Veriler tarayıcıda (`localStorage`) saklanır; sayfa yenilense bile kalır. Bu, [tıbbi kenevir tesis simülatörü](https://github.com/noprobono-can/tibbi-kenevir-tesis-simulatoru) ile aynı yaklaşımdır.

**Uygulama kodu:** GitHub’da dosyayı açıp kalem simgesiyle düzenleyin veya Cursor ile commit/push yapın. `main` branch’e push edildiğinde GitHub Actions otomatik olarak GitHub Pages’e yayınlar.
