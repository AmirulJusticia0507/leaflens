import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

import ThemeToggle from "../components/ThemeToggle";
import LeafIcon from "../components/LeafIcon";
import NavigationLinks from "../components/NavigationLinks";


export const metadata: Metadata = {
  title: "LeafLens — AI Plant Identification & Health Monitoring",
  description: "Local AI Leaf Identification & Monitoring System",
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('leaflens-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        {/* Sticky Glass Navbar */}
        <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/75 backdrop-blur-xl transition-all dark:border-slate-800/80 dark:bg-slate-950/75">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            {/* Brand Logo */}
            <Link
              href="/"
              className="group flex items-center gap-2.5 font-bold transition-transform active:scale-95"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-600/30 transition-transform duration-300 group-hover:scale-105">
                <LeafIcon className="h-5 w-5 fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Leaf<span className="text-emerald-500">Lens</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  AI Plant Engine
                </span>
              </div>
            </Link>

            {/* Navigation Links Component */}
            <div className="flex items-center gap-2 sm:gap-4">
              <NavigationLinks />
              
              {/* Divider */}
              <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800" />
              
              <ThemeToggle />
            </div>
          </nav>
        </header>

        {/* Main Content Container */}
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>

        {/* Modern Footer */}
        <footer className="mt-auto border-t border-slate-200/60 bg-white/40 py-6 backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/40">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center text-xs text-slate-500 dark:text-slate-400 sm:flex-row sm:px-6 sm:text-left lg:px-8">
            <p>© {new Date().getFullYear()} LeafLens AI Engine. Local Vision & Analytics System.</p>
            <div className="flex items-center gap-4 font-medium">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Ollama Llama3 Vision
              </span>
              <span>FastAPI Backend</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

