# Asri Store — Requirements V1

**Document Version:** V1  
**Status:** Approved & Locked  
**Project:** Asri Store  
**Repository:** gantulu/gantulu.github.io  
**Baseline:** Requirement Baseline V1

---

## 1. Project Overview

Asri Store adalah aplikasi e-commerce untuk menjual produk dari berbagai brand dengan kategori awal Tas dan Speaker.

Aplikasi menyediakan storefront, guest checkout, pembayaran melalui Duitku POP, serta pengelolaan pesanan menggunakan backend Supabase.

### Project Objectives

- Menyediakan storefront modern dan responsif.
- Mendukung katalog produk multi-brand.
- Mendukung guest checkout tanpa registrasi pelanggan.
- Mendukung pembayaran melalui Duitku POP.
- Menyediakan pelacakan status pesanan internal.
- Menjaga keamanan data pelanggan, transaksi, dan pembayaran.

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| JSX Runtime | Babel Standalone CDN |
| Language | JavaScript / JSX |
| Styling | CSS |
| Hosting | GitHub Pages |
| Backend | Supabase |
| Database | Supabase PostgreSQL |
| Storage | Supabase Storage |
| Server-side Logic | Supabase Edge Functions |
| Payment Gateway | Duitku POP |
| Currency | IDR |

### Architecture Constraints

- Satu aplikasi React.
- Satu entry point.
- Satu root rendering point.
- Menggunakan React + Babel CDN.
- Tidak menggunakan Node.js, npm, Vite, Webpack, atau build pipeline untuk frontend.
- Operasi sensitif harus dilakukan melalui backend.
- Secret key dan kredensial Duitku tidak boleh diekspos ke frontend.
- Tidak mengubah konfigurasi GitHub Pages tanpa persetujuan terpisah.

### Repository Boundary

Repository frontend yang dipilih adalah gantulu/gantulu.github.io.

Lokasi repository atau project untuk database migrations, Edge Functions, dan konfigurasi backend Supabase perlu ditentukan sebelum implementasi.

## 3. Storefront Requirements

### 3.1 Product Catalog

- Kategori awal: Tas dan Speaker.
- Mendukung produk dari berbagai brand.
- Produk dapat memiliki varian atau tidak.
- Varian dapat menggunakan atribut seperti ukuran dan warna.
- Harga normal wajib tersedia.
- Harga promosi bersifat opsional.
- Harga varian mengikuti harga produk.
- Pengelolaan produk melalui Supabase Dashboard.
- Tidak ada admin dashboard pada V1.

### 3.2 Product Images

Sumber gambar produk:
- Supabase Storage.
- External image URL.

### 3.3 Navigation

Navigasi storefront:

1. Home
2. Produk
3. Tas
4. Speaker
5. Promo
6. Tentang Kami
7. Kontak
8. Keranjang

### 3.4 Search

- Pencarian berdasarkan nama produk.
- Tidak ada filter produk pada V1.
- Tidak ada sorting produk pada V1.

## 4. Shopping Cart

- Menggunakan browser Local Storage.
- Data keranjang bertahan setelah halaman dimuat ulang.
- Pelanggan dapat menambahkan produk.
- Pelanggan dapat menghapus produk.
- Pelanggan dapat mengubah kuantitas.
- Keranjang mendukung produk dengan atau tanpa varian.
- Backend memvalidasi harga, promosi, dan stok saat checkout.
- Data Local Storage bukan sumber kebenaran transaksi.
- Total pembayaran harus dihitung ulang oleh backend.

## 5. Checkout

### 5.1 Checkout Model

Guest Checkout only.

- Tidak membutuhkan registrasi.
- Tidak membutuhkan login pelanggan.
- Pelanggan dapat membuat pesanan sebagai guest.

### 5.2 Customer Information

Form checkout menyediakan:

- Nama lengkap.
- Nomor WhatsApp.
- Email.
- Alamat lengkap.

### 5.3 Shipping

- Biaya pengiriman ditentukan secara manual oleh operator/backend.
- Biaya pengiriman wajib ditentukan sebelum pelanggan melakukan pembayaran.
- Invoice pembayaran tidak boleh dibuat sebelum total akhir pesanan tersedia.

Formula:

**Total Pembayaran = Subtotal Produk + Biaya Pengiriman**

### 5.4 Checkout Business Flow

Urutan bisnis minimum:

1. Pelanggan mengirim data checkout.
2. Backend memvalidasi produk, varian, harga, promosi, dan stok.
3. Biaya pengiriman ditentukan oleh operator/backend.
4. Backend menghitung total akhir pesanan.
5. Invoice Duitku dibuat berdasarkan total akhir.
6. Pelanggan melanjutkan pembayaran.

Detail status internal dan mekanisme operasional setiap tahap ditentukan dalam technical design.

## 6. Payment

### 6.1 Payment Provider

Duitku POP.

### 6.2 Payment Requirements

- Pembayaran menggunakan IDR.
- Nominal uang disimpan sebagai integer Rupiah.
- Pembuatan invoice dilakukan melalui backend.
- Kredensial Duitku hanya tersedia pada lingkungan backend.
- Callback pembayaran diverifikasi backend.
- Frontend tidak boleh menetapkan status pembayaran secara langsung.
- Status pembayaran diperbarui berdasarkan hasil verifikasi backend.
- Pemrosesan callback harus aman terhadap duplikasi.
- Hasil callback yang ambigu atau bertentangan tidak boleh dianggap sebagai pembayaran berhasil tanpa verifikasi.

### 6.3 Payment Environment

Lingkungan Duitku yang digunakan untuk implementasi dan pengujian harus ditentukan sebelum pengujian integrasi.

## 7. Inventory

### 7.1 Stock Management

Menggunakan stock reservation.

### 7.2 Reservation Requirements

- Stok divalidasi saat checkout.
- Sistem mendukung reservasi stok untuk pesanan.
- Masa reservasi mengikuti masa berlaku invoice Duitku.
- Pembatalan dapat dilakukan otomatis maupun manual.
- Pembatalan otomatis mengikuti hasil verifikasi kedaluwarsa invoice.
- Stok yang sudah direservasi tidak boleh digunakan oleh pesanan lain selama reservasi masih aktif.

### 7.3 Inventory Lifecycle

Technical design wajib menentukan:

- Kapan reservasi stok dimulai.
- Bagaimana stok tersedia dihitung.
- Kapan reservasi dianggap selesai.
- Bagaimana stok dipulihkan setelah invoice gagal atau kedaluwarsa.
- Bagaimana pembayaran terlambat ditangani setelah reservasi dilepas.
- Bagaimana callback duplikat tidak menyebabkan perubahan stok berulang.
- Bagaimana transaksi bersamaan mencegah overselling.

### 7.4 Inventory Safety

Perubahan stok dan reservasi harus bersifat atomik serta idempotent.

## 8. Order Management

### 8.1 Order Tracking

- Menggunakan status internal Asri Store.
- Tidak menggunakan integrasi tracking kurir pada V1.
- Status pesanan diperoleh dari backend.

### 8.2 Order Confirmation

Halaman konfirmasi pesanan menampilkan:

- Nomor pesanan.
- Tanggal pesanan.
- Daftar produk.
- Subtotal.
- Biaya pengiriman.
- Total pembayaran.
- Status pesanan.
- Status pembayaran.
- Tautan melanjutkan pembayaran jika invoice tersedia.
- Tautan menuju Order Status.

### 8.3 Order Status Access

Menggunakan Secure Order Token.

Ketentuan:

- Token dibuat oleh backend menggunakan generator kriptografis yang aman.
- Database hanya menyimpan hash token.
- Token tidak kedaluwarsa otomatis selama data pesanan masih tersimpan.
- Token dapat dicabut.
- Token dapat diterbitkan ulang.
- Nomor pesanan saja tidak cukup untuk mengakses informasi pesanan.
- Backend memverifikasi token pada setiap permintaan.
- Token tidak boleh terekspos melalui log, analytics, atau referrer pihak ketiga.

Mekanisme distribusi dan penyimpanan tautan akses oleh pelanggan ditentukan sebelum implementasi.

### 8.4 Order Data Retention

- Masa penyimpanan data pesanan belum ditentukan.
- Kebijakan retensi ditentukan bersama kebijakan privasi.
- Sistem harus mendukung penghapusan atau anonimisasi data sesuai kebijakan yang nantinya disetujui.
- Token tidak berlaku lagi setelah pesanan dihapus atau aksesnya dicabut.

## 9. Cancellation and Refund

### 9.1 Cancellation

