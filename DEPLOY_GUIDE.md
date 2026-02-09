# Panduan Deployment ke VPS dengan Docker + Traefik

Panduan ini untuk men-deploy **Clevio AI Staff** ke VPS yang sudah memiliki Traefik.

## Prasyarat
- Akses SSH ke VPS.
- Traefik sudah aktif di port 80/443.
- Domain sudah diarahkan ke IP VPS (A Record).

---

## Langkah 1: Cek Traefik Aktif

```bash
ss -tulpn | rg ':80\b|:443\b'
```
Pastikan output menunjukkan `docker-proxy` di port 80/443.

---

## Langkah 2: Clone/Update Repository

```bash
cd /home/clevio
git clone URL_REPOSITORY_GITHUB_ANDA clevio-ai-staff
cd clevio-ai-staff
```

Jika sudah pernah clone:
```bash
cd /home/clevio/clevio-ai-staff
git pull origin main
```

---

## Langkah 3: Setup Environment Variables

1. Copy template:
   ```bash
   cp .env.example .env
   ```

2. Edit file `.env`:
   ```bash
   nano .env
   ```

3. Isi variabel-variabel berikut:
   ```env
   # === TRAEFIK CONFIG ===
   DOMAIN=clevio-staff.yourdomain.com
   SERVICE_PORT=3000
   TRAEFIK_NETWORK=root_default

   # === APPLICATION CONFIG (copy dari .env.local) ===
   NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxh...
   NEXT_PUBLIC_BASE_URL=https://clevio-staff.yourdomain.com
   NEXT_N8N_PROCESS_AGENT=https://...
   # ... variabel lainnya
   ```

4. Simpan: `Ctrl+X` → `Y` → `Enter`

---

## Langkah 4: Build & Run

```bash
docker compose up -d --build
```

Proses build pertama kali memakan waktu 2-5 menit.

---

## Langkah 5: Verifikasi

1. **Cek status container:**
   ```bash
   docker ps
   ```
   Pastikan container `clevio-ai-staff` statusnya `Up`.

2. **Cek logs (jika ada masalah):**
   ```bash
   docker logs clevio-ai-staff -f
   ```

3. **Buka di browser:**
   ```
   https://DOMAIN_ANDA
   ```
   SSL akan otomatis aktif via Traefik.

---

## Update Aplikasi

Jika ada perubahan kode:

```bash
cd /home/clevio/clevio-ai-staff
git pull origin main
docker compose up -d --build
```

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| DNS belum pointing | Pastikan A Record domain ke IP VPS |
| Port 80/443 bentrok | Hanya Traefik yang boleh pakai port ini |
| SSL tidak terbit | Tunggu 1-2 menit, cek email di `.env` valid |
| Container tidak jalan | Cek logs: `docker logs clevio-ai-staff` |

---

## Struktur File Docker

```
clevio-ai-staff/
├── Dockerfile           # Resep build Next.js
├── docker-compose.yml   # Config Traefik + Service
├── .env.example         # Template environment
├── .env                 # Environment aktif (jangan di-git!)
└── .dockerignore        # File yang tidak ikut build
```
