# React + Vite

Starter aplikasi menggunakan React, Vite, JavaScript (JSX), CSS, dan React Router.

## Persyaratan

- Node.js versi 20.19+ atau 22.12+
- npm

## Menjalankan project

```bash
npm ci
npm run dev
```

## Build production

```bash
npm run build
npm run preview
```

Hasil build production tersedia di folder `dist/`.

## GitHub Pages

Repository ini menggunakan GitHub Actions untuk membangun aplikasi Vite dan menerbitkan artifact `dist/` ke GitHub Pages.

- Workflow deployment: `.github/workflows/deploy-pages.yml`
- Trigger otomatis: setiap push ke branch `main`
- Trigger manual: `workflow_dispatch`
- Vite base path: `/` karena repository ini dipublikasikan sebagai GitHub user site (`gantulu.github.io`).

Aktifkan **Settings → Pages → Build and deployment → Source: GitHub Actions** satu kali sebelum deployment pertama.

## Struktur

- `public/`: file statis.
- `src/assets/`: aset yang diimpor melalui kode.
- `src/components/`: komponen UI reusable.
- `src/layouts/`: layout halaman.
- `src/pages/`: halaman aplikasi.
- `src/hooks/`: custom React hooks.
- `src/services/`: integrasi API dan backend.
- `src/utils/`: helper umum.
- `src/styles/`: stylesheet global.

Folder aset dan utilitas dapat ditambahkan saat mulai digunakan.
