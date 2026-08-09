# Product Requirements Document (PRD) - Masjid Tazkia Digital Ecosystem

## 1. Pendahuluan
**Nama Produk:** Sistem Manajemen Ekosistem Digital Masjid Tazkia  
**Tujuan:** Mendigitalisasi seluruh ekosistem operasional, keuangan, pelayanan jamaah, dan manajemen aset Masjid Tazkia untuk meningkatkan transparansi, akuntabilitas, dan efisiensi pelayanan.  
**Visi:** Menjadikan Masjid Tazkia sebagai pusat peradaban dan ekosistem digital percontohan (Islamic Center) yang modern, transparan, dan terpercaya.

## 2. Target Pengguna (Roles & Personas)
Sistem ini dirancang dengan arsitektur multi-role yang mencakup:
1. **Jamaah (User Publik):** Mengakses informasi jadwal shalat, berita, pendaftaran qurban, sewa gedung, donasi ZISWAF, dan melihat transparansi keuangan.
2. **Ketua DKM:** Memiliki akses approval (persetujuan) tingkat tinggi untuk pengeluaran anggaran dan melihat laporan eksekutif.
3. **Bendahara:** Mengelola keuangan masjid, pencatatan Jurnal Umum, Buku Besar, dan pembuatan Laporan Keuangan standar akuntansi.
4. **Divisi Penghimpunan:** Mengelola pemasukan (ZISWAF, Kotak Amal, dll).
5. **Divisi Penyaluran:** Mengelola program penyaluran bantuan dan distribusi dana zakat/sedekah.
6. **Admin Masjid:** Mengatur konten aplikasi (Hero image, Logo, Pengurus, Artikel) dan administrasi harian.

## 3. Fitur Utama (Core Features)

### A. Portal Jamaah (Front-End)
- **Beranda & Edukasi:** Informasi jadwal shalat, arah kiblat, artikel islami, profil masjid, dan sejarah.
- **Donasi & ZISWAF:** Fasilitas pembayaran donasi terintegrasi (QRIS), donasi rutin bulanan, kalkulator zakat.
- **Transparansi:** Akses publik ke laporan penerimaan dan penyaluran dana masjid secara real-time.
- **Sewa Gedung (Alhambra):** Informasi fasilitas, harga, dan ketersediaan gedung untuk pernikahan/acara.
- **Qurban:** Pendaftaran dan pembelian hewan qurban secara online (Sapi kolektif, Kambing/Domba).
- **Personal Dashboard:** Riwayat donasi, sertifikat digital (PDF), dan status pendaftaran qurban.

### B. Portal Pengurus DKM (Back-Office / ERP)
- **Dashboard Terpusat:** Menampilkan metrik keuangan dan operasional secara visual (Chart.js) dengan dukungan responsivitas adaptif (System-wide Dark Mode).
- **Modul Keuangan Terpadu (Terpusat):**
  - **Chart of Accounts (CoA):** Pemetaan kode akun keuangan.
  - **Jurnal Umum & Kas Kecil:** Pencatatan transaksi masuk dan keluar.
  - **Buku Besar:** Rekapitulasi per akun.
  - **Penyusutan Aset:** Kalkulasi dan posting otomatis beban penyusutan aset tetap.
  - **Verifikasi ZISWAF & Approval:** Manajemen validasi donasi masuk.
  - **Report Printer:** Cetak Laporan Laba/Rugi, Neraca, dan Arus Kas.
- **Manajemen Aset & Inventaris:** Pencatatan barang masjid beserta nilainya.
- **Manajemen App (CMS):** Mengganti foto hero, logo masjid, banner, foto pengurus, QRIS.
- **Manajemen Media Cloud:** Semua unggahan (real pict, bukti bayar) tersimpan di Supabase Storage (`tazkia-media`) sehingga tersinkronisasi antar perangkat.

