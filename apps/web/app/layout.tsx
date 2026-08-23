import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LeafLens",
  description: "Local AI Leaf Identification & Monitoring System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <header className="border-b border-black/10">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-bold text-leaf-primary">
              LeafLens
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/" className="hover:text-leaf-primary">
                Dashboard
              </Link>
              <Link href="/scan" className="hover:text-leaf-primary">
                Scan
              </Link>
              <Link href="/history" className="hover:text-leaf-primary">
                History
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
