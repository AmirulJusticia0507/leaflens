---

### 4. `GUIDELINES.md` (Diperbarui)

```markdown
# Guidelines Integrasi Scan AI

## Prompt Engineering untuk Ollama & DeepSeek
Gunakan Prompt dengan output terstruktur JSON agar FastAPI dapat langsung menyimpan hasilnya tanpa parsing manual.

**Template System Prompt ke Ollama Vision & DeepSeek:**
```text
Kamu adalah ahli botani profesional. Analisis foto daun ini dan ekstrak informasi berikut dalam format JSON MURNI:
{
  "plant_name": "Nama lokal umum",
  "scientific_name": "Nama ilmiah",
  "plant_category": "Kategori (pohon keras, tanaman hias, herba, dll)",
  "growth_duration": "Berapa lama biasanya tumbuh dari benih hingga dewasa/panen",
  "lifespan": "Berapa lama estimasi usia/umur maksimal pohon ini",
  "growth_rate": "Cepat / Sedang / Lambat",
  "care_summary": "Saran singkat perawatan (air, sinar matahari)",
  "confidence": 0.00
}
Handling Camera Capture di Frontend Next.js
Menggunakan API HTML5 navigator.mediaDevices.getUserMedia untuk live capture.

Foto hasil tangkapan dibentuk menjadi File Blob / Base64.

Gunakan modul kompresi client-side (misal: browser-image-compression) untuk memperkecil resolusi foto menjadi maks 1024x1024 piksel sebelum diunggah ke FastAPI. Hal ini krusial agar pengolahan AI lokal di Ollama berjalan lebih cepat.


<ElicitationsGroup message="Ingin dibuatkan contoh modul komponen React (Next.js) untuk fitur kamera & upload foto ini?">

  <Elicitation label="Buatkan komponen Next.js untuk Live Camera Capture" query="Buatkan komponen React Next.js (App Router) untuk capture kamera dan upload file daun."/>

  <Elicitation label="Buatkan endpoint FastAPI untuk menerima upload foto & panggil Ollama" query="Buatkan endpoint FastAPI Python untuk menerima upload foto daun dan mengirimnya ke Ollama."/>

  <Elicitation label="Buatkan contoh response JSON analisa DeepSeek" query="Tunjukkan contoh struktur JSON utuh hasil analisa daun dari Ollama DeepSeek."/>
</ElicitationsGroup>
```
