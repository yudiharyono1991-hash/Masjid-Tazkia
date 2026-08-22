# BLUEPRINT & PANDUAN UJI COBA (UAT)
**Sistem Informasi & Portal ZISWAF Masjid Tazkia - Sentul City, Bogor**

---

> [!IMPORTANT]
> **Status Dokumen:** Panduan Simulasi UAT (User Acceptance Testing)
> **Sifat Data saat ini:** 100% Data Dummy / Simulasi. Bebas untuk dimanipulasi, dihapus, atau ditambah.
> **Tujuan UAT:** Memastikan alur penggunaan sistem dari kacamata Jamaah (Eksternal) dan Pengurus DKM (Internal) berjalan lancar sebelum peluncuran resmi (*Go-Live*).

---

## 👥 BAGIAN 1: SKENARIO JAMAAH EKSTERNAL (Tampilan Publik)
*Ini adalah skenario yang akan diuji oleh jamaah atau donatur biasa.*

### 1. Navigasi Beranda & Informasi Ibadah
- **Langkah:** Buka tautan utama aplikasi (misal: `masjidtazkia.netlify.app`).
- **Yang Diuji:**
  - Pastikan **Jadwal Shalat** hari ini muncul dengan akurat sesuai lokasi (Sentul/Bogor).
  - Pastikan **Agenda Shalat Jumat** muncul otomatis di bagian atas khusus pada hari Kamis dan Jumat.
  - Gulir (*scroll*) ke bawah untuk melihat menu Layanan Kami (ZISWAF, Dakwah, Sosial).

### 2. Simulasi Berdonasi ZISWAF (Paling Krusial)
- **Langkah:**
  1. Klik tombol **"Salurkan Wakaf"** di *Hero Section* (Spanduk Atas) ATAU klik tombol **"Donasi Sekarang"** pada salah satu program di "Daftar Program".
  2. Jendela (*Pop-up*) formulir donasi akan muncul.
  3. Pilih nominal cepat (misal: Rp 100.000) atau ketik nominal bebas.
  4. Isi nama (boleh dikosongkan untuk Hamba Allah), nomor HP/Email, dan doa.
  5. Pilih metode pembayaran (Pilih **BSI** atau **QRIS**).
  6. Klik **"Lanjutkan Pembayaran"**.
- **Yang Diuji:** Sistem harus menampilkan instruksi transfer dan Nomor Virtual Account (VA) secara jelas.
- *(Catatan UAT: Uang tidak akan benar-benar terpotong karena ini adalah simulasi).*

### 3. Mengecek Transparansi Laporan (Kepercayaan Umat)
- **Langkah:** Gulir halaman ke area **"Laporan Keuangan & Transparansi"**.
- **Yang Diuji:**
  - Pastikan grafik perbandingan Pemasukan vs Pengeluaran muncul.
  - Pastikan tabel riwayat donasi terakhir (*Recent Donations*) menampilkan data donatur (*real-time*).

---

## 🏢 BAGIAN 2: SKENARIO PENGURUS INTERNAL (Portal DKM)
*Ini adalah skenario yang hanya boleh diuji oleh Pengurus/Manajemen Masjid Tazkia.*

### 1. Mengakses Dashboard Rahasia
- **Langkah:**
  1. Buka aplikasi publik.
  2. Klik lambang 🤖 (Robot/DKM) di navigasi bawah (jika buka di HP), atau klik menu profil di pojok kanan atas (di PC).
  3. **Cara Cepat:** Tambahkan `/#dkm_portal` di akhir alamat web (contoh: `masjidtazkia.netlify.app/#dkm_portal`).
- **Yang Diuji:** Masukkan kata sandi (PIN) super admin.

### 2. Mengelola Program ZISWAF (Modul Program & Ibadah)
- **Langkah:**
  1. Masuk ke tab **Program & Ibadah**.
  2. Klik tombol **"+ Program Baru"**.
  3. Isi judul program (misal: "Bantuan Yatim"), target dana, dan unggah foto simulasi.
  4. Simpan.
- **Yang Diuji:** Kembali ke Halaman Utama Publik, pastikan program yang baru dibuat langsung muncul di "Daftar Program".

### 3. Sistem Akuntansi & Keuangan (Modul Keuangan Terpadu)
- **Langkah:**
  1. Masuk ke tab **Dashboard & Laporan** -> Klik **Modul Keuangan Terpadu** (warna emas).
  2. Buka tab **Mutasi Kas Live**: Coba catat pemasukan manual (misal: Infaq Kotak Amal Rp 500.000).
  3. Buka tab **Buku Besar**: Pilih akun "Kas di Bendahara", pastikan uang Rp 500.000 tersebut masuk.
  4. Buka tab **Tanda Tangan Laporan**: Coba klik tombol "Cetak PDF" pada Laporan Aktivitas, dan pastikan file PDF terunduh.
- **Yang Diuji:** Sistem Akuntansi Standar PSAK 109 berjalan tanpa *error* pencatatan.

---

## 🚀 BAGIAN 3: PROSEDUR GO-LIVE (Pasca UAT)

Jika uji coba (UAT) besok telah selesai dan seluruh tim DKM menyatakan **"Aplikasi SIAP Digunakan"**, maka berikut adalah langkah rilis resmi:

1. **Konfirmasi Pembersihan Data (Wipe Data)**
   - Laporkan kembali di *chat* ini dengan kalimat: *"Kami siap Go-Live, tolong berikan script Hard Reset".*
2. **Eksekusi Hard Reset (Oleh Super Admin / Sistem)**
   - Semua angka keuangan, data simulasi, riwayat donasi, dan program *dummy* akan **dihapus bersih menjadi 0** secara permanen.
3. **Pengisian Data Riil**
   - Masukkan Saldo Awal (Uang fisik / saldo bank aktual masjid saat ini) ke dalam Jurnal Umum.
   - Buat 2-3 Program Kampanye asli dengan foto resmi masjid.
4. **Peluncuran**
   - Sebarkan tautan/link web secara resmi ke WhatsApp Grup Jamaah dan sosial media Masjid Tazkia.

> [!TIP]
> **Cara Mencetak Panduan Ini:**
> Panduan ini dapat Bapak/Ibu _Copy-Paste_ ke dalam Microsoft Word, lalu disimpan sebagai PDF untuk dibagikan kepada tim penguji (DKM) besok.
