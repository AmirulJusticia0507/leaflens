import Link from "next/link";

export default function DashboardPage() {
  return (
    <section className="space-y-4">
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
    </section>
  );
}
