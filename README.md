# LeafLens — Local AI Leaf Identification & Monitoring System

Sistem pemantauan dan identifikasi tanaman berbasis AI lokal gratis menggunakan Ollama (vision + reasoning) untuk mengenali jenis daun, mendeteksi masalah kesehatan, dan memberi rekomendasi penanganan — 100% privat, diproses di perangkat sendiri tanpa upload ke cloud.

## ✨ Fitur Utama

- **Identifikasi Vision AI** — Foto daun → nama tanaman, ilmiah, kategori, ciri daun
- **Rekomendasi Penanganan** — `health_status` + `treatment_steps` (3–5 langkah konkret, mis. bercak bakteri)
- **Hybrid Verification** — Vision (`llava`/`moondream`) + cross-check `deepseek-r1` untuk koreksi nama & kalibrasi confidence
- **GPS Tagging** — Toggle otomatis ambil koordinat, link Google Maps, simpan `latitude`/`longitude` per scan
- **PWA Offline** — Installable (manifest + icon), service worker cache shell/API/assets, halaman `offline.html`, riwayat tetap bisa dibuka offline
- **Offline Queue** — Scan saat offline diantrekan di IndexedDB, auto-sync saat online kembali
- **Database 50+ Tanaman Indonesia** — Halaman `/plants` searchable (padi, mangga, cabai, anggrek, dll.), data lokal
- **Monitoring** — Grafik kesehatan bulanan, riwayat, tracker tanaman
- **Privasi** — Cookie popup (sessionStorage untuk *Nanti*, localStorage untuk *Setuju*)

## Tech Stack

- **Monorepo:** PNPM Workspaces
- **Frontend:** Next.js 14 (App Router), TailwindCSS, TypeScript, Framer Motion
- **Backend:** Python FastAPI + Pydantic v2 + SQLModel (AsyncPG)
- **AI:** Ollama — Vision `llava` (fallback `moondream`, `llama3.2-vision` butuh Ollama ≥0.33), Reasoning `deepseek-r1`
- **DB:** PostgreSQL 15+ (Neon/Postgres lokal)
- **Storage:** Local `uploads/` + StaticFiles `/uploads`
- **PWA:** `manifest.ts`, `sw.js` (stale-while-revalidate + network-first), `offline.html`
- **Offline Queue:** IndexedDB (`leaflens-offline`)

## Prasyarat

- Node.js ≥18, PNPM ≥8
- Python ≥3.10 (venv di `apps/api/.venv`)
- PostgreSQL ≥15
- Ollama ≥0.33.0 (`ollama --version`)

## Checklist Environment

- [X] PostgreSQL berjalan (`postgresql-x64-18` + DB `leaflens`)
- [X] Ollama `http://localhost:11434` berjalan — **v0.33.0** (fix `mllama`)
- [X] `deepseek-r1` (5.2GB) & `llava` (4.7GB) ter-pull — vision utama
- [X] Fallback `moondream` (1.7GB) siap
- [X] `llama3.2-vision` (7.8GB) ter-pull — *opsional, masih error `mllama` di 0.33, pakai `llava`*
- [X] PWA assets: `public/icons/*`, `sw.js`, `offline.html`, `manifest.webmanifest`
- [X] DB migrated: kolom `leaf_scans.latitude`/`longitude` + `health_status`/`treatment_steps`
- [X] Beekeeper Studio terkoneksi (`leaflens:leaflens@localhost:5432/leaflens`)

> `llama3.2-vision` tetap opsional — `.env` sekarang pakai `llava` (sudah terverifikasi end-to-end).

## Cara Menjalankan (1 terminal)

```bash
pnpm install
ollama pull llava          # vision utama (4.7GB)
ollama pull deepseek-r1    # reasoning (5.2GB)
# fallback ringan jika perlu: ollama pull moondream

pnpm dev
# Web: http://localhost:3000  (PWA installable)
# API: http://localhost:8000  (docs: /docs, health: /health)
```

`pnpm dev` menjalankan **keduanya** paralel (`apps/web` + `apps/api` via `.venv\Scripts\python.exe -m uvicorn` — sudah di-fix agar tidak perlu aktivasi venv manual).

### Manual (2 terminal)

```bash
# Terminal 1 — API
cd apps/api
.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000

# Terminal 2 — Web
pnpm --filter @leaflens/web exec next dev -H 0.0.0.0 -p 3000
# atau port custom: -p 3002
```

