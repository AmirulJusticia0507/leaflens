import { NextResponse } from "next/server";
import { getHistory } from "@/lib/server-db";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await getHistory());
}
