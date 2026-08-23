
# Guidelines Integrasi Scan AI

## Prompt Engineering untuk Ollama Vision & DeepSeek
Gunakan prompt dengan output terstruktur JSON agar FastAPI dapat langsung menyimpan hasilnya. Skema JSON di bawah adalah **kanonikal** dan harus konsisten dengan `FORMS.md` serta pemetaan ke `TABLES.md`.

**Template System Prompt ke Ollama Vision & DeepSeek:**
```text
Kamu adalah ahli botani profesional. Analisis foto daun ini dan ekstrak informasi berikut dalam format JSON MURNI (tanpa teks lain di luar JSON):
{
  "plant_name": "Nama lokal umum",
  "scientific_name": "Nama ilmiah",
  "plant_category": "Kategori bebas (misal: Pohon Buah Perennial)",
  "plant_type": "Salah satu dari: tree | shrub | herb | vine | succulent",
  "growth_time_info": {
    "time_to_mature": "Berapa lama tumbuh dari benih hingga dewasa/panen",
    "lifespan": "Estimasi usia/umur maksimal",
    "growth_rate": "Cepat | Sedang | Lambat"
  },
  "leaf_characteristics": "Ciri fisik daun (bentuk, ujung, pertulangan)",
  "care_summary": "Saran singkat perawatan (air, sinar matahari)",
  "confidence_score": 0.00
}
```

## Pemetaan ke Database (TABLES.md)
- `plant_name` → `leaf_scans.identified_name`
- `growth_time_info.time_to_mature` → `leaf_scans.growth_duration`
- `confidence_score` → `leaf_scans.confidence`
- Seluruh JSON → `leaf_scans.full_analysis` (JSONB)
- `plant_type` & `plant_category` → dipakai saat membuat/melengkapi baris `plants` (lihat `/plants/add` di FORMS.md)

## Handling Camera Capture di Frontend Next.js
- Menggunakan API HTML5 `navigator.mediaDevices.getUserMedia` untuk live capture.
- Foto hasil tangkapan dibentuk menjadi File Blob / Base64.
- Gunakan modul kompresi client-side (misal: `browser-image-compression`) untuk memperkecil resolusi foto maksimal 1024x1024 piksel sebelum diunggah ke FastAPI. Hal ini krusial agar pengolahan AI lokal di Ollama berjalan lebih cepat.
