"use client";

import { useEffect, useState } from "react";
import { adminProvider } from "@/api/admin";
import { useAdminStore } from "@/store/admin";
import { Button } from "@/components/atoms/button";
import Link from "next/link";
import { Building2, Search, RefreshCw, ChevronRight, CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminPendingCompaniesPage() {
  const { pendingCompanies, setPendingCompanies, setPendingCompaniesLoading } = useAdminStore();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchCompanies = async () => {
    setLoading(true); setPendingCompaniesLoading(true);
    const { data, error } = await adminProvider.getPendingCompanies();
    if (data) setPendingCompanies(data); else toast.error(error || "Erreur");
    setLoading(false);
  };

  useEffect(() => { if (pendingCompanies.length === 0) fetchCompanies(); }, []);

  const filtered = pendingCompanies.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.legal_name?.toLowerCase().includes(q) || c.trade_name?.toLowerCase().includes(q) || c.entrepreneur?.user?.full_name?.toLowerCase().includes(q);
  });

  const pendingCount = pendingCompanies.filter((c) => c.status === "pending").length;
  const reverifyCount = pendingCompanies.filter((c) => c.status === "reverify_requested").length;

  return (
    <div className="max-w-7xl mx-auto py-10 px-8 space-y-10">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-2">Administration</p>
          <h1 className="text-3xl font-bold text-black">File d&apos;attente</h1>
          <p className="text-black/40 text-sm mt-2">Examiner les demandes d&apos;enregistrement d&apos;entreprises</p>
        </div>
        <Button onClick={fetchCompanies} variant="outline" disabled={loading} className="gap-2"><RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />Actualiser</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {[
          { label: "En attente", value: pendingCount },
          { label: "Re-verification", value: reverifyCount },
          { label: "Total", value: pendingCompanies.length },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-black/5">
            <p className="text-3xl font-bold text-black">{s.value}</p>
            <p className="text-sm text-black/40 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 text-sm text-black/40 hover:text-black/60 transition-colors">
        {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        Rechercher
      </button>
      {showFilters && (
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
          <input type="text" placeholder="Nom, secteur..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-black/10 bg-white text-sm text-black placeholder:text-black/20 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
        {loading && pendingCompanies.length === 0 ? (
          <div className="flex items-center justify-center py-20"><RefreshCw className="w-8 h-8 animate-spin text-black/10" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20"><CheckCircle2 className="w-12 h-12 text-black/10 mx-auto mb-3" /><p className="text-black/40 font-medium">Aucune entreprise en attente</p><p className="text-black/20 text-sm mt-1">Toutes les demandes ont ete traitees</p></div>
        ) : (
          <div className="divide-y divide-black/5">
            {filtered.map((c) => (
              <Link key={c.id} href={`/admin/companies/pending/${c.id}`} className="flex items-center justify-between px-6 py-5 hover:bg-black/[0.01] transition-colors group">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0"><Building2 className="w-5 h-5 text-primary/60" /></div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-black truncate">{c.trade_name || c.legal_name}</p>
                    <p className="text-xs text-black/30 mt-0.5">{c.corporate_form} · {c.industry_sector || ""}{c.entrepreneur?.user?.full_name ? ` · ${c.entrepreneur.user.full_name}` : ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-medium bg-primary/5 text-primary px-3 py-1 rounded-full">{c.status === "pending" ? "En attente" : "Re-verification"}</span>
                  <ChevronRight className="w-4 h-4 text-black/10 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
