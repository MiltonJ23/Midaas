"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

type TabType = "description" | "milestones" | "leaderboard";

const TABS: { key: TabType; label: string }[] = [
  { key: "description", label: "Description" },
  { key: "milestones", label: "Milestone Breakdown" },
  { key: "leaderboard", label: "Investor Leaderboard" },
];

interface Milestone {
  id: string;
  title: string;
  status: string;
  amountPercentage: number;
  estimation: string;
}

interface Backer {
  rank: number;
  name: string;
  amount: number;
  date: string;
  anonymous: boolean;
}

interface Project {
  id: string;
  title: string;
  entrepreneur: string;
  company: string;
  category: string;
  location: string;
  shortDescription: string;
  fullDescription: string;
  targetAmount: number;
  raisedAmount: number;
  daysLeft: number;
  investorsCount: number;
  socials: { twitter: string; linkedin: string; website: string };
  milestones: Milestone[];
  leaderboard: Backer[];
}

// Extended mock project data matching our global platform matrix
const mockProjectsDatabase: Record<string, Project> = {
  "PRJ-2026-01": {
    id: "PRJ-2026-01",
    title: "Eco-Friendly Cold Hubs for Local Markets",
    entrepreneur: "Amadou Diallo",
    company: "Diallo Agritech Solutions",
    category: "Agribusiness",
    location: "Yaoundé, Cameroon",
    shortDescription:
      "Deploying solar-powered cooling stations across local market grids to eradicate post-harvest waste for smallholder farmers.",
    fullDescription:
      "Post-harvest food loss represents one of the most critical structural deficits across sub-Saharan agricultural supply chains. This initiative builds and operates interconnected cold-storage hubs powered completely by high-efficiency photovoltaic panels. Local market retailers pay a nominal utility fee to preserve perishable stocks, significantly increasing household revenues while ensuring localized food protection protocols.",
    targetAmount: 25000,
    raisedAmount: 18750,
    daysLeft: 14,
    investorsCount: 142,
    socials: { twitter: "#", linkedin: "#", website: "#" },
    milestones: [
      {
        id: "M1",
        title: "Site Acquisition & Civil Foundations",
        status: "Unlocked",
        amountPercentage: 30,
        estimation: "Completed Q1 2026",
      },
      {
        id: "M2",
        title: "Solar Array Assembly & Power Integration",
        status: "In Progress",
        amountPercentage: 45,
        estimation: "Current Phase",
      },
      {
        id: "M3",
        title: "Thermal Unit Testing & Community Launch",
        status: "Pending",
        amountPercentage: 25,
        estimation: "Estimated Aug 2026",
      },
    ],
    leaderboard: [
      {
        rank: 1,
        name: "Nde Hurich",
        amount: 5000,
        date: "2026-05-12",
        anonymous: false,
      },
      {
        rank: 2,
        name: "Cameroon Angel Network",
        amount: 4500,
        date: "2026-05-18",
        anonymous: false,
      },
      {
        rank: 3,
        name: "Diaspora Seed Fund II",
        amount: 3000,
        date: "2026-06-01",
        anonymous: false,
      },
      {
        rank: 4,
        name: "Anonymous Contributor",
        amount: 1500,
        date: "2026-06-04",
        anonymous: true,
      },
    ],
  },
  "PRJ-2026-02": {
    id: "PRJ-2026-02",
    title: "Fintech Platform for Rural Micro-Loans",
    entrepreneur: "Nde Hurich",
    company: "Midaas Core Labs",
    category: "Tech & Innovation",
    location: "Douala, Cameroon",
    shortDescription:
      "Enabling decentralized financial accessibility layers via USSD and offline encryption for rural merchants.",
    fullDescription:
      "A deep infrastructure initiative optimizing liquidity circulation layers outside standard web configurations. This sandbox allows small credit associations to securely distribute and record micro-funding operations using localized cryptographic protocols.",
    targetAmount: 50000,
    raisedAmount: 50000,
    daysLeft: 0,
    investorsCount: 389,
    socials: { twitter: "#", linkedin: "#", website: "#" },
    milestones: [
      {
        id: "M1",
        title: "USSD Engine Validation",
        status: "Unlocked",
        amountPercentage: 50,
        estimation: "Completed",
      },
      {
        id: "M2",
        title: "Regulatory Sandbox Clearance",
        status: "Unlocked",
        amountPercentage: 50,
        estimation: "Completed",
      },
    ],
    leaderboard: [
      {
        rank: 1,
        name: "Global Impact Ventures",
        amount: 20000,
        date: "2026-04-10",
        anonymous: false,
      },
      {
        rank: 2,
        name: "Florence Obi",
        amount: 12000,
        date: "2026-04-15",
        anonymous: false,
      },
    ],
  },
};

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectID = params?.projectID as string;
  const [activeTab, setActiveTab] = useState<TabType>("description");
  const [isFavorited, setIsFavorited] = useState(false);

  // Fallback pattern if item is missing from active memory cache mapping
  const project =
    mockProjectsDatabase[projectID] || mockProjectsDatabase["PRJ-2026-01"];
  const completionPercentage = Math.round(
    (project.raisedAmount / project.targetAmount) * 100,
  );

  return (
    <div className="p-6 bg-background min-h-screen max-w-7xl mx-auto">
      {/* Structural Action Navigation Line */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="group-hover:-translate-x-1 transition-transform"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </button>

      {/* 1. PRIMARY PRESENTATION CARD (Profile, Summary, Actions) */}
      <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Cover Media Placeholder Frame */}
          <div className="w-full lg:w-1/3 aspect-[4/3] bg-black/5 rounded-xl relative flex items-center justify-center overflow-hidden border border-black/10">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="1.5"
            >
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <div className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">
              {project.category}
            </div>
          </div>

          {/* Project Header Identity Core Context */}
          <div className="flex-1 space-y-3 w-full">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h1 className="text-xl lg:text-2xl font-semibold text-foreground tracking-tight">
                  {project.title}
                </h1>
                <p className="text-sm text-muted-foreground font-medium">
                  Operational Ecosystem managed by{" "}
                  <span className="text-foreground font-semibold">
                    {project.entrepreneur}
                  </span>{" "}
                  • {project.company}
                </p>
              </div>

              {/* Utility Interactive Engagement Controls */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/projects/${project.id}/invest`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-all shadow-sm shadow-primary/25"
                >
                  Investir
                </Link>
              </div>
            </div>

            <p className="text-sm text-black/50 leading-relaxed max-w-3xl">
              {project.shortDescription}
            </p>

            {/* Social Mapping Nodes */}
            <div className="flex items-center gap-4 pt-2 text-xs font-medium text-black/40 border-t border-black/5">
              <span className="flex items-center gap-1.5">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {project.location}
              </span>
              <div className="h-3 w-[1px] bg-black/10" />
              <div className="flex items-center gap-3">
                <a
                  href={project.socials.website}
                  className="hover:text-primary transition-colors"
                >
                  Digital Portal
                </a>
                <a
                  href={project.socials.linkedin}
                  className="hover:text-primary transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href={project.socials.twitter}
                  className="hover:text-primary transition-colors"
                >
                  Network Channel
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ELEVATED METRICS BAR (Requested placement directly below presentation card) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 bg-white border border-black/5 rounded-2xl p-5 shadow-sm">
        {/* Metric Node: Funding Progress */}
        <div className="space-y-2 border-r border-black/5 last:border-0 pr-2">
          <span className="text-[10px] font-bold text-black/30 uppercase tracking-wider block">
            Capital Velocity
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-mono font-bold text-foreground">
              ${project.raisedAmount.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">
              of ${project.targetAmount.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-black/5 h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <span className="text-xs text-primary font-semibold block">
            {completionPercentage}% Funded
          </span>
        </div>

        {/* Metric Node: Cohort Commitments */}
        <div className="space-y-1 sm:border-r border-black/5 pl-0 sm:pl-4">
          <span className="text-[10px] font-bold text-black/30 uppercase tracking-wider block">
            Backing Cohort
          </span>
          <span className="text-2xl font-mono font-bold text-foreground block">
            {project.investorsCount}
          </span>
          <span className="text-xs text-muted-foreground block">
            Active inclusive accounts synchronized
          </span>
        </div>

        {/* Metric Node: Temporal Horizon */}
        <div className="space-y-1 border-r border-black/5 pl-0 lg:pl-4">
          <span className="text-[10px] font-bold text-black/30 uppercase tracking-wider block">
            Temporal Window
          </span>
          <span className="text-2xl font-mono font-bold text-foreground block">
            {project.daysLeft > 0 ? `${project.daysLeft} Days` : "Finalized"}
          </span>
          <span className="text-xs text-muted-foreground block">
            Time remaining before pool validation
          </span>
        </div>

        {/* Metric Node: Platform Registry Seal */}
        <div className="space-y-1 pl-0 lg:pl-4 flex flex-col justify-center">
          <span className="text-[10px] font-bold text-black/30 uppercase tracking-wider block mb-1">
            Audit Tracking Vector
          </span>
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 px-3 py-2 rounded-xl w-fit">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-green-800 uppercase tracking-wide">
              Validated Assets Security
            </span>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE CONTENT NAVIGATION TAB MATRIX */}
      <div className="space-y-6">
        <div className="flex border-b border-black/5 gap-6">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`pb-3 text-sm font-medium tracking-wider border-b-2 transition-all capitalize ${
                activeTab === key
                  ? "border-black text-foreground font-semibold"
                  : "border-transparent text-muted-foreground hover:text-black/70"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* TAB TARGET VIEWPORTS */}
        <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm min-h-[300px]">
          {/* TAB CONTENT: CORE PROJECT DESCRIPTION */}
          {activeTab === "description" && (
            <div className="space-y-6 max-w-4xl animate-fadeIn">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Operational Blueprint
                </h3>
                <p className="text-black/50 text-sm leading-relaxed">
                  {project.fullDescription}
                </p>
              </div>

              <div className="p-4 bg-black/[0.03] border border-black/5 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold uppercase text-black/30 tracking-wider mb-1">
                    Deployment Location
                  </h4>
                  <p className="text-sm font-medium text-black/70">
                    {project.location}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-black/30 tracking-wider mb-1">
                    Corporate Registries
                  </h4>
                  <p className="text-sm font-medium text-black/70">
                    {project.company} (Validated)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: MILESTONE PROGRESSIVE DEPLOYMENT ENGINE (Core Protect Guardrail) */}
          {activeTab === "milestones" && (
            <div className="space-y-6 max-w-3xl animate-fadeIn">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Milestone Escrow Sequencing
                </h3>
                <p className="text-xs text-muted-foreground">
                  In compliance with Midaas financial inclusion standards,
                  capital assets are released systematically upon audited
                  verification milestones.
                </p>
              </div>

              <div className="relative border-l-2 border-black/5 pl-6 ml-3 space-y-8">
                {project.milestones.map((milestone, idx) => (
                  <div key={milestone.id} className="relative">
                    {/* Progress Visual Tracker Node */}
                    <span
                      className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 bg-white transition-all ${
                        milestone.status === "Unlocked"
                          ? "border-green-500 bg-green-50"
                          : milestone.status === "In Progress"
                            ? "border-primary bg-primary/5 animate-pulse"
                            : "border-slate-300"
                      }`}
                    />

                    <div className="bg-black/[0.03] border border-black/5 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-bold bg-black/10 px-1.5 py-0.5 rounded text-black/50">
                            STAGE {idx + 1}
                          </span>
                          <span
                            className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                              milestone.status === "Unlocked"
                                ? "bg-green-100 text-green-800"
                                : milestone.status === "In Progress"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-black/10 text-black/40"
                            }`}
                          >
                            {milestone.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-foreground">
                          {milestone.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {milestone.estimation}
                        </p>
                      </div>

                      <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto">
                        <span className="text-xs text-muted-foreground block">
                          Escrow Payload Allocation
                        </span>
                        <span className="text-sm font-mono font-bold text-black/70">
                          {milestone.amountPercentage}% of Total Capital
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB CONTENT: INVESTOR LEADERBOARD */}
          {activeTab === "leaderboard" && (
            <div className="space-y-4 max-w-3xl animate-fadeIn">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Capital Ledger
                </h3>
                <p className="text-xs text-muted-foreground">
                  High-tier organizational contributors verified on the ledger
                  network ecosystem.
                </p>
              </div>

              <div className="border border-black/5 rounded-xl overflow-hidden">
                <div className="grid grid-cols-4 bg-black/[0.03] border-b border-black/5 p-3 text-xs font-bold text-black/40 uppercase tracking-wider">
                  <div>Rank</div>
                  <div className="col-span-2">Backer Registry Identifier</div>
                  <div className="text-right">Committed Payload</div>
                </div>

                <div className="divide-y divide-border">
                  {project.leaderboard.map((backer) => (
                    <div
                      key={backer.rank}
                      className="grid grid-cols-4 p-3 items-center text-sm"
                    >
                      <div className="font-mono text-xs font-bold text-black/30">
                        #0{backer.rank}
                      </div>
                      <div className="col-span-2 flex items-center gap-2">
                        <span
                          className={`font-medium ${backer.anonymous ? "text-black/30 italic" : "text-foreground font-semibold"}`}
                        >
                          {backer.name}
                        </span>
                        {!backer.anonymous && (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#22c55e"
                            strokeWidth="2.5"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                        )}
                      </div>
                      <div className="text-right font-mono font-bold text-black/70">
                        ${backer.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
