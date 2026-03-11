"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface SubRegion {
  name: string;
  completion: number;
  managerCompletion: number;
  enrolled: number;
  overdue: number;
  flag?: string;
}

interface Region {
  id: string;
  name: string;
  completion: number;
  managerCompletion: number;
  enrolled: number;
  overdue: number;
  color: string;
  subRegions: SubRegion[];
}

const REGIONS: Region[] = [
  {
    id: "americas",
    name: "Americas",
    completion: 78,
    managerCompletion: 52,
    enrolled: 4200,
    overdue: 420,
    color: "#2563eb",
    subRegions: [
      { name: "US — East Coast", completion: 82, managerCompletion: 58, enrolled: 1400, overdue: 110 },
      { name: "US — Pacific", completion: 75, managerCompletion: 48, enrolled: 1100, overdue: 140, flag: "Manager gap" },
      { name: "US — Central", completion: 80, managerCompletion: 55, enrolled: 600, overdue: 55 },
      { name: "Canada", completion: 88, managerCompletion: 71, enrolled: 520, overdue: 30 },
      { name: "Mexico", completion: 62, managerCompletion: 35, enrolled: 380, overdue: 65, flag: "Low completion" },
      { name: "Brazil", completion: 58, managerCompletion: 29, enrolled: 200, overdue: 20, flag: "Low completion" },
    ],
  },
  {
    id: "emea",
    name: "EMEA",
    completion: 85,
    managerCompletion: 68,
    enrolled: 3800,
    overdue: 210,
    color: "#7c3aed",
    subRegions: [
      { name: "UK & Ireland", completion: 91, managerCompletion: 78, enrolled: 900, overdue: 30 },
      { name: "DACH (DE/AT/CH)", completion: 88, managerCompletion: 72, enrolled: 720, overdue: 35 },
      { name: "France & Benelux", completion: 84, managerCompletion: 65, enrolled: 650, overdue: 40 },
      { name: "Nordics", completion: 92, managerCompletion: 81, enrolled: 410, overdue: 15 },
      { name: "Southern Europe", completion: 79, managerCompletion: 54, enrolled: 580, overdue: 50, flag: "Manager gap" },
      { name: "Middle East & Africa", completion: 71, managerCompletion: 42, enrolled: 540, overdue: 40, flag: "Low completion" },
    ],
  },
  {
    id: "apac",
    name: "APAC",
    completion: 67,
    managerCompletion: 41,
    enrolled: 4400,
    overdue: 680,
    color: "#dc2626",
    subRegions: [
      { name: "Japan", completion: 82, managerCompletion: 60, enrolled: 800, overdue: 60 },
      { name: "South Korea", completion: 78, managerCompletion: 55, enrolled: 520, overdue: 50 },
      { name: "Greater China", completion: 65, managerCompletion: 38, enrolled: 1100, overdue: 180, flag: "Manager gap" },
      { name: "Southeast Asia", completion: 58, managerCompletion: 31, enrolled: 900, overdue: 200, flag: "Critical gap" },
      { name: "India", completion: 61, managerCompletion: 34, enrolled: 720, overdue: 140, flag: "Critical gap" },
      { name: "ANZ", completion: 89, managerCompletion: 74, enrolled: 360, overdue: 50 },
    ],
  },
];

interface TrainingProgram {
  id: string;
  name: string;
  shortName: string;
  globalCompletion: number;
  due: string;
  daysUntilDue: number;
}

