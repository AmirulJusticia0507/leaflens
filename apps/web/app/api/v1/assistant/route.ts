import { NextResponse } from "next/server";
import type { AnalysisResult } from "@leaflens/shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_API_URL = "https://boso-jawa-ai.vercel.app";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      question?: unknown;
      diagnosis?: AnalysisResult;
    };
    const question = typeof body.question === "string" ? body.question.trim() : "";

    if (!question || question.length > 500 || !body.diagnosis?.plant_name) {
      return NextResponse.json(
        { detail: "Pitakon wajib diisi (maksimal 500 karakter) lan diagnosis kudu ana." },
        { status: 422 }
      );
    }

    const diagnosis = body.diagnosis;
    const context = [
      `Tanduran: ${diagnosis.plant_name}`,
      `Jeneng ilmiah: ${diagnosis.scientific_name || "ora dingerteni"}`,
      `Kondisi: ${diagnosis.health_status || "ora dingerteni"}`,
      `Perawatan: ${diagnosis.care_summary}`,
      `Langkah penanganan: ${(diagnosis.treatment_steps || []).join("; ") || "durung ana"}`,
    ].join("\n");

    const baseUrl = (process.env.BOSO_JAWA_API_URL || DEFAULT_API_URL).replace(/\/$/, "");
    const response = await fetch(`${baseUrl}/api/v1/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "Kowe asisten tani kanggo warga desa. Wangsulana nganggo basa Jawa ngoko sing prasaja, sopan, maksimal 3 ukara, lan langsung njawab pitakone. Gunakake mung konteks diagnosis sing diwenehake. Aja nggawe diagnosis anyar, merek obat, utawa dosis pestisida. Yen informasi ora cukup, kandhaa supaya takon penyuluh pertanian lan manut label produk.",
          },
          {
            role: "user",
            content: `${context}\n\nPitakon petani: ${question}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 300,
      }),
      signal: AbortSignal.timeout(30_000),
    });

    const data = await response.json().catch(() => null);
    const answer = data?.data?.answer;
    if (!response.ok || typeof answer !== "string" || !answer.trim()) {
      const detail = data?.detail || `Boso Jawa AI gagal (HTTP ${response.status})`;
      throw new Error(String(detail));
    }

    return NextResponse.json({ answer: answer.trim() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Asisten ora bisa njawab saiki.";
    return NextResponse.json({ detail: message }, { status: 502 });
  }
}
