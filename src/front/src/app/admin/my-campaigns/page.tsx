"use client";

import { campaignProvider } from "@/api/campaigns";
import { Button } from "@/components/atoms/button";
import useGetCampaigns from "@/hooks/useCampaigns";
import Project from "@/entities/project/project";
import { useCampaignsStore } from "@/store/campaigns";
import { ModalNames, useModalStore } from "@/store/modal";
import { useMemo, useState } from "react";
import { Plus, Eye, Edit3, Search, TrendingUp, Layers, ChevronDown, ChevronUp } from "lucide-react";

export default function MyCampaignsPage() {
  useGetCampaigns({ page: 1 });
  const { campaigns, count } = useCampaignsStore();
  const { openModal } = useModalStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => campaigns.filter((c) => {
    const q = search.trim().toLowerCase();
    return (!q || c.title.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q)) && (statusFilter === "all" || c.status === statusFilter);
  }), [campaigns, search, statusFilter]);

  const totalRaised = campaigns.reduce((s, c) => s + c.fundingRaised, 0);
  const activeCount = campaigns.filter((c) => c.status === "active").length;

  return (
    <div className="max-w-7xl mx-auto py-10 px-8 space-y-10">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-2">Entrepreneur</p>
          <h1 className="text-3xl font-bold text-black">Mes campagnes</h1>
          <p className="text-black/40 text-sm mt-2">Gerer vos projets de financement</p>
        </div>
        <Button onClick={() => openModal({ name: ModalNames.ADD_CAMPAIGN })} className="gap-2"><Plus className="w-4 h-4" />Nouvelle campagne</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Total", value: count, icon: Layers },
          { label: "Actives", value: activeCount, icon: TrendingUp },
          { label: "Fonds leves", value: `${totalRaised.toLocaleString()} XOF`, icon: TrendingUp },
          { label: "Terminees", value: campaigns.filter((c) => c.status === "completed" || c.status === "funded").length, icon: Layers },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-black/5">
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center mb-4"><s.icon className="w-5 h-5 text-primary" /></div>
            <p className="text-2xl font-bold text-black">{s.value}</p>
            <p className="text-sm text-black/40 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 text-sm text-black/40 hover:text-black/60">{showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}Filtres</button>
      {showFilters && (
        <div className="flex gap-4 flex-wrap">
          <div className="relative flex-1 max-w-sm"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" /><input type="text" placeholder="Titre, categorie..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl border border-black/10 bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all" /></div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-3 rounded-xl border border-black/10 bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none">
            <option value="all">Tous les statuts</option>
            <option value="draft">Brouillon</option>
            <option value="pending">En attente</option>
            <option value="active">Actif</option>
            <option value="funded">Finance</option>
            <option value="completed">Termine</option>
            <option value="blocked">Bloque</option>
            <option value="rejected">Rejete</option>
          </select>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-20"><Layers className="w-12 h-12 text-black/10 mx-auto mb-3" /><p className="text-black/40 font-medium">Aucune campagne</p><p className="text-black/20 text-sm mt-1">Creez votre premiere campagne</p></div>
        ) : (
          <div className="divide-y divide-black/5">
            {filtered.map((c) => (
              <div key={c.id} className="flex items-center justify-between px-6 py-5 hover:bg-black/[0.01] transition-colors">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 overflow-hidden">{c.coverImageUrl ? <img src={c.coverImageUrl} alt="" className="w-full h-full object-cover" /> : <Layers className="w-5 h-5 text-primary/40" />}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-black truncate">{c.title}</p>
                    <p className="text-xs text-black/30 mt-0.5">{c.category || "—"} · {c.fundingGoal.toLocaleString()} {c.currency} · {c.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="hidden sm:flex items-center gap-2"><div className="w-20 h-1.5 bg-black/5 rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(c.progressPercentage, 100)}%` }} /></div><span className="text-xs text-black/40 w-8">{c.progressPercentage}%</span></div>
                  <span className="text-xs bg-primary/5 text-primary px-3 py-1 rounded-full font-medium">{c.statusLabel}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => { openModal({ name: ModalNames.CAMPAIGN_DETAILS, data: { campaign: c } }); }}><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => { openModal({ name: ModalNames.EDIT_CAMPAIGN, data: { campaign: c, type: "edit" } }); }}><Edit3 className="w-4 h-4" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