const TRAINING_PROGRAMS: TrainingProgram[] = [
  { id: "all", name: "All Programs", shortName: "All", globalCompletion: 76, due: "", daysUntilDue: 0 },
  { id: "coc", name: "Code of Conduct Attestation", shortName: "Code of Conduct", globalCompletion: 72, due: "Mar 31, 2026", daysUntilDue: 21 },
  { id: "respect", name: "Workplace Respect", shortName: "Workplace Respect", globalCompletion: 76, due: "Apr 26, 2026", daysUntilDue: 47 },
  { id: "abc", name: "Anti-Bribery & Corruption", shortName: "Anti-Bribery", globalCompletion: 82, due: "Jun 1, 2026", daysUntilDue: 83 },
  { id: "privacy", name: "Data Privacy (GDPR/CCPA)", shortName: "Data Privacy", globalCompletion: 88, due: "Jul 15, 2026", daysUntilDue: 127 },
];

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const AMERICAS_CODES = new Set([
  "840","124","484","076","032","152","170","604","218","862",
  "068","600","858","328","740","591","188","340","320","222",
  "558","630","044","052","192","214","332","388","780",
]);
const EMEA_CODES = new Set([
  "826","372","276","040","756","250","528","056","442",
  "752","578","208","246","380","724","620","300","792",
  "643","804","616","203","703","348","100","642","688",
  "191","705","008","807","499","070",
  "682","784","414","512","634","048","400","760","368","364",
  "818","434","788","012","504","710","404","800","566",
  "288","384","120","180","562","466","854","694","768",
  "324","686","508","834","270","204","024","072","516",
]);
const APAC_CODES = new Set([
  "392","410","156","158","344","446","360","458","702",
  "764","704","608","104","116","418","036","554","356",
  "586","050","144","524","496","408",
]);

function getRegionForCountry(code: string): string | null {
  if (AMERICAS_CODES.has(code)) return "americas";
  if (EMEA_CODES.has(code)) return "emea";
  if (APAC_CODES.has(code)) return "apac";
  return null;
}

