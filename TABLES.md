
# Database Schema (PostgreSQL)

### 1. `plants` (Katalog Profil Tanaman)

| Column              | Type         | Constraints                   | Description                                                  |
| ------------------- | ------------ | ----------------------------- | ------------------------------------------------------------ |
| `id`              | UUID         | PK, Default gen_random_uuid() | ID Unik Tanaman                                              |
| `common_name`     | VARCHAR(150) | Not Null                      | Nama lokal (misal: Pohon Mangga Harum Manis)                 |
| `scientific_name` | VARCHAR(200) | Nullable                      | Nama Latin / Botanical Classification                        |
| `plant_type`      | VARCHAR(50)  | Not Null                      | Jenis:`tree`, `shrub`, `herb`, `vine`, `succulent` |
| `avg_lifespan`    | VARCHAR(100) | Nullable                      | Estimasi lama hidup (misal: "10-30 Tahun")                   |
| `growth_speed`    | VARCHAR(50)  | Nullable                      | Kecepatan tumbuh:`lambat`, `sedang`, `cepat`           |

> `plant_type` di sini harus konsisten dengan field `plant_type` pada JSON kanonikal (GUIDELINES.md / FORMS.md).

### 2. `leaf_scans` (Log Hasil Scan / Identifikasi)

| Column              | Type         | Constraints                   | Description                                    |
| ------------------- | ------------ | ----------------------------- | ---------------------------------------------- |
| `id`              | UUID         | PK, Default gen_random_uuid() | ID Log Scan                                    |
| `plant_id`        | UUID         | FK ->`plants.id`, **Nullable**| Relasi ke jenis tanaman (diisi saat disimpan ke tracker) |
| `input_source`    | VARCHAR(20)  | Not Null                      | Sumber:`camera_capture` atau `file_upload` |
| `location_type`   | VARCHAR(20)  | Nullable                      | Konteks lokasi:`Indoor` / `Outdoor` / `Liar/Hutan` |
| `image_url`       | TEXT         | Not Null                      | Path lokasi file foto daun disimpan            |
| `identified_name` | VARCHAR(200) | Not Null                      | Nama tanaman terdeteksi AI (`plant_name`)      |
| `growth_duration` | VARCHAR(100) | Not Null                      | Waktu tumbuh/panen (`growth_time_info.time_to_mature`) |
| `confidence`      | FLOAT        | Not Null                      | Nilai keyakinan AI 0.0 - 1.0 (`confidence_score`) |
| `full_analysis`   | JSONB        | Not Null                      | Seluruh JSON hasil analisis dari DeepSeek       |
| `scanned_at`      | TIMESTAMPTZ  | Default NOW()                 | Waktu pemindaian                               |

> **History & Growth Monitoring (Milestone 3):** tidak ada tabel terpisah; timeline diambil dari `leaf_scans` diurutkan `scanned_at` untuk `plant_id` yang sama.
