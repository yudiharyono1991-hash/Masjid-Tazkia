# Panduan Migrasi Server Masjid Tazkia Platform

Dokumen ini berisi panduan teknis langkah demi langkah untuk memindahkan aplikasi Masjid Tazkia ke server VPS baru.

## Spesifikasi Server Rekomendasi
- **OS**: Ubuntu 22.04 / 24.04 LTS
- **RAM**: Minimal 2GB (direkomendasikan 4GB jika traffic tinggi)
- **CPU**: 2 vCPU
- **Storage**: 20GB+ SSD

## Persiapan Pra-Migrasi

1. Pastikan Anda memiliki akses SSH (`root` atau user dengan hak `sudo`) ke server baru.
2. Siapkan domain atau subdomain yang akan mengarah ke IP VPS baru (misal: `app.masjidtazkia.id`). Edit DNS record (A Record) di penyedia domain Anda.

## Langkah-langkah Migrasi

### 1. Update Sistem & Install Dependensi
Masuk ke VPS via SSH dan jalankan:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx unzip
```

### 2. Install Node.js & PM2
Aplikasi ini menggunakan Node.js.
```bash
# Install Node.js (Versi 20 direkomendasikan)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 untuk menjalankan aplikasi di background
sudo npm install -g pm2
```

### 3. Clone Repository Aplikasi
Pindahkan *source code* ke server. Bisa via Git atau SCP/SFTP.
```bash
cd /var/www
# Ubah URL di bawah sesuai repository private Anda (gunakan Personal Access Token jika perlu)
sudo git clone https://github.com/your-username/MasjidTazkia.git masjidtazkia
cd masjidtazkia
```

### 4. Setup Environment Variables
Buat file `.env` di dalam folder project berdasarkan `.env.example`.
```bash
sudo cp .env.example .env
sudo nano .env
```
Pastikan variabel berikut terisi (terutama jika menggunakan Supabase yang sama):
```env
VITE_SUPABASE_URL=https://[YOUR-ID].supabase.co
VITE_SUPABASE_ANON_KEY=ey...
GEMINI_API_KEY=AIza...
ADMIN_SECRET=tazkia-dkm-2026
```

### 5. Install Package & Build Aplikasi
```bash
# Install dependency
sudo npm install

# Build frontend (Vite React)
sudo npm run build
```

### 6. Jalankan Server Backend
```bash
# Compile TypeScript backend ke JS (jika perlu) atau gunakan ts-node/tsx. 
# Di aplikasi ini server.ts dapat dijalankan dengan PM2 menggunakan tsx:
sudo npm install -g tsx
pm2 start server.ts --name "masjidtazkia" --interpreter tsx

# Menyimpan PM2 agar autostart saat server reboot
pm2 save
pm2 startup
```

### 7. Konfigurasi Nginx (Reverse Proxy)
Aplikasi berjalan di port 3000. Kita perlu mengarahkannya ke port 80/443 dengan Nginx.
```bash
sudo nano /etc/nginx/sites-available/masjidtazkia
```
Masukkan konfigurasi berikut (ganti nama domain):
```nginx
server {
    listen 80;
    server_name app.masjidtazkia.id;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Aktifkan konfigurasi Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/masjidtazkia /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. Install SSL (HTTPS)
Sangat direkomendasikan untuk memasang SSL gratis dari Let's Encrypt.
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d app.masjidtazkia.id
```

## Post-Migrasi
- Coba akses domain Anda (https://app.masjidtazkia.id).
- Coba masuk ke Portal DKM dan pastikan data dari Supabase berhasil termuat.
- Tes fungsi *upload* gambar/media.

### Troubleshooting
- Jika *Blank Screen*: Cek `pm2 logs masjidtazkia`
- Jika *API/Supabase Error*: Cek ulang nilai di file `.env` dan pastikan URL Supabase tepat.
