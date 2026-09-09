import { NextResponse } from "next/server";
import { getHistory } from "@/lib/server-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getHistory());
  } catch {
    return NextResponse.json([]);
  }
}
