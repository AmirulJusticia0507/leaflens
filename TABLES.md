
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

### 2. `leaf_scans` (Log Hasil Scan / Identifikasi)

| Column              | Type         | Constraints                   | Description                                    |
| ------------------- | ------------ | ----------------------------- | ---------------------------------------------- |
| `id`              | UUID         | PK, Default gen_random_uuid() | ID Log Scan                                    |
| `plant_id`        | UUID         | FK ->`plants.id`            | Relasi ke jenis tanaman                        |
| `input_source`    | VARCHAR(20)  | Not Null                      | Sumber:`camera_capture` atau `file_upload` |
| `image_url`       | TEXT         | Not Null                      | Path lokasi file foto daun disimpan            |
| `identified_name` | VARCHAR(200) | Not Null                      | Nama tanaman terdeteksi AI                     |
| `growth_duration` | VARCHAR(100) | Not Null                      | Berapa lama bisa tumbuh/panen dari AI          |
| `confidence`      | FLOAT        | Not Null                      | Nilai akurasi/keyakinan AI (0.0 - 1.0)         |
| `full_analysis`   | JSONB        | Not Null                      | Detail lengkap hasil analisis dari DeepSeek    |
| `scanned_at`      | TIMESTAMPTZ  | Default NOW()                 | Waktu pemindaian                               |
