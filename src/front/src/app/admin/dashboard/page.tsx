"use client";

import { useAuthStore } from "@/store/auth";
import { useAdminStore } from "@/store/admin";
import { useCompanyStore } from "@/store/company";
import { useCampaignsStore } from "@/store/campaigns";
import { ModalNames, useModalStore } from "@/store/modal";
import OnboardingBanner from "@/components/molecules/onboarding-banner";
import useGetCampaigns from "@/hooks/useCampaigns";
import useGetCompanies from "@/hooks/useCompanies";
import { Button } from "@/components/atoms/button";
import { useEffect, useState } from "react";
import { Building2, TrendingUp, Plus, Eye, Briefcase, Users, ArrowRight, Layers, Target, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { adminProvider } from "@/api/admin";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { pendingCompanies, entrepreneurs, users, setPendingCompanies, setEntrepreneurs, setUsers } = useAdminStore();
  const { companies, count: companyCount } = useCompanyStore();
  const { campaigns, count: campaignCount } = useCampaignsStore();
  const { openModal } = useModalStore();
  const [showCompanies, setShowCompanies] = useState(true);
  const [showCampaigns, setShowCampaigns] = useState(true);

  useGetCampaigns({ page: 1 });
  useGetCompanies();

  const isAdmin = user?.role === "admin";
  const isEntrepreneur = user?.isEntrepreneur ?? false;
  const entrepreneurStatus = user?.entrepreneurStatus;
  const isPendingEntrepreneur = entrepreneurStatus === "pending";
  const isActiveEntrepreneur = isEntrepreneur && entrepreneurStatus === "active";

  const totalFundingRaised = campaigns.reduce((sum, c) => sum + c.fundingRaised, 0);
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;

  useEffect(() => {
    if (!isAdmin) return;
    if (pendingCompanies.length === 0) adminProvider.getPendingCompanies().then(({ data }) => { if (data) setPendingCompanies(data); });
    if (entrepreneurs.length === 0) adminProvider.getEntrepreneurs().then(({ data }) => { if (data) setEntrepreneurs(data); });
    if (users.length === 0) adminProvider.getUsers().then(({ data }) => { if (data) setUsers(data); });
  }, [isAdmin]);

  const handleAddCompany = () => openModal({ name: ModalNames.ADD_COMPANY });
  const handleAddCampaign = () => openModal({ name: ModalNames.ADD_CAMPAIGN });

  const pendingReviewCount = pendingCompanies.filter((c) => c.status === "pending" || c.status === "reverify_requested").length;

  // ═══ ADMIN VIEW ══════════════════════════════════════════
  if (isAdmin) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-8 space-y-12">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-2">Administration</p>
          <h1 className="text-3xl font-bold text-black">Tableau de bord</h1>
          <p className="text-black/40 text-sm mt-2">Gerer les entreprises, entrepreneurs et utilisateurs</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "En attente", value: pendingReviewCount, icon: Clock, href: "/admin/companies/pending" },
            { label: "Entreprises", value: pendingCompanies.length, icon: Building2, href: "/admin/companies/pending" },
            { label: "Entrepreneurs", value: entrepreneurs.length, icon: UserCheck, href: "/admin/entrepreneurs" },
            { label: "Utilisateurs", value: users.length, icon: Users, href: "/admin/users" },
          ].map((s, i) => (
            <Link key={i} href={s.href} className="group bg-white rounded-2xl p-6 border border-black/5 hover:border-primary/20 hover:shadow-sm transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <ArrowRight className="w-4 h-4 text-black/10 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-3xl font-bold text-black">{s.value}</p>
              <p className="text-sm text-black/40 mt-1">{s.label}</p>
            </Link>
          ))}
        </div>

        {pendingCompanies.length > 0 && (
          <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
            <button onClick={() => setShowCompanies(!showCompanies)} className="w-full flex items-center justify-between p-6 hover:bg-black/[0.01] transition-colors">
              <div>
                <h2 className="text-lg font-semibold text-black">Demandes en attente</h2>
                <p className="text-sm text-black/40 mt-0.5">{pendingReviewCount} entreprise(s) en attente de validation</p>
              </div>
              {showCompanies ? <ChevronUp className="w-5 h-5 text-black/20" /> : <ChevronDown className="w-5 h-5 text-black/20" />}
            </button>
            {showCompanies && (
              <div className="border-t border-black/5 divide-y divide-black/5">
                {pendingCompanies.slice(0, 8).map((c) => (
                  <Link key={c.id} href={`/admin/companies/pending/${c.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-black/[0.01] transition-colors group">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0"><Building2 className="w-5 h-5 text-primary/60" /></div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-black truncate">{c.trade_name || c.legal_name}</p>
                        <p className="text-xs text-black/30 mt-0.5">{c.corporate_form}{c.entrepreneur?.user?.full_name ? ` · ${c.entrepreneur.user.full_name}` : ""}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-primary bg-primary/5 px-3 py-1 rounded-full shrink-0">{c.status === "pending" ? "En attente" : "Re-verification"}</span>
                  </Link>
                ))}
                <div className="px-6 py-4 text-center">
                  <Link href="/admin/companies/pending" className="text-sm font-medium text-primary hover:underline">Voir tout</Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ═══ ENTREPRENEUR PENDING ════════════════════════════════
  if (isPendingEntrepreneur) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-6">
          <Briefcase className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-black mb-3">Demande en cours de validation</h1>
        <p className="text-black/40 leading-relaxed">Votre demande de passage en mode entrepreneur a ete soumise. Un administrateur va verifier vos informations. Vous recevrez une notification des que votre statut sera actif.</p>
      </div>
    );
  }

  // ═══ INVESTOR / ACTIVE ENTREPRENEUR ══════════════════════
  return (
    <div className="max-w-7xl mx-auto py-10 px-8 space-y-12">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-2">{isActiveEntrepreneur ? "Entrepreneur" : "Investisseur"}</p>
          <h1 className="text-3xl font-bold text-black">Tableau de bord</h1>
          <p className="text-black/40 text-sm mt-2">{isActiveEntrepreneur ? "Gerer vos entreprises et campagnes" : "Explorer les opportunites d'investissement"}</p>
        </div>
        {isActiveEntrepreneur && (
          <div className="flex gap-3">
            <Button onClick={handleAddCompany} variant="outline" className="gap-2"><Building2 className="w-4 h-4" />Nouvelle entreprise</Button>
            <Button onClick={handleAddCampaign} className="gap-2"><Plus className="w-4 h-4" />Nouvelle campagne</Button>
          </div>
        )}
      </div>

      {!isEntrepreneur && !isPendingEntrepreneur && <OnboardingBanner />}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {isActiveEntrepreneur ? (
          <>
            {[
              { label: "Mes entreprises", value: companyCount, icon: Building2 },
              { label: "Mes campagnes", value: campaignCount, icon: Layers },
              { label: "Campagnes actives", value: activeCampaigns, icon: TrendingUp },
              { label: "Total collecte", value: `${totalFundingRaised.toLocaleString()} XOF`, icon: Target },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-black/5">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center mb-4"><s.icon className="w-5 h-5 text-primary" /></div>
                <p className="text-2xl font-bold text-black">{s.value}</p>
                <p className="text-sm text-black/40 mt-1">{s.label}</p>
              </div>
            ))}
          </>
        ) : (
          <>
            {[
              { label: "Projets disponibles", value: campaignCount, icon: Layers },
              { label: "Montant total leve", value: `${totalFundingRaised.toLocaleString()} XOF`, icon: TrendingUp },
              { label: "Projets actifs", value: activeCampaigns, icon: Target },
              { label: "Investisseurs", value: "—", icon: Users },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-black/5">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center mb-4"><s.icon className="w-5 h-5 text-primary" /></div>
                <p className="text-2xl font-bold text-black">{s.value}</p>
                <p className="text-sm text-black/40 mt-1">{s.label}</p>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Companies (collapsible) */}
      {isActiveEntrepreneur && (
        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
          <button onClick={() => setShowCompanies(!showCompanies)} className="w-full flex items-center justify-between p-6 hover:bg-black/[0.01]">
            <div><h2 className="text-lg font-semibold text-black">Mes entreprises</h2><p className="text-sm text-black/40 mt-0.5">Gerer les entreprises liees a vos campagnes</p></div>
            <div className="flex items-center gap-3">{showCompanies ? <ChevronUp className="w-5 h-5 text-black/20" /> : <ChevronDown className="w-5 h-5 text-black/20" />}</div>
          </button>
          {showCompanies && (
            <div className="border-t border-black/5">
              {companies.length > 0 ? (
                <div className="divide-y divide-black/5">
                  {companies.map((c) => (
                    <div key={c.id} className="flex items-center justify-between px-6 py-4 hover:bg-black/[0.01] transition-colors">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0"><Building2 className="w-5 h-5 text-primary/60" /></div>
                        <div><p className="text-sm font-medium text-black">{c.displayName}</p><p className="text-xs text-black/30 mt-0.5">{c.corporateForm} · {c.industrySector || "Non specifie"}</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs bg-primary/5 text-primary px-3 py-1 rounded-full font-medium">{c.statusLabel}</span>
                        <Link href={`/admin/companies/${c.id}`}><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16"><Building2 className="w-10 h-10 text-black/10 mx-auto mb-3" /><p className="text-black/40 font-medium">Aucune entreprise creee</p><p className="text-black/20 text-sm mt-1">Creez votre premiere entreprise pour lancer des campagnes</p><Button onClick={handleAddCompany} className="mt-4 gap-2"><Plus className="w-4 h-4" />Creer une entreprise</Button></div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Campaigns (collapsible) */}
      <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
        <button onClick={() => setShowCampaigns(!showCampaigns)} className="w-full flex items-center justify-between p-6 hover:bg-black/[0.01]">
          <div><h2 className="text-lg font-semibold text-black">{isActiveEntrepreneur ? "Mes campagnes" : "Campagnes recentes"}</h2><p className="text-sm text-black/40 mt-0.5">{isActiveEntrepreneur ? "Apercu de vos dernieres campagnes" : "Decouvrez les dernieres opportunites"}</p></div>
          <div className="flex items-center gap-3">
            <Link href={isActiveEntrepreneur ? "/admin/my-campaigns" : "/admin/projects"} className="text-sm text-primary hover:underline font-medium">Voir tout</Link>
            {showCampaigns ? <ChevronUp className="w-5 h-5 text-black/20" /> : <ChevronDown className="w-5 h-5 text-black/20" />}
          </div>
        </button>
        {showCampaigns && (
          <div className="border-t border-black/5">
            {campaigns.length > 0 ? (
              <div className="divide-y divide-black/5">
                {campaigns.slice(0, 6).map((c) => (
                  <div key={c.id} className="flex items-center justify-between px-6 py-4 hover:bg-black/[0.01] transition-colors">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 overflow-hidden">{c.coverImageUrl ? <img src={c.coverImageUrl} alt="" className="w-full h-full object-cover" /> : <Layers className="w-5 h-5 text-primary/40" />}</div>
                      <div className="min-w-0"><p className="text-sm font-medium text-black truncate">{c.title}</p><p className="text-xs text-black/30 mt-0.5">{c.category || "Non categorise"} · {c.fundingGoal.toLocaleString()} {c.currency}</p></div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="hidden sm:flex items-center gap-2"><div className="w-20 h-1.5 bg-black/5 rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(c.progressPercentage, 100)}%` }} /></div><span className="text-xs text-black/40 w-8">{c.progressPercentage}%</span></div>
                      <span className="text-xs bg-primary/5 text-primary px-3 py-1 rounded-full font-medium">{c.statusLabel}</span>
                      {!isActiveEntrepreneur && <Link href={`/admin/projects/${c.id}`}><Button variant="ghost" size="sm"><ArrowRight className="w-4 h-4" /></Button></Link>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16"><Layers className="w-10 h-10 text-black/10 mx-auto mb-3" /><p className="text-black/40 font-medium">{isActiveEntrepreneur ? "Aucune campagne creee" : "Aucune campagne disponible"}</p><p className="text-black/20 text-sm mt-1">{isActiveEntrepreneur ? "Creez votre premiere campagne apres avoir enregistre une entreprise" : "Revenez plus tard pour decouvrir les nouveaux projets"}</p>{isActiveEntrepreneur && <Button onClick={handleAddCampaign} className="mt-4 gap-2"><Plus className="w-4 h-4" />Nouvelle campagne</Button>}</div>
            )}
          </div>
        )}
      </div>

      {/* CTA Investor */}
      {!isActiveEntrepreneur && !isPendingEntrepreneur && campaignCount > 0 && (
        <div className="bg-primary rounded-2xl p-10 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold">Pret a investir ?</h2>
              <p className="text-white/70 mt-2 max-w-lg text-sm leading-relaxed">Explorez les projets disponibles et trouvez celui qui correspond a vos objectifs d'investissement.</p>
            </div>
            <Link href="/admin/projects"><Button className="bg-white text-primary hover:bg-white/90 gap-2">Explorer les projets <ArrowRight className="w-4 h-4" /></Button></Link>
          </div>
        </div>
      )}
    </div>
  );
}
