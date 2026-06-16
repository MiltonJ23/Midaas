"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import { twMerge } from "tailwind-merge";

/* ─── Types ──────────────────────────── */

interface PublicCompany {
  id: string;
  legalName: string;
  tradeName: string;
  corporateForm: string;
  industrySector: string;
  status: string;
  physicalAddress: string;
}

/* ─── Sample data (mirrors API shape) ── */

const SAMPLE_COMPANIES: PublicCompany[] = [
  {
    id: "1",
    legalName: "Societe Alpha SARL",
    tradeName: "Alpha Tech",
    corporateForm: "SARL",
    industrySector: "Fintech",
    status: "approved",
    physicalAddress: "Rue 1234, Bastos, Yaounde",
  },
  {
    id: "2",
    legalName: "Green Harvest ETS",
    tradeName: "Green Harvest",
    corporateForm: "ETS",
    industrySector: "Agribusiness",
    status: "approved",
    physicalAddress: "Mvog-Mbi, Yaounde",
  },
  {
    id: "3",
    legalName: "MediConnect SARL",
    tradeName: "MediConnect",
    corporateForm: "SARL",
    industrySector: "Healthcare",
    status: "approved",
    physicalAddress: "Bonanjo, Douala",
  },
  {
    id: "4",
    legalName: "SolarGrid SA",
    tradeName: "SolarGrid",
    corporateForm: "SA",
    industrySector: "Energy",
    status: "approved",
    physicalAddress: "Bastos, Yaounde",
  },
  {
    id: "5",
    legalName: "EduTech Solutions SARL",
    tradeName: "EduTech",
    corporateForm: "SARL",
    industrySector: "Tech & Innovation",
    status: "approved",
    physicalAddress: "Melen, Yaounde",
  },
  {
    id: "6",
    legalName: "AgriPro ETS",
    tradeName: "AgriPro",
    corporateForm: "ETS",
    industrySector: "Agribusiness",
    status: "approved",
    physicalAddress: "Biyem-Assi, Yaounde",
  },
];

const INDUSTRY_SECTORS = [
  "All",
  "Fintech",
  "Agribusiness",
  "Healthcare",
  "Energy",
  "Tech & Innovation",
  "Retail & Trade",
];

const CORPORATE_FORMS = ["All", "ETS", "SARL", "SA", "SAS"];

/* ─── Helpers ─────────────────────────── */

const industryColor = (sector: string) => {
  const map: Record<string, string> = {
    Fintech: "bg-blue-100 text-blue-700",
    Agribusiness: "bg-green-100 text-green-700",
    Healthcare: "bg-red-100 text-red-700",
    Energy: "bg-yellow-100 text-yellow-700",
    "Tech & Innovation": "bg-purple-100 text-purple-700",
    "Retail & Trade": "bg-orange-100 text-orange-700",
  };
  return map[sector] ?? "bg-gray-100 text-gray-600";
};

