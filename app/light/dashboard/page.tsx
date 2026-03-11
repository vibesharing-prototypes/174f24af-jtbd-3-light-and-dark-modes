"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const AGENTS = [
  { name: "Policy Monitor", detail: "Scanned 342 policies", time: "last 4 min ago" },
  { name: "Regulatory Scanner", detail: "14 jurisdictions monitored", time: "next in 12 min" },
  { name: "Training Tracker", detail: "12,400 sessions analyzed", time: "last 8 min ago" },
  { name: "Speak Up Analyst", detail: "23 active cases reviewed", time: "last 15 min ago" },
];

interface Signal {
  severity: "CRITICAL" | "HIGH";
  title: string;
  due: string;
  daysLeft: number;
  finding: string;
  agentActions: { text: string; time: string; links: { label: string; style: "primary" | "danger" | "muted" }[] }[];
  humanAction: { text: string; href: string; label: string } | null;
  owner: { name: string; role: string; initials: string; status: string; time: string };
}

const SIGNALS: Signal[] = [
  {
    severity: "CRITICAL",
    title: "Global Code of Conduct Review",
    due: "Mar 31",
    daysLeft: 21,
    finding: "Policy last reviewed 14 months ago. 3 regulatory changes require section updates. APAC attestation at 49%.",
    agentActions: [
      { text: "Assigned Elena Vasquez as owner", time: "1:45 PM", links: [{ label: "See reasoning", style: "primary" }] },
      { text: "Drafted updates for 3 policy sections", time: "1:52 PM", links: [{ label: "See drafts", style: "primary" }] },
      { text: "Sent re-certification requests to 3 regional leads", time: "1:55 PM", links: [{ label: "See status", style: "primary" }, { label: "Rescind", style: "danger" }] },
    ],
    humanAction: { text: "Review 3 drafted changes (~8 min)", href: "/light/tasks", label: "Review" },
    owner: { name: "Elena Vasquez", initials: "EV", role: "Head of Policy", status: "Assigned", time: "1:45 PM" },
  },
  {
    severity: "HIGH",
    title: "EU Whistleblower Directive Reporting",
    due: "Apr 13",
    daysLeft: 34,
    finding: "Annual report due. NA activity up 40%, LATAM anonymous reports up 3x. 2 cases in triage.",
    agentActions: [
      { text: "Assigned James Okafor as owner", time: "1:46 PM", links: [{ label: "See reasoning", style: "primary" }] },
      { text: "Compiled draft annual report from 6 regions", time: "2:01 PM", links: [{ label: "See draft", style: "primary" }] },
      { text: "Flagged 2 high-priority cases for triage", time: "2:03 PM", links: [{ label: "View cases", style: "primary" }] },
    ],
    humanAction: { text: "Triage 2 flagged cases before Apr 13", href: "/light/tasks", label: "Triage" },
    owner: { name: "James Okafor", initials: "JO", role: "Speak Up Lead", status: "Assigned", time: "1:46 PM" },
  },
  {
    severity: "HIGH",
    title: "APAC Harassment Training Renewal",
    due: "Apr 26",
    daysLeft: 45,
    finding: "Completion 67%, manager training 41%. Manager Speak Up cases up 28% this quarter.",
    agentActions: [
      { text: "Assigned Priya Sharma as owner", time: "1:47 PM", links: [{ label: "See reasoning", style: "primary" }] },
      { text: "Sent reminders to 149 managers", time: "2:12 PM", links: [{ label: "See email", style: "primary" }, { label: "Rescind", style: "danger" }] },
      { text: "Shared regional breakdown with L&D", time: "2:13 PM", links: [{ label: "See report", style: "primary" }] },
    ],
    humanAction: { text: "Review regional training breakdown", href: "/light/training", label: "Review" },
    owner: { name: "Priya Sharma", initials: "PS", role: "L&D Director APAC", status: "Assigned", time: "1:47 PM" },
  },
];

/* ------------------------------------------------------------------ */
/*  Timeline Data                                                      */
/* ------------------------------------------------------------------ */

type TimelineStatus = "completed" | "today" | "critical" | "high" | "medium" | "upcoming";

interface TimelineEvent {
  date: string;
  shortDate: string;
  title: string;
  status: TimelineStatus;
  hoverTitle: string;
  hoverBody: string;
  hoverLinks?: string[];
}

