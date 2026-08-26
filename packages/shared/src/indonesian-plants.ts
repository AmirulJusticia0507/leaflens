export interface IndonesianPlant {
  common_name: string;
  scientific_name: string;
  plant_type: "tree" | "shrub" | "herb" | "vine" | "succulent";
  category: string;
  avg_lifespan: string;
  growth_speed: "Cepat" | "Sedang" | "Lambat";
  origin: string;
  care_tips: string;
}

export const INDONESIAN_PLANTS: IndonesianPlant[] = [
  { common_name: "Padi", scientific_name: "Oryza sativa", plant_type: "herb", category: "Tanaman Pangan", avg_lifespan: "4-6 bulan", growth_speed: "Cepat", origin: "Asia Tenggara", care_tips: "Genangan air terkontrol, pupuk urea." },
  { common_name: "Jagung", scientific_name: "Zea mays", plant_type: "herb", category: "Tanaman Pangan", avg_lifespan: "3-4 bulan", growth_speed: "Cepat", origin: "Amerika Tengah", care_tips: "Sinar penuh, jarak tanam 75x25cm." },
  { common_name: "Cabai Rawit", scientific_name: "Capsicum frutescens", plant_type: "shrub", category: "Sayuran", avg_lifespan: "1-2 tahun", growth_speed: "Sedang", origin: "Amerika Tropis", care_tips: "Siram teratur, hindari genangan." },
  { common_name: "Tomat", scientific_name: "Solanum lycopersicum", plant_type: "herb", category: "Sayuran", avg_lifespan: "4-8 bulan", growth_speed: "Cepat", origin: "Amerika Selatan", care_tips: "Ajir penyangga, pangkas tunas air." },
  { common_name: "Mangga Harum Manis", scientific_name: "Mangifera indica", plant_type: "tree", category: "Buah", avg_lifespan: "30-50 tahun", growth_speed: "Sedang", origin: "India-Myanmar", care_tips: "Matahari penuh, pangkas bentuk." },
  { common_name: "Pisang Cavendish", scientific_name: "Musa acuminata", plant_type: "herb", category: "Buah", avg_lifespan: "1-2 tahun per anakan", growth_speed: "Cepat", origin: "Asia Tenggara", care_tips: "Kelembapan tinggi, anakan dipisah." },
  { common_name: "Kelapa", scientific_name: "Cocos nucifera", plant_type: "tree", category: "Perkebunan", avg_lifespan: "60-80 tahun", growth_speed: "Sedang", origin: "Pasifik", care_tips: "Tahan garam, drainase baik." },
  { common_name: "Teh", scientific_name: "Camellia sinensis", plant_type: "shrub", category: "Perkebunan", avg_lifespan: "30-50 tahun", growth_speed: "Sedang", origin: "Tiongkok", care_tips: "Dataran tinggi, pangkas rutin." },
  { common_name: "Kopi Arabika", scientific_name: "Coffea arabica", plant_type: "shrub", category: "Perkebunan", avg_lifespan: "20-30 tahun", growth_speed: "Sedang", origin: "Ethiopia", care_tips: "Naungan 30%, pH 5-6." },
  { common_name: "Cengkeh", scientific_name: "Syzygium aromaticum", plant_type: "tree", category: "Rempah", avg_lifespan: "50-80 tahun", growth_speed: "Lambat", origin: "Maluku", care_tips: "Curah hujan tinggi, angin minimal." },
  { common_name: "Lada Hitam", scientific_name: "Piper nigrum", plant_type: "vine", category: "Rempah", avg_lifespan: "15-20 tahun", growth_speed: "Cepat", origin: "India Selatan", care_tips: "Tiang panjat, kelembapan 60-80%." },
  { common_name: "Kunyit", scientific_name: "Curcuma longa", plant_type: "herb", category: "Rempah", avg_lifespan: "8-10 bulan", growth_speed: "Sedang", origin: "Asia Selatan", care_tips: "Rimpang, tanah gembur." },
  { common_name: "Jahe", scientific_name: "Zingiber officinale", plant_type: "herb", category: "Rempah", avg_lifespan: "8-10 bulan", growth_speed: "Sedang", origin: "Asia Tenggara", care_tips: "Naungan parsial, siram teratur." },
  { common_name: "Kangkung", scientific_name: "Ipomoea aquatica", plant_type: "herb", category: "Sayuran", avg_lifespan: "1-2 bulan", growth_speed: "Cepat", origin: "Asia Tropis", care_tips: "Genangan dangkal, panen pucuk." },
  { common_name: "Bayam", scientific_name: "Amaranthus tricolor", plant_type: "herb", category: "Sayuran", avg_lifespan: "1 bulan", growth_speed: "Cepat", origin: "Amerika Tengah", care_tips: "Sinar penuh, siram pagi-sore." },
  { common_name: "Sawi Hijau", scientific_name: "Brassica juncea", plant_type: "herb", category: "Sayuran", avg_lifespan: "1-2 bulan", growth_speed: "Cepat", origin: "Tiongkok", care_tips: "Dataran tinggi, hindari hama ulat." },
  { common_name: "Kubis", scientific_name: "Brassica oleracea", plant_type: "herb", category: "Sayuran", avg_lifespan: "3-4 bulan", growth_speed: "Sedang", origin: "Eropa", care_tips: "Tanah gembur, pupuk kandang." },
  { common_name: "Wortel", scientific_name: "Daucus carota", plant_type: "herb", category: "Sayuran", avg_lifespan: "3-4 bulan", growth_speed: "Sedang", origin: "Eropa", care_tips: "Tanah dalam, bebas batu." },
  { common_name: "Kentang", scientific_name: "Solanum tuberosum", plant_type: "herb", category: "Sayuran", avg_lifespan: "3-4 bulan", growth_speed: "Sedang", origin: "Amerika Selatan", care_tips: "Dataran tinggi dingin, hilling." },
  { common_name: "Bawang Merah", scientific_name: "Allium cepa var. aggregatum", plant_type: "herb", category: "Sayuran", avg_lifespan: "2-3 bulan", growth_speed: "Cepat", origin: "Asia Tengah", care_tips: "Musim kemarau, drainase baik." },
  { common_name: "Bawang Putih", scientific_name: "Allium sativum", plant_type: "herb", category: "Rempah", avg_lifespan: "4-5 bulan", growth_speed: "Sedang", origin: "Asia Tengah", care_tips: "Dataran tinggi, hari panjang." },
  { common_name: "Kedelai", scientific_name: "Glycine max", plant_type: "herb", category: "Tanaman Pangan", avg_lifespan: "3-4 bulan", growth_speed: "Cepat", origin: "Tiongkok", care_tips: "Inokulasi Rhizobium." },
  { common_name: "Kacang Tanah", scientific_name: "Arachis hypogaea", plant_type: "herb", category: "Tanaman Pangan", avg_lifespan: "4-5 bulan", growth_speed: "Cepat", origin: "Amerika Selatan", care_tips: "Tanah berpasir, gembur." },
  { common_name: "Ubi Kayu", scientific_name: "Manihot esculenta", plant_type: "shrub", category: "Umbi", avg_lifespan: "8-12 bulan", growth_speed: "Sedang", origin: "Amerika Selatan", care_tips: "Tahan kekeringan, stek batang." },
  { common_name: "Ubi Jalar", scientific_name: "Ipomoea batatas", plant_type: "vine", category: "Umbi", avg_lifespan: "4-6 bulan", growth_speed: "Cepat", origin: "Amerika Tengah", care_tips: "Gundukan tanah, ujung stek." },
  { common_name: "Talas", scientific_name: "Colocasia esculenta", plant_type: "herb", category: "Umbi", avg_lifespan: "8-10 bulan", growth_speed: "Sedang", origin: "Asia Tenggara", care_tips: "Lahan basah, naungan." },
  { common_name: "Durian Musang King", scientific_name: "Durio zibethinus", plant_type: "tree", category: "Buah", avg_lifespan: "30-50 tahun", growth_speed: "Sedang", origin: "Kalimantan", care_tips: "Lahan luas, penyerbukan kelelawar." },
  { common_name: "Rambutan", scientific_name: "Nephelium lappaceum", plant_type: "tree", category: "Buah", avg_lifespan: "20-30 tahun", growth_speed: "Sedang", origin: "Melayu", care_tips: "Iklim basah, pangkas air." },
  { common_name: "Manggis", scientific_name: "Garcinia mangostana", plant_type: "tree", category: "Buah", avg_lifespan: "50-80 tahun", growth_speed: "Lambat", origin: "Semenanjung Malaya", care_tips: "Naungan awal, tanah asam." },
  { common_name: "Salak Pondoh", scientific_name: "Salacca zalacca", plant_type: "shrub", category: "Buah", avg_lifespan: "15-20 tahun", growth_speed: "Sedang", origin: "Jawa", care_tips: "Kelembapan tinggi, duri." },
  { common_name: "Pepaya", scientific_name: "Carica papaya", plant_type: "tree", category: "Buah", avg_lifespan: "3-5 tahun", growth_speed: "Cepat", origin: "Amerika Tengah", care_tips: "Batang berongga, angin kencang hindari." },
  { common_name: "Nangka", scientific_name: "Artocarpus heterophyllus", plant_type: "tree", category: "Buah", avg_lifespan: "30-50 tahun", growth_speed: "Sedang", origin: "India", care_tips: "Buah besar, penyangga." },
  { common_name: "Jambu Air", scientific_name: "Syzygium aqueum", plant_type: "tree", category: "Buah", avg_lifespan: "20-30 tahun", growth_speed: "Sedang", origin: "Melayu", care_tips: "Penyiraman buah menjelang panen." },
  { common_name: "Alpukat Hass", scientific_name: "Persea americana", plant_type: "tree", category: "Buah", avg_lifespan: "20-30 tahun", growth_speed: "Sedang", origin: "Meksiko", care_tips: "Tanah tidak tergenang." },
  { common_name: "Jambu Biji", scientific_name: "Psidium guajava", plant_type: "tree", category: "Buah", avg_lifespan: "15-20 tahun", growth_speed: "Cepat", origin: "Amerika Tropis", care_tips: "Pemangkasan buah." },
  { common_name: "Sirih Gading", scientific_name: "Epipremnum aureum", plant_type: "vine", category: "Hias", avg_lifespan: "5-10 tahun", growth_speed: "Cepat", origin: "Polinesia", care_tips: "Teduh, media lembap." },
  { common_name: "Monstera Deliciosa", scientific_name: "Monstera deliciosa", plant_type: "vine", category: "Hias", avg_lifespan: "10-15 tahun", growth_speed: "Cepat", origin: "Meksiko", care_tips: "Turus lumut, daun besar." },
  { common_name: "Lidah Buaya", scientific_name: "Aloe barbadensis", plant_type: "succulent", category: "Hias", avg_lifespan: "5-25 tahun", growth_speed: "Lambat", origin: "Arab", care_tips: "Jangan overwater, sinar terang." },
  { common_name: "Lidah Mertua", scientific_name: "Sansevieria trifasciata", plant_type: "succulent", category: "Hias", avg_lifespan: "10-20 tahun", growth_speed: "Lambat", origin: "Afrika Barat", care_tips: "Toleran gelap, jarang siram." },
  { common_name: "Aglaonema", scientific_name: "Aglaonema commutatum", plant_type: "herb", category: "Hias", avg_lifespan: "5-10 tahun", growth_speed: "Sedang", origin: "Filipina", care_tips: "Kelembapan, hindari matahari langsung." },
  { common_name: "Keladi", scientific_name: "Caladium bicolor", plant_type: "herb", category: "Hias", avg_lifespan: "6-9 bulan musiman", growth_speed: "Sedang", origin: "Amerika Selatan", care_tips: "Umbi dorman musim kemarau." },
  { common_name: "Anggrek Bulan", scientific_name: "Phalaenopsis amabilis", plant_type: "herb", category: "Hias", avg_lifespan: "5-10 tahun", growth_speed: "Lambat", origin: "Indonesia", care_tips: "Tempel pakis, siram kabut." },
  { common_name: "Mawar", scientific_name: "Rosa hybrida", plant_type: "shrub", category: "Hias", avg_lifespan: "5-10 tahun", growth_speed: "Sedang", origin: "Tiongkok", care_tips: "Pangkas bunga layu." },
  { common_name: "Melati", scientific_name: "Jasminum sambac", plant_type: "shrub", category: "Hias", avg_lifespan: "10-15 tahun", growth_speed: "Cepat", origin: "India", care_tips: "Matahari penuh, harum malam." },
  { common_name: "Kelor", scientific_name: "Moringa oleifera", plant_type: "tree", category: "Herbal", avg_lifespan: "10-15 tahun", growth_speed: "Cepat", origin: "Himalaya", care_tips: "Pangkas rutin, kaya nutrisi." },
  { common_name: "Sereh", scientific_name: "Cymbopogon citratus", plant_type: "herb", category: "Rempah", avg_lifespan: "1-2 tahun", growth_speed: "Cepat", origin: "Sri Lanka", care_tips: "Rumpun, bagi anakan." },
  { common_name: "Kemangi", scientific_name: "Ocimum basilicum", plant_type: "herb", category: "Herbal", avg_lifespan: "6-12 bulan", growth_speed: "Cepat", origin: "India", care_tips: "Pangkas pucuk, jangan berbunga." },
  { common_name: "Seledri", scientific_name: "Apium graveolens", plant_type: "herb", category: "Sayuran", avg_lifespan: "3-4 bulan", growth_speed: "Sedang", origin: "Mediterania", care_tips: "Naungan, tanah lembap." },
  { common_name: "Kacang Panjang", scientific_name: "Vigna unguiculata", plant_type: "vine", category: "Sayuran", avg_lifespan: "2-3 bulan", growth_speed: "Cepat", origin: "Afrika", care_tips: "Lanjaran, panen muda." },
  { common_name: "Terong Ungu", scientific_name: "Solanum melongena", plant_type: "shrub", category: "Sayuran", avg_lifespan: "4-6 bulan", growth_speed: "Sedang", origin: "India", care_tips: "Ajir, hama kutu." },
  { common_name: "Pare", scientific_name: "Momordica charantia", plant_type: "vine", category: "Sayuran", avg_lifespan: "3-4 bulan", growth_speed: "Cepat", origin: "India", care_tips: "Para-para, pahit." },
];

export function searchPlants(query: string): IndonesianPlant[] {
  const q = query.toLowerCase().trim();
  if (!q) return INDONESIAN_PLANTS;
  return INDONESIAN_PLANTS.filter(
    (p) =>
      p.common_name.toLowerCase().includes(q) ||
      p.scientific_name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
}
