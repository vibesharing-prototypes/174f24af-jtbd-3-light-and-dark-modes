"use client";

import { useState } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const TIMELINE = [
  {
    time: "1:45 PM",
    title: "Assigned owner",
    detail: "Elena Vasquez assigned as policy owner based on role and past review history",
    status: "done" as const,
    links: [{ label: "See reasoning", style: "primary" as const }],
  },
  {
    time: "1:48 PM",
    title: "Regulatory comparison complete",
    detail: "Compared all 12 policy sections against EU Whistleblower Directive, UK Bribery Act update, and Singapore MOM standards. 3 sections flagged for revision.",
    status: "done" as const,
    links: [{ label: "See comparison report", style: "primary" as const }],
  },
  {
    time: "1:52 PM",
    title: "Draft updates ready",
    detail: "Drafted updated language for Anti-Bribery (§4.2), Whistleblower Protections (§7.1), and Training Requirements (§9.3).",
    status: "done" as const,
    links: [{ label: "Review in editor", style: "primary" as const }, { label: "See redline", style: "muted" as const }],
  },
  {
    time: "1:55 PM",
    title: "Re-certification requests sent",
    detail: "Requests sent to 3 regional leads. Marcus Webb (NA) confirmed. Awaiting EMEA and APAC.",
    status: "in_progress" as const,
    links: [{ label: "See request text", style: "primary" as const }, { label: "Rescind", style: "danger" as const }],
    responses: [
      { initials: "MW", name: "Marcus Webb", region: "NA", status: "Confirmed", color: "#16a34a" },
      { initials: "KM", name: "Katrin Müller", region: "EMEA", status: "Pending", color: "#d97706" },
      { initials: "PS", name: "Priya Sharma", region: "APAC", status: "Pending", color: "#d97706" },
    ],
  },
  {
    time: "1:56 PM",
    title: "Stakeholders notified",
    detail: "Task summary shared with Legal, Compliance, and L&D teams.",
    status: "done" as const,
    links: [{ label: "See recipients", style: "primary" as const }, { label: "Rescind", style: "danger" as const }],
  },
];

const REG_CHANGES = [
  { title: "UK Bribery Act guidance updated", source: "UK Ministry of Justice · Nov 2025", section: "§4.2", impact: "Anti-bribery language needs revision" },
  { title: "EU Whistleblower Directive transposition", source: "European Commission · Sep 2025", section: "§7.1", impact: "New reporting channel requirements" },
  { title: "Singapore workplace harassment standards", source: "MOM Singapore · Jan 2026", section: "§9.3", impact: "APAC-specific conduct provisions" },
];

const RELATED_SIGNALS = [
  { title: "EU Whistleblower Directive Reporting", severity: "High", severityColor: "#d97706", due: "34 days", note: "Directly impacts Code of Conduct whistleblower provisions" },
  { title: "APAC Training Compliance Gap", severity: "Medium", severityColor: "#ea580c", due: "45 days", note: "49% APAC attestation rate tied to Code of Conduct awareness" },
];

const STAKEHOLDERS = [
  { initials: "EV", name: "Elena Vasquez", role: "Head of Policy", note: "Assigned as owner", noteColor: "#6b7280", time: "1:45 PM" },
  { initials: "MW", name: "Marcus Webb", role: "NA Compliance Lead", note: "Re-cert confirmed", noteColor: "#16a34a", time: "1:55 PM" },
  { initials: "KM", name: "Katrin Müller", role: "EMEA Compliance Lead", note: "Re-cert pending", noteColor: "#d97706", time: "1:55 PM" },
  { initials: "PS", name: "Priya Sharma", role: "APAC Compliance Lead", note: "Re-cert pending", noteColor: "#d97706", time: "1:55 PM" },
  { initials: "JO", name: "James Okafor", role: "Speak Up Lead", note: "Shared summary", noteColor: "#6b7280", time: "1:56 PM" },
];

type RightTab = "changes" | "signals" | "people";

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

function ChevronRight() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>;
}

function SendIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function TasksLightPage() {
  const [rightTab, setRightTab] = useState<RightTab>("changes");
  const [publishAccepted, setPublishAccepted] = useState(false);

  const RIGHT_TABS: { id: RightTab; label: string; count: number }[] = [
    { id: "changes", label: "Reg Changes", count: REG_CHANGES.length },
    { id: "signals", label: "Related Signals", count: RELATED_SIGNALS.length },
    { id: "people", label: "Stakeholders", count: STAKEHOLDERS.length },
  ];

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left icon sidebar */}
      <aside className="w-12 bg-white border-r border-[#e5e7eb] flex flex-col items-center py-3 gap-4 shrink-0">
        <DiligentLogo />
        <div className="w-6 h-[1px] bg-[#e5e7eb]" />
        <div className="w-7 h-7 rounded-md bg-[#f3f4f6] flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
        </div>
        <div className="w-7 h-7 rounded-md bg-[#f3f4f6] flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>
        </div>
        <div className="w-7 h-7 rounded-md bg-[#eff6ff] border border-[#2563eb]/30 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top nav */}
        <header className="h-12 border-b border-[#e5e7eb] flex items-center justify-between px-4 shrink-0">
          <span className="text-sm font-semibold text-[#111827]">Acme Co.</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6b7280]">Ronald Chen</span>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#2563eb] flex items-center justify-center text-[11px] font-bold text-white">RC</div>
          </div>
        </header>

        {/* Breadcrumb */}
        <div className="h-10 border-b border-[#e5e7eb] flex items-center px-4 gap-1.5 text-xs">
          <Link href="/light" className="text-[#2563eb] hover:underline">Connected Compliance</Link>
          <ChevronRight />
          <Link href="/light/dashboard" className="text-[#2563eb] hover:underline">Dashboard</Link>
          <ChevronRight />
          <span className="text-[#6b7280]">Code of Conduct Review</span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-[#f9fafb]">
          <div className="flex gap-5 p-5 max-w-[1440px] mx-auto">
            {/* ======================== LEFT COLUMN ======================== */}
            <div className="flex-1 min-w-0 space-y-5">

              {/* ---- Task Header ---- */}
              <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <h1 className="text-lg font-bold text-[#111827]">Global Code of Conduct Review</h1>
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#dc2626] bg-[#fef2f2] border border-[#fecaca]">Critical</span>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Due", value: "Mar 31, 2026", sub: "21 days", subColor: "#dc2626" },
                    { label: "Last reviewed", value: "Jan 15, 2025", sub: "14 months ago", subColor: "#d97706" },
                    { label: "Status", value: "In Progress", valueColor: "#2563eb" },
                    { label: "Current attestation", value: "72% global", sub: "49% APAC", subColor: "#d97706" },
                  ].map((m) => (
                    <div key={m.label} className="rounded-lg bg-[#f9fafb] border border-[#e5e7eb] p-3">
                      <p className="text-[11px] text-[#6b7280] mb-1">{m.label}</p>
                      <p className="text-sm font-semibold" style={{ color: m.valueColor ?? "#374151" }}>{m.value}</p>
                      {m.sub && <p className="text-[11px] mt-0.5 font-medium" style={{ color: m.subColor }}>{m.sub}</p>}
                    </div>
                  ))}
                </div>

                {/* Owner row */}
                <div className="flex items-center justify-between rounded-lg bg-[#f9fafb] border border-[#e5e7eb] px-4 py-2.5">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-[#6b7280]">Owner:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#f3f4f6] border border-[#d1d5db] flex items-center justify-center text-[8px] font-bold text-[#374151]">EV</div>
                      <span className="text-[#111827] font-medium">Elena Vasquez</span>
                      <span className="text-[#6b7280] text-[11px]">Head of Policy</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#16a34a]">Assigned by agent · 1:45 PM</span>
                    <button className="text-[10px] text-[#9ca3af] hover:text-[#6b7280] transition-colors">Change</button>
                  </div>
                </div>
              </div>

              {/* ---- Agent Timeline (consolidated) ---- */}
              <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
                    <h2 className="text-sm font-bold text-[#111827]">Agent Activity</h2>
                  </div>
                  <span className="text-[11px] text-[#6b7280]">4 of 5 actions complete</span>
                </div>

                <div className="space-y-0">
                  {TIMELINE.map((item, i) => {
                    const isLast = i === TIMELINE.length - 1;
                    const dotColor = item.status === "done" ? "#16a34a" : "#2563eb";
                    return (
                      <div key={i} className="flex gap-3">
                        {/* Dot + line */}
                        <div className="flex flex-col items-center w-4 shrink-0">
                          <div className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0" style={{ background: dotColor, boxShadow: item.status === "in_progress" ? `0 0 6px ${dotColor}60` : "none" }} />
                          {!isLast && <div className="w-px flex-1 bg-[#e5e7eb] my-1" />}
                        </div>
                        {/* Content */}
                        <div className={`flex-1 min-w-0 ${isLast ? "pb-0" : "pb-4"}`}>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[13px] font-semibold text-[#111827]">{item.title}</span>
                            {item.status === "in_progress" && (
                              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-[#2563eb] bg-[#eff6ff] border border-[#bfdbfe]">In progress</span>
                            )}
                          </div>
                          <p className="text-[12px] text-[#6b7280] leading-relaxed">{item.detail}</p>

                          {/* Response tracker */}
                          {item.responses && (
                            <div className="flex items-center gap-4 mt-2 pt-2 border-t border-[#e5e7eb]">
                              {item.responses.map((r) => (
                                <div key={r.name} className="flex items-center gap-1.5">
                                  <div className="w-5 h-5 rounded-full bg-[#f3f4f6] border border-[#d1d5db] flex items-center justify-center text-[7px] font-bold text-[#374151]">{r.initials}</div>
                                  <span className="text-[10px] text-[#374151]">{r.name}</span>
                                  <span className="text-[9px] font-semibold" style={{ color: r.color }}>{r.status}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] text-[#9ca3af]">{item.time}</span>
                            <span className="text-[10px] text-[#e5e7eb]">·</span>
                            {item.links.map((link, li) => (
                              <button key={li} className="text-[10px] font-semibold transition-colors" style={{
                                color: link.style === "primary" ? "#2563eb" : link.style === "danger" ? "#dc262680" : "#6b7280",
                              }}>
                                {link.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ---- Publish CTA (hero action) ---- */}
              {!publishAccepted ? (
                <div className="rounded-xl border border-[#7c3aed]/20 bg-[#f5f3ff] p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#ede9fe] border border-[#c4b5fd] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#7c3aed]">Agent Recommendation</span>
                      </div>
                      <p className="text-[14px] font-semibold text-[#111827] leading-snug mb-1">
                        Schedule the updated Code of Conduct to publish on April 1
                      </p>
                      <p className="text-[12px] text-[#6b7280] leading-relaxed mb-4">
                        Publishing 90 days before the June 30 audit window gives all employees time to complete attestation and lets regional compliance leads flag gaps early. The current 72% attestation rate reflects the <em>last</em> cycle — once this version publishes, attestation resets and a new 90-day cycle begins. Waiting past mid-April risks audit findings.
                      </p>

                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex-1 grid grid-cols-3 gap-2">
                          <div className="rounded-lg bg-white border border-[#e5e7eb] p-2.5 text-center">
                            <p className="text-[10px] text-[#6b7280]">Publish date</p>
                            <p className="text-sm font-semibold text-[#7c3aed]">Apr 1, 2026</p>
                          </div>
                          <div className="rounded-lg bg-white border border-[#e5e7eb] p-2.5 text-center">
                            <p className="text-[10px] text-[#6b7280]">Attestation deadline</p>
                            <p className="text-sm font-semibold text-[#374151]">Jun 30, 2026</p>
                          </div>
                          <div className="rounded-lg bg-white border border-[#e5e7eb] p-2.5 text-center">
                            <p className="text-[10px] text-[#6b7280]">Employees to attest</p>
                            <p className="text-sm font-semibold text-[#374151]">12,400</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setPublishAccepted(true)}
                          className="rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] hover:from-[#6d28d9] hover:to-[#7c3aed] text-white text-sm font-semibold px-5 py-2.5 transition-all shadow-sm"
                        >
                          Approve April 1 publish
                        </button>
                        <Link
                          href="/light/editor"
                          className="rounded-lg border border-[#d1d5db] bg-white hover:bg-[#f3f4f6] text-sm text-[#374151] font-medium px-4 py-2.5 transition-colors"
                        >
                          Review drafts first
                        </Link>
                        <button className="text-[11px] text-[#6b7280] hover:text-[#374151] transition-colors">
                          Suggest a different date
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-[#16a34a]/20 bg-[#f0fdf4] p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#dcfce7] border border-[#86efac] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] font-semibold text-[#111827] mb-1">Publication scheduled for April 1, 2026</p>
                      <p className="text-[12px] text-[#6b7280] leading-relaxed">
                        The updated Global Code of Conduct will publish automatically on April 1. Attestation requests will be sent to all 12,400 employees with a June 30 deadline. Elena Vasquez and regional leads will be notified 48 hours before publication.
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <Link
                          href="/light/editor"
                          className="rounded-lg border border-[#d1d5db] bg-white hover:bg-[#f3f4f6] text-sm text-[#374151] font-medium px-4 py-2 transition-colors"
                        >
                          Review drafts before then
                        </Link>
                        <button onClick={() => setPublishAccepted(false)} className="text-[11px] text-[#6b7280] hover:text-[#374151] transition-colors">
                          Change date
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ======================== RIGHT COLUMN ======================== */}
            <div className="w-[340px] shrink-0 space-y-5">

              {/* ---- Tabbed Panel ---- */}
              <div className="rounded-xl border border-[#e5e7eb] bg-white overflow-hidden shadow-sm">
                {/* Tab bar */}
                <div className="flex border-b border-[#e5e7eb]">
                  {RIGHT_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setRightTab(tab.id)}
                      className={`flex-1 py-2.5 text-[11px] font-semibold text-center transition-colors relative ${
                        rightTab === tab.id ? "text-[#111827]" : "text-[#9ca3af] hover:text-[#6b7280]"
                      }`}
                    >
                      {tab.label}
                      <span className="ml-1 text-[10px] font-normal" style={{ color: rightTab === tab.id ? "#6b7280" : "#9ca3af" }}>{tab.count}</span>
                      {rightTab === tab.id && <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#2563eb] rounded-full" />}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="p-4">
                  {rightTab === "changes" && (
                    <div className="space-y-3">
                      <p className="text-[11px] text-[#16a34a] mb-1">All 3 mapped to policy sections — draft language ready</p>
                      {REG_CHANGES.map((item, i) => (
                        <div key={i} className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-3">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-[12px] font-medium text-[#374151]">{item.title}</p>
                            <span className="text-[10px] font-bold text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] rounded px-1.5 py-0.5 shrink-0">{item.section}</span>
                          </div>
                          <p className="text-[10px] text-[#9ca3af] mt-1">{item.source}</p>
                          <p className="text-[10px] text-[#d97706] mt-1">{item.impact}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {rightTab === "signals" && (
                    <div className="space-y-3">
                      {RELATED_SIGNALS.map((s, i) => (
                        <div key={i} className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-3 hover:border-[#2563eb]/30 transition-colors cursor-pointer">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-[12px] font-medium text-[#374151]">{s.title}</p>
                            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ color: s.severityColor, background: `${s.severityColor}15`, border: `1px solid ${s.severityColor}30` }}>{s.severity}</span>
                          </div>
                          <p className="text-[10px] text-[#9ca3af] mb-1">Due in {s.due}</p>
                          <p className="text-[10px] text-[#6b7280] leading-relaxed">{s.note}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {rightTab === "people" && (
                    <div className="space-y-2.5">
                      {STAKEHOLDERS.map((p) => (
                        <div key={p.initials} className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-[#f3f4f6] border border-[#d1d5db] flex items-center justify-center text-[9px] font-semibold text-[#374151] flex-shrink-0">{p.initials}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[12px] font-medium text-[#111827]">{p.name}</span>
                              <span className="text-[10px] text-[#9ca3af]">{p.role}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px]" style={{ color: p.noteColor }}>{p.note}</span>
                              <span className="text-[9px] text-[#d1d5db]">·</span>
                              <span className="text-[9px] text-[#9ca3af]">{p.time}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ---- Prompt Box ---- */}
              <div className="rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2.5">
                  <input type="text" placeholder="Ask about this policy..." className="flex-1 bg-transparent text-sm text-[#374151] placeholder-[#9ca3af] outline-none" readOnly />
                  <button className="shrink-0 text-[#9ca3af] hover:text-[#2563eb] transition-colors"><SendIcon /></button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {["What changed in the draft?", "Why April 1?", "Who hasn\u2019t confirmed?"].map((pill) => (
                    <span key={pill} className="inline-flex rounded-full border border-[#e5e7eb] bg-[#f3f4f6] px-2.5 py-1 text-[11px] text-[#6b7280] hover:text-[#374151] hover:border-[#2563eb]/30 cursor-pointer transition-colors">
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
