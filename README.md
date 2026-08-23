
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

## Cara Menjalankan

```bash
# 1. Install semua dependensi
pnpm install

# 2. Siapkan model Ollama (vision + reasoning)
ollama pull llama3.2-vision
ollama pull deepseek-r1

# 3. Jalankan Ollama di lokal (terminal terpisah)
ollama serve

# 4. Jalankan environment pengembangan (API & Web)
pnpm dev
```

## Akses dari HP

Web dev server sudah di-bind ke `0.0.0.0`, jadi bisa dibuka dari HP yang satu Wi-Fi dengan PC.

1. Cek IP LAN PC: `ipconfig` (misal: `10.70.193.117`).
2. Edit `.env` (root) sebelum menjalankan `pnpm dev`:
   - `NEXT_PUBLIC_API_BASE_URL=http://<IP-LAN>:8000`
   - Di `apps/api/.env`: `CORS_ORIGINS=http://localhost:3000,http://<IP-LAN>:3000`
3. Izinkan port 3000 & 8000 di Windows Firewall (Private network).
4. Buka `http://<IP-LAN>:3000` di browser HP.

> **Catatan kamera:** API kamera HTML5 (`getUserMedia`) hanya aktif pada *secure context*.
> Lewat `http://localhost` di PC kamera jalan normal, tapi dari HP via `http://<IP-LAN>` kamera live **terblokir browser**.
> Solusi: pakai mode **Unggah File** di HP, atau jalankan web via HTTPS (`next dev --experimental-https`) dan percayai sertifikat self-signed di HP.
