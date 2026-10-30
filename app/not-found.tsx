import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Compass, ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0f18] text-[#f4eee5] flex flex-col justify-between selection:bg-[#c9a36a] selection:text-[#0a0f18]">
      <Header />

      <main className="flex-1 flex items-center justify-center py-32 px-6">
        <div className="max-w-xl mx-auto text-center space-y-6 p-8 rounded-3xl bg-[#141d2b]/40 border border-[rgba(201,163,106,0.2)]">
          <div className="w-16 h-16 rounded-2xl bg-[#0e1624] border border-[rgba(201,163,106,0.3)] flex items-center justify-center mx-auto text-[#c9a36a]">
            <Compass className="w-8 h-8 animate-spin-slow" />
          </div>

          <span className="text-[11px] font-mono tracking-[0.3em] text-[#c9a36a] uppercase block">
            404 — RESIDENCE UNREACHABLE
          </span>

          <h1 className="font-display text-4xl sm:text-5xl font-light text-[#f4eee5] tracking-tight">
            Off the <span className="italic text-[#c9a36a]">Horizon</span>
          </h1>

          <p className="text-sm sm:text-base text-[#8f9ba8] font-sans font-light leading-relaxed">
            The requested residential suite or architectural portfolio item does not exist or may have been privately acquired.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/properties"
              className="btn-brass px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold flex items-center gap-2"
            >
              <span>Browse All Residences</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="px-6 py-3.5 rounded-full text-xs uppercase tracking-widest font-mono text-[#8f9ba8] hover:text-[#f4eee5] border border-white/10 hover:border-white/20 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