## Endpoint Penting

- `POST /api/v1/scan` — multipart `image_file` + `location_type` + `latitude`/`longitude` → `ScanResponse` (termasuk `health_status`, `treatment_steps`)
- `GET /api/v1/history` — list riwayat (sekarang dengan `latitude`, `longitude`, `health_status`)
- `GET /api/v1/history/monthly-health?months=12`
- `GET /api/v1/plants`
- `GET /uploads/{file}` — static foto
- `GET /health` — cek API
- `GET /manifest.webmanifest` — PWA manifest
- `GET /sw.js` — service worker

## PWA & Offline

- Install: buka `http://localhost:3000` di Chrome/Edge → banner *Install LeafLens* (komponen `InstallPrompt`) atau menu *Install app*
- Offline: halaman yang pernah dibuka + `GET /api/v1/*` di-cache; halaman baru yang belum di-cache → `offline.html`
- Antrean: jika scan saat offline, disimpan di IndexedDB dan tombol *Sinkronkan* muncul di `ScanUploader`

## GPS

Aktifkan toggle *Tag Lokasi GPS Otomatis* di halaman Scan. Browser akan minta izin lokasi → koordinat tampil dengan link Maps → terkirim bersama scan.

## Database Tanaman

Buka `/plants` — 50 entri `INDONESIAN_PLANTS` (`packages/shared/src/indonesian-plants.ts`), pencarian client-side (nama/ilmiah/kategori), filter kategori. Data bisa dipakai sebagai fallback jika vision confidence rendah.

## Akses Database (Beekeeper Studio)

Kredensial dari `apps/api/.env` (`DATABASE_URL`):

```
postgresql+asyncpg://leaflens:leaflens@localhost:5432/leaflens
```

**Beekeeper Studio → New Connection → Postgres:**

| Field    | Nilai         |
| -------- | ------------- |
| Host     | `localhost` |
| Port     | `5432`      |
| Database | `leaflens`  |
| Username | `leaflens`  |
| Password | `leaflens`  |
| SSL      | Off           |

Klik *Test* → *Connect*. Tabel utama: `plants` dan `leaf_scans` (kolom `latitude`/`longitude`/`full_analysis` berisi `health_status` & `treatment_steps`).

**Alternatif tanpa GUI:**

```bash
# psql (jika ter-install)
psql postgresql://leaflens:leaflens@localhost:5432/leaflens -c "SELECT common_name, plant_type FROM plants;"

# atau via Python venv
cd apps/api
.venv\Scripts\python.exe -c "import asyncio; from app.core.database import engine; from sqlalchemy import text; asyncio.run(engine.connect().execute(text('SELECT count(*) FROM leaf_scans')).fetchone())"
```

## Konfigurasi Ollama

`apps/api/.env`:

```
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_VISION_MODEL=llava          # atau moondream / llama3.2-vision
OLLAMA_REASONING_MODEL=deepseek-r1
```

Ganti model tanpa restart DB — cukup ubah `.env` dan restart `pnpm dev`. Hybrid verification aktif otomatis saat `confidence <0.85`.

## Akses dari HP (1 Wi-Fi)

Next.js sudah `0.0.0.0` + rewrites `/api` → tidak ada CORS.

```bash
ipconfig  # cari IPv4, mis. 10.70.193.117
# Izinkan port 3000 di Firewall (Private)
# Buka http://10.70.193.117:3000 di HP
```

Kamera live butuh HTTPS (secure context). Generate self-signed:

```bash
openssl req -x509 -newkey rsa:2048 -sha256 -days 365 -nodes \
  -keyout apps/web/certificates/localhost-key.pem \
  -out apps/web/certificates/localhost.pem \
  -subj "/CN=LeafLens Dev" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1,IP:10.70.193.117"

pnpm --filter @leaflens/web exec next dev -H 0.0.0.0 -p 3000
# buka https://10.70.193.117:3000 → Advanced → Proceed
```

## Expose via Cloudflare Tunnel (opsional, untuk demo publik)

Gunakan `cloudflared` dari Laragon (`C:\laragon\bin\cloudflared\cloudflared.exe`) untuk mendapatkan URL publik sementara `https://*.trycloudflare.com`.