const TIMELINE: TimelineEvent[] = [
  {
    date: "2025-12-15",
    shortDate: "Dec 15",
    title: "Annual SOX Compliance Review",
    status: "completed",
    hoverTitle: "Completed — All controls passed",
    hoverBody: "SOX review finalized. 48 controls tested, all operating effectively. No material weaknesses identified. External auditor concurred.",
    hoverLinks: ["See audit report"],
  },
  {
    date: "2026-01-15",
    shortDate: "Jan 15",
    title: "Code of Conduct last reviewed",
    status: "completed",
    hoverTitle: "Completed — Now overdue for refresh",
    hoverBody: "Last full policy review was Jan 15, 2025. 3 regulatory changes have since occurred requiring section updates. This triggered the current Critical signal.",
    hoverLinks: ["See review history"],
  },
  {
    date: "2026-01-31",
    shortDate: "Jan 31",
    title: "Q4 Ethics Hotline Report filed",
    status: "completed",
    hoverTitle: "Completed — Filed on time",
    hoverBody: "23 cases resolved in Q4. 2 escalated to external counsel. Anonymous reporting up 18% vs Q3. LATAM channel usage increased significantly.",
    hoverLinks: ["See Q4 report"],
  },
  {
    date: "2026-02-14",
    shortDate: "Feb 14",
    title: "Board Risk Committee presentation",
    status: "completed",
    hoverTitle: "Completed — 2 action items remain",
    hoverBody: "Presented compliance posture to Board. 2 action items assigned: (1) update Code of Conduct by Q1 end, (2) investigate APAC training gaps. Both now in progress.",
    hoverLinks: ["See deck", "View action items"],
  },
  {
    date: "2026-02-28",
    shortDate: "Feb 28",
    title: "UK Modern Slavery Statement published",
    status: "completed",
    hoverTitle: "Completed — Published on time",
    hoverBody: "Annual statement published to company website. Reviewed by external counsel. No significant supply chain findings this cycle.",
    hoverLinks: ["See statement"],
  },
  {
    date: "2026-03-01",
    shortDate: "Mar 1",
    title: "Q1 Regulatory Change Assessment",
    status: "completed",
    hoverTitle: "Completed — 3 changes flagged",
    hoverBody: "Agent identified 3 new regulatory changes: UK Bribery Act update, EU Whistleblower Directive transposition, Singapore MOM harassment standards. All 3 now mapped to policy sections with draft updates prepared.",
    hoverLinks: ["See assessment"],
  },
  {
    date: "2026-03-10",
    shortDate: "Mar 10",
    title: "Today",
    status: "today",
    hoverTitle: "Current — 3 active deadlines",
    hoverBody: "Agent detected 3 approaching deadlines, assigned owners, and began preparation work. 9 actions completed, 3 items await your review.",
    hoverLinks: [],
  },
  {
    date: "2026-03-31",
    shortDate: "Mar 31",
    title: "Code of Conduct Review due",
    status: "critical",
    hoverTitle: "Critical — 21 days · Agent preparing",
    hoverBody: "3 policy sections drafted, Elena Vasquez assigned, regional re-certification requests sent. You need to review and approve the drafted changes.",
    hoverLinks: ["Review drafts"],
  },
  {
    date: "2026-04-13",
    shortDate: "Apr 13",
    title: "EU Whistleblower Report due",
    status: "high",
    hoverTitle: "High — 34 days · Draft report compiled",
    hoverBody: "Agent compiled draft annual report from case data across 6 regions. 2 high-priority cases need your triage before the filing deadline.",
    hoverLinks: ["See draft report", "Triage cases"],
  },
  {
    date: "2026-04-26",
    shortDate: "Apr 26",
    title: "APAC Training Renewal expires",
    status: "high",
    hoverTitle: "High — 45 days · Reminders sent",
    hoverBody: "149 manager reminders sent. Regional breakdown shared with L&D team. Completion is trending up but still below 70% threshold.",
    hoverLinks: ["Training breakdown"],
  },
  {
    date: "2026-05-15",
    shortDate: "May 15",
    title: "Annual Compliance Plan Review",
    status: "medium",
    hoverTitle: "Upcoming — 66 days · No action yet",
    hoverBody: "Annual review of the enterprise compliance plan. Agent will begin pre-work 30 days before deadline. Prior year plan and board feedback will be compiled automatically.",
    hoverLinks: [],
  },
  {
    date: "2026-06-01",
    shortDate: "Jun 1",
    title: "Anti-Bribery Policy Refresh",
    status: "upcoming",
    hoverTitle: "Upcoming — 83 days · Monitoring",
    hoverBody: "Scheduled refresh of anti-bribery policy. Agent is monitoring for additional regulatory changes. No action needed until May.",
    hoverLinks: [],
  },
  {
    date: "2026-06-30",
    shortDate: "Jun 30",
    title: "H1 Compliance Report to Board",
    status: "upcoming",
    hoverTitle: "Upcoming — 112 days · Auto-scheduled",
    hoverBody: "Semi-annual compliance report to Board Risk Committee. Agent will compile data starting Jun 1. Includes all H1 metrics, case resolutions, and policy changes.",
    hoverLinks: [],
  },
];