const REGION_LABELS: { id: string; coords: [number, number] }[] = [
  { id: "americas", coords: [-90, 20] },
  { id: "emea", coords: [20, 25] },
  { id: "apac", coords: [105, 20] },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
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

function pctColor(pct: number) {
  if (pct >= 80) return "#3fb950";
  if (pct >= 60) return "#fbbf24";
  return "#f87171";
}

/* ------------------------------------------------------------------ */
/*  Real World Map (compact)                                           */
/* ------------------------------------------------------------------ */

function RealWorldMap({
  regions,
  selected,
  onSelect,
  hoveredCountry,
  onHoverCountry,
}: {
  regions: Region[];
  selected: string;
  onSelect: (id: string) => void;
  hoveredCountry: string | null;
  onHoverCountry: (name: string | null) => void;
}) {
  const regionMap = useMemo(() => {
    const m: Record<string, Region> = {};
    for (const r of regions) m[r.id] = r;
    return m;
  }, [regions]);

  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{ scale: 120, center: [10, 25] }}
      style={{ width: "100%", height: "auto" }}
    >
      <ZoomableGroup>
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryCode = geo.id;
              const regionId = getRegionForCountry(countryCode);
              const region = regionId ? regionMap[regionId] : null;
              const isSelected = regionId === selected;
              const isHovered = geo.properties.name === hoveredCountry;

              let fill = "#f3f4f6";
              let stroke = "#d1d5db";
              let strokeWidth = 0.4;

              if (region) {
                if (isSelected) {
                  fill = `${region.color}30`;
                  stroke = region.color;
                  strokeWidth = isHovered ? 1.2 : 0.6;
                } else {
                  fill = `${region.color}12`;
                  stroke = `${region.color}40`;
                  strokeWidth = isHovered ? 0.8 : 0.3;
                }
                if (isHovered) fill = `${region.color}50`;
              }

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  onClick={() => { if (regionId) onSelect(regionId); }}
                  onMouseEnter={() => onHoverCountry(geo.properties.name)}
                  onMouseLeave={() => onHoverCountry(null)}
                  style={{
                    default: { outline: "none", cursor: regionId ? "pointer" : "default" },
                    hover: { outline: "none", cursor: regionId ? "pointer" : "default" },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>

        {REGION_LABELS.map(({ id, coords }) => {
          const r = regionMap[id];
          if (!r) return null;
          const isSel = id === selected;
          return (
            <Marker key={id} coordinates={coords}>
              <g onClick={() => onSelect(id)} className="cursor-pointer">
                {isSel && (
                  <circle r={18} fill="none" stroke={r.color} strokeWidth={0.5} strokeOpacity={0.4}>
                    <animate attributeName="r" from="18" to="35" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity" from="0.4" to="0" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                )}
                <text textAnchor="middle" y={-6} style={{ fontSize: 8, fontWeight: 800, fill: isSel ? r.color : "#9ca3af", letterSpacing: "0.5px" }}>
                  {r.name.toUpperCase()}
                </text>
                <text textAnchor="middle" y={8} style={{ fontSize: 14, fontWeight: 900, fill: isSel ? "#111827" : "#d1d5db" }}>
                  {r.completion}%
                </text>
                <text textAnchor="middle" y={18} style={{ fontSize: 6, fontWeight: 600, fill: isSel ? "#6b7280" : "#e5e7eb" }}>
                  {r.enrolled.toLocaleString()} enrolled
                </text>
              </g>
            </Marker>
          );
        })}
      </ZoomableGroup>
    </ComposableMap>
  );
}

/* ------------------------------------------------------------------ */
/*  Icon Sidebar                                                       */
/* ------------------------------------------------------------------ */

function IconSidebar() {
  const icons = [
    { id: "home", d: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" },
    { id: "compliance", d: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5h6M9 14l2 2 4-4", active: true },
    { id: "chart", d: "M3 3v18h18M7 16l4-4 4 4 4-6" },
    { id: "board", d: "M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zM8 2v4M16 2v4M3 10h18" },
    { id: "chat", d: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" },
  ];

  return (
    <aside className="w-12 flex-shrink-0 bg-white border-r border-[#e5e7eb] flex flex-col items-center py-3 gap-4">
      <div className="mb-2"><DiligentLogo size={20} /></div>
      {icons.map((ic) => (
        <div key={ic.id} className={`flex items-center justify-center w-8 h-8 rounded-md cursor-pointer transition-colors ${"active" in ic && ic.active ? "bg-[#dc2626]" : "hover:bg-gray-100"}`}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={"active" in ic && ic.active ? "#fff" : "#6b7280"} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d={ic.d} /></svg>
        </div>
      ))}
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function TrainingPage() {
  const [selectedRegion, setSelectedRegion] = useState("apac");
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [activeProgram, setActiveProgram] = useState("all");
  const region = REGIONS.find((r) => r.id === selectedRegion)!;

  const globalCompletion = Math.round(REGIONS.reduce((s, r) => s + r.completion * r.enrolled, 0) / REGIONS.reduce((s, r) => s + r.enrolled, 0));
  const totalOverdue = REGIONS.reduce((s, r) => s + r.overdue, 0);

  const handleHoverCountry = useCallback((name: string | null) => setHoveredCountry(name), []);

  const worstSubs = useMemo(() => {
    const all: (SubRegion & { regionName: string; regionColor: string })[] = [];
    for (const r of REGIONS) {
      for (const s of r.subRegions) {
        all.push({ ...s, regionName: r.name, regionColor: r.color });
      }
    }
    return all.sort((a, b) => a.completion - b.completion).slice(0, 5);
  }, []);

  const activeProg = TRAINING_PROGRAMS.find((p) => p.id === activeProgram)!;

  interface CompletedAction {
    urgency: string;
    urgencyColor: string;
    urgencyBg: string;
    status: string;
    timestamp: string;
    links: { label: string; style: "primary" | "muted" | "danger" }[];
  }

  const insightByRegion: Record<string, { headline: string; body: string; actions: CompletedAction[] }> = {
    apac: {
      headline: "APAC manager training at 41% — correlating with a 28% rise in manager-related Speak Up cases this quarter",
      body: "Southeast Asia and India are both under 35% for manager completion. This is the widest all-vs-manager gap across all regions. ANZ and Japan are healthy, but the volume in SE Asia and India is dragging the region down.",
      actions: [
        { urgency: "Urgent", urgencyColor: "#dc2626", urgencyBg: "#fef2f2", status: "Reminders sent to 149 managers in Southeast Asia & India who haven't completed training", timestamp: "Today at 2:12 PM", links: [{ label: "See email text", style: "primary" }, { label: "Rescind email", style: "danger" }] },
        { urgency: "High", urgencyColor: "#d97706", urgencyBg: "#fffbeb", status: "Targeted reminders sent to 680 overdue APAC employees — 3 follow-ups scheduled before Apr 26 deadline", timestamp: "Today at 2:12 PM", links: [{ label: "See email text", style: "primary" }, { label: "View schedule", style: "muted" }, { label: "Rescind emails", style: "danger" }] },
        { urgency: "Done", urgencyColor: "#16a34a", urgencyBg: "#dcfce7", status: "Priya Sharma (L&D Director APAC) notified with a 30-day remediation brief and this regional breakdown attached", timestamp: "Today at 2:13 PM", links: [{ label: "See message", style: "primary" }, { label: "Rescind", style: "danger" }] },
      ],
    },
    americas: {
      headline: "Americas at 78% but Mexico and Brazil are under 63% — US Pacific managers at 48% despite strong overall numbers",
      body: "Canada and US East Coast are performing well and could serve as models. The real risk is concentrated in LATAM (Mexico 62%, Brazil 58%) and in the US Pacific manager gap (48% vs 75% overall).",
      actions: [
        { urgency: "Urgent", urgencyColor: "#dc2626", urgencyBg: "#fef2f2", status: "Escalation sent to LATAM regional leads — Mexico and Brazil training owners notified with 85 overdue employees flagged", timestamp: "Today at 2:14 PM", links: [{ label: "See escalation", style: "primary" }, { label: "Rescind", style: "danger" }] },
        { urgency: "High", urgencyColor: "#d97706", urgencyBg: "#fffbeb", status: "US Pacific manager gap flagged to regional L&D — investigation brief shared with 48% vs 75% analysis", timestamp: "Today at 2:14 PM", links: [{ label: "See brief", style: "primary" }, { label: "Rescind", style: "danger" }] },
        { urgency: "Done", urgencyColor: "#16a34a", urgencyBg: "#dcfce7", status: "Canada's 88% completion playbook packaged and shared with Americas regional training leads as a replication model", timestamp: "Today at 2:15 PM", links: [{ label: "See playbook", style: "primary" }, { label: "Rescind", style: "danger" }] },
      ],
    },
    emea: {
      headline: "EMEA leads at 85% — but Southern Europe and Middle East & Africa need manager-level attention",
      body: "Nordics (92%) and UK (91%) are top performers. Southern Europe managers at 54% and Middle East & Africa at 42% are the weak points. The EU Whistleblower Directive makes training compliance legally critical across all EU member states.",
      actions: [
        { urgency: "High", urgencyColor: "#d97706", urgencyBg: "#fffbeb", status: "Reminders sent to 90 managers in Southern Europe and ME&A who are below the completion threshold before regulatory audits", timestamp: "Today at 2:16 PM", links: [{ label: "See email text", style: "primary" }, { label: "Rescind emails", style: "danger" }] },
        { urgency: "Done", urgencyColor: "#16a34a", urgencyBg: "#dcfce7", status: "ME&A completion gap flagged on the EU Whistleblower Directive compliance review agenda for next cycle", timestamp: "Today at 2:16 PM", links: [{ label: "See review entry", style: "primary" }, { label: "Remove flag", style: "danger" }] },
        { urgency: "Done", urgencyColor: "#16a34a", urgencyBg: "#dcfce7", status: "Recognition sent to Nordics and UK teams — completion rates above 90% highlighted as benchmark for other EMEA regions", timestamp: "Today at 2:17 PM", links: [{ label: "See message", style: "primary" }, { label: "Rescind", style: "danger" }] },
      ],
    },
  };

  const insight = insightByRegion[selectedRegion];

  return (
    <div className="flex h-screen bg-white text-[#374151] overflow-hidden">
      <IconSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top nav */}
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

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto px-6 py-5">
            {/* Breadcrumb + title */}
            <div className="flex items-center gap-2 text-[12px] text-[#6b7280] mb-3">
              <Link href="/light" className="hover:text-[#2563eb]">Connected Compliance</Link>
              <span>›</span>
              <Link href="/light/dashboard" className="hover:text-[#2563eb]">Dashboard</Link>
              <span>›</span>
              <span className="text-[#374151]">Training Compliance</span>
            </div>

            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 className="text-xl font-bold text-[#111827]">Training Compliance by Region</h1>
                <p className="text-[13px] text-[#6b7280] mt-0.5">Global completion <span className="font-bold" style={{ color: pctColor(globalCompletion) }}>{globalCompletion}%</span> · <span className="text-[#dc2626] font-semibold">{totalOverdue.toLocaleString()} overdue</span> · Updated Mar 10, 2026</p>
              </div>
              <div className="flex gap-2">
                <button className="rounded-lg border border-[#d1d5db] bg-[#f3f4f6] px-3 py-2 text-xs font-semibold text-[#374151] hover:bg-gray-200 transition-colors">Export Report</button>
              </div>
            </div>

            {/* ============================================================ */}
            {/*  SECTION 1: AI Insight + Actions (hero position)             */}
            {/* ============================================================ */}
            <div className="rounded-xl border border-[#d1d5db] bg-white mb-5 overflow-hidden">
              {/* Headline bar */}
              <div className="flex items-start gap-3 px-5 py-4 border-b border-[#e5e7eb]" style={{ background: `${region.color}08` }}>
                <div className="w-9 h-9 rounded-lg bg-[#f5f3ff] border border-[#8b5cf6] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#7c3aed]">AI Insight</span>
                    <span className="text-[9px] text-[#d1d5db]">·</span>
                    <span className="text-[9px] text-[#6b7280]">{region.name} region selected</span>
                  </div>
                  <p className="text-[14px] font-semibold text-[#111827] leading-snug">{insight.headline}</p>
                  <p className="text-[12px] text-[#6b7280] mt-1.5 leading-relaxed">{insight.body}</p>
                </div>
              </div>

              {/* Actions already taken */}
              <div className="px-5 py-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">What&apos;s Already Underway</span>
                  <span className="text-[9px] text-[#9ca3af] ml-1">Actions taken by your compliance agent</span>
                </div>
                <div className="space-y-2">
                  {insight.actions.map((a, i) => (
                    <div key={i} className="rounded-lg border px-4 py-3" style={{ borderColor: `${a.urgencyColor}20`, background: `${a.urgencyBg}20` }}>
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-1.5 mt-0.5 flex-shrink-0 w-[78px]">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={a.urgencyColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                          <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: a.urgencyColor }}>{a.urgency}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] text-[#111827] leading-relaxed">{a.status}</p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[10px] text-[#9ca3af]">{a.timestamp}</span>
                            <span className="text-[10px] text-[#d1d5db]">·</span>
                            {a.links.map((link, li) => (
                              <button
                                key={li}
                                className="text-[10px] font-semibold transition-colors"
                                style={{
                                  color: link.style === "primary" ? "#2563eb" : link.style === "danger" ? "#dc262680" : "#6b7280",
                                }}
                              >
                                {link.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* People notified */}
                <div className="flex items-center gap-5 mt-4 pt-3 border-t border-[#e5e7eb]">
                  <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">Notified</span>
                  {[
                    { initials: "PS", name: "Priya Sharma", role: "L&D APAC", time: "2:13 PM" },
                    { initials: "EV", name: "Elena Vasquez", role: "Head of Policy", time: "2:14 PM" },
                    { initials: "JO", name: "James Okafor", role: "Speak Up Lead", time: "2:15 PM" },
                  ].map((p) => (
                    <div key={p.initials} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#f3f4f6] border border-[#d1d5db] flex items-center justify-center text-[8px] font-semibold text-[#374151]">{p.initials}</div>
                      <div>
                        <span className="text-[11px] font-medium text-[#374151]">{p.name}</span>
                        <span className="text-[10px] text-[#9ca3af] ml-1">{p.role}</span>
                      </div>
                      <span className="text-[9px] text-[#16a34a]">Notified {p.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/*  SECTION 2: Training Program Tabs                            */}
            {/* ============================================================ */}
            <div className="flex items-center gap-1 mb-5 border-b border-[#e5e7eb] overflow-x-auto">
              {TRAINING_PROGRAMS.map((p) => {
                const isActive = p.id === activeProgram;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActiveProgram(p.id)}
                    className="relative flex items-center gap-2 px-4 py-2.5 text-[12px] font-semibold transition-colors whitespace-nowrap"
                    style={{ color: isActive ? "#111827" : "#9ca3af" }}
                  >
                    {p.shortName}
                    {p.id !== "all" && (
                      <span className="text-[10px] font-bold" style={{ color: pctColor(p.globalCompletion) }}>{p.globalCompletion}%</span>
                    )}
                    {p.daysUntilDue > 0 && p.daysUntilDue <= 30 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626]" />
                    )}
                    {isActive && <div className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-[#2563eb]" />}
                  </button>
                );
              })}
              {activeProg.id !== "all" && (
                <div className="ml-auto flex items-center gap-2 text-[11px] text-[#6b7280] pr-2 flex-shrink-0">
                  <span>Due: <span className="text-[#111827] font-semibold">{activeProg.due}</span></span>
                  {activeProg.daysUntilDue <= 30 && (
                    <span className="text-[#dc2626] font-bold">{activeProg.daysUntilDue} days</span>
                  )}
                </div>
              )}
            </div>

            {/* ============================================================ */}
            {/*  SECTION 3: Map + Worst Sub-Regions (side by side)           */}
            {/* ============================================================ */}
            <div className="flex gap-5 mb-5">
              {/* Map */}
              <div className="flex-1 min-w-0 relative rounded-xl border border-[#d1d5db] bg-[#f9fafb] overflow-hidden">
                {hoveredCountry && (
                  <div className="absolute top-3 left-3 z-10 rounded-md bg-white/95 border border-[#d1d5db] px-2.5 py-1.5 pointer-events-none">
                    <span className="text-[11px] font-semibold text-[#111827]">{hoveredCountry}</span>
                  </div>
                )}
                <RealWorldMap
                  regions={REGIONS}
                  selected={selectedRegion}
                  onSelect={setSelectedRegion}
                  hoveredCountry={hoveredCountry}
                  onHoverCountry={handleHoverCountry}
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-4 rounded-md bg-white/90 border border-[#e5e7eb] px-3 py-1.5">
                  {REGIONS.map((r) => (
                    <div key={r.id} className="flex items-center gap-1.5 cursor-pointer" onClick={() => setSelectedRegion(r.id)}>
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ background: r.color, opacity: r.id === selectedRegion ? 1 : 0.35 }} />
                      <span className="text-[9px] font-semibold" style={{ color: r.id === selectedRegion ? r.color : "#9ca3af" }}>{r.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Worst sub-regions */}
              <div className="w-[320px] flex-shrink-0 rounded-xl border border-[#d1d5db] bg-white p-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#dc2626]">Lowest Completion</h3>
                </div>
                <p className="text-[11px] text-[#6b7280] mb-3">Bottom 5 sub-regions across all geographies</p>
                <div className="space-y-2">
                  {worstSubs.map((s, i) => (
                    <div
                      key={s.name}
                      className="flex items-center gap-3 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2.5 cursor-pointer hover:border-[#d1d5db] transition-colors"
                      onClick={() => {
                        const parentRegion = REGIONS.find((r) => r.subRegions.some((sr) => sr.name === s.name));
                        if (parentRegion) setSelectedRegion(parentRegion.id);
                      }}
                    >
                      <span className="text-[11px] font-extrabold text-[#9ca3af] w-4 text-right">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] font-semibold text-[#111827]">{s.name}</span>
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded" style={{ color: s.regionColor, background: `${s.regionColor}15`, border: `1px solid ${s.regionColor}25` }}>{s.regionName}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-[#9ca3af] mt-0.5">
                          <span>{s.overdue} overdue</span>
                          <span>Mgr: {s.managerCompletion}%</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[16px] font-extrabold tabular-nums" style={{ color: pctColor(s.completion) }}>{s.completion}%</span>
                        {s.flag && <span className="text-[8px] font-bold" style={{ color: pctColor(s.completion) }}>{s.flag}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/*  SECTION 4: Region tabs + sub-region detail                  */}
            {/* ============================================================ */}
            <div className="rounded-xl border border-[#d1d5db] bg-white overflow-hidden">
              {/* Region tabs */}
              <div className="flex border-b border-[#e5e7eb]">
                {REGIONS.map((r) => {
                  const isSel = r.id === selectedRegion;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRegion(r.id)}
                      className="flex-1 flex items-center justify-center gap-3 py-3 border-b-2 transition-all"
                      style={{ borderBottomColor: isSel ? r.color : "transparent", background: isSel ? `${r.color}08` : "transparent" }}
                    >
                      <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: isSel ? r.color : "#9ca3af" }}>{r.name}</span>
                      <span className="text-lg font-extrabold" style={{ color: isSel ? "#111827" : "#d1d5db" }}>{r.completion}%</span>
                      <span className="text-[10px]" style={{ color: isSel ? "#6b7280" : "#e5e7eb" }}>Mgr {r.managerCompletion}%</span>
                      {r.overdue > 400 && <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626]" />}
                    </button>
                  );
                })}
              </div>

              {/* Sub-region rows */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] text-[#6b7280]">{region.subRegions.length} sub-regions · {region.enrolled.toLocaleString()} employees · {region.overdue} overdue</p>
                  <div className="flex items-center gap-4 text-[10px] text-[#9ca3af]">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#16a34a]" /><span>≥80%</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#d97706]" /><span>60-79%</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#dc2626]" /><span>&lt;60%</span></div>
                  </div>
                </div>
                <div className="space-y-2">
                  {[...region.subRegions].sort((a, b) => a.completion - b.completion).map((sub) => (
                    <div key={sub.name} className="flex items-center gap-3 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 hover:border-[#d1d5db] transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[13px] font-semibold text-[#111827]">{sub.name}</span>
                          {sub.flag && (
                            <span
                              className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                              style={{
                                color: sub.flag === "Critical gap" ? "#f87171" : sub.flag === "Low completion" ? "#fbbf24" : "#ea580c",
                                background: sub.flag === "Critical gap" ? "#fef2f2" : sub.flag === "Low completion" ? "#fffbeb40" : "#fff7ed40",
                                border: `1px solid ${sub.flag === "Critical gap" ? "#fecaca" : sub.flag === "Low completion" ? "#fde68a40" : "#fed7aa40"}`,
                              }}
                            >
                              {sub.flag}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-[11px] text-[#6b7280]">
                          <span>{sub.enrolled.toLocaleString()} enrolled</span>
                          <span className={sub.overdue > 100 ? "text-[#dc2626] font-semibold" : ""}>{sub.overdue} overdue</span>
                        </div>
                      </div>

                      <div className="w-40 flex-shrink-0 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-[#6b7280] w-8">All</span>
                          <div className="flex-1 h-2 rounded-full bg-[#f3f4f6] overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${sub.completion}%`, background: pctColor(sub.completion) }} />
                          </div>
                          <span className="text-[10px] font-bold tabular-nums w-8 text-right" style={{ color: pctColor(sub.completion) }}>{sub.completion}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-[#6b7280] w-8">Mgr</span>
                          <div className="flex-1 h-2 rounded-full bg-[#f3f4f6] overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${sub.managerCompletion}%`, background: pctColor(sub.managerCompletion) }} />
                          </div>
                          <span className="text-[10px] font-bold tabular-nums w-8 text-right" style={{ color: pctColor(sub.managerCompletion) }}>{sub.managerCompletion}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
