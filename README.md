
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
