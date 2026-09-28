import { NextResponse } from "next/server";
import type { AnalysisResult, PlantType, ScanResponse } from "@leaflens/shared";
import { saveScan } from "@/lib/server-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_CONTENT_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    plant_name: { type: "STRING" },
    scientific_name: { type: "STRING", nullable: true },
    plant_category: { type: "STRING", nullable: true },
    plant_type: { type: "STRING" },
    growth_time_info: {
      type: "OBJECT",
      properties: {
        time_to_mature: { type: "STRING" },
        lifespan: { type: "STRING" },
        growth_rate: { type: "STRING" },
      },
      required: ["time_to_mature", "lifespan", "growth_rate"],
    },
    leaf_characteristics: { type: "STRING" },
    care_summary: { type: "STRING" },
    health_status: { type: "STRING" },
    treatment_steps: { type: "ARRAY", items: { type: "STRING" } },
    confidence_score: { type: "NUMBER" },
  },
  required: ["plant_name", "plant_type", "growth_time_info", "leaf_characteristics", "care_summary", "health_status", "treatment_steps", "confidence_score"],
};

const SYSTEM_PROMPT = `You are a professional botanist. Analyze this leaf image.
Respond ONLY with valid JSON, no markdown, no extra text. Use EXACTLY these snake_case keys:

{
  "plant_name": "common name in Indonesian",
  "scientific_name": "scientific name or null",
  "plant_category": "category in Indonesian",
  "plant_type": "one of: tree | shrub | herb | vine | succulent",
  "growth_time_info": {
    "time_to_mature": "e.g. 3-5 tahun",
    "lifespan": "e.g. 30-50 tahun",
    "growth_rate": "Cepat | Sedang | Lambat"
  },
  "leaf_characteristics": "1-2 sentences physical description in Indonesian",
  "care_summary": "brief care advice in Indonesian",
  "health_status": "Sehat | or descriptive like Sakit - Bercak Daun",
  "treatment_steps": ["concrete step 1", "concrete step 2"],
  "confidence_score": 0.85
}

Rules:
- All string values MUST be in Indonesian.
- If leaf looks healthy: health_status="Sehat" and 1-2 prevention steps.
- If diseased/damaged: health_status explains the issue and 3-5 concrete treatment steps.
- confidence_score is 0.0-1.0, be realistic (0.7-0.95).
- Do NOT copy the example values above; analyze the actual image.`;

function normalize(data: Record<string, any>): AnalysisResult {
  const gti = typeof data.growth_time_info === "object" && data.growth_time_info
    ? data.growth_time_info
    : {};
  const plantType = String(data.plant_type || "").trim().toLowerCase();
  const plantTypes = new Set(["tree", "shrub", "herb", "vine", "succulent"]);
  const confidence = Number(data.confidence_score ?? data.confidence ?? 0.75);

  return {
    plant_name: String(data.plant_name || "Tanaman Tidak Dikenal"),
    scientific_name: data.scientific_name && !["null", "none"].includes(String(data.scientific_name).toLowerCase())
      ? String(data.scientific_name)
      : null,
    plant_category: data.plant_category ? String(data.plant_category) : null,
    plant_type: (plantTypes.has(plantType) ? plantType : "herb") as PlantType,
    growth_time_info: {
      time_to_mature: String(gti.time_to_mature || gti.time_mature || "Tidak diketahui"),
      lifespan: String(gti.lifespan || gti.life_span || "Tidak diketahui"),
      growth_rate: ["Cepat", "Sedang", "Lambat"].includes(String(gti.growth_rate)) ? gti.growth_rate : "Sedang",
    },
    leaf_characteristics: String(data.leaf_characteristics || data.characteristics || "Tidak tersedia"),
    care_summary: String(data.care_summary || data.care_tips || "Perawatan standar sesuai jenis tanaman."),
    health_status: String(data.health_status || "Sehat"),
    treatment_steps: Array.isArray(data.treatment_steps) ? data.treatment_steps.map(String) : [],
    confidence_score: Math.max(0, Math.min(1, Number.isFinite(confidence) ? confidence : 0.75)),
  };
}

function parseVisionJson(raw: string): Record<string, any> {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}") + 1;
  const json = start >= 0 && end > start ? raw.slice(start, end) : raw;
  try {
    return JSON.parse(json);
  } catch {
    // Some models occasionally omit a comma between JSON properties.
    return JSON.parse(json.replace(/(["\]}])\s*(?="(?:[^"\\]|\\.)+"\s*:)/g, "$1,"));
  }
}

async function geminiVision(imageBase64: string, mimeType: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  if (!key) throw new Error("GEMINI_API_KEY belum diatur di Vercel");

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        role: "user",
        parts: [
          { text: SYSTEM_PROMPT },
          { inline_data: { mime_type: mimeType, data: imageBase64 } },
        ],
      }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    }),
  });

  if (!res.ok) throw new Error(`Gemini gagal (HTTP ${res.status}): ${(await res.text()).slice(0, 160)}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("image_file");
    if (!(file instanceof File)) {
      return NextResponse.json({ detail: "image_file wajib diisi" }, { status: 422 });
    }
    if (!ALLOWED_CONTENT_TYPES.has(file.type)) {
      return NextResponse.json({ detail: "Tipe file harus JPG/PNG/WEBP" }, { status: 415 });
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ detail: "Ukuran file maksimal 10MB" }, { status: 413 });
    }

    const imageBase64 = Buffer.from(await file.arrayBuffer()).toString("base64");
    const raw = await geminiVision(imageBase64, file.type);
    if (!raw.trim()) throw new Error("Gemini tidak mengembalikan hasil analisis. Coba scan ulang.");
    const result = normalize(parseVisionJson(raw));
    const scanId = await saveScan({
      sourceType: form.get("source_type") === "camera" ? "camera" : "upload",
      locationType: String(form.get("location_type") || ""),
      latitude: form.get("latitude") ? Number(form.get("latitude")) : null,
      longitude: form.get("longitude") ? Number(form.get("longitude")) : null,
      imageUrl: `data:${file.type};base64,${imageBase64}`,
      result,
    }).catch(() => crypto.randomUUID());
    const body: ScanResponse = { scan_id: scanId, result };

    return NextResponse.json(body);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menganalisis gambar";
    return NextResponse.json({ detail: message }, { status: 502 });
  }
}
