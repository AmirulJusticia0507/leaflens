import { Pool } from "pg";
import type { AnalysisResult, HistoryItem, PlantPublic } from "@leaflens/shared";

let pool: Pool | null = null;
let ready: Promise<void> | null = null;

function databaseUrl() {
  return process.env.DATABASE_URL?.replace("postgresql+asyncpg://", "postgresql://");
}

function getPool() {
  const connectionString = databaseUrl();
  if (!connectionString) return null;
  pool ??= new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  return pool;
}

async function ensureTables() {
  const db = getPool();
  if (!db) return;
  ready ??= db.query(`
    create table if not exists plants (
      id uuid primary key default gen_random_uuid(),
      common_name varchar(150) not null,
      scientific_name varchar(200),
      plant_type varchar(50) not null,
      avg_lifespan varchar(100),
      growth_speed varchar(50)
    );
    create table if not exists leaf_scans (
      id uuid primary key default gen_random_uuid(),
      plant_id uuid references plants(id),
      input_source varchar(20) not null,
      location_type varchar(20),
      latitude double precision,
      longitude double precision,
      image_url text not null,
      identified_name varchar(200) not null,
      growth_duration varchar(100) not null,
      confidence double precision not null,
      full_analysis jsonb not null,
      scanned_at timestamptz not null default now()
    );
  `).then(() => undefined);
  await ready;
}

export async function saveScan(input: {
  sourceType: "camera" | "upload";
  locationType?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  imageUrl?: string;
  result: AnalysisResult;
}) {
  const db = getPool();
  if (!db) return crypto.randomUUID();
  await ensureTables();
  const saved = await db.query<{ id: string }>(
    `insert into leaf_scans
      (input_source, location_type, latitude, longitude, image_url, identified_name, growth_duration, confidence, full_analysis)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     returning id`,
    [
      input.sourceType === "camera" ? "camera_capture" : "file_upload",
      input.locationType || null,
      input.latitude ?? null,
      input.longitude ?? null,
      input.imageUrl || "",
      input.result.plant_name,
      input.result.growth_time_info.time_to_mature,
      input.result.confidence_score,
      JSON.stringify(input.result),
    ],
  );
  return saved.rows[0]?.id || crypto.randomUUID();
}

export async function getHistory(): Promise<HistoryItem[]> {
  const db = getPool();
  if (!db) return [];
  await ensureTables();
  const result = await db.query<HistoryItem>(`
    select
      id::text as scan_id,
      identified_name,
      confidence,
      image_url,
      scanned_at::text as scanned_at,
      location_type,
      latitude,
      longitude,
      full_analysis->>'health_status' as health_status
    from leaf_scans
    order by scanned_at desc
    limit 100
  `);
  return result.rows;
}

export async function getPlants(): Promise<PlantPublic[]> {
  const db = getPool();
  if (!db) return [];
  await ensureTables();
  const result = await db.query<PlantPublic>(`
    select distinct on (p.id)
      p.id::text,
      p.common_name,
      p.scientific_name,
      p.plant_type,
      p.avg_lifespan,
      p.growth_speed,
      s.image_url,
      s.scanned_at::text as scanned_at,
      s.full_analysis->>'health_status' as health_status,
      s.confidence
    from plants p
    left join leaf_scans s on s.plant_id = p.id
    order by p.id, s.scanned_at desc nulls last
  `);
  return result.rows;
}

export async function getPlant(id: string): Promise<PlantPublic | null> {
  const db = getPool();
  if (!db) return null;
  await ensureTables();
  const result = await db.query<PlantPublic>(
    `select distinct on (p.id)
      p.id::text,
      p.common_name,
      p.scientific_name,
      p.plant_type,
      p.avg_lifespan,
      p.growth_speed,
      s.image_url,
      s.scanned_at::text as scanned_at,
      s.full_analysis->>'health_status' as health_status,
      s.confidence
    from plants p
    left join leaf_scans s on s.plant_id = p.id
    where p.id = $1
    order by p.id, s.scanned_at desc nulls last`,
    [id],
  );
  return result.rows[0] ?? null;
}

export async function addPlantFromScan(scanId: string, nickname: string): Promise<PlantPublic> {
  const db = getPool();
  if (!db) throw new Error("DATABASE_URL belum diatur di Vercel");
  await ensureTables();
  const scan = await db.query<{ full_analysis: AnalysisResult; identified_name: string }>(
    "select full_analysis, identified_name from leaf_scans where id = $1 limit 1",
    [scanId],
  );
  if (scan.rows.length === 0) throw new Error("scan_id tidak ditemukan");

  const analysis = scan.rows[0].full_analysis;
  const saved = await db.query<PlantPublic>(
    `insert into plants (common_name, scientific_name, plant_type, avg_lifespan, growth_speed)
     values ($1,$2,$3,$4,$5)
     returning id::text, common_name, scientific_name, plant_type, avg_lifespan, growth_speed`,
    [
      nickname || scan.rows[0].identified_name,
      analysis.scientific_name,
      analysis.plant_type,
      analysis.growth_time_info.lifespan,
      analysis.growth_time_info.growth_rate,
    ],
  );
  await db.query("update leaf_scans set plant_id = $1 where id = $2", [saved.rows[0].id, scanId]);
  return saved.rows[0];
}
