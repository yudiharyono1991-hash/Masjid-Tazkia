# 7. Business Rules (Aturan Bisnis)

## Hak Akses & Pembatasan Wewenang (Role-Based Access Control)
Sistem ini menggunakan pembatasan akses ketat (Strict Role Enforcement) untuk memastikan keamanan:
1. **Jamaah:** Hanya dapat melihat beranda, profil, dan melakukan donasi publik. Tidak dapat mengakses dashboard DKM.
2. **Admin Masjid:** Dapat mengelola konten statis (Logo, Foto Hero, Profil Masjid, Artikel) dan layanan umum. Tidak dapat melihat saldo Buku Besar.
3. **Divisi Penghimpunan:** Hanya dapat menginput pemasukan (ZISWAF, kotak amal).
4. **Divisi Penyaluran:** Hanya dapat mengajukan usulan pengeluaran/distribusi dana ziswaf.
5. **Bendahara DKM:** Memiliki akses penuh ke Modul Akuntansi (Buku Besar, Jurnal Umum, Chart of Accounts, Laporan Keuangan). Bertugas mencetak laporan.
6. **Ketua DKM:** Akses eksekutif. Dapat melihat seluruh laporan analitik (grafik donasi) dan memberikan otorisasi final.

## Approval Workflow (Alur Persetujuan)
- Setiap transaksi pengeluaran (misal: Biaya Perawatan Gedung) dengan nominal di atas Rp 5.000.000 harus dimasukkan sebagai "Draft".
- Draft tersebut muncul di panel Ketua DKM untuk diverifikasi keabsahannya.
- Jika disetujui, status berubah menjadi "Valid" dan otomatis tercatat di Buku Besar.

## Alur Transaksi & ZISWAF
- Donasi publik yang masuk melalui QRIS secara default masuk sebagai "Penerimaan Belum Terklasifikasi" sampai divalidasi oleh Bendahara/Divisi Penghimpunan.
- Kalkulator Zakat menggunakan standar Nisab Emas (85 gram) dengan persentase 2.5%.
- Harga Hewan Qurban bersifat dinamis dan dapat diatur oleh Admin setiap menjelang Idul Adha. Harga patungan (Sapi kolektif) dihitung dari harga sapi dibagi 7 porsi.

## Alur Verifikasi Akun/Masjid
- Pihak DKM yang baru mendaftarkan cabang/masjid baru harus mengunggah scan SK Pengurus dan Surat Domisili Masjid.
- Tim Admin Pusat (Tazkia HQ) akan memverifikasi dokumen tersebut sebelum akun DKM cabang dapat menggunakan modul donasi QRIS untuk mencegah penipuan.

## Akuntansi & Manajemen Aset (Penyusutan)
- **Metode Penyusutan:** Sistem menggunakan metode **Garis Lurus (Straight-Line)**. Aset Tetap diasumsikan memiliki masa manfaat standar (misal 5 tahun / 60 bulan).
- **Penjurnalan Otomatis:** Saat Bendahara memicu fungsi "Hitung Penyusutan Aset", nilai sisa barang di modul Inventaris akan dikurangi, dan sistem secara otomatis mengkreditkan "Akumulasi Penyusutan" serta mendebit "Beban Penyusutan" di Jurnal Umum.
