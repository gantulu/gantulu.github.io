# Project Structure

Dokumen ini menjelaskan struktur direktori yang direncanakan untuk aplikasi **React + TypeScript + Vite** pada repository `gantulu/gantulu.github.io`.

> **Catatan:** Tree di bawah adalah acuan struktur proyek, bukan hasil verifikasi bahwa seluruh file dan direktori tersebut sudah tersedia di repository.

## Directory Tree

```text
.
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   └──
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   └── ui/
│   ├── layouts/
│   │   └── MainLayout/
│   ├── pages/
│   │   ├── Home/
│   │   ├── Products/
│   │   ├── Orders/
│   │   └── Livechat/
│   ├── routes/
│   │   └── AppRoutes.tsx
│   ├── styles/
│   │   └── global.css
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Directory Responsibilities

| Path | Responsibility |
|---|---|
| `.github/workflows/` | GitHub Actions workflow untuk build dan deploy ke GitHub Pages. |
| `public/` | File statis yang disalin Vite tanpa proses import dari source code. |
| `src/assets/` | Asset yang di-import oleh aplikasi, seperti gambar dan ikon. |
| `src/components/common/` | Komponen reusable yang bersifat umum. |
| `src/components/ui/` | Komponen UI dasar dan konsisten. |
| `src/layouts/MainLayout/` | Layout utama yang digunakan oleh halaman aplikasi. |
| `src/pages/` | Komponen halaman berdasarkan fitur atau route. |
| `src/routes/` | Definisi dan konfigurasi routing aplikasi. |
| `src/styles/` | Global stylesheet dan aturan styling bersama. |
| `src/App.tsx` | Komponen root aplikasi. |
| `src/main.tsx` | Entry point React untuk memasang aplikasi ke DOM. |
| `index.html` | HTML entry point Vite. |
| `package.json` | Metadata proyek, dependencies, dan npm scripts. |
| `tsconfig.json` | Konfigurasi TypeScript. |
| `vite.config.ts` | Konfigurasi Vite, termasuk base path untuk GitHub Pages. |
| `README.md` | Dokumentasi utama proyek dan instruksi pengembangan/deployment. |

## File Organization Conventions

1. Letakkan komponen yang dipakai lintas fitur di `components/`.
2. Letakkan komponen khusus halaman di direktori halaman terkait.
3. Pisahkan konfigurasi route dari implementasi halaman.
4. Gunakan ekstensi `.tsx` untuk file TypeScript yang berisi JSX dan `.ts` untuk TypeScript tanpa JSX.
5. Hindari membuat folder atau file sebelum ada kebutuhan implementasi yang jelas.
6. Jangan menggandakan komponen, konfigurasi, atau sumber data yang sudah tersedia.

## GitHub Pages Deployment

- Build aplikasi menggunakan script yang didefinisikan di `package.json`.
- Atur `base` pada `vite.config.ts` sesuai jenis repository GitHub Pages.
- Workflow `deploy.yml` bertanggung jawab menjalankan build dan menerbitkan hasil build ke GitHub Pages.
- Pastikan konfigurasi routing kompatibel dengan static hosting GitHub Pages.
- Deployment hanya dilakukan setelah perubahan dan hasil build diverifikasi.

## Technology Boundary

Standar teknologi proyek:

- React
- TypeScript
- Vite
- Git dan GitHub
- GitHub Actions
- GitHub Pages

Penambahan framework, library, atau layanan lain harus memiliki kebutuhan teknis yang jelas dan disetujui terlebih dahulu.

## Maintenance Rules

- Repository aktual adalah sumber kebenaran untuk kondisi implementasi.
- Perbarui dokumen ini ketika struktur proyek berubah.
- Jangan menganggap item pada tree sudah dibuat sebelum diverifikasi di repository.
- Hindari perubahan di luar scope dan jangan menghapus fitur tanpa persetujuan.
