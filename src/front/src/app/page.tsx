"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Shield, Check, Sparkles, Globe, Smartphone, Banknote, Lock, TrendingUp, BarChart3, Users, ChevronRight } from "lucide-react";

const COUNTRIES = [
  "Cote d'Ivoire", "Cameroun", "Senegal", "Benin", "Burkina Faso",
  "Mali", "Togo", "Nigeria", "Ghana", "Kenya", "Tanzanie", "Ouganda",
  "Rwanda", "Zambie", "Mozambique", "RDC", "Congo", "Gabon", "Malawi", "Sierra Leone"
];

const CURRENCIES = ["XOF", "XAF", "NGN", "GHS", "KES", "TZS", "UGX", "RWF", "ZMW", "MZN"];

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* ═══ NAV ══════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-black/5 transition-shadow duration-300 hover:shadow-sm">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <svg width="30" height="30" viewBox="0 0 32 32" fill="none" className="transition-transform duration-300 group-hover:scale-105">
                <path d="M2 24L8 6L14 24L20 6L26 24" stroke="#C2410C" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 24L14 12L20 24" stroke="#C2410C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
              </svg>
              <span className="text-lg font-bold tracking-tight text-black transition-colors duration-200">MIDAAS</span>
            </Link>

            <div className="hidden md:flex items-center gap-10">
              <Link href="/explore" className="text-sm text-black/50 hover:text-primary transition-colors duration-200 font-medium">Explorer</Link>
              <Link href="/auth/signin" className="text-sm text-black/50 hover:text-primary transition-colors duration-200 font-medium">Se connecter</Link>
              <Link href="/auth/signup" className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-sm shadow-primary/25 active:scale-[0.97]">
                Investir <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>

            <button className="md:hidden p-1.5 text-black/60 hover:text-black transition-colors duration-200" onClick={() => setMobileOpen(!mobileOpen)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <><path d="M4 6h16M4 12h16M4 18h16" /></>}
              </svg>
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-black/5 px-8 py-6 space-y-4 bg-white animate-in slide-in-from-top duration-200">
            <Link href="/explore" onClick={() => setMobileOpen(false)} className="block text-sm text-black/50 py-1">Explorer</Link>
            <Link href="/auth/signin" onClick={() => setMobileOpen(false)} className="block text-sm text-black/50 py-1">Se connecter</Link>
            <Link href="/auth/signup" onClick={() => setMobileOpen(false)} className="block text-sm font-semibold text-primary py-1">Investir</Link>
          </div>
        )}
      </header>

      {/* ═══ HERO ══════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center px-8 lg:px-12 pt-20 pb-16 bg-white">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-primary/15 text-xs font-semibold text-primary mb-10 bg-primary/5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Plateforme d&apos;investissement en Afrique
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.06] tracking-tight text-black">
                Investissez<br />
                dans <span className="text-primary italic font-light">l&apos;avenir</span><br />
                de l&apos;Afrique
              </h1>

              <p className="mt-8 text-base md:text-lg text-black/50 leading-relaxed max-w-lg">
                La plateforme qui connecte les investisseurs aux entrepreneurs africains.
                Financement par jalons, paiements Mobile Money via PawaPay, transparence totale.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup" className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25 active:scale-[0.97]">
                  Commencer a investir
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <Link href="/explore" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-medium text-black/50 border border-black/10 rounded-lg hover:border-primary hover:text-primary transition-all duration-200">
                  Explorer les projets
                </Link>
              </div>
            </div>

            {/* Feature cards with hover effects */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, title: "Escrow securise", desc: "Fonds liberes uniquement apres validation de chaque jalon du projet." },
                { icon: Smartphone, title: "Mobile Money natif", desc: "Paiements via MTN, Orange, Airtel, Moov et tous les operateurs." },
                { icon: Globe, title: "20 pays couverts", desc: "Investissez depuis n'importe quel pays supporte par PawaPay." },
                { icon: Lock, title: "Zero chargeback", desc: "Transactions Mobile Money irreversibles : aucune fraude possible." },
              ].map((c, i) => (
                <div key={i} className="bg-[#FDFBF9] rounded-2xl p-6 border border-black/5 hover:border-primary/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <c.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-sm font-semibold text-black mb-1.5">{c.title}</h3>
                  <p className="text-xs text-black/40 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2 — How it works ═══════════════ */}
      <section className="py-28 md:py-36 px-8 lg:px-12 bg-[#FDFBF9]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/15 text-xs font-semibold text-primary mb-6 bg-primary/5">
              Comment ca marche
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-black leading-tight mb-4">
              Investissez en <span className="text-primary italic font-light">toute simplicite</span>
            </h2>
            <p className="text-black/50 text-base leading-relaxed max-w-2xl">
              Un processus transparent en trois etapes. Votre capital est securise
              par un systeme d&apos;escrow, les paiements transitent via Mobile Money
              <span className="text-black/30 text-xs ml-1">— infrastructure PawaPay</span>.
            </p>
          </div>

          {/* 3 steps with connector lines */}
          <div className="grid md:grid-cols-3 gap-10 mb-20 relative">
            {[
              { step: "01", icon: Banknote, title: "Investissement", desc: "Vous choisissez un projet et investissez directement en Mobile Money. Votre capital est place en escrow." },
              { step: "02", icon: Shield, title: "Validation par jalons", desc: "Les fonds sont liberes progressivement. Chaque etape est verifiee avant le deblocage suivant." },
              { step: "03", icon: Smartphone, title: "Paiement & retours", desc: "Les retours sont verses directement sur votre portefeuille Mobile Money, dans votre devise locale." },
            ].map((s, i) => (
              <div key={i} className="relative bg-white rounded-2xl p-8 border border-black/5 hover:border-primary/20 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <p className="text-5xl font-bold text-black/5 mb-4">{s.step}</p>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-3">{s.title}</h3>
                <p className="text-sm text-black/50 leading-relaxed">{s.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute -right-5 top-1/2 -translate-y-1/2 z-10">
                    <ChevronRight className="w-5 h-5 text-primary/30" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Countries + Currencies */}
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white rounded-2xl border border-black/5 p-8 hover:border-primary/10 transition-colors duration-300">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><Globe className="w-4 h-4 text-primary" /></div>
                <h3 className="text-lg font-semibold text-black">20 pays africains</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COUNTRIES.map((c) => (
                  <div key={c} className="flex items-center gap-2 text-sm text-black/50 py-1 group cursor-default">
                    <Check className="w-3.5 h-3.5 text-primary/40 group-hover:text-primary transition-colors duration-200 shrink-0" />
                    <span className="truncate">{c}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-black/5 p-8 hover:border-primary/10 transition-colors duration-300">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><Banknote className="w-4 h-4 text-primary" /></div>
                <h3 className="text-lg font-semibold text-black">Toutes les devises</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {CURRENCIES.map((c) => (
                  <span key={c} className="px-3 py-1.5 text-xs font-semibold bg-primary/5 border border-primary/10 rounded-lg text-primary hover:bg-primary/10 transition-colors duration-200 cursor-default">
                    {c}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs text-black/40 leading-relaxed">
                Conversion et reglement automatiques dans votre devise locale.
                Investissez en XOF, recevez en XAF, NGN, GHS ou toute autre devise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 3 — Trust & Escrow (illustrated) ═══ */}
      <section className="py-28 md:py-36 px-8 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/15 text-xs font-semibold text-primary mb-6 bg-primary/5">
                <Shield className="w-3 h-3" />
                Confiance &amp; Transparence
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-black leading-tight mb-10">
                Votre argent est<br />
                <span className="text-primary italic font-light">protege a chaque etape</span>
              </h2>

              <div className="space-y-4">
                {[
                  { icon: Users, title: "KYC obligatoire", desc: "Verification d'identite pour tous les entrepreneurs avant toute campagne" },
                  { icon: Lock, title: "Escrow securise", desc: "Fonds bloques et liberes uniquement apres validation humaine de chaque jalon" },
                  { icon: Check, title: "Audit systematique", desc: "Preuves documentaires, photos et videos examinees par notre equipe" },
                  { icon: Shield, title: "PawaPay certifie", desc: "Paiements geres par une infrastructure regulee, auditee et certifiee" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#FDFBF9] transition-colors duration-200 group">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors duration-200">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-black mb-0.5">{item.title}</h4>
                      <p className="text-xs text-black/40 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Escrow flow — illustrated card */}
            <div className="relative">
              <div className="bg-[#0A0A0A] rounded-3xl p-10 text-white relative overflow-hidden group hover:shadow-2xl transition-shadow duration-500">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/15 rounded-full blur-3xl group-hover:bg-primary/25 transition-colors duration-700" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-primary/25 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-xl font-bold">Mecanisme d&apos;escrow</p>
                  </div>

                  <div className="space-y-0">
                    {[
                      { step: "1", icon: Banknote, label: "L'investisseur choisit un projet et envoie les fonds via Mobile Money" },
                      { step: "2", icon: Lock, label: "Les fonds sont bloques en escrow securise via PawaPay" },
                      { step: "3", icon: Check, label: "L'entrepreneur soumet des preuves pour chaque jalon" },
                      { step: "4", icon: Users, label: "Notre equipe valide et debloque les fonds progressivement" },
                      { step: "5", icon: TrendingUp, label: "Les retours sont verses automatiquement sur le Mobile Money" },
                    ].map((s, i) => (
                      <div key={s.step} className="relative flex items-start gap-4 pb-5 last:pb-0 group/step">
                        {/* Connector line */}
                        {i < 4 && (
                          <div className="absolute left-[19px] top-9 bottom-0 w-px bg-white/5 group-hover/step:bg-primary/30 transition-colors duration-300" />
                        )}
                        <div className="w-[38px] h-[38px] rounded-full bg-primary/15 border-2 border-primary/25 flex items-center justify-center shrink-0 mt-0.5 group-hover/step:bg-primary/25 group-hover/step:border-primary/40 transition-all duration-300 relative z-10">
                          <span className="text-xs font-bold text-primary">{s.step}</span>
                        </div>
                        <div className="pt-2">
                          <p className="text-sm text-white/50 leading-relaxed group-hover/step:text-white/70 transition-colors duration-200">{s.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 4 — CTA ═══════════════════════════ */}
      <section className="py-28 md:py-36 px-8 lg:px-12 bg-[#0A0A0A] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/25 text-xs font-semibold text-primary mb-8 bg-primary/10">
            <Sparkles className="w-3 h-3" />
            Rejoignez la communaute
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl mx-auto">
            Pret a investir dans la<br />
            <span className="text-primary italic font-light">prochaine generation</span> d&apos;entrepreneurs africains ?
          </h2>
          <p className="mt-8 text-white/30 max-w-xl mx-auto leading-relaxed text-base">
            Creez votre compte gratuitement. Investissez via Mobile Money dans
            des projets verifies a travers 20 pays africains. Suivi transparent,
            retours automatises.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup" className="group inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25 active:scale-[0.97]">
              Creer un compte gratuit
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link href="/explore" className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-medium text-white/30 border border-white/10 rounded-lg hover:border-white/30 hover:text-white/60 transition-all duration-200">
              Voir les projets
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER — complet ═════════════════════════ */}
      <footer className="bg-[#0A0A0A] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-8 lg:px-12 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                  <path d="M2 24L8 6L14 24L20 6L26 24" stroke="#C2410C" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 24L14 12L20 24" stroke="#C2410C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
                </svg>
                <span className="text-base font-bold text-white">MIDAAS</span>
              </div>
              <p className="text-xs text-white/40 leading-relaxed max-w-xs">
                Plateforme de financement participatif connectant investisseurs et
                entrepreneurs africains. Transparence, securite, impact.
              </p>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">Plateforme</h4>
              <ul className="space-y-2.5">
                {["Explorer les projets", "Creer un compte", "Se connecter", "Admin"].map((l) => (
                  <li key={l}>
                    <Link href={l === "Explorer les projets" ? "/explore" : l === "Creer un compte" ? "/auth/signup" : l === "Se connecter" ? "/auth/signin" : "/auth/admin"}
                      className="text-xs text-white/30 hover:text-primary transition-colors duration-200">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">Ressources</h4>
              <ul className="space-y-2.5">
                {["Comment ca marche", "Confiance & Securite", "PawaPay", "Mobile Money"].map((l) => (
                  <li key={l}>
                    <span className="text-xs text-white/30 cursor-default">{l}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Coverage */}
            <div>
              <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">Couverture</h4>
              <ul className="space-y-2.5">
                {["20 pays africains", "10 devises supportees", "520M+ wallets", "Zero chargeback"].map((l) => (
                  <li key={l}>
                    <span className="text-xs text-white/30 cursor-default">{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/20">
              &copy; {new Date().getFullYear()} Midaas. Tous droits reserves.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-[10px] text-white/20 cursor-default">Confidentialite</span>
              <span className="text-[10px] text-white/20 cursor-default">Conditions</span>
              <span className="text-[10px] text-white/20 cursor-default">Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
