# 2. Architecture & Data Flow

## Arsitektur Sistem
Aplikasi ini dibangun menggunakan arsitektur Single Page Application (SPA) dengan teknologi berikut:
- **Frontend Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS (Mobile-first)
- **State Management:** Zustand (Client-side global state) + LocalStorage (Offline caching)
- **Backend & Database:** Supabase (PostgreSQL, Storage)

## Data Flow
1. **Client Action:** Pengguna melakukan aksi di UI (misal: isi form donasi, cetak jurnal).
2. **State Update:** Zustand store memperbarui state secara instan untuk UI yang sangat responsif.
3. **Persistence (Hybrid Model):** Data utama disinkronkan ke Supabase menggunakan JSONB ke dalam tabel `app_sync_state` sebagai mekanisme *global state synchronization* (Tahap 1), sembari perlahan dipindahkan ke tabel murni relasional seperti `programs`, `donations`, dan `gallery_items`.
4. **Media Storage:** Jika berupa file media (gambar/PDF/bukti transfer), diunggah langsung ke Supabase Storage (`tazkia-media`), lalu URL-nya disimpan ke database/state. Fitur ini dijamin *cross-device* dan anti hilang dengan Public Access Policies.
5. **Offline Fallback:** `localStorage` bertindak sebagai lapisan cache tambahan untuk memastikan aplikasi tidak nge-*freeze* atau langsung *blank* saat sinyal terputus sesaat.

## Skema Database (Logical Schema)
### 1. `users`
- `id` (UUID, Primary Key)
- `email`, `name`, `phone`
- `role` (enum: jamaah, ketua_dkm, bendahara, penghimpunan, penyaluran, admin_masjid, pengurus_dkm)

### 2. `transactions`
- `id` (UUID)
- `type` (masuk, keluar)
- `category` (zakat, infaq, operasional, dll)
- `amount` (numeric)
- `date` (timestamp)
- `description` (text)
- `approved_by` (UUID user yang menyetujui, jika pengeluaran)

### 3. `settings`
- `id` (singleton)
- `masjid_name`, `logo_url`, `hero_urls`, `qris_url`

## Ringkasan Integrasi Backend
Karena menggunakan arsitektur modern Serverless, komunikasi data langsung terjadi via Supabase Client:
- **Upload Media:** `supabase.storage.from('tazkia-media').upload()` dengan penamaan file berbasis UNIX Timestamp.
- **State Sync (Tahap 1):** `supabase.from('app_sync_state').upsert()` untuk menyimpan seluruh object JSON Zustand.
- **Relational Operations:** `supabase.from('programs').select()` untuk membaca tabel yang sudah dimigrasi sempurna.
- **Idempotency Policies:** Kebijakan RLS publik (Public Access/Insert) dirancang dengan pendekatan `DO BLOCK` pada SQL untuk meminimalisasi konflik "Already Exists" saat deploy.
