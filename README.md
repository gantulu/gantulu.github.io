# Gantulu

Website pribadi yang dibangun menggunakan React, TypeScript, dan Vite, serta ditujukan untuk GitHub Pages.

## Teknologi

- React 19
- TypeScript
- Vite
- GitHub Actions
- GitHub Pages

## Persyaratan

- Node.js 20.19+ atau 22.12+
- npm

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Vite akan menampilkan alamat development server di terminal.

## Pemeriksaan dan production build

```bash
npm run build
npm run preview
```

Perintah build menjalankan pemeriksaan TypeScript melalui `tsc -b`, kemudian membuat hasil produksi ke direktori `dist/`.

## Struktur sumber

- `src/App.tsx`: komponen root aplikasi.
- `src/main.tsx`: entry point React.
- `src/styles/global.css`: stylesheet global.
- `src/assets/`: aset yang diimpor dari source code.
- `public/`: aset statis yang disalin Vite ke hasil build.

## GitHub Pages

Repository ini adalah GitHub user-site `gantulu.github.io`, sehingga konfigurasi Vite menggunakan `base: "/"`.

Workflow `.github/workflows/deploy.yml` hanya dapat dijalankan secara manual melalui `workflow_dispatch`. Workflow tersebut tidak berjalan otomatis pada setiap push. Sebelum deployment, pastikan GitHub Pages menggunakan **GitHub Actions** sebagai build and deployment source, lalu jalankan workflow hanya setelah mendapat persetujuan.

## Catatan dependency lock

Jalankan `npm install` untuk menghasilkan `package-lock.json` yang sesuai dengan dependency saat ini. Commit file tersebut agar instalasi berikutnya dapat menggunakan `npm ci` dan dependency yang terkunci. File lock belum disertakan dalam perubahan ini karena registry npm tidak dapat dijangkau dari lingkungan implementasi.

## Batasan perubahan

Tidak ada konfigurasi Pages, secret, domain, atau deployment aktif yang diubah oleh dokumentasi dan konfigurasi awal ini.
