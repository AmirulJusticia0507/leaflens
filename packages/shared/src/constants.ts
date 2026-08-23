export const PLANT_TYPES: readonly string[] = [
  "tree",
  "shrub",
  "herb",
  "vine",
  "succulent",
];

export const GROWTH_RATES: readonly string[] = ["Cepat", "Sedang", "Lambat"];

export const LOCATION_TYPES: readonly string[] = [
  "Indoor",
  "Outdoor",
  "Liar/Hutan",
];

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export const OLLAMA_VISION_MODEL = "llama3.2-vision";
export const OLLAMA_REASONING_MODEL = "deepseek-r1";

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_IMAGE_DIMENSION = 1024;
