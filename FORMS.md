
# Form Specifications

## 1. Leaf Scan & Plant Identification Form (`/scan`)

- **Inputs:**
  - `source_type`: String Enum (`camera` | `upload`).
  - `image_file`: Binary (JPG / PNG / WEBP, Max 10MB).
  - `location_type`: Select Opsional (`Indoor` | `Outdoor` | `Liar/Hutan`).
- **Validasi:**
  - `image_file` wajib disertakan.
  - Tipe file harus berupa gambar valid (`image/jpeg`, `image/png`, `image/webp`).
- **Expected JSON Response:**
  ```json
  {
    "plant_name": "Mangga Harum Manis",
    "scientific_name": "Mangifera indica",
    "plant_category": "Pohon Buah Perennial",
    "growth_time_info": {
      "time_to_mature": "3 - 5 tahun dari bibit",
      "lifespan": "30 - 50 tahun",
      "growth_rate": "Sedang"
    },
    "leaf_characteristics": "Bentuk memanjang, ujung runcing, pertulangan menyirip jelas",
    "confidence_score": 0.92
  }
  ```
- 

2. Save to Tracker Form (/plants/add)
   Inputs:

scan_id: UUID (Membawa data dari hasil scan di atas).

custom_nickname: String (Misal: "Mangga Belakang Rumah").

planting_date: Date (Tanggal mulai ditanam jika tahu).
