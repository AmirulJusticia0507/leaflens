# LeafLens - Local AI Leaf Identification & Monitoring System

Sistem pemantauan dan identifikasi tanaman berbasis AI lokal gratis menggunakan Ollama (model vision + reasoning) untuk mengenali jenis daun dan mendeteksi masalah kesehatan tanaman.

## Tech Stack

- **Monorepo Manager:** PNPM Workspaces
- **Frontend:** Next.js 14+ (App Router, TailwindCSS, TypeScript)
- **Backend:** Python FastAPI + Pydantic v2
- **AI Inference Engine:** Ollama
  - **Vision / Multimodal:** `llama3.2-vision` (alternatif: `deepseek-janus`, `gemma3`)
  - **Reasoning:** `deepseek-r1`
- **Database:** PostgreSQL + AsyncPG / SQLModel
- **Storage:** Local Storage / MinIO (Foto Daun)

## Prasyarat System

- Node.js >= 18.x
- Python >= 3.10
- PostgreSQL >= 15
- Ollama Server

## Checklist Persiapan Environment

- [X] Service PostgreSQL berjalan (`postgresql-x64-18`)
- [X] Ollama server berjalan di `localhost:11434`
- [X] Model reasoning `deepseek-r1:14b` sudah ter-pull
- [ ] **`ollama pull llama3.2-vision`** ← BELUM DILAKUKAN, lanjutkan besok (±4–5 GB).
  Wajib ada sebelum fitur scan daun; tanpa ini endpoint `/api/v1/scan` gagal dengan error 502.

## Cara Menjalankan

```bash
# 1. Install semua dependensi
pnpm install

# 2. Siapkan model Ollama (vision + reasoning)
ollama pull llama3.2-vision
ollama pull deepseek-r1

# 3. Jalankan Ollama di lokal (terminal terpisah)
ollama serve

# 4. Jalankan environment pengembangan (API & Web sekaligus)
pnpm dev
```

### Menjalankan Secara Manual (Terminal Terpisah)

```bash
# Terminal 1 — FastAPI Backend (port 8000)
# Gunakan path .venv karena uvicorn tidak otomatis ada di PATH
cd apps/api
.venv\Scripts\uvicorn.exe main:app --reload --port 8000

# Terminal 2 — Next.js Frontend (port 3002, akses dari semua IP)
pnpm --filter @leaflens/web exec next dev -H 0.0.0.0 -p 3002
```

> **Catatan:** Di Windows PowerShell, `uvicorn` tidak dikenali langsung karena berada di `.venv\Scripts\`.
> Alternatif lain: aktifkan venv dulu dengan `apps/api/.venv/Scripts/Activate.ps1`, lalu jalankan `uvicorn main:app --reload --port 8000`.

## Akses dari HP

Web dev server sudah di-bind ke `0.0.0.0`, jadi bisa dibuka dari HP yang satu Wi-Fi dengan PC.
Semua panggilan API **di-proxy lewat Next.js** (rewrites `/api/v1/*` dan `/uploads/*` ke FastAPI),
jadi tidak ada masalah CORS maupun *mixed content*.

### Cara cepat (HTTP, tanpa kamera live)

1. Cek IP LAN PC: `ipconfig` (misal: `10.70.193.117`).
2. Izinkan port 3000 di Windows Firewall (Private network).
3. Jalankan `pnpm --filter @leaflens/web exec next dev -H 0.0.0.0 -p 3002`, buka `http://<IP-LAN>:3002` di HP.
4. Fitur **kamera live tidak jalan** via HTTP non-localhost — gunakan mode **Unggah File**.

### Mode HTTPS (kamera live dari HP)

1. Generate sertifikat self-signed dengan SAN IP LAN PC kamu:
   ```bash
   openssl req -x509 -newkey rsa:2048 -sha256 -days 365 -nodes \
     -keyout apps/web/certificates/localhost-key.pem \
     -out apps/web/certificates/localhost.pem \
     -subj "/CN=LeafLens Dev" \
     -addext "subjectAltName=DNS:localhost,IP:127.0.0.1,IP:<IP-LAN>"
   ```
2. Jalankan: `pnpm --filter @leaflens/web exec next dev -H 0.0.0.0 -p 3002`
3. Buka `https://<IP-LAN>:3002` di HP → browser akan memperingatkan sertifikat
   self-signed; terima/lanjutkan (*Advanced → Proceed*) agar halaman menjadi *secure context*
   dan API kamera aktif.

> Sertifikat di folder `apps/web/certificates/` sengaja di-gitignore (berisi private key).
> Bila IP LAN berubah, regenerate sertifikatnya.
