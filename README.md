# Grup Strateji Workspace

Interaktif strateji workspace for seven group companies. Select a company from the sidebar and fill in strategic canvas zones together during live working sessions.

Canlı site (GitHub Pages): [noprobono-can.github.io/strategic-road-map](https://noprobono-can.github.io/strategic-road-map/)

Kaynak: [github.com/noprobono-can/strategic-road-map](https://github.com/noprobono-can/strategic-road-map)

## Features

- Left sidebar with seven group companies (fixed order)
- Visual strategy board with editable zone cards — not a long scrolling form
- Entity name and primary role pre-filled per company
- Canvas field data persisted in `localStorage` (survives refresh)
- Turkish UI labels with English company names and roles preserved
- Responsive layout: sidebar collapses into a mobile sheet on small screens
- Client-side access gate before the workspace (username + self-serve password; session-based)
- Per-zone shared notes tagged by author (Okan / Emre / Bora); users can delete only their own notes
- Per-user company access rules enforced in the client
- PDF report export for the current company workspace
- Logout returns to the login screen

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

**Strateji içeriği (canlı workspace):** Canlı sitede kullanıcı adınızı girin. İlk girişte kendi şifrenizi oluşturun; sonraki ziyaretlerde kullanıcı adı ve şifre ile giriş yapın. Şirket seçin, her alana not ekleyin. Notlar yazar etiketiyle paylaşılır; yalnızca kendi notlarınızı silebilirsiniz. Veriler tarayıcıda (`localStorage`) saklanır.

**Uygulama kodu:** GitHub’da dosyayı açıp kalem simgesiyle düzenleyin veya Cursor ile commit/push yapın. `main` branch’e push edildiğinde GitHub Actions otomatik olarak GitHub Pages’e yayınlar.
