
---

### 2. `ARCHITECTURE.md`

```markdown
# System Architecture

## Alur Pemrosesan Kamera / Upload Daun
[ User: Capture Foto / Upload ]
│
▼ (FormData Payload)
[ Next.js Client ]
│ (Direct API Stream)
▼
[ FastAPI Backend ]
│
├───► [ Storage Engine ] (Simpan gambar ke disk/MinIO)
│
├───► [ Ollama Multimodal (Llama 3.2 Vision / Gemma 4 Vision) ]
│     └── Ekstrak ciri visual: warna, bentuk tulang daun, tekstur
│
├───► [ Ollama DeepSeek ]
│     └── Analisa spesies, masa tumbuh, syarat media tanam & estimasi umur
│
▼
[ PostgreSQL DB ] (Simpan Log Scan & Estimasi Umur/Tumbuh)


## Komponen AI lokal
- **Vision Pre-processor (Ollama Multimodal):** Menggunakan model visual ringan di Ollama (`llama3.2-vision` / `gemma4`) untuk "membaca" bentuk fisik daun.
- **Reasoning Engine (DeepSeek via Ollama):** Menerima ciri fisik dari model vision untuk mengidentifikasi taksonomi, durasi tumbuh (*lifespan* / *growth rate*), serta rekomendasi perawatan.
```
