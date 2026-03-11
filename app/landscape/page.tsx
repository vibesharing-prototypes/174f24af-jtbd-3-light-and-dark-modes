"use client";

import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const DOMAINS = [
  {
    title: "Policy Manager",
    lastUpdated: "53m ago",
    month: "March 2026",
    metric: "Policies Edited",
    sparkline: "M0,40 L20,38 L40,42 L60,35 L80,37 L100,30 L120,28 L140,32 L160,25 L180,15 L200,18 L220,10 L240,12",
    dayDots: [3, 5, 7, 10, 11, 14, 17, 19, 21, 24],
    todayDot: 11,
    summary:
      "Several policies are now overdue for review, including core governance policies such as Anti-Bribery and Workplace Conduct, and the current Code of Conduct may not yet reflect recent EU and UK regulatory guidance. Engagement with policies is also uneven — particularly in APAC, where attestation rates are below the global average and search activity suggests employees are trying to find guidance but not always locating the right policies.",
  },
  {
    title: "Speak Up",
    lastUpdated: "2h 6m ago",
    month: "March 2026",
    metric: "Cases",
    sparkline: "M0,38 L20,35 L40,37 L60,30 L80,28 L100,32 L120,25 L140,20 L160,22 L180,18 L200,15 L220,20 L240,12",
    dayDots: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
    todayDot: 11,
    summary:
      "Reporting activity has increased in several regions, with harassment reports in North America rising significantly and anonymous reporting in LATAM increasing sharply. Several high-priority cases have been submitted recently and some are still awaiting triage, while investigation timelines across the programme are trending slower than peer benchmarks.",
  },
  {
    title: "Training",
    lastUpdated: "1h 19m ago",
    month: "March 2026",
    metric: "Sessions Completed",
    sparkline: "M0,42 L20,40 L40,38 L60,40 L80,35 L100,32 L120,30 L140,28 L160,25 L180,20 L200,22 L220,15 L240,10",
    dayDots: [1, 3, 5, 8, 10, 13, 15, 18, 20, 22],
    todayDot: 11,
    summary:
      "Training completion is generally strong but varies across regions and teams. Participation in Workplace Respect training is noticeably lower in North America than in EMEA, and manager-related allegations are increasing in Speak Up cases despite limited manager-specific training coverage — suggesting a gap between policy awareness and everyday leadership behaviour.",
  },
];

const MONTHS = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

function DiligentLogo() {
  return (
    <svg viewBox="0 0 222 222" width={20} height={20}>
      <path fill="#EE312E" d="M200.87,110.85c0,33.96-12.19,61.94-33.03,81.28c-0.24,0.21-0.42,0.43-0.66,0.64c-15.5,14.13-35.71,23.52-59.24,27.11l-1.59-1.62l35.07-201.75l1.32-3.69C178.64,30.36,200.87,65.37,200.87,110.85z" />
      <path fill="#AF292E" d="M142.75,12.83l-0.99,1.47L0.74,119.34L0,118.65c0,0,0-0.03,0-0.06V0.45h85.63c5.91,0,11.64,0.34,17.19,1.01h0.21c14.02,1.66,26.93,5.31,38.48,10.78C141.97,12.46,142.75,12.83,142.75,12.83z" />
      <path fill="#D3222A" d="M142.75,12.83L0,118.65v99.27v3.62h85.96c7.61,0,14.94-0.58,21.99-1.66C107.95,219.89,142.75,12.83,142.75,12.83z" />
    </svg>
  );
}

function SendIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>;
}

/* ------------------------------------------------------------------ */
/*  Components                                                         */
/* ------------------------------------------------------------------ */

function SidebarIcon({ d, active }: { d: string; active?: boolean }) {
  return (
    <div className={`w-7 h-7 rounded-md flex items-center justify-center ${active ? "bg-[#1f6feb] text-white" : "bg-[#21262d]"}`}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#8b949e"} strokeWidth="2"><path d={d} /></svg>
    </div>
  );
}