/* ─── Component ──────────────────────── */

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All");
  const [formFilter, setFormFilter] = useState("All");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filtered = useMemo(() => {
    return SAMPLE_COMPANIES.filter((c) => {
      if (sectorFilter !== "All" && c.industrySector !== sectorFilter)
        return false;
      if (formFilter !== "All" && c.corporateForm !== formFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !c.legalName.toLowerCase().includes(q) &&
          !c.tradeName.toLowerCase().includes(q) &&
          !c.industrySector.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [search, sectorFilter, formFilter]);

  return (
    <div className="min-h-screen bg-white">
      {/* ─── NAV ──────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image
                src="/logo.png"
                alt="Midaas"
                width={100}
                height={32}
                className="object-contain"
              />
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/#features"
                className="text-sm text-gray-600 hover:text-[#00de00] transition-colors font-MontserratRegular"
              >
                Features
              </Link>
              <Link
                href="/#how-it-works"
                className="text-sm text-gray-600 hover:text-[#00de00] transition-colors font-MontserratRegular"
              >
                How It Works
              </Link>
              <Link
                href="/explore"
                className="text-sm text-[#00de00] font-MontserratSemiBold"
              >
                Explore Projects
              </Link>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/auth/signin"
                className="px-5 py-2 text-sm font-MontserratSemiBold text-gray-700 hover:text-[#00de00] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-5 py-2.5 text-sm font-MontserratSemiBold text-white bg-[#00de00] rounded-full hover:bg-[#00c800] transition-colors shadow-sm"
              >
                Get Started
              </Link>
            </div>

            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <>
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        <div
          className={twMerge(
            "md:hidden overflow-hidden transition-all duration-300",
            mobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="px-4 py-4 space-y-3 border-t border-gray-100">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-gray-600 py-2"
            >
              Home
            </Link>
            <Link
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-gray-600 py-2"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-gray-600 py-2"
            >
              How It Works
            </Link>
            <hr className="border-gray-100" />
            <Link
              href="/auth/signin"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-MontserratSemiBold text-gray-700 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center text-sm font-MontserratSemiBold text-white bg-[#00de00] rounded-full py-2.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO ─────────────────────────── */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-MontserratBold text-gray-900 tracking-tight">
            Explore <span className="text-[#00de00]">Approved Projects</span>
          </h1>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Browse verified businesses and initiatives looking for capital. No
            account required — dive in and discover where your investment could
            make a difference.
          </p>
        </div>
      </section>

      {/* ─── FILTERS ──────────────────────── */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search bar */}
          <div className="relative max-w-xl mx-auto mb-6">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, industry…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#00de00] focus:ring-2 focus:ring-[#00de00]/10 outline-none transition-all"
            />
          </div>

          {/* Desktop filters */}
          <div className="hidden md:flex items-center justify-center gap-3 flex-wrap">
            {/* Sector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-400 mr-1">Sector:</span>
              {INDUSTRY_SECTORS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSectorFilter(s)}
                  className={twMerge(
                    "px-3.5 py-1.5 text-xs rounded-full border transition-colors font-MontserratSemiBold",
                    sectorFilter === s
                      ? "bg-[#00de00] text-white border-[#00de00]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#00de00] hover:text-[#00de00]",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            <span className="w-px h-5 bg-gray-200" />
            {/* Corporate form */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-400 mr-1">Type:</span>
              {CORPORATE_FORMS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFormFilter(f)}
                  className={twMerge(
                    "px-3 py-1.5 text-xs rounded-full border transition-colors font-MontserratSemiBold",
                    formFilter === f
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-900 hover:text-gray-900",
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile filter toggle */}
          <div className="md:hidden flex justify-center mb-4">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-MontserratSemiBold text-gray-600 border border-gray-200 rounded-full"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="20" y2="12" />
                <line x1="12" y1="18" x2="20" y2="18" />
              </svg>
              Filters
            </button>
          </div>

          {/* Mobile filter panel */}
          <div
            className={twMerge(
              "md:hidden overflow-hidden transition-all duration-300",
              mobileFiltersOpen
                ? "max-h-96 opacity-100 mb-4"
                : "max-h-0 opacity-0",
            )}
          >
            <div className="space-y-4 bg-gray-50 rounded-xl p-4">
              <div>
                <p className="text-xs text-gray-400 mb-2 font-MontserratSemiBold">
                  Sector
                </p>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRY_SECTORS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSectorFilter(s)}
                      className={twMerge(
                        "px-3 py-1.5 text-xs rounded-full border transition-colors",
                        sectorFilter === s
                          ? "bg-[#00de00] text-white border-[#00de00]"
                          : "bg-white text-gray-600 border-gray-200",
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-2 font-MontserratSemiBold">
                  Legal Form
                </p>
                <div className="flex flex-wrap gap-2">
                  {CORPORATE_FORMS.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFormFilter(f)}
                      className={twMerge(
                        "px-3 py-1.5 text-xs rounded-full border transition-colors",
                        formFilter === f
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-600 border-gray-200",
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROJECT GRID ─────────────────── */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <svg
                className="mx-auto mb-4 text-gray-300"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <p className="text-gray-400 text-sm">
                No projects match your filters.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSectorFilter("All");
                  setFormFilter("All");
                }}
                className="mt-3 text-xs text-[#00de00] hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-400 mb-4">
                Showing {filtered.length} of {SAMPLE_COMPANIES.length} projects
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((company) => (
                  <div
                    key={company.id}
                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#00de00]/20 transition-all duration-300 p-6 flex flex-col"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-MontserratSemiBold text-gray-900 truncate">
                          {company.tradeName || company.legalName}
                        </h3>
                        {company.tradeName && (
                          <p className="text-xs text-gray-400 mt-0.5 truncate">
                            {company.legalName}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 font-mono shrink-0 ml-2">
                        {company.corporateForm}
                      </span>
                    </div>

                    {/* Industry badge */}
                    <div className="mb-4">
                      <span
                        className={twMerge(
                          "inline-block px-3 py-1 text-xs font-MontserratSemiBold rounded-full",
                          industryColor(company.industrySector),
                        )}
                      >
                        {company.industrySector}
                      </span>
                    </div>

                    {/* Address */}
                    {company.physicalAddress && (
                      <div className="flex items-start gap-2 mb-4 text-xs text-gray-400">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          className="shrink-0 mt-0.5"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>{company.physicalAddress}</span>
                      </div>
                    )}

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* CTA */}
                    <Link
                      href="/auth/signup"
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-MontserratSemiBold text-white bg-[#00de00] rounded-xl hover:bg-[#00c800] transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      Sign Up to Invest
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ─── CTA BANNER ───────────────────── */}
      <section className="py-16 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-MontserratBold text-gray-900">
            Ready to Start Investing?
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            Create your free account today and get access to detailed project
            information, milestone tracking, and secure investment tools.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 px-8 py-3 text-sm font-MontserratSemiBold text-white bg-[#00de00] rounded-full hover:bg-[#00c800] transition-colors shadow-lg shadow-[#00de00]/25"
            >
              Create Free Account
            </Link>
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 px-8 py-3 text-sm font-MontserratSemiBold text-gray-700 border border-gray-200 rounded-full hover:border-[#00de00] hover:text-[#00de00] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────── */}
      <footer className="border-t border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Midaas"
                width={80}
                height={26}
                className="object-contain"
              />
            </div>
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} Midaas. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-xs text-gray-400 hover:text-[#00de00] transition-colors"
              >
                Home
              </Link>
              <Link
                href="/auth/signin"
                className="text-xs text-gray-400 hover:text-[#00de00] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="text-xs text-gray-400 hover:text-[#00de00] transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
