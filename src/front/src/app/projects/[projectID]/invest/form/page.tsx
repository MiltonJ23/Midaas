"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader, Check, Shield, Phone, Lock, Smartphone, Globe, RefreshCw } from "lucide-react";
import { campaignProvider } from "@/api/campaigns";
import { investmentProvider } from "@/api/investments";
import { pawaPayProvider, type CountryConfig, type ProviderConfig } from "@/api/pawapay";
import { toast } from "react-toastify";

const PLATFORM_FEE = 0.05;

type Step = "form" | "sending" | "waiting_pin" | "confirming" | "success" | "failed";

export default function InvestFormPage({ params }: { params: { projectID: string } }) {
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [configLoading, setConfigLoading] = useState(true);
  const [countries, setCountries] = useState<CountryConfig[]>([]);
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [provider, setProvider] = useState("");
  const [step, setStep] = useState<Step>("form");
  const [progressText, setProgressText] = useState("");

  // Load project & PawaPay config
  useEffect(() => {
    (async () => {
      const [projectRes, config] = await Promise.all([
        campaignProvider.getById(params.projectID),
        pawaPayProvider.getActiveConf(),
      ]);
      if (projectRes.data) setProject(projectRes.data);
      if (config.countries?.length) {
        setCountries(config.countries);
        // Auto-select country based on project currency
        if (projectRes.data?.currency) {
          const match = config.countries.find((c) =>
            c.providers.some((p) =>
              p.currencies.some((cur) => cur.currency === projectRes.data.currency)
            )
          );
          if (match) setCountry(match.country);
          else if (config.countries[0]) setCountry(config.countries[0].country);
        } else if (config.countries[0]) {
          setCountry(config.countries[0].country);
        }
      }
      setLoading(false);
      setConfigLoading(false);
    })();
  }, [params.projectID]);

  // Auto-select first provider for country
  useEffect(() => {
    const countryData = countries.find((c) => c.country === country);
    if (countryData?.providers?.length) {
      const operational = countryData.providers.filter((p) =>
        p.currencies.some((cur) => cur.operationTypes?.DEPOSIT?.status === "OPERATIONAL")
      );
      if (operational.length > 0 && !operational.find((p) => p.provider === provider)) {
        setProvider(operational[0].provider);
      } else if (countryData.providers[0] && !provider) {
        setProvider(countryData.providers[0].provider);
      }
    }
  }, [country, countries]);

  const countryData = countries.find((c) => c.country === country);
  const providerData = countryData?.providers.find((p) => p.provider === provider);
  const currencyData = providerData?.currencies[0];
  const depositConfig = currencyData?.operationTypes?.DEPOSIT;
  const currency = currencyData?.currency || project?.currency || "XOF";
  const availableProviders = countryData?.providers || [];
  const providerName = providerData?.displayName || provider;
  const minAmount = parseInt(depositConfig?.minAmount || "1000");
  const maxAmount = parseInt(depositConfig?.maxAmount || "999999999");

  const fee = parseFloat(amount || "0") * PLATFORM_FEE;
  const total = parseFloat(amount || "0") + fee;

  const submitInvestment = useCallback(async () => {
    const val = parseFloat(amount);
    if (!val || val < minAmount) { toast.error(`Minimum ${minAmount} ${currency}`); return; }
    if (val > maxAmount) { toast.error(`Maximum ${maxAmount} ${currency}`); return; }
    if (!phoneNumber || phoneNumber.length < 6) { toast.error("Numero Mobile Money invalide"); return; }

    setStep("sending");
    setProgressText("Envoi de la demande de paiement...");
    await new Promise((r) => setTimeout(r, 1500));

    try {
      const { data, error } = await investmentProvider.invest(params.projectID, { amount: val, currency });
      if (error) { toast.error(error || "Echec de la transaction"); setStep("failed"); return; }

      setStep("waiting_pin");
      setProgressText("Demande de confirmation envoyee sur votre telephone");

      if (depositConfig?.pinPrompt === "MANUAL") {
        setProgressText("Composez le code USSD sur votre telephone pour confirmer");
      }
      await new Promise((r) => setTimeout(r, 2500));

      setStep("confirming");
      setProgressText(`Confirmation du paiement par ${providerName}...`);
      await new Promise((r) => setTimeout(r, 2000));

      setStep("success");
      toast.success("Investissement confirme !");
      setTimeout(() => { router.push(`/projects/${params.projectID}`); router.refresh(); }, 2000);
    } catch {
      toast.error("Erreur de communication");
      setStep("failed");
    }
  }, [amount, phoneNumber, currency, providerName, minAmount, maxAmount, params.projectID, router, depositConfig]);

  const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n));

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center"><div className="w-8 h-8 border-2 border-black/10 border-t-primary rounded-full animate-spin" /></div>
  );

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {step === "form" && (
          <>
            <Link href={`/projects/${params.projectID}`} className="inline-flex items-center gap-2 text-sm text-black/40 hover:text-black/60 transition-colors mb-8"><ArrowLeft className="w-4 h-4" /> Retour au projet</Link>

            <div className="bg-white rounded-2xl border border-black/5 p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-black">Investir</h1>
                  <p className="text-sm text-black/40 mt-1 truncate">{project?.title}</p>
                </div>
                {configLoading && <RefreshCw className="w-4 h-4 text-black/20 animate-spin" />}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Montant ({currency})</label>
                <input type="number" min={minAmount} max={maxAmount} step={depositConfig?.decimalsInAmount === "TWO_PLACES" ? "0.01" : "1"} placeholder={`Ex: ${fmt(minAmount)}`} value={amount} onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3.5 text-lg font-semibold rounded-xl border border-black/10 bg-white text-black placeholder:text-black/20 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                <p className="text-xs text-black/30">{fmt(minAmount)} – {maxAmount >= 999999 ? "Illimite" : fmt(maxAmount)} {currency}</p>
              </div>

              {/* Country */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Pays</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                  <select value={country} onChange={(e) => setCountry(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-black/10 bg-white text-black focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all appearance-none">
                    {countries.map((c) => (
                      <option key={c.country} value={c.country}>{c.displayName.fr || c.displayName.en || c.country}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Provider */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Operateur Mobile Money</label>
                <div className="grid grid-cols-2 gap-2">
                  {availableProviders.map((p) => {
                    const operational = p.currencies.some((cur) => cur.operationTypes?.DEPOSIT?.status === "OPERATIONAL");
                    return (
                      <button key={p.provider} onClick={() => setProvider(p.provider)}
                        disabled={!operational}
                        className={`flex items-center gap-2 px-3 py-3 rounded-xl border text-sm font-medium transition-all ${
                          provider === p.provider ? "border-primary bg-primary/5 text-primary" : "border-black/10 text-black/50 hover:border-black/20"
                        } ${!operational ? "opacity-30 cursor-not-allowed" : ""}`}>
                        <Smartphone className="w-4 h-4" />{p.displayName}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">Numero Mobile Money</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                  <input type="tel" placeholder={countryData ? `${countryData.prefix} XX XX XX XX` : "XX XX XX XX XX"} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-black/10 bg-white text-black placeholder:text-black/20 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                </div>
                {countryData && <p className="text-[10px] text-black/20">Prefix: +{countryData.prefix}</p>}
              </div>

              {/* Fee breakdown */}
              {parseFloat(amount) > 0 && (
                <div className="bg-black/[0.02] rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-black/40">Montant investi</span><span className="font-medium text-black">{fmt(parseFloat(amount))} {currency}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-black/40">Frais plateforme (5%)</span><span className="font-medium text-black">+ {fmt(fee)} {currency}</span></div>
                  <div className="border-t border-black/5 pt-2 flex justify-between"><span className="text-sm font-semibold text-black">Total a payer</span><span className="text-sm font-bold text-primary">{fmt(total)} {currency}</span></div>
                </div>
              )}

              <button onClick={submitInvestment} disabled={!providerData}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-all shadow-sm shadow-primary/25 disabled:opacity-40 disabled:cursor-not-allowed">
                <Lock className="w-4 h-4" />Payer via {providerName}
              </button>

              <p className="text-center text-xs text-black/20 flex items-center justify-center gap-1"><Shield className="w-3 h-3" />Transaction securisee · Infrastructure PawaPay</p>
            </div>
          </>
        )}

        {/* Processing states */}
        {["sending", "waiting_pin", "confirming"].includes(step) && (
          <div className="bg-white rounded-2xl border border-black/5 p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              {step === "confirming" ? <Check className="w-8 h-8 text-primary animate-in zoom-in duration-300" /> : <Loader className="w-8 h-8 text-primary animate-spin" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-black">{step === "sending" ? "Envoi en cours" : step === "waiting_pin" ? "Confirmation requise" : "Confirmation du paiement"}</h2>
              <p className="text-sm text-black/40 mt-2">{progressText}</p>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              {[0, 1, 2].map((i) => (<div key={i} className={`w-2 h-2 rounded-full ${step === "confirming" ? "bg-primary" : "bg-primary/30"} animate-bounce`} style={{ animationDelay: `${i * 0.15}s` }} />))}
            </div>
            <div className="space-y-1">
              <p className="text-xs text-black/30">Vous allez recevoir une demande de confirmation</p>
              <p className="text-[10px] text-black/20">{providerName} · PawaPay</p>
            </div>
          </div>
        )}

        {/* Success */}
        {step === "success" && (
          <div className="bg-white rounded-2xl border border-black/5 p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto"><Check className="w-8 h-8 text-primary" /></div>
            <div>
              <h2 className="text-lg font-bold text-black">Paiement confirme !</h2>
              <p className="text-sm text-black/40 mt-2"><span className="font-semibold text-black">{fmt(parseFloat(amount))} {currency}</span> investis avec succes via <span className="text-black/60">{providerName}</span>.</p>
            </div>
            <Link href={`/projects/${params.projectID}`} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">Retour au projet</Link>
          </div>
        )}

        {/* Failed */}
        {step === "failed" && (
          <div className="bg-white rounded-2xl border border-black/5 p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto"><Shield className="w-8 h-8 text-red-400" /></div>
            <div>
              <h2 className="text-lg font-bold text-black">Paiement echoue</h2>
              <p className="text-sm text-black/40 mt-2">La transaction n&apos;a pas pu aboutir. Verifiez votre solde Mobile Money ou reessayez.</p>
            </div>
            <button onClick={() => setStep("form")} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">Reessayer</button>
          </div>
        )}
      </div>
    </div>
  );
}
