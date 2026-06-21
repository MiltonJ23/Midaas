"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { investmentProvider, type InvestmentItem } from "@/api/investments";
import { TrendingUp, ArrowUpRight, Clock, CheckCircle, Briefcase } from "lucide-react";

export default function PortfolioPage() {
  const [investments, setInvestments] = useState<InvestmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await investmentProvider.getMyInvestments();
      if (data) setInvestments(data);
      setLoading(false);
    })();
  }, []);

  const totalInvested = investments.reduce((s, i) => s + (i.amount || 0), 0);
  const activeCount = investments.filter((i) => i.status === "active" || i.status === "completed").length;

  return (
    <div className="max-w-5xl mx-auto py-10 px-8 space-y-10">
      <div>
        <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-2">Investisseur</p>
        <h1 className="text-3xl font-bold text-black">Mon portefeuille</h1>
        <p className="text-black/40 text-sm mt-2">Suivez vos investissements</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-black/5">
          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center mb-4"><TrendingUp className="w-5 h-5 text-primary" /></div>
          <p className="text-2xl font-bold text-black">{totalInvested.toLocaleString()} XOF</p>
          <p className="text-sm text-black/40 mt-1">Total investi</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-black/5">
          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center mb-4"><Briefcase className="w-5 h-5 text-primary" /></div>
          <p className="text-2xl font-bold text-black">{investments.length}</p>
          <p className="text-sm text-black/40 mt-1">Investissements</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-black/10 border-t-primary rounded-full animate-spin" /></div>
        ) : investments.length === 0 ? (
          <div className="text-center py-20"><Briefcase className="w-12 h-12 text-black/10 mx-auto mb-3" /><p className="text-black/40 font-medium">Aucun investissement</p><p className="text-black/20 text-sm mt-1">Explorez les projets et commencez a investir</p><Link href="/admin/projects" className="inline-flex items-center gap-2 mt-4 text-sm text-primary hover:underline font-medium">Explorer les projets <ArrowUpRight className="w-3.5 h-3.5" /></Link></div>
        ) : (
          <div className="divide-y divide-black/5">
            {investments.map((inv) => (
              <Link key={inv.id} href={`/projects/${inv.project_id}`} className="flex items-center justify-between px-6 py-5 hover:bg-black/[0.01] transition-colors group">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0"><TrendingUp className="w-5 h-5 text-primary/60" /></div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-black truncate">{inv.project?.title || `Projet ${inv.project_id?.slice(0, 8)}`}</p>
                    <p className="text-xs text-black/30 mt-0.5">{new Date(inv.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-black">{inv.amount?.toLocaleString()} {inv.currency}</p>
                    {inv.fee_amount > 0 && <p className="text-[10px] text-black/30">dont {inv.fee_amount?.toLocaleString()} {inv.currency} frais</p>}
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${inv.status === "completed" ? "bg-primary/5 text-primary" : "bg-black/5 text-black/40"}`}>
                    {inv.status === "completed" ? <CheckCircle className="w-3 h-3 inline mr-1" /> : <Clock className="w-3 h-3 inline mr-1" />}
                    {inv.status === "completed" ? "Confirme" : inv.status}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-black/10 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
