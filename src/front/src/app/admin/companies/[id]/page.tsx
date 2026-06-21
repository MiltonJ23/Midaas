"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";
import { companyProvider } from "@/api/company";
import { campaignProvider } from "@/api/campaigns";
import Company from "@/entities/company/company";
import Project from "@/entities/project/project";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/atoms/button";
import CompanyRegistrationForm from "@/components/organisms/company-registration/company-registration-form";
import {
  ArrowLeft,
  Building2,
  Layers,
  TrendingUp,
  Target,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Loader,
} from "lucide-react";
import Link from "next/link";

export default function CompanyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const companyId = params.id as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [campaigns, setCampaigns] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !companyId) return;

    (async () => {
      setLoading(true);
      setError(null);

      // Fetch company details
      const { data: companyData, error: companyError } =
        await companyProvider.getById(companyId);

      if (companyData) {
        setCompany(companyData);
      } else {
        setError(companyError || "Company not found");
        setLoading(false);
        return;
      }

      // Fetch campaigns for this company
      const { data: campaignsData } =
        await campaignProvider.getByCompany(companyId);

      if (campaignsData) {
        setCampaigns(campaignsData);
      }

      setLoading(false);
    })();
  }, [user, companyId]);

  // Stats
  const stats = useMemo(() => {
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(
      (c) => c.status === "active",
    ).length;
    const totalFundingGoal = campaigns.reduce(
      (sum, c) => sum + c.fundingGoal,
      0,
    );
    const totalFundingRaised = campaigns.reduce(
      (sum, c) => sum + c.fundingRaised,
      0,
    );
    const completedCampaigns = campaigns.filter(
      (c) => c.status === "completed" || c.status === "funded",
    ).length;

    return {
      totalCampaigns,
      activeCampaigns,
      totalFundingGoal,
      totalFundingRaised,
      completedCampaigns,
    };
  }, [campaigns]);

  // Status icon
  const StatusIcon =
    company?.status === "approved"
      ? CheckCircle2
      : company?.status === "rejected"
        ? XCircle
        : Clock;

  const statusIconColor =
    company?.status === "approved"
      ? "text-emerald-500"
      : company?.status === "rejected"
        ? "text-red-500"
        : "text-amber-500";

  const handleRegistrationComplete = useCallback(() => {
    // Refresh company data
    (async () => {
      const { data } = await companyProvider.getById(companyId);
      if (data) setCompany(data);
    })();
  }, [companyId]);

  if (loading) {
    return (
      <section className="p-6">
        <div className="max-w-[1200px] mx-auto mt-8 flex items-center justify-center min-h-[400px]">
          <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (error || !company) {
    return (
      <section className="p-6">
        <div className="max-w-[1200px] mx-auto mt-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="text-center py-16 bg-white rounded-xl border border-border">
            <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Company not found
            </h2>
            <p className="text-slate-500">
              {error || "This company does not exist or you don't have access."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="p-6">
      <div className="max-w-[1200px] mx-auto mt-8 space-y-6">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2 -ml-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Button>

        {/* ─── Header ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary px-6 py-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-white">
                  {company.displayName}
                </h1>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="text-white/70 text-sm">
                    {company.corporateForm}
                  </span>
                  <span className="text-white/40">·</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${company.statusColor}`}
                  >
                    <StatusIcon className={`w-3.5 h-3.5 ${statusIconColor}`} />
                    {company.statusLabel}
                  </span>
                  {company.industrySector && (
                    <>
                      <span className="text-white/40">·</span>
                      <span className="text-white/70 text-sm">
                        {company.industrySector}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Status-based content ──────────────────────────────────── */}
        {company.status === "draft" && (
          <CompanyRegistrationForm
            company={company}
            onComplete={handleRegistrationComplete}
          />
        )}

        {company.status === "pending" && (
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-200 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Pending Validation
            </h2>
            <p className="text-slate-600 max-w-lg mx-auto">
              Your company has been submitted for validation. An administrator
              will review your documents and information shortly. You will be
              notified once the status changes.
            </p>
          </div>
        )}

        {company.status === "rejected" && (
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl border border-red-200 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Validation Rejected
            </h2>
            <p className="text-slate-600 max-w-lg mx-auto">
              Your company submission was not approved. Please review the
              feedback and update your information before resubmitting.
            </p>
          </div>
        )}

        {/* ─── Stats + Campaigns (approved companies) ──────────── */}
        {(company.status === "approved" ||
          company.status === "reverify_requested") && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-border p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Total campaigns</p>
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {stats.totalCampaigns}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-border p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Active campaigns</p>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {stats.activeCampaigns}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-border p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Funding goal</p>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                    <Target className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {stats.totalFundingGoal.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">XOF</p>
              </div>

              <div className="bg-white rounded-xl border border-border p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Raised / Completed</p>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {stats.totalFundingRaised.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {stats.completedCampaigns} campaigns completed
                </p>
              </div>
            </div>

            {/* Campaigns Table */}
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Campaigns
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {stats.totalCampaigns > 0
                      ? `All campaigns linked to ${company.displayName}`
                      : "No campaigns yet for this company"}
                  </p>
                </div>
                {stats.totalCampaigns > 0 && (
                  <Link href="/admin/my-campaigns">
                    <Button variant="ghost" size="sm" className="gap-1">
                      View all
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </Button>
                  </Link>
                )}
              </div>

              {stats.totalCampaigns > 0 ? (
                <div className="divide-y divide-border">
                  {campaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                          {campaign.coverImageUrl ? (
                            <img
                              src={campaign.coverImageUrl}
                              alt={campaign.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <FileText className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 truncate">
                            {campaign.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {campaign.category || "Uncategorized"} ·{" "}
                            {campaign.fundingGoal.toLocaleString()}{" "}
                            {campaign.currency}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="hidden sm:flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                campaign.progressPercentage >= 100
                                  ? "bg-emerald-500"
                                  : campaign.progressPercentage >= 50
                                    ? "bg-blue-500"
                                    : "bg-amber-500"
                              }`}
                              style={{
                                width: `${campaign.progressPercentage}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-500 w-8">
                            {campaign.progressPercentage}%
                          </span>
                        </div>

                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${campaign.statusColor}`}
                        >
                          {campaign.statusLabel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <Layers className="w-12 h-12 text-slate-300" />
                    <p className="text-slate-500 font-medium">
                      No campaigns yet
                    </p>
                    <p className="text-slate-400 text-sm">
                      Create your first campaign for this company
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
