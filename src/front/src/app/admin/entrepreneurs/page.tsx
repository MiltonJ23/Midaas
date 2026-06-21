"use client";

import { useEffect, useState } from "react";
import { adminProvider, type AdminEntrepreneurItem } from "@/api/admin";
import { useAdminStore } from "@/store/admin";
import { ModalNames, useModalStore } from "@/store/modal";
import { Button } from "@/components/atoms/button";
import { Users, Search, RefreshCw, ChevronDown, ChevronUp, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "react-toastify";

function nameFrom(ent: AdminEntrepreneurItem) {
  return ent.user?.full_name?.trim() || ent.user?.email?.trim() || `Entrepreneur ${ent.id.slice(0, 8)}`;
}

export default function AdminEntrepreneursPage() {
  const { entrepreneurs, setEntrepreneurs, setEntrepreneursLoading } = useAdminStore();
  const { openModal } = useModalStore();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const fetchEntrepreneurs = async () => {
    setLoading(true); setEntrepreneursLoading(true);
    const { data, error } = await adminProvider.getEntrepreneurs();
    if (data) setEntrepreneurs(data); else toast.error(error || "Erreur");
    setLoading(false);
  };

  useEffect(() => { if (entrepreneurs.length === 0) fetchEntrepreneurs(); }, []);

  const filtered = entrepreneurs.filter((e) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return nameFrom(e).toLowerCase().includes(q) || e.status?.toLowerCase().includes(q);
  });

  const activeCount = entrepreneurs.filter((e) => e.status === "active").length;

  const handleSuspend = (ent: AdminEntrepreneurItem) => openModal({ name: ModalNames.CONFIRM_ACTION, data: { title: "Suspendre", description: `Suspendre "${nameFrom(ent)}" ?`, itemId: ent.id, onConfirm: async () => { const { data, error } = await adminProvider.suspendEntrepreneur(ent.id); if (data) { useAdminStore.getState().updateEntrepreneurStatus(ent.id, "suspended"); toast.success("Suspendu"); } else toast.error(error || "Erreur"); } } });
  const handleActivate = (ent: AdminEntrepreneurItem) => openModal({ name: ModalNames.CONFIRM_ACTION, data: { title: "Activer", description: `Reactiver "${nameFrom(ent)}" ?`, itemId: ent.id, onConfirm: async () => { const { data, error } = await adminProvider.activateEntrepreneur(ent.id); if (data) { useAdminStore.getState().updateEntrepreneurStatus(ent.id, "active"); toast.success("Active"); } else toast.error(error || "Erreur"); } } });

  return (
    <div className="max-w-7xl mx-auto py-10 px-8 space-y-10">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-2">Administration</p>
          <h1 className="text-3xl font-bold text-black">Entrepreneurs</h1>
          <p className="text-black/40 text-sm mt-2">Gerer les profils entrepreneurs</p>
        </div>
        <Button onClick={fetchEntrepreneurs} variant="outline" disabled={loading} className="gap-2"><RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />Actualiser</Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-black/5"><p className="text-3xl font-bold text-black">{entrepreneurs.length}</p><p className="text-sm text-black/40 mt-1">Total</p></div>
        <div className="bg-white rounded-2xl p-6 border border-black/5"><p className="text-3xl font-bold text-black">{activeCount}</p><p className="text-sm text-black/40 mt-1">Actifs</p></div>
      </div>

      <button onClick={() => setShowSearch(!showSearch)} className="flex items-center gap-2 text-sm text-black/40 hover:text-black/60">{showSearch ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}Rechercher</button>
      {showSearch && (
        <div className="relative max-w-md"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" /><input type="text" placeholder="Nom..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl border border-black/10 bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all" /></div>
      )}

      <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
        {loading && entrepreneurs.length === 0 ? (
          <div className="flex items-center justify-center py-20"><RefreshCw className="w-8 h-8 animate-spin text-black/10" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20"><Users className="w-12 h-12 text-black/10 mx-auto mb-3" /><p className="text-black/40 font-medium">Aucun entrepreneur</p></div>
        ) : (
          <div className="divide-y divide-black/5">
            {filtered.map((ent) => (
              <div key={ent.id} className="flex items-center justify-between px-6 py-5 hover:bg-black/[0.01] transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0"><Users className="w-5 h-5 text-primary/60" /></div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3"><p className="text-sm font-medium text-black truncate">{nameFrom(ent)}</p><span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${ent.status === "active" ? "bg-primary/5 text-primary" : "bg-red-50 text-red-600"}`}>{ent.status === "active" ? "Actif" : "Suspendu"}</span></div>
                    <p className="text-xs text-black/30 mt-0.5">ID: {ent.id.slice(0, 8)}...</p>
                  </div>
                </div>
                {ent.status === "active" ? (
                  <Button onClick={() => handleSuspend(ent)} size="sm" variant="outline" className="gap-1.5 text-red-500 border-red-200 hover:bg-red-50"><ToggleLeft className="w-4 h-4" />Suspendre</Button>
                ) : (
                  <Button onClick={() => handleActivate(ent)} size="sm" variant="outline" className="gap-1.5"><ToggleRight className="w-4 h-4" />Activer</Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
