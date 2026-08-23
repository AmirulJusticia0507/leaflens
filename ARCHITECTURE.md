
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
├───► [ Ollama Multimodal (llama3.2-vision / gemma3) ]
│     └── Ekstrak ciri visual: warna, bentuk tulang daun, tekstur
│
├───► [ Ollama DeepSeek-R1 ]
│     └── Analisa spesies, masa tumbuh, syarat media tanam & estimasi umur
│
▼
[ PostgreSQL DB ] (Simpan Log Scan & Estimasi Umur/Tumbuh)


## Komponen AI lokal
- **Vision Pre-processor (Ollama Multimodal):** Menggunakan model visual di Ollama (`llama3.2-vision` / `gemma3`) untuk "membaca" bentuk fisik daun.
- **Reasoning Engine (DeepSeek-R1 via Ollama):** Menerima ciri fisik dari model vision untuk mengidentifikasi taksonomi, durasi tumbuh (*lifespan* / *growth rate*), serta rekomendasi perawatan.