```powershell
# Terminal 1 — Web (LeafLens di localhost:3000 via pnpm dev)
C:\laragon\bin\cloudflared\cloudflared.exe tunnel --url http://localhost:3000
# akan cetak: https://xxxx-xxxx.trycloudflare.com

# Terminal 2 — API saja (jika frontend perlu panggil API publik, bukan localhost)
C:\laragon\bin\cloudflared\cloudflared.exe tunnel --url http://localhost:8000
# catat URL API publiknya, mis. https://yyyy-yyyy.trycloudflare.com
```

> **Catatan:**
>
> - URL `trycloudflare.com` acak dan sementara (ganti tiap run) — cocok untuk demo, bukan produksi.
> - Jika frontend diakses via URL publik tapi `NEXT_PUBLIC_API_BASE_URL` masih `http://localhost:8000`, browser di HP/orang lain akan gagal (mencoba `localhost` milik device mereka). Untuk demo publik: set di `apps/api/.env` → `NEXT_PUBLIC_API_BASE_URL=https://<url-api-publik>` dan tambahkan origin web ke `CORS_ORIGINS` (mis. `https://xxxx.trycloudflare.com`), lalu restart `pnpm dev`.
> - Untuk akses HP 1 Wi-Fi saja, tidak perlu Cloudflare — cukup pakai `http://<IP-LAN>:3000` (bagian sebelumnya).

## Deploy Production

### Opsi A — Docker Compose (VPS, tetap privat & offline)

File sudah siap: `docker-compose.prod.yml` + `apps/api/Dockerfile` + `apps/web/Dockerfile`.

```bash
# 1. Siapkan env production
cp apps/api/.env.example apps/api/.env
# edit: DATABASE_URL, CORS_ORIGINS=https://yourdomain.com, OLLAMA_VISION_MODEL=llava

# 2. Build & jalankan (butuh Docker + Compose)
docker compose -f docker-compose.prod.yml up -d --build

# 3. Inisialisasi model Ollama (sekali, di dalam container ollama)
docker compose -f docker-compose.prod.yml exec ollama ollama pull llava
docker compose -f docker-compose.prod.yml exec ollama ollama pull deepseek-r1
# cek: docker compose exec ollama ollama list

# 4. Cek service
curl http://localhost:8000/health
curl http://localhost:3000/api/v1/history

# 5. Domain + HTTPS (Nginx reverse proxy di depan web:3000, Let's Encrypt)
# Contoh Nginx:
#   server { listen 443 ssl; server_name leaflens.com;
#     ssl_certificate /etc/letsencrypt/live/leaflens.com/fullchain.pem;
#     location / { proxy_pass http://localhost:3000; }
#     location /api/ { proxy_pass http://localhost:8000; }
#   }
```

Volume persisten: `pgdata` (DB), `ollama_data` (model 4-7GB), `uploads_data` (foto). Untuk GPU, uncomment blok `deploy.resources` di `ollama` service.

### Opsi B — Vercel + Railway (tanpa GPU)

- **Web** → Vercel: import repo, framework Next.js, `pnpm --filter @leaflens/web build`
- **API** → Railway/Render: deploy `apps/api` via Dockerfile, set `DATABASE_URL` ke Neon/Supabase, `OLLAMA_BASE_URL` ke `https://api.groq.com` atau mock jika tidak ada GPU
- Set `NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com` dan `CORS_ORIGINS=https://yourdomain.com`

> Untuk produksi tanpa GPU, pertimbangkan ganti `OLLAMA_VISION_MODEL` ke API eksternal atau tetap pakai `moondream` (CPU-friendly, 1.7GB).

## Troubleshooting

- `uvicorn is not recognized` → sudah di-fix di `package.json` (`".venv\\Scripts\\python.exe -m uvicorn"`), cukup `pnpm dev`
- Port 3000/8000 rebutan (`EADDRINUSE`, `muter-muter`) → `netstat -ano | findstr :3000` lalu `taskkill /F /PID <id>`
- `unknown model architecture: 'mllama'` → update Ollama ke 0.33+ atau pakai `llava`/`moondream`
- Ollama timeout 2m → `app/core/ollama.py` sudah `timeout=300` + `num_predict=400`

## Struktur

```
apps/api/app/{api/v1,core,models,schemas,services}
apps/web/{app,components,lib,public/{icons,sw.js,offline.html}}
packages/shared/src/{types,indonesian-plants}
```
