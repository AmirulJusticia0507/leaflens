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

export const GROQ_VISION_MODEL = "qwen/qwen3.6-27b";
export const GROQ_REASONING_MODEL = "deepseek-r1-distill-llama-70b";

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_IMAGE_DIMENSION = 1024;
