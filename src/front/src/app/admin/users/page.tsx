"use client";

import { useEffect, useState } from "react";
import { adminProvider } from "@/api/admin";
import { useAdminStore } from "@/store/admin";
import { Button } from "@/components/atoms/button";
import { Users, Search, RefreshCw, Mail, Phone, ChevronDown, ChevronUp, BadgeCheck, BadgeX } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminUsersPage() {
  const { users, setUsers, setUsersLoading } = useAdminStore();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const fetchUsers = async () => {
    setLoading(true); setUsersLoading(true);
    const { data, error } = await adminProvider.getUsers();
    if (data) setUsers(data); else toast.error(error || "Erreur");
    setLoading(false);
  };

  useEffect(() => { if (users.length === 0) fetchUsers(); }, []);

  const filtered = users.filter((u) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return u.full_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.phone_number?.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto py-10 px-8 space-y-10">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-2">Administration</p>
          <h1 className="text-3xl font-bold text-black">Utilisateurs</h1>
          <p className="text-black/40 text-sm mt-2">Tous les utilisateurs de la plateforme</p>
        </div>
        <Button onClick={fetchUsers} variant="outline" disabled={loading} className="gap-2"><RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />Actualiser</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-black/5"><p className="text-3xl font-bold text-black">{users.length}</p><p className="text-sm text-black/40 mt-1">Total</p></div>
        <div className="bg-white rounded-2xl p-6 border border-black/5"><p className="text-3xl font-bold text-black">{users.filter((u) => u.is_entrepreneur).length}</p><p className="text-sm text-black/40 mt-1">Entrepreneurs</p></div>
        <div className="bg-white rounded-2xl p-6 border border-black/5"><p className="text-3xl font-bold text-black">{users.filter((u) => u.id_card_url).length}</p><p className="text-sm text-black/40 mt-1">KYC verifie</p></div>
      </div>

      <button onClick={() => setShowSearch(!showSearch)} className="flex items-center gap-2 text-sm text-black/40 hover:text-black/60">{showSearch ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}Rechercher</button>
      {showSearch && (
        <div className="relative max-w-md"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" /><input type="text" placeholder="Nom, email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl border border-black/10 bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all" /></div>
      )}

      <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
        {loading && users.length === 0 ? (
          <div className="flex items-center justify-center py-20"><RefreshCw className="w-8 h-8 animate-spin text-black/10" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20"><Users className="w-12 h-12 text-black/10 mx-auto mb-3" /><p className="text-black/40 font-medium">Aucun utilisateur</p></div>
        ) : (
          <div className="divide-y divide-black/5">
            {filtered.map((u) => (
              <div key={u.id} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 gap-4 hover:bg-black/[0.01] transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><Users className="w-5 h-5 text-primary" /></div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-black truncate">{u.full_name || "N/A"}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs text-black/30 flex items-center gap-1"><Mail className="w-3 h-3" />{u.email || "—"}</span>
                      {u.phone_number && <span className="text-xs text-black/30 flex items-center gap-1"><Phone className="w-3 h-3" />{u.phone_number}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {u.is_entrepreneur && <span className="text-xs font-medium bg-primary/5 text-primary px-2.5 py-0.5 rounded-full flex items-center gap-1"><BadgeCheck className="w-3 h-3" />Entrepreneur</span>}
                  {u.id_card_url ? (
                    <span className="text-xs text-black/40 flex items-center gap-1"><BadgeCheck className="w-3 h-3 text-primary/60" />KYC OK</span>
                  ) : (
                    <span className="text-xs text-black/20 flex items-center gap-1"><BadgeX className="w-3 h-3" />Sans KYC</span>
                  )}
                  <span className="text-xs text-black/20">{u.created_at ? new Date(u.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
