# Panduan Deployment ke VPS dengan Docker

Panduan ini akan membantu Anda men-deploy aplikasi **Clevio AI Staff** ke VPS menggunakan Docker.

## Prasyarat
- Akses SSH ke VPS (Ubuntu/Debian recommended).
- Domain sudah diarahkan ke IP VPS (A Record).

## Langkah 1: Persiapan VPS (Sekali Saja)

1. **Login ke VPS**
   ```bash
   ssh root@IP_ADDRESS_VPS_ANDA
   ```

2. **Update System**
   ```bash
   apt update && apt upgrade -y
   ```

3. **Install Docker & Docker Compose**
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh

   # Install Docker Compose (V2 biasanya sudah include di docker CLI baru, tapi untuk memastikan)
   apt install docker-compose-plugin -y
   ```

## Langkah 2: Setup Project di VPS

1. **Clone Repository**
   ```bash
   # Masuk ke folder home atau folder project
   cd ~
   git clone URL_REPOSITORY_GITHUB_ANDA clevio-ai-staff
   cd clevio-ai-staff
   ```

2. **Buat File Environment (.env.production)**
   Copy isi dari `.env.local` di komputer Anda, lalu buat file baru di VPS:
   ```bash
   nano .env.production
   ```
   Paste semua variabel environment. **PENTING**: Pastikan `NEXT_PUBLIC_BASE_URL` mengarah ke domain VPS Anda, bukan `localhost`.

   Contoh isi `.env.production`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxh...
   NEXT_PUBLIC_BASE_URL=https://clevio-staff.com
   # ... variabel lainnya
   ```
   Simpan dengan `Ctrl+X`, lalu `Y`, lalu `Enter`.

## Langkah 3: Menjalankan Aplikasi

1. **Build & Run Container**
   ```bash
   docker compose up -d --build
   ```
   Perintah ini akan:
   - Build image docker (memakan waktu beberapa menit saat pertama kali).
   - Menjalankan container di background.

2. **Cek Status Container**
   ```bash
   docker compose ps
   ```
   Pastikan statusnya `Up`.

3. **Cek Logs (Jika ada masalah)**
   ```bash
   docker compose logs -f
   ```

## Langkah 4: Setup Domain & SSL (Nginx Reverse Proxy)

Agar aplikasi bisa diakses via HTTPS (SSL) dan domain, kita gunakan Nginx & Certbot.

1. **Install Nginx**
   ```bash
   apt install nginx -y
   ```

2. **Buat Config Nginx**
   ```bash
   nano /etc/nginx/sites-available/clevio
   ```
   Isi dengan config berikut (ganti `your_domain.com` dengan domain Anda):
   ```nginx
   server {
       server_name your_domain.com www.your_domain.com;

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

3. **Aktifkan Config & Restart Nginx**
   ```bash
   ln -s /etc/nginx/sites-available/clevio /etc/nginx/sites-enabled/
   rm /etc/nginx/sites-enabled/default  # Hapus default config jika ada
   nginx -t # Test config, pastikan OK
   systemctl restart nginx
   ```

4. **Install SSL (Certbot)**
   ```bash
   apt install certbot python3-certbot-nginx -y
   certbot --nginx -d your_domain.com -d www.your_domain.com
   ```
   Ikuti instruksi di layar. Certbot akan otomatis configure SSL untuk Nginx.

## Langkah 5: Update Aplikasi (Maintenance)

Jika ada perubahan kode di GitHub dan ingin update di VPS:

```bash
cd ~/clevio-ai-staff
git pull origin main
docker compose up -d --build
```
Docker akan rebuild ulang layer yang berubah saja dan restart aplikasi dengan versi terbaru.
