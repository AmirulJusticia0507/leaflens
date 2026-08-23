import HistoryList from "@/components/HistoryList";

export default function HistoryPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Riwayat Scan</h1>
      <p className="text-sm opacity-70">
        Timeline pemantauan perkembangan daun dari waktu ke waktu.
      </p>
      <HistoryList />
    </section>
  );
}