## 4. Kebutuhan Sistem (System Requirements)
- **Teknologi Front-End:** React 18 (TypeScript), Vite, Tailwind CSS (dengan dukungan native Dark Mode `dark:` class), Lucide Icons, Chart.js.
- **Manajemen State:** Zustand (tersinkronisasi dengan Supabase JSONB `app_sync_state` + LocalStorage fallback).
- **Penyimpanan Media & Cloud Database:** 
  - **Supabase Storage** (`tazkia-media` bucket) untuk penyimpanan file media lintas perangkat dengan public access policies.
  - **Supabase PostgreSQL** sebagai backend utama pencatatan (Role Level Security via bypass anon access).
- **Responsivitas:** Wajib Mobile-First Design (Aplikasi harus nyaman digunakan di smartphone) dan mendukung Dark Mode.

---

## 5. Product Backlog

Berikut adalah daftar pekerjaan (Backlog) yang telah diprioritaskan untuk pengembangan selanjutnya:

### 🚀 Sprint Berjalan (Current / To-Do)
- [ ] **Auth & Role Enforcement:** Menyempurnakan pembatasan halaman berdasarkan role (misal: Bendahara hanya bisa buka menu keuangan).
- [ ] **Integrasi Notifikasi Donasi Jamaah:** Fitur pengingat/target donasi bulanan di Portal Jamaah agar jamaah mendapat notifikasi beberapa hari sebelum tanggal target.
- [ ] **Penyempurnaan Integrasi Supabase Database:** Migrasi seluruh data transaksi keuangan, inventaris, dan user dari LocalStorage/Zustand ke PostgreSQL Supabase agar persisten lintas perangkat (tidak hanya medianya saja).

### 📈 Backlog Prioritas Menengah (Next Release)
- [ ] **Export & Import Data (Excel/CSV):** Fitur bagi bendahara untuk mengunduh laporan ke format Excel.
- [ ] **Manajemen Artikel/Berita:** Sistem CRUD lengkap untuk tim publikasi masjid menambahkan berita atau jadwal kajian secara dinamis tanpa hardcode.
- [ ] **WhatsApp Gateway Integration (Notifikasi):** Mengirimkan bukti tanda terima (kuitansi digital) donasi ke WhatsApp jamaah.
- [ ] **Fitur PWA (Progressive Web App):** Membuat aplikasi dapat di-install di layar utama HP (Add to Home Screen) agar terasa seperti aplikasi native.

### 🔮 Backlog Prioritas Rendah (Future Epics)
- [ ] **Four Eyes Principle / Approval System:** Transaksi pengeluaran dana di atas nominal tertentu wajib mendapat "Approval" (Klik Setuju) dari Ketua DKM di dalam sistem sebelum sah dibukukan.
- [ ] **Booking Gedung Otomatis:** Sistem kalender interaktif untuk jamaah melakukan *booking* tanggal sewa gedung Alhambra secara langsung, terintegrasi dengan payment gateway.
- [ ] **Integrasi AI Syariah:** Chatbot islami berbasis AI untuk menjawab pertanyaan jamaah seputar fikih keseharian atau jadwal masjid.

---

## 6. Kriteria Penerimaan (Acceptance Criteria) Umum
1. Aplikasi harus berjalan tanpa error (0 TypeScript error) saat di-build.
2. Setiap elemen interaktif (tombol, dropdown, modal) harus responsif dan tidak terpotong di layar mobile berukuran kecil (min lebar 320px).
3. Data sensitif tidak boleh tampil atau dapat diedit oleh role yang tidak memiliki otoritas (misal: Jamaah tidak bisa melihat fitur edit logo).
4. Media (Foto/PDF) yang diunggah harus otomatis ter-upload ke Cloud Storage agar terlihat oleh pengguna lain di perangkat berbeda.

---
*Dokumen ini merupakan pedoman acuan pengembangan dan dapat diperbarui (living document) seiring berjalannya siklus Agile dari tim pengembang.*