function DomainCard({ domain }: { domain: typeof DOMAINS[number] }) {
  return (
    <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#21262d] flex items-center justify-center">
            {domain.title === "Policy Manager" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /></svg>}
            {domain.title === "Speak Up" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>}
            {domain.title === "Training" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></svg>}
          </div>
          <h3 className="text-sm font-bold text-[#f0f6fc]">{domain.title}</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#3fb950]" />
          <span className="text-[10px] text-[#6e7681]">{domain.lastUpdated}</span>
        </div>
      </div>

      {/* Month + day dots */}
      <div className="mb-1">
        <p className="text-[11px] text-[#8b949e] text-center font-medium mb-2">{domain.month}</p>
        <div className="flex items-center justify-center gap-[6px]">
          {Array.from({ length: 31 }, (_, i) => {
            const isActive = domain.dayDots.includes(i);
            const isToday = i === domain.todayDot;
            return (
              <div
                key={i}
                className="w-[5px] h-[5px] rounded-full"
                style={{
                  background: isToday ? "#f0f6fc" : isActive ? "#58a6ff" : "#21262d",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Sparkline chart */}
      <div className="my-3">
        <p className="text-[9px] font-bold uppercase tracking-widest text-[#6e7681] mb-2">{domain.metric}</p>
        <div className="h-12 relative">
          {/* Axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between">
            {MONTHS.map((m) => (
              <span key={m} className="text-[7px] text-[#484f58]">{m}</span>
            ))}
          </div>
          <svg viewBox="0 0 240 50" className="w-full h-10" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`grad-${domain.title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#58a6ff" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#58a6ff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`${domain.sparkline} L240,50 L0,50 Z`} fill={`url(#grad-${domain.title})`} />
            <path d={domain.sparkline} fill="none" stroke="#58a6ff" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {/* Summary */}
      <p className="text-[11px] text-[#8b949e] leading-relaxed flex-1">{domain.summary}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function LandscapePage() {
  return (
    <div className="min-h-screen bg-[#0d1117] flex">
      {/* Left icon sidebar */}
      <aside className="w-12 bg-[#0d1117] border-r border-[#30363d] flex flex-col items-center py-3 gap-4 shrink-0">
        <DiligentLogo />
        <div className="w-6 h-[1px] bg-[#30363d]" />
        <SidebarIcon d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" active />
        <SidebarIcon d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
        <SidebarIcon d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" />
        <SidebarIcon d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        <SidebarIcon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <SidebarIcon d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top nav */}
        <header className="h-12 border-b border-[#30363d] flex items-center justify-between px-4 shrink-0">
          <span className="text-sm font-semibold text-[#f0f6fc]">Acme Co.</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8b949e]">Ronald Chen</span>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#1f6feb] flex items-center justify-center text-[11px] font-bold text-white">RC</div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1100px] mx-auto px-6 py-10">

            {/* ---- Greeting ---- */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#f0f6fc] mb-1">Good morning Ronald!</h1>
              <p className="text-base font-medium text-[#8b949e]">ACME&apos;s compliance landscape</p>
              <p className="text-[11px] text-[#3fb950] mt-2">Updated: Mar 11, 2026 at 7:43 AM</p>
            </div>

            {/* ---- AI Summary ---- */}
            <div className="max-w-[680px] mx-auto mb-8">
              <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-5">
                <p className="text-[13px] text-[#c9d1d9] leading-relaxed">
                  Across ACME, the compliance picture is mixed. Some areas are performing well, but several signals suggest emerging risk. Harassment reports in North America have increased significantly, anonymous reporting in LATAM is rising, and several regulatory deadlines are approaching quickly.
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <Link href="/dashboard" className="inline-flex items-center rounded-full bg-[#1f6feb] hover:bg-[#388bfd] text-white text-[11px] font-semibold px-3.5 py-1.5 transition-colors">
                    View all suggested actions
                  </Link>
                  <Link href="/dashboard" className="inline-flex items-center rounded-full border border-[#30363d] bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] text-[11px] font-semibold px-3.5 py-1.5 transition-colors">
                    View urgent actions
                  </Link>
                </div>
              </div>
            </div>

            {/* ---- Prompt ---- */}
            <div className="max-w-[680px] mx-auto mb-10">
              <p className="text-[13px] text-[#8b949e] mb-2">What would you like to discuss?</p>
              <div className="flex items-center gap-2 rounded-xl border border-[#30363d] bg-[#161b22] px-4 py-3">
                <input
                  type="text"
                  placeholder="Ask a follow-up..."
                  className="flex-1 bg-transparent text-sm text-[#c9d1d9] placeholder-[#484f58] outline-none"
                  readOnly
                />
                <button className="shrink-0 w-8 h-8 rounded-full bg-[#1f6feb] hover:bg-[#388bfd] flex items-center justify-center text-white transition-colors">
                  <SendIcon />
                </button>
              </div>
            </div>

            {/* ---- Domain Cards ---- */}
            <div className="grid grid-cols-3 gap-5">
              {DOMAINS.map((domain) => (
                <DomainCard key={domain.title} domain={domain} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
