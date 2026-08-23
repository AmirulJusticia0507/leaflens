import ScanUploader from "@/components/ScanUploader";

export default function ScanPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Scan Daun</h1>
      <p className="text-sm opacity-70">
        Ambil foto daun via kamera atau unggah gambar untuk diidentifikasi AI lokal.
      </p>
      <ScanUploader />
    </section>
  );
}
