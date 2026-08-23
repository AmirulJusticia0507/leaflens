export type GrowthRate = "Cepat" | "Sedang" | "Lambat";

export interface GrowthTimeInfo {
  time_to_mature: string;
  lifespan: string;
  growth_rate: GrowthRate;
}

export interface AnalysisResult {
  plant_name: string;
  scientific_name: string | null;
  plant_category: string | null;
  plant_type: string;
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
