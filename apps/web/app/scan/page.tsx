import ScanUploader from "@/components/ScanUploader";
import Tooltip from "@/components/Tooltip";
import { Camera, Sparkles, ShieldCheck, Zap } from "lucide-react";

export default function ScanPage() {
  return (
    <section className="space-y-8 pb-8">
      {/* Page Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 p-6 sm:p-8 text-white shadow-xl dark:from-emerald-900/90 dark:via-teal-950 dark:to-slate-900 border border-emerald-500/30">
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-32 w-64 -translate-x-1/2 rounded-full bg-teal-300/15 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              Model AI Siap Menganalisis
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Scan & Identifikasi Daun
            </h1>
            <p className="text-sm text-emerald-50/90 leading-relaxed max-w-md">
              Foto atau unggah gambar daun tanaman untuk diidentifikasi jenis, kondisi kesehatan, dan rekomendasi perawatan oleh AI lokal.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex shrink-0 flex-col gap-2">
            {[
              { icon: ShieldCheck, text: "100% Pemrosesan Lokal", tip: "Semua pemrosesan dilakukan di perangkat lokal, tidak ada data yang dikirim ke cloud" },
              { icon: Zap, text: "Inferensi < 50ms", tip: "Kecepatan inferensi AI didukung oleh GPU lokal" },
              { icon: Sparkles, text: "Llama3 Multimodal AI", tip: "Menggunakan model Llama3 Vision untuk analisis gambar" },
            ].map(({ icon: Icon, text, tip }) => (
              <Tooltip key={text} content={tip} side="left">
                <span className="flex items-center gap-2 text-xs font-medium text-emerald-100">
                  <Icon className="h-4 w-4 text-emerald-300" /> {text}
                </span>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>

      {/* Tips Card */}
      <div className="flex items-start gap-3 rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4 dark:bg-sky-500/10">
        <Camera className="mt-0.5 h-5 w-5 shrink-0 text-sky-500" />
        <div className="text-xs text-slate-600 dark:text-slate-300">
          <span className="font-bold text-sky-600 dark:text-sky-400">Tips untuk hasil terbaik: </span>
          Pastikan gambar daun dalam pencahayaan yang cukup, tidak buram, dan daun terlihat jelas dengan latar belakang kontras. Hindari daun yang tertutup air atau bayangan berat.
        </div>
      </div>

      {/* Main Scan Component */}
      <ScanUploader />
    </section>
  );
}
