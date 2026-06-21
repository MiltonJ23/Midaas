"use client";

import Link from "next/link";
import { ArrowLeft, Shield, FileText, AlertTriangle } from "lucide-react";

export default function InvestPage({ params }: { params: { projectID: string } }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        <Link href={`/projects/${params.projectID}`} className="inline-flex items-center gap-2 text-sm text-black/40 hover:text-black/60 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Retour au projet
        </Link>

        <div className="bg-white rounded-2xl border border-black/5 p-8 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <h1 className="text-xl font-bold text-black">Avis important</h1>
          </div>

          <div className="space-y-5 text-sm text-black/50 leading-relaxed">
            <div className="flex items-start gap-3 p-4 bg-amber-50/50 rounded-xl border border-amber-100">
              <FileText className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-3">
                <p className="font-semibold text-black">Vous n&apos;achetez pas une part d&apos;entreprise.</p>
                <p>
                  Votre contribution est un apport en capital dans le cadre d&apos;un contrat
                  de financement participatif. Vous ne devenez pas actionnaire de
                  l&apos;entreprise et ne detenez aucun droit de vote ou de propriete.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-red-50/30 rounded-xl border border-red-100">
              <Shield className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-3">
                <p className="font-semibold text-black">Midaas n&apos;est pas responsable.</p>
                <p>
                  Midaas est une plateforme de mise en relation. Nous ne garantissons
                  pas les rendements, ni le succes des projets finances. Les performances
                  passees ou projetees ne prepasent pas les resultats futurs.
                </p>
                <p>
                  En cas de defaillance de l&apos;entrepreneur, votre capital pourrait
                  etre partiellement ou totalement perdu. Investissez uniquement ce
                  que vous etes pret a perdre.
                </p>
              </div>
            </div>

            <div className="p-4 bg-black/[0.02] rounded-xl border border-black/5">
              <p className="font-semibold text-black mb-2">Conformite reglementaire</p>
              <p>
                Cette plateforme opere dans le respect de la reglementation CEMAC
                et de la COBAC relatives aux services de financement participatif.
                Les transactions sont securisees via l&apos;infrastructure PawaPay,
                agreee par les regulateurs des 20 pays d&apos;operation.
              </p>
            </div>
          </div>

          <Link
            href={`/projects/${params.projectID}/invest/form`}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-all shadow-sm shadow-primary/25"
          >
            J&apos;ai compris, je souhaite investir
          </Link>

          <p className="text-center text-xs text-black/20">
            Conformement a l&apos;article 47 du Reglement COBAC R-2020/01 relatif
            au financement participatif dans la zone CEMAC.
          </p>
        </div>
      </div>
    </div>
  );
}