/* ------------------------------------------------------------------ */
/*  Icons & Components                                                 */
/* ------------------------------------------------------------------ */

function DiligentLogo({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 222 222" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <path fill="#EE312E" d="M200.87,110.85c0,33.96-12.19,61.94-33.03,81.28c-0.24,0.21-0.42,0.43-0.66,0.64c-15.5,14.13-35.71,23.52-59.24,27.11l-1.59-1.62l35.07-201.75l1.32-3.69C178.64,30.36,200.87,65.37,200.87,110.85z" />
      <path fill="#AF292E" d="M142.75,12.83l-0.99,1.47L0.74,119.34L0,118.65c0,0,0-0.03,0-0.06V0.45h85.63c5.91,0,11.64,0.34,17.19,1.01h0.21c14.02,1.66,26.93,5.31,38.48,10.78C141.97,12.46,142.75,12.83,142.75,12.83z" />
      <path fill="#D3222A" d="M142.75,12.83L0,118.65v99.27v3.62h85.96c7.61,0,14.94-0.58,21.99-1.66C107.95,219.89,142.75,12.83,142.75,12.83z" />
    </svg>
  );
}

function SidebarIcon({ d, active = false }: { d: string; active?: boolean }) {
  return (
    <div className={`flex items-center justify-center w-8 h-8 rounded-md cursor-pointer transition-colors ${active ? "bg-[#dc2626]" : "hover:bg-gray-100"}`}>
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#6b7280"} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
    </div>
  );
}

function statusColor(s: TimelineStatus): string {
  switch (s) {
    case "completed": return "#16a34a";
    case "today": return "#2563eb";
    case "critical": return "#dc2626";
    case "high": return "#d97706";
    case "medium": return "#ea580c";
    case "upcoming": return "#9ca3af";
  }
}

function statusDotStyle(s: TimelineStatus): { bg: string; border: string; size: number } {
  switch (s) {
    case "today": return { bg: "#2563eb", border: "#2563eb", size: 10 };
    case "critical": return { bg: "#dc2626", border: "#dc2626", size: 8 };
    case "high": return { bg: "#d97706", border: "#d97706", size: 7 };
    default: return { bg: s === "completed" ? "#16a34a" : "#9ca3af", border: s === "completed" ? "#16a34a60" : "#d1d5db", size: 6 };
  }
}

/* ------------------------------------------------------------------ */
/*  Timeline Component                                                 */
/* ------------------------------------------------------------------ */

