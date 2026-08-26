import PlantDatabase from "@/components/PlantDatabase";

export const metadata = {
  title: "Database Tanaman — LeafLens",
  description: "Jelajahi 50+ tanaman Indonesia dengan info perawatan.",
};

export default function PlantsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-900 dark:text-white">Database Tanaman</h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          50+ tanaman umum Indonesia — cari berdasarkan nama, ilmiah, atau kategori. Data lokal, tersedia offline.
        </p>
      </div>
      <PlantDatabase />
    </div>
  );
}
