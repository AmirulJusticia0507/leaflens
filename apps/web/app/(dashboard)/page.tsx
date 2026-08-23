import Link from "next/link";
import PlantsOverview from "@/components/PlantsOverview";

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Dashboard Pemantauan</h1>
        <p className="text-sm opacity-70">
          Pantau kesehatan dan pertumbuhan tanamanmu secara lokal dengan AI.
        </p>
        <Link
          href="/scan"
          className="inline-block rounded-md bg-leaf-primary px-4 py-2 text-white hover:bg-leaf-accent"
        >
          Mulai Scan Daun
        </Link>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Tanaman Tersimpan</h2>
        <PlantsOverview />
      </div>
    </section>
  );
}
