"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { campaignProvider, type DiscoverProjectItem } from "@/api/campaigns";
import { ArrowRight, Search, MapPin } from "lucide-react";

const CATEGORIES = ["All", "Fintech", "Agribusiness", "Healthcare", "Energy", "Tech & Innovation", "Retail & Trade"];

const fmt = (n: number, c = "XOF") => new Intl.NumberFormat("fr-FR").format(n) + " " + c;

export default function ExplorePage() {
  const [projects, setProjects] = useState<DiscoverProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { (async () => { const { data } = await campaignProvider.discover(); if (data) setProjects(data); setLoading(false); })(); }, []);

  const filtered = useMemo(() => projects.filter((p) => {
    const sector = p.company?.industry_sector ?? p.category ?? "";
    if (sectorFilter !== "All" && sector !== sectorFilter) return false;
    if (search) { const q = search.toLowerCase(); if (!p.title.toLowerCase().includes(q) && !(p.company?.legal_name ?? "").toLowerCase().includes(q) && !sector.toLowerCase().includes(q)) return false; }
    return true;
  }), [projects, search, sectorFilter]);

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-black/5">
        <div className="max-w-7xl mx-auto px-8 lg:px-12 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><path d="M2 24L8 6L14 24L20 6L26 24" stroke="#C2410C" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 24L14 12L20 24" stroke="#C2410C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/></svg>
            <span className="text-lg font-bold text-black">MIDAAS</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/auth/signin" className="text-sm text-black/50 hover:text-primary transition-colors font-medium">Se connecter</Link>
            <Link href="/auth/signup" className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-all shadow-sm shadow-primary/25">Investir <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          <button className="md:hidden text-black/50" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{mobileOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <><path d="M4 6h16M4 12h16M4 18h16" /></>}</svg>
          </button>
        </div>
      </header>

      <section className="pt-32 pb-12 px-8 lg:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-black tracking-tight">Explorez les <span className="text-primary">projets verifies</span></h1>
          <p className="mt-3 text-black/40 max-w-xl mx-auto text-sm">Parcourez les initiatives validees par notre equipe. Aucun compte requis.</p>
        </div>
      </section>

      <section className="pb-8 px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
            <input type="text" placeholder="Rechercher par nom, secteur..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-sm border border-black/10 rounded-xl bg-white text-black placeholder:text-black/20 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
          </div>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {CATEGORIES.map((s) => (
              <button key={s} onClick={() => setSectorFilter(s)}
                className={twMerge("px-3.5 py-1.5 text-xs rounded-lg border transition-colors font-medium", sectorFilter === s ? "bg-primary text-white border-primary" : "bg-white text-black/40 border-black/10 hover:border-primary hover:text-primary")}>{s}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-black/10 border-t-primary rounded-full animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-black/30 text-sm">Aucun projet ne correspond.</p>
              <button onClick={() => { setSearch(""); setSectorFilter("All"); }} className="mt-3 text-xs text-primary hover:underline font-medium">Reinitialiser les filtres</button>
            </div>
          ) : (
            <>
              <p className="text-xs text-black/30 mb-6">{filtered.length} projet{filtered.length > 1 ? "s" : ""} trouve{filtered.length > 1 ? "s" : ""}</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((p) => {
                  const sector = p.company?.industry_sector ?? p.category ?? "";
                  const progress = p.funding_goal > 0 ? Math.round(((p.funding_raised ?? 0) / p.funding_goal) * 100) : 0;
                  return (
                    <div key={p.id} className="group bg-white border border-black/5 rounded-xl p-6 hover:border-primary/20 hover:shadow-md transition-all flex flex-col">
                      <h3 className="font-semibold text-black text-sm truncate">{p.title}</h3>
                      {p.company && <p className="text-xs text-black/30 mt-1 truncate">{p.company.trade_name || p.company.legal_name} · {p.company.corporate_form}</p>}
                      {sector && <div className="mt-3"><span className="inline-block px-2.5 py-0.5 text-[10px] font-semibold rounded-md border bg-primary/5 text-primary border-primary/15">{sector}</span></div>}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs mb-1.5"><span className="text-black/70 font-semibold">{fmt(p.funding_raised ?? 0, p.currency)}</span><span className="text-black/30">sur {fmt(p.funding_goal, p.currency)}</span></div>
                        <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden"><div className={`h-full rounded-full ${progress >= 100 ? "bg-primary" : "bg-primary/60"}`} style={{ width: `${Math.min(progress, 100)}%` }} /></div>
                        <p className="text-right text-[10px] text-black/30 mt-1">{progress}%</p>
                      </div>
                      {p.company?.physical_address && <div className="flex items-center gap-1 mt-3 text-xs text-black/30"><MapPin className="w-3 h-3" /> {p.company.physical_address}</div>}
                      {(p.short_term_roi || p.medium_term_roi) && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {p.short_term_roi && <span className="px-2 py-0.5 text-[10px] font-semibold bg-primary/5 text-primary border border-primary/15 rounded-md">{p.short_term_roi}% CT</span>}
                          {p.medium_term_roi && <span className="px-2 py-0.5 text-[10px] font-semibold bg-primary/5 text-primary border border-primary/15 rounded-md">{p.medium_term_roi}% MT</span>}
                          {p.long_term_roi && <span className="px-2 py-0.5 text-[10px] font-semibold bg-primary/5 text-primary border border-primary/15 rounded-md">{p.long_term_roi}% LT</span>}
                        </div>
                      )}
                      <div className="flex-1" />
                      <Link href="/auth/signup" className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors opacity-0 group-hover:opacity-100">
                        S&apos;inscrire pour investir <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      <footer className="bg-[#0A0A0A] border-t border-white/5 py-10 px-8 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none"><path d="M2 24L8 6L14 24L20 6L26 24" stroke="#C2410C" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 24L14 12L20 24" stroke="#C2410C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/></svg>
            <span className="text-sm font-bold text-white/30">MIDAAS</span>
          </div>
          <p className="text-xs text-white/10">&copy; {new Date().getFullYear()} Midaas</p>
          <div className="flex gap-8">
            <Link href="/" className="text-xs text-white/10 hover:text-white/30">Accueil</Link>
            <Link href="/auth/signin" className="text-xs text-white/10 hover:text-white/30">Connexion</Link>
            <Link href="/auth/signup" className="text-xs text-white/10 hover:text-white/30">Inscription</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
