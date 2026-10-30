# Project Structure

Dokumen ini mencatat struktur aktual repository `gantulu/gantulu.github.io` dan rencana pengembangan berikutnya. Repository aktual tetap menjadi sumber kebenaran.

## Current Directory Tree

```text
.
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   └── favicon.svg
├── src/
│   ├── styles/
│   │   └── global.css
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── .gitignore
├── index.html
├── package.json
├── README.md
├── role.md
├── structure.md
├── tsconfig.json
└── vite.config.ts
```

## Planned Source Directories

Direktori berikut belum dibuat. Tambahkan ketika kebutuhan implementasi sudah jelas dan terdapat file sumber yang akan ditempatkan di dalamnya.

```text
src/
├── assets/
├── components/
│   ├── common/
│   └── ui/
├── layouts/
│   └── MainLayout/
├── pages/
│   ├── Home/
│   ├── Products/
│   ├── Orders/
│   └── Livechat/
└── routes/
```

## Directory Responsibilities

| Path | Responsibility |
|---|---|
| `.github/workflows/` | Workflow GitHub Actions untuk build dan deployment manual GitHub Pages. |
| `public/` | Aset statis yang disalin Vite tanpa melalui import source code. |
| `src/assets/` | Aset yang diimpor oleh aplikasi. |
| `src/components/common/` | Komponen reusable lintas fitur. |
| `src/components/ui/` | Komponen UI dasar. |
| `src/layouts/` | Layout yang digunakan oleh halaman aplikasi. |
| `src/pages/` | Komponen halaman berdasarkan fitur atau route. |
| `src/routes/` | Definisi dan konfigurasi routing bila diperlukan. |
| `src/styles/` | Global stylesheet dan aturan styling bersama. |
| `src/App.tsx` | Komponen root aplikasi. |
| `src/main.tsx` | Entry point React. |
| `src/vite-env.d.ts` | Deklarasi tipe bawaan Vite. |
| `index.html` | HTML entry point Vite. |
| `package.json` | Metadata, dependencies, dan npm scripts. |
| `tsconfig.json` | Konfigurasi TypeScript. |
| `vite.config.ts` | Konfigurasi Vite dan base path GitHub Pages. |
| `README.md` | Dokumentasi instalasi, development, build, dan deployment. |
| `.gitignore` | Daftar file dan direktori lokal yang tidak dilacak Git. |

## GitHub Pages

- Repository ini adalah GitHub user-site `gantulu.github.io`; Vite menggunakan `base: "/"`.
- Workflow `deploy.yml` hanya menggunakan trigger `workflow_dispatch`.
- Workflow tidak berjalan otomatis ketika ada push.
- Deployment memerlukan GitHub Pages menggunakan source **GitHub Actions**.
- Jangan menjalankan workflow deployment sebelum mendapat persetujuan.
- Workflow memasang dependency menggunakan `npm install` karena `package-lock.json` belum tersedia. Setelah lockfile dihasilkan dan ditambahkan ke repository, ubah langkah instalasi menjadi `npm ci`.

## Technology Boundary

Standar teknologi proyek:

- React
- TypeScript
- Vite
- Git dan GitHub
- GitHub Actions
- GitHub Pages

Penambahan framework, library, atau layanan lain harus memiliki kebutuhan teknis dan persetujuan.

## Maintenance Rules

1. Audit repository sebelum perubahan.
2. Perbarui dokumen ini ketika struktur aktual berubah.
3. Bedakan file yang sudah ada dari direktori rencana.
4. Hindari file kosong, duplikasi, dan perubahan di luar scope.
5. Verifikasi setiap perubahan.