function ComplianceTimeline() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const todayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (todayRef.current) {
      todayRef.current.scrollIntoView({ block: "center", behavior: "auto" });
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e7eb]">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#6b7280]">Compliance Calendar</h2>
        <span className="text-[9px] text-[#9ca3af]">Dec 2025 — Jun 2026</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="relative">
          {TIMELINE.map((ev, i) => {
            const dot = statusDotStyle(ev.status);
            const color = statusColor(ev.status);
            const isHovered = hoveredIdx === i;
            const isPast = ev.status === "completed";
            const isToday = ev.status === "today";

            return (
              <div
                key={i}
                ref={isToday ? todayRef : undefined}
                className="relative flex gap-3 group"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Vertical line + dot */}
                <div className="flex flex-col items-center w-4 flex-shrink-0">
                  <div
                    className="rounded-full flex-shrink-0 transition-all duration-200"
                    style={{
                      width: dot.size,
                      height: dot.size,
                      background: dot.bg,
                      border: `1.5px solid ${dot.border}`,
                      boxShadow: isHovered ? `0 0 8px ${color}40` : isToday ? `0 0 6px ${color}30` : "none",
                      marginTop: isToday ? 2 : 4,
                    }}
                  />
                  {i < TIMELINE.length - 1 && (
                    <div className="w-px flex-1 min-h-[16px]" style={{ background: TIMELINE[i + 1].status === "today" ? "#2563eb30" : "#e5e7eb" }} />
                  )}
                </div>

                {/* Content */}
                <div className={`pb-4 flex-1 min-w-0 ${isToday ? "pb-5" : ""}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold tabular-nums" style={{ color: isToday ? "#2563eb" : isPast ? "#9ca3af" : color }}>{ev.shortDate}</span>
                    {isToday && <span className="text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#2563eb]/15 text-[#2563eb] border border-[#2563eb]/30">Today</span>}
                  </div>
                  <p
                    className="text-[11px] mt-0.5 leading-snug cursor-default transition-colors"
                    style={{ color: isToday ? "#111827" : isPast ? "#6b7280" : isHovered ? "#111827" : "#6b7280" }}
                  >
                    {ev.title}
                  </p>

                  {/* Hover popover */}
                  {isHovered && !isToday && (
                    <div
                      className="mt-2 rounded-lg border bg-white p-3 animate-fade-in-up shadow-black/10"
                      style={{ borderColor: `${color}30` }}
                    >
                      <p className="text-[11px] font-semibold mb-1" style={{ color }}>{ev.hoverTitle}</p>
                      <p className="text-[11px] text-[#6b7280] leading-relaxed">{ev.hoverBody}</p>
                      {ev.hoverLinks && ev.hoverLinks.length > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          {ev.hoverLinks.map((l) => (
                            <button key={l} className="text-[10px] font-semibold text-[#2563eb] hover:opacity-80 transition-opacity">{l}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Signal Card                                                        */
/* ------------------------------------------------------------------ */

function SignalCard({ signal }: { signal: Signal }) {
  const sevColor = signal.severity === "CRITICAL" ? "#dc2626" : "#d97706";

  return (
    <div className="rounded-xl border border-[#d1d5db] bg-white overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-[#e5e7eb]">
        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ color: sevColor, background: `${sevColor}15`, border: `1px solid ${sevColor}30` }}>
          {signal.severity}
        </span>
        <h3 className="text-[14px] font-semibold text-[#111827] flex-1">{signal.title}</h3>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-[11px] text-[#6b7280]">{signal.due}</span>
          <span className="text-[11px] font-bold" style={{ color: signal.daysLeft <= 21 ? "#dc2626" : "#d97706" }}>{signal.daysLeft}d</span>
        </div>
      </div>

      <div className="px-5 py-4">
        <p className="text-[12px] text-[#6b7280] leading-relaxed mb-4">{signal.finding}</p>

        <div className="flex gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-2.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#16a34a]">Agent handled</span>
            </div>
            <div className="space-y-2">
              {signal.agentActions.map((a, i) => (
                <div key={i} className="flex gap-2.5">
                  <div className="flex flex-col items-center mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#16a34a] flex-shrink-0" />
                    {i < signal.agentActions.length - 1 && <div className="w-px flex-1 bg-[#e5e7eb] mt-0.5" />}
                  </div>
                  <div className="pb-1.5">
                    <p className="text-[11px] text-[#374151] leading-relaxed">{a.text}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] text-[#9ca3af]">{a.time}</span>
                      {a.links.map((l, li) => (
                        <button key={li} className="text-[9px] font-semibold transition-opacity hover:opacity-80" style={{ color: l.style === "primary" ? "#2563eb" : l.style === "danger" ? "#dc262670" : "#6b7280" }}>
                          {l.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-px bg-[#e5e7eb] flex-shrink-0" />

          <div className="w-[190px] flex-shrink-0 flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-full bg-[#f3f4f6] border border-[#d1d5db] flex items-center justify-center text-[9px] font-bold text-[#374151]">{signal.owner.initials}</div>
              <div>
                <p className="text-[11px] font-medium text-[#111827]">{signal.owner.name}</p>
                <p className="text-[9px] text-[#9ca3af]">{signal.owner.role} · <span className="text-[#16a34a]">{signal.owner.status}</span></p>
              </div>
            </div>

            {signal.humanAction && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#2563eb]">You</span>
                </div>
                <p className="text-[11px] text-[#374151] mb-2">{signal.humanAction.text}</p>
                <Link href={signal.humanAction.href} className="inline-flex items-center gap-1.5 rounded-md bg-[#2563eb] hover:bg-[#3b82f6] text-white text-[11px] font-semibold px-3 py-1.5 transition-colors">
                  {signal.humanAction.label}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-white text-[#374151] overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-12 flex-shrink-0 bg-white border-r border-[#e5e7eb] flex flex-col items-center py-3 gap-4">
        <div className="mb-2"><DiligentLogo size={20} /></div>
        <SidebarIcon d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <SidebarIcon d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5h6M9 14l2 2 4-4" active />
        <SidebarIcon d="M3 3v18h18M7 16l4-4 4 4 4-6" />
        <SidebarIcon d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zM8 2v4M16 2v4M3 10h18" />
        <SidebarIcon d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
        <div className="mt-auto">
          <SidebarIcon d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4M12 16h.01" />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Agent ticker */}
        <div className="flex-shrink-0 border-b border-[#e5e7eb] bg-[#f9fafb] overflow-hidden">
          <div className="animate-ticker flex whitespace-nowrap py-2">
            {[...AGENTS, ...AGENTS].map((agent, i) => (
              <div key={i} className="flex items-center gap-2 px-5 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] flex-shrink-0" />
                <span className="text-[#374151] font-medium">{agent.name}</span>
                <span className="text-[#6b7280]">&middot;</span>
                <span className="text-[#6b7280]">{agent.detail},</span>
                <span className="text-[#6b7280]">{agent.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Nav */}
        <header className="h-12 flex-shrink-0 border-b border-[#e5e7eb] flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth={1.8}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
            <span className="text-sm font-semibold text-[#111827]">Acme Co.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6b7280]">Ronald Chen</span>
            <div className="w-7 h-7 rounded-full bg-[#f3f4f6] border border-[#d1d5db] flex items-center justify-center text-[10px] font-semibold text-[#374151]">RC</div>
          </div>
        </header>

        {/* Body: two-column layout */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Left: signals */}
          <div className="flex-1 min-w-0 overflow-y-auto pb-32">
            <section className="max-w-[900px] mx-auto px-6 pt-6 pb-2 animate-fade-in-up">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-[#111827]">3 compliance deadlines approaching</h1>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#dc2626]/15 text-[#dc2626] border border-[#dc2626]/30">1 Critical</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#d97706]/15 text-[#d97706] border border-[#d97706]/30">2 High</span>
                  </div>
                </div>
                <span className="text-[11px] text-[#9ca3af]">Mar 10, 2026</span>
              </div>
              <p className="text-[13px] text-[#6b7280] mb-5">
                Your agents detected these deadlines, assigned owners, and started work. Review what they&apos;ve prepared.
              </p>

              <div className="flex items-center gap-6 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-5 py-3 mb-6">
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                  <span className="text-[12px] text-[#374151]"><span className="font-bold text-[#16a34a]">9</span> agent actions</span>
                </div>
                <div className="w-px h-4 bg-[#e5e7eb]" />
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  <span className="text-[12px] text-[#374151]"><span className="font-bold text-[#2563eb]">3</span> need your review</span>
                </div>
                <div className="w-px h-4 bg-[#e5e7eb]" />
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                  <span className="text-[12px] text-[#6b7280]">~15 min</span>
                </div>
              </div>
            </section>

            <section className="max-w-[900px] mx-auto px-6 space-y-4">
              {SIGNALS.map((signal) => (
                <SignalCard key={signal.title} signal={signal} />
              ))}
            </section>

            {/* Bottom prompt box */}
            <div className="fixed bottom-0 left-12 right-[280px] bg-gradient-to-t from-white via-white to-transparent pt-6 pb-4 px-6 z-10">
              <div className="max-w-[900px] mx-auto space-y-3">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {["What did the agent do?", "Show me the riskiest deadline", "Prepare a board summary"].map((s) => (
                    <button key={s} className="text-xs px-3 py-1.5 rounded-full border border-[#d1d5db] bg-white text-[#6b7280] hover:text-[#374151] hover:border-[#9ca3af] transition-colors cursor-pointer">{s}</button>
                  ))}
                </div>
                <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3">
                  <DiligentLogo size={16} />
                  <input type="text" placeholder="Ask about your compliance posture" className="flex-1 bg-transparent text-sm text-[#374151] placeholder-[#6b7280] outline-none" readOnly />
                  <button className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#16a34a] hover:bg-[#22c55e] transition-colors cursor-pointer">
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Compliance Calendar */}
          <div className="w-[280px] flex-shrink-0 border-l border-[#e5e7eb] bg-white flex flex-col">
            <ComplianceTimeline />
          </div>
        </div>
      </div>
    </div>
  );
}
