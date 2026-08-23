
# LeafLens - Local AI Leaf Identification & Monitoring System

Sistem pemantauan dan identifikasi tanaman berbasis AI lokal gratis menggunakan Ollama (DeepSeek-R1 / DeepSeek-Janus) untuk mengenali jenis daun dan mendeteksi masalah kesehatan tanaman.

## Tech Stack

- **Monorepo Manager:** PNPM Workspaces
- **Frontend:** Next.js 14+ (App Router, TailwindCSS, TypeScript)
- **Backend:** Python FastAPI + Pydantic v2
- **AI Inference Engine:** Ollama (DeepSeek Vision / DeepSeek-R1)
- **Database:** PostgreSQL + AsyncPG / SQLModel
- **Storage:** Local Storage / MinIO (Foto Daun)

## Prasyarat System

- Node.js >= 18.x
- Python >= 3.10
- PostgreSQL >= 15
- Ollama Server (`ollama run deepseek-r1` atau `ollama run deepseek-coder`)

## Cara Menjalankan

```bash
# 1. Install semua dependensi
pnpm install

# 2. Jalankan Ollama di lokal
ollama serve

# 3. Jalankan environment pengembangan (API & Web)
pnpm dev
```
