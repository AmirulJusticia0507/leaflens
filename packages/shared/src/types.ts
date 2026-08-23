export type GrowthRate = "Cepat" | "Sedang" | "Lambat";

export type PlantType = "tree" | "shrub" | "herb" | "vine" | "succulent";

export type InputSource = "camera" | "upload";

export type LocationType = "Indoor" | "Outdoor" | "Liar/Hutan";

export interface GrowthTimeInfo {
  time_to_mature: string;
  lifespan: string;
  growth_rate: GrowthRate;
}

export interface AnalysisResult {
  plant_name: string;
  scientific_name: string | null;
  plant_category: string | null;
  plant_type: PlantType;
  growth_time_info: GrowthTimeInfo;
  leaf_characteristics: string;
  care_summary: string;
  confidence_score: number;
}

export interface ScanResponse {
  scan_id: string;
  result: AnalysisResult;
}

export interface HistoryItem {
  scan_id: string;
  identified_name: string;
  confidence: number;
  image_url: string;
  scanned_at: string;
}

export interface MonthlyHealthPoint {
  month: string;
  scan_count: number;
  avg_confidence: number | null;
}

export interface PlantCreate {
  scan_id: string;
  custom_nickname: string;
  planting_date?: string;
}

export interface PlantPublic {
  id: string;
  common_name: string;
  scientific_name: string | null;
  plant_type: PlantType;
  avg_lifespan: string | null;
  growth_speed: string | null;
}