- Mendukung pembatalan otomatis.
- Mendukung pembatalan manual.
- Pembatalan otomatis mengikuti verifikasi kedaluwarsa invoice.
- Pembatalan manual digunakan untuk kondisi khusus.
- Perubahan status pembatalan dan pelepasan stok harus aman terhadap pemrosesan berulang.

### 9.2 Refund

- Refund dilakukan secara manual di luar sistem.
- Hasil refund dicatat melalui backend.
- Tidak ada integrasi refund Duitku pada V1.
- Pencatatan refund tidak otomatis mengubah stok.
- Kebijakan restock setelah refund perlu mengikuti keputusan operasional.

## 10. Customer Notifications

Tidak ada notifikasi otomatis pada V1.

- Tidak ada WhatsApp Business API.
- Tidak ada email notification otomatis.
- Pelanggan memeriksa status melalui halaman Order Status.
- Informasi status diperoleh dari backend ketika halaman dibuka.
- Operator dapat melakukan komunikasi manual jika diperlukan.

## 11. UI / Visual Design

| Property | Value |
|---|---|
| Design Direction | Modern E-Commerce |
| Primary | #047857 |
| Background | #FFFFFF |
| Surface | #F8FAFC |
| Text | #1E293B |
| Typography | Inter |
| Fallback | Arial, sans-serif |
| Responsive | Mobile dan Desktop |

## 12. Security Requirements

- Operasi sensitif dilakukan melalui backend.
- Duitku credentials tidak boleh diekspos ke browser.
- Harga, promosi, stok, ongkir, dan total pembayaran divalidasi backend.
- Callback pembayaran harus diverifikasi.
- Operasi transaksi dan inventory harus idempotent.
- Operasi reservasi stok harus aman terhadap transaksi bersamaan.
- Secure Order Token menggunakan generator kriptografis yang aman.
- Database hanya menyimpan hash token.
- Akses data pesanan harus melalui validasi token.
- Hak akses data pelanggan mengikuti prinsip least privilege.
- Data sensitif tidak boleh terekspos melalui log atau layanan pihak ketiga.

Detail RLS, database permissions, Edge Function authorization, dan secret management ditetapkan pada technical design.

## 13. Out of Scope — V1

- Customer registration dan login.
- Admin dashboard.
- Otomatisasi notifikasi WhatsApp.
- Otomatisasi notifikasi email.
- Integrasi tracking kurir.
- Integrasi refund otomatis.
- Filter dan sorting produk.
- Multi-currency.
- Build pipeline frontend berbasis Node.js, Vite, atau Webpack.

## 14. Open Decisions

Bagian ini mencatat hal yang belum boleh dianggap sebagai keputusan final.

| ID | Topic | Status |
|---|---|---|
| TBD-01 | Hak akses operator terhadap nama, WhatsApp, email, dan alamat pelanggan | Belum diputuskan |
| TBD-02 | Kebijakan retensi dan penghapusan data | Menunggu kebijakan privasi |
| TBD-03 | Repository/project backend Supabase | Belum ditentukan |
| TBD-04 | Lifecycle dan nama status order | Menunggu technical design |
| TBD-05 | Lifecycle dan nama status payment | Menunggu technical design |
| TBD-06 | Detail inventory reservation dan release | Menunggu technical design |
| TBD-07 | Penanganan pembayaran terlambat atau ambigu | Menunggu validasi dokumentasi Duitku |
| TBD-08 | Mekanisme operator menetapkan ongkir dan menangani pesanan | Belum ditentukan |
| TBD-09 | Distribusi dan pemulihan Secure Order Token | Belum ditentukan |
| TBD-10 | Lingkungan Duitku untuk pengujian | Belum ditentukan |
| TBD-11 | Detail database schema, RLS, dan Edge Functions | Menunggu technical design |

## 15. Approval and Change Control

Dokumen ini merupakan Requirement Baseline V1 yang telah disetujui.

Ketentuan:

- Keputusan yang tercantum menjadi baseline resmi V1.
- Perubahan requirement dicatat melalui revisi V2, V3, dan seterusnya.
- Open Decisions tidak dianggap sebagai requirement final.
- Persetujuan requirement bukan persetujuan implementasi seluruh aplikasi.
- Repository, database, secrets, dan deployment tidak boleh diubah di luar ruang lingkup otorisasi implementasi yang diberikan secara eksplisit.
- Implementasi harus mengikuti baseline yang telah disetujui.

---

**End of Asri Store Requirement Baseline V1**
