# 9. Product Backlog & Roadmap

Dokumen ini berisi daftar fitur, peningkatan, dan perbaikan (backlog) yang telah diprioritaskan untuk pengembangan Sistem Ekosistem Digital Masjid Tazkia.

## 🚀 Sprint Berjalan (Selesai & Sisa To-Do)
- [x] **Penyempurnaan Integrasi Supabase Database (Tahap 1):** Mekanisme sinkronisasi data master dan relasional via `app_sync_state` JSONB untuk *persistence* lintas perangkat, serta implementasi Supabase Storage untuk media dengan `DO BLOCK` idempotent policies.
- [x] **Auth & Role Enforcement:** Memisahkan modul-modul (terutama Modul Keuangan Terpadu) dan memberi proteksi berdasarkan otoritas role secara ketat di DKM Dashboard.
- [x] **System-Wide UI/UX & Dark Mode:** Restrukturisasi menu navigasi admin, penghapusan elemen E2E *debugging*, dan implementasi kompatibilitas mode gelap yang tidak menyilaukan.
- [x] **Mobile-Friendly TV Display:** Menyelesaikan isu YouTube autoplay pada mobile device, strukturisasi UI, dan merapikan komponen Mobile Dashboard.
- [x] **Manajemen Sinkronisasi Realtime:** Memastikan State Cloud menjadi prioritas agar pengeditan (hapus, ubah teks) sinkron permanen di setiap perangkat (PC/HP/Tablet) dengan anti-revert.
- [ ] **Integrasi Notifikasi Donasi Jamaah:** Menambahkan pengingat target donasi bulanan (recurring donation) di Portal Jamaah.

## 📈 Prioritas Menengah (Next Release)
- [ ] **Migrasi Total ke Tabel Relasional (Tahap 2):** Memecah JSONB `app_sync_state` menjadi tabel murni relasional secara menyeluruh (seperti `inventories`, `erp_journals`, `erp_ledger`, dll) untuk performa analitik yang lebih skalabel.
- [ ] **Otomatisasi Penyusutan (Cron Job):** Mengganti kalkulasi manual penyusutan aset (tombol) menjadi *cron job scheduler* server-side yang berjalan otomatis setiap akhir bulan.
- [ ] **Export & Import Data (Excel/CSV):** Mengembangkan fitur agar bendahara dapat mengunduh laporan keuangan, neraca, dan jurnal ke dalam format Excel standar akuntansi.
- [ ] **Manajemen Artikel/Berita Dinamis:** Membuat sistem CMS (Content Management System) lengkap dengan Rich Text Editor (WYSIWYG) untuk tim publikasi.

## 🔮 Prioritas Rendah & Inovasi Jangka Panjang (Future Epics)
- [ ] **WhatsApp Gateway Integration (Kuitansi Digital):** Menyambungkan webhook donasi dengan layanan API WhatsApp untuk mengirim bukti penerimaan ziswaf secara otomatis ke no HP jamaah.
- [ ] **Four Eyes Principle / Approval System:** Membangun *workflow* persetujuan bertingkat; di mana Bendahara membuat *draft* pengeluaran, dan Ketua DKM harus mengklik tombol "Setuju" sebelum dana bisa dicatat keluar.
- [ ] **Booking Gedung Otomatis & Payment Gateway:** Sistem kalender interaktif untuk jamaah melakukan penyewaan gedung Alhambra, langsung terhubung dengan integrasi pembayaran (Midtrans/Xendit).
- [ ] **Integrasi AI Syariah (Chatbot Fiqih):** Menanamkan widget asisten virtual pintar yang dilatih (Fine-Tuned) dengan dataset khusus kajian/fatwa terpercaya untuk menjawab pertanyaan jamaah 24/7.
- [ ] **OCR (Optical Character Recognition) Kuitansi:** Fitur bagi bendahara untuk memfoto kuitansi kertas, lalu AI secara otomatis membaca nominal dan mengisinya ke form Jurnal Umum.
