"use client";

import { useEffect, useState } from "react";
import { adminProvider, type AdminEntrepreneurItem } from "@/api/admin";
import { useAdminStore } from "@/store/admin";
import { ModalNames, useModalStore } from "@/store/modal";
import { Button } from "@/components/atoms/button";
import {
  Users,
  Search,
  RefreshCw,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  Shield,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { toast } from "react-toastify";

export default function AdminEntrepreneursPage() {
  const { entrepreneurs, setEntrepreneurs, setEntrepreneursLoading } =
    useAdminStore();
  const { openModal } = useModalStore();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchEntrepreneurs = async () => {
    setLoading(true);
    setEntrepreneursLoading(true);
    const { data, error } = await adminProvider.getEntrepreneurs();
    if (data) {
      setEntrepreneurs(data);
    } else {
      toast.error(error || "Erreur lors du chargement");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (entrepreneurs.length === 0) {
      fetchEntrepreneurs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = entrepreneurs.filter((e) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.user?.full_name?.toLowerCase().includes(q) ||
      e.user?.email?.toLowerCase().includes(q) ||
      e.status?.toLowerCase().includes(q)
    );
  });

  const activeCount = entrepreneurs.filter((e) => e.status === "active").length;
  const suspendedCount = entrepreneurs.filter(
    (e) => e.status === "suspended",
  ).length;

  const handleSuspend = (ent: AdminEntrepreneurItem) => {
    openModal({
      name: ModalNames.CONFIRM_ACTION,
      data: {
        type: "suspend_entrepreneur",
        title: "Suspendre l'entrepreneur",
        description: `Êtes-vous sûr de vouloir suspendre "${ent.user?.full_name}" ? Il ne pourra plus gérer ses entreprises.`,
        itemId: ent.id,
        onConfirm: async () => {
          const { data, error } = await adminProvider.suspendEntrepreneur(
            ent.id,
          );
          if (data) {
            useAdminStore
              .getState()
              .updateEntrepreneurStatus(ent.id, "suspended");
            toast.success("Entrepreneur suspendu");
          } else {
            toast.error(error || "Erreur lors de la suspension");
          }
        },
      },
    });
  };

  const handleActivate = (ent: AdminEntrepreneurItem) => {
    openModal({
      name: ModalNames.CONFIRM_ACTION,
      data: {
        type: "activate_entrepreneur",
        title: "Activer l'entrepreneur",
        description: `Voulez-vous réactiver "${ent.user?.full_name}" ?`,
        itemId: ent.id,
        onConfirm: async () => {
          const { data, error } = await adminProvider.activateEntrepreneur(
            ent.id,
          );
          if (data) {
            useAdminStore.getState().updateEntrepreneurStatus(ent.id, "active");
            toast.success("Entrepreneur activé");
          } else {
            toast.error(error || "Erreur lors de l'activation");
          }
        },
      },
    });
  };

  return (
    <section className="p-6">
      <div className="max-w-[1400px] mx-auto mt-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-MontserratBold text-gray-900">
              Entrepreneurs
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Gérez les profils entrepreneurs de la plateforme
            </p>
          </div>
          <Button
            onClick={fetchEntrepreneurs}
            variant="outline"
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un entrepreneur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00de00]/20 focus:border-[#00de00] transition-all"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Total</p>
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                <Users className="w-4 h-4 text-gray-600" />
              </div>
            </div>
            <p className="text-2xl font-bold mt-2">{entrepreneurs.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Actifs</p>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl font-bold mt-2 text-emerald-600">
              {activeCount}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Suspendus</p>
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                <UserX className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <p className="text-2xl font-bold mt-2 text-red-600">
              {suspendedCount}
            </p>
          </div>
        </div>

        {/* Entrepreneurs List */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          {loading && entrepreneurs.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-300" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="flex flex-col items-center gap-3">
                <Users className="w-16 h-16 text-gray-200" />
                <p className="text-gray-500 font-MontserratSemiBold text-lg">
                  Aucun entrepreneur trouvé
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((ent) => (
                <div
                  key={ent.id}
                  className="p-5 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center flex-shrink-0 border border-emerald-100">
                        <Users className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-MontserratSemiBold text-gray-900">
                            {ent.user?.full_name || "Utilisateur inconnu"}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                              ent.status === "active"
                                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                : "bg-red-100 text-red-800 border-red-200"
                            }`}
                          >
                            {ent.status === "active" ? (
                              <UserCheck className="w-3 h-3" />
                            ) : (
                              <UserX className="w-3 h-3" />
                            )}
                            {ent.status === "active" ? "Actif" : "Suspendu"}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 flex-wrap">
                          {ent.user?.email && (
                            <span className="inline-flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5" />
                              {ent.user.email}
                            </span>
                          )}
                          {ent.user?.phone_number && (
                            <>
                              <span className="text-gray-300">·</span>
                              <span className="inline-flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5" />
                                {ent.user.phone_number}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {ent.status === "active" ? (
                        <Button
                          onClick={() => handleSuspend(ent)}
                          size="sm"
                          variant="destructive"
                          className="gap-1.5"
                        >
                          <ToggleLeft className="w-4 h-4" />
                          Suspendre
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleActivate(ent)}
                          size="sm"
                          className="gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                        >
                          <ToggleRight className="w-4 h-4" />
                          Activer
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
