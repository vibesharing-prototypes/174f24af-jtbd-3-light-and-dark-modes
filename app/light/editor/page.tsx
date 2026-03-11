"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

type SuggestionStatus = "pending" | "accepted" | "rejected";

/* ------------------------------------------------------------------ */
/*  Selection Popup                                                    */
/* ------------------------------------------------------------------ */

interface SelectionPopup {
  x: number;
  y: number;
  text: string;
}

function useTextSelectionPopup(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [popup, setPopup] = useState<SelectionPopup | null>(null);

  const handleMouseUp = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) {
      return;
    }

    if (containerRef.current && !containerRef.current.contains(sel.anchorNode)) {
      return;
    }

    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    setPopup({
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top - containerRect.top - 8,
      text: sel.toString().trim(),
    });
  }, [containerRef]);

  const dismiss = useCallback(() => setPopup(null), []);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-selection-popup]")) return;
      setPopup(null);
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [handleMouseUp]);

  return { popup, dismiss };
}

function generateRewrite(original: string, mode: "formal" | "concise" | "example"): string {
  const trimmed = original.length > 200 ? original.slice(0, 200) : original;

  if (mode === "formal") {
    if (trimmed.toLowerCase().includes("bribery") || trimmed.toLowerCase().includes("financial")) {
      return "No officer, director, employee, or authorized agent of the Corporation shall, directly or through any intermediary, offer, promise, authorize, or provide any payment, gift, or other thing of value to any person — including but not limited to government officials, private-sector counterparts, and third-party facilitators — for the purpose of improperly influencing any act or decision, in strict accordance with the UK Bribery Act 2010 (as amended) and all applicable anti-corruption legislation.";
    }
    if (trimmed.toLowerCase().includes("whistleblower") || trimmed.toLowerCase().includes("reports concerns")) {
      return "The Corporation shall ensure that any individual who, acting in good faith and on reasonable grounds, discloses information regarding suspected misconduct, violations of law, or breaches of this Code shall be afforded the full protections available under applicable law — including, without limitation, the EU Whistleblower Protection Directive (2019/1937) — and shall not be subjected to any form of retaliation, adverse employment action, or discriminatory treatment.";
    }
    return "The Corporation hereby establishes and mandates compliance with the following provision, which shall apply to all officers, directors, employees, contractors, and agents operating within any jurisdiction in which the Corporation conducts business, without exception or limitation.";
  }

  if (mode === "concise") {
    if (trimmed.toLowerCase().includes("bribery") || trimmed.toLowerCase().includes("financial")) {
      return "Bribery in any form is prohibited — including facilitation payments and payments through intermediaries. Violations will result in disciplinary action and potential criminal liability under the UK Bribery Act.";
    }
    if (trimmed.toLowerCase().includes("whistleblower") || trimmed.toLowerCase().includes("reports concerns")) {
      return "Good-faith reporters are protected from retaliation. Reports are acknowledged within 7 days with feedback within 3 months, per the EU Whistleblower Directive.";
    }
    return "All employees must comply with this provision. Violations are subject to disciplinary action up to and including termination.";
  }

  // example
  if (trimmed.toLowerCase().includes("bribery") || trimmed.toLowerCase().includes("financial")) {
    return original + "\n\nExample: An employee arranging a $500 gift card for a government inspector to expedite a permit approval would constitute a prohibited facilitation payment — even if such payments are considered customary in the local jurisdiction. This applies equally whether the payment is made directly or through a local agent or consultant.";
  }
  if (trimmed.toLowerCase().includes("whistleblower") || trimmed.toLowerCase().includes("reports concerns")) {
    return original + "\n\nExample: If an employee in the Berlin office discovers that expense reports are being systematically falsified by a team lead, they may submit an anonymous report through the Diligent Speak Up channel. The Compliance team must acknowledge receipt within 7 days and provide a status update within 3 months. The reporter cannot be reassigned, demoted, or otherwise penalized for making the report.";
  }
  return original + "\n\nExample: A manager who becomes aware of a potential violation of this Code must report it to the Compliance team within 48 hours. Failure to report known violations may itself constitute a breach of this Code.";
}

function SelectionToolbar({ popup, onAction, onDismiss }: { popup: SelectionPopup; onAction: (action: string) => void; onDismiss: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [rewriteMode, setRewriteMode] = useState<"formal" | "concise" | "example" | null>(null);
  const selectedSnippet = popup.text.length > 60 ? popup.text.slice(0, 57) + "..." : popup.text;

  const actions = [
    { id: "edit", icon: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7", label: "Edit directly", color: "#2563eb" },
    { id: "source", icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5", label: "See AI source", color: "#7c3aed" },
    { id: "peers", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75", label: "How peers phrase this", color: "#d97706" },
  ];

  const rewriteActions: { id: "formal" | "concise" | "example"; icon: string; label: string; color: string }[] = [
    { id: "formal", icon: "M4 7V4h16v3M9 20h6M12 4v16", label: "More formal", color: "#7c3aed" },
    { id: "concise", icon: "M21 10H3M21 6H3M21 14H3M15 18H3", label: "More concise", color: "#16a34a" },
    { id: "example", icon: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M12 12h.01M8 12h.01M16 12h.01", label: "Add example", color: "#d97706" },
  ];

  const sourceContent: Record<string, { title: string; body: string }> = {
    source: {
      title: "AI Source & Reasoning",
      body: "This language was generated from the UK Bribery Act 2010 (as amended Nov 2025), cross-referenced with EU Anti-Corruption Directive guidance and SEC enforcement trends. The phrasing \"directly or through intermediaries\" was added based on 4 recent enforcement actions where intermediary payments were at issue.",
    },
    peers: {
      title: "How Peers Phrase This",
      body: "Among 12 peer companies in financial services and technology (anonymized benchmark data), 9 out of 12 explicitly reference the UK Bribery Act by name. 7 out of 12 include the \"facilitation payments\" prohibition. The average section length for anti-bribery clauses is 180 words vs. your current 42 words.",
    },
  };

  const rewriteResult = rewriteMode ? generateRewrite(popup.text, rewriteMode) : null;
  const rewriteLabels: Record<string, string> = { formal: "More Formal", concise: "More Concise", example: "With Example" };

  return (
    <div
      data-selection-popup
      className="absolute z-50 animate-fade-in-up"
      style={{ left: popup.x, top: popup.y, transform: "translate(-50%, -100%)" }}
    >
      {/* Expanded detail card */}
      {expanded && expanded !== "edit" && sourceContent[expanded] && !rewriteMode && (
        <div className="mb-2 w-[340px] rounded-lg border border-[#d1d5db] bg-[#f9fafb] p-4 shadow-xl shadow-black/10">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[12px] font-bold text-[#111827]">{sourceContent[expanded].title}</h4>
            <button onClick={() => setExpanded(null)} className="text-[#9ca3af] hover:text-[#6b7280] transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
          <p className="text-[11px] text-[#6b7280] leading-relaxed mb-3">{sourceContent[expanded].body}</p>
          <div className="rounded-md bg-[#ffffff] border border-[#e5e7eb] px-3 py-2">
            <p className="text-[10px] text-[#9ca3af] mb-1">Selected text</p>
            <p className="text-[11px] text-[#374151] italic">&ldquo;{selectedSnippet}&rdquo;</p>
          </div>
        </div>
      )}

      {/* Rewrite result card */}
      {rewriteMode && rewriteResult && (
        <div className="mb-2 w-[400px] rounded-lg border border-[#d1d5db] bg-[#f9fafb] p-4 shadow-xl shadow-black/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
              <h4 className="text-[12px] font-bold text-[#111827]">AI Rewrite — {rewriteLabels[rewriteMode]}</h4>
            </div>
            <button onClick={() => setRewriteMode(null)} className="text-[#9ca3af] hover:text-[#6b7280] transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Original */}
          <div className="rounded-md bg-[#ffffff] border border-[#e5e7eb] px-3 py-2 mb-3">
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#9ca3af] mb-1">Original</p>
            <p className="text-[11px] text-[#6b7280] leading-relaxed line-through">{selectedSnippet}</p>
          </div>

          {/* Rewrite */}
          <div className="rounded-md border border-[#7c3aed]/30 bg-[#7c3aed]/5 px-3 py-2 mb-3">
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#7c3aed] mb-1">Suggested rewrite</p>
            <p className="text-[11px] text-[#374151] leading-relaxed whitespace-pre-line">{rewriteResult}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { onAction("accept-rewrite"); onDismiss(); }}
              className="flex items-center gap-1.5 rounded-md bg-[#16a34a]/20 text-[#16a34a] text-[11px] font-semibold px-3 py-1.5 hover:bg-[#16a34a]/30 transition-colors"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              Accept rewrite
            </button>
            <button
              onClick={() => setRewriteMode(null)}
              className="rounded-md text-[#6b7280] text-[11px] font-medium px-3 py-1.5 hover:bg-gray-100 transition-colors"
            >
              Try another
            </button>
            <button
              onClick={() => { onAction("edit"); onDismiss(); }}
              className="rounded-md text-[#2563eb] text-[11px] font-medium px-3 py-1.5 hover:bg-gray-100 transition-colors"
            >
              Edit manually
            </button>
          </div>
        </div>
      )}

      {/* Main toolbar */}
      <div className="rounded-lg border border-[#d1d5db] bg-[#f9fafb] shadow-xl shadow-black/10 overflow-hidden">
        {/* Row 1: Inspect actions */}
        <div className="flex items-center gap-0.5 p-1">
          {actions.map((a) => (
            <button
              key={a.id}
              onClick={() => {
                if (a.id === "edit") {
                  onAction("edit");
                  onDismiss();
                } else {
                  setRewriteMode(null);
                  setExpanded(expanded === a.id ? null : a.id);
                }
              }}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors hover:bg-gray-100"
              style={{ color: expanded === a.id && !rewriteMode ? a.color : "#6b7280" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={a.icon} /></svg>
              {a.label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-[#f3f4f6]" />

        {/* Row 2: Rewrite actions */}
        <div className="flex items-center gap-0.5 p-1">
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#d1d5db] px-2">Rewrite</span>
          {rewriteActions.map((a) => (
            <button
              key={a.id}
              onClick={() => {
                setExpanded(null);
                setRewriteMode(rewriteMode === a.id ? null : a.id);
              }}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors hover:bg-gray-100"
              style={{ color: rewriteMode === a.id ? a.color : "#6b7280" }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={a.icon} /></svg>
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Arrow */}
      <div className="flex justify-center -mt-px">
        <div className="w-2 h-2 rotate-45 bg-[#f9fafb] border-r border-b border-[#d1d5db]" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PolicyEditorPage() {
  const [suggestions, setSuggestions] = useState<Record<string, SuggestionStatus>>({
    section3: "pending",
    section5: "pending",
    section7: "pending",
  });
  const [submitted, setSubmitted] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const { popup, dismiss } = useTextSelectionPopup(editorRef);

  const updateSuggestion = (key: string, status: SuggestionStatus) => {
    setSuggestions((prev) => ({ ...prev, [key]: status }));
  };

  const acceptAll = () => {
    setSuggestions({ section3: "accepted", section5: "accepted", section7: "accepted" });
  };

  const complianceItems = [
    { label: "UK Bribery Act 2010", dependsOn: "section3" },
    { label: "EU Whistleblower Directive 2019/1937", dependsOn: "section5" },
    { label: "Singapore MOM Workplace Standards", dependsOn: "section7" },
    { label: "SOX Compliance Language", dependsOn: null },
    { label: "APAC Regional Requirements", dependsOn: "section7" },
  ];

  return (
    <div className="flex h-screen bg-[#ffffff] text-[#374151]">
      <div className="w-12 flex-shrink-0 bg-[#ffffff] border-r border-[#d1d5db] flex flex-col items-center pt-3 gap-4">
        <svg viewBox="0 0 222 222" width={20} height={20}>
          <path fill="#EE312E" d="M200.87,110.85c0,33.96-12.19,61.94-33.03,81.28c-0.24,0.21-0.42,0.43-0.66,0.64c-15.5,14.13-35.71,23.52-59.24,27.11l-1.59-1.62l35.07-201.75l1.32-3.69C178.64,30.36,200.87,65.37,200.87,110.85z" />
          <path fill="#AF292E" d="M142.75,12.83l-0.99,1.47L0.74,119.34L0,118.65c0,0,0-0.03,0-0.06V0.45h85.63c5.91,0,11.64,0.34,17.19,1.01h0.21c14.02,1.66,26.93,5.31,38.48,10.78C141.97,12.46,142.75,12.83,142.75,12.83z" />
          <path fill="#D3222A" d="M142.75,12.83L0,118.65v99.27v3.62h85.96c7.61,0,14.94-0.58,21.99-1.66C107.95,219.89,142.75,12.83,142.75,12.83z" />
        </svg>
        <div className="w-6 h-px bg-[#d1d5db]" />
        <button className="w-8 h-8 rounded flex items-center justify-center text-[#6b7280] hover:text-[#111827] hover:bg-gray-100 transition-colors">
          <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
        </button>
        <button className="w-8 h-8 rounded flex items-center justify-center text-[#6b7280] hover:text-[#111827] hover:bg-gray-100 transition-colors">
          <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
        </button>
        <button className="w-8 h-8 rounded flex items-center justify-center text-[#6b7280] hover:text-[#111827] hover:bg-gray-100 transition-colors">
          <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx={11} cy={11} r={8} /><path d="M21 21l-4.35-4.35" /></svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-12 flex-shrink-0 border-b border-[#d1d5db] flex items-center justify-between px-4">
          <span className="text-[#111827] font-semibold text-sm">Acme Co.</span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#6b7280]">Ronald Chen</span>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">RC</div>
          </div>
        </div>

        <div className="h-10 flex-shrink-0 border-b border-[#d1d5db] flex items-center px-4 gap-1.5 text-xs">
          <Link href="/light" className="text-[#2563eb] hover:underline">Connected Compliance</Link>
          <span className="text-[#6b7280]">/</span>
          <Link href="/light/dashboard" className="text-[#2563eb] hover:underline">Dashboard</Link>
          <span className="text-[#6b7280]">/</span>
          <Link href="/light/tasks" className="text-[#2563eb] hover:underline">Code of Conduct Review</Link>
          <span className="text-[#6b7280]">/</span>
          <span className="text-[#374151]">Policy Editor</span>
        </div>

        {/* Hint bar */}
        <div className="flex-shrink-0 border-b border-[#e5e7eb] bg-[#f9fafb]/50 px-4 py-2 flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
          <span className="text-[11px] text-[#6b7280]">Select any text to edit directly, see the AI source, or compare with peer policies</span>
        </div>

        <div className="flex-1 flex min-h-0">
          {/* Editor area */}
          <div ref={editorRef} className="relative flex-1 overflow-y-auto p-6 min-w-0">
            {popup && (
              <SelectionToolbar
                popup={popup}
                onAction={(action) => { /* handle edit action */ }}
                onDismiss={dismiss}
              />
            )}

            <div className="mb-5">
              <h1 className="text-2xl font-bold text-[#111827] mb-1">Global Code of Conduct</h1>
              <p className="text-xs text-[#6b7280]">Version 4.2 · Last updated Jan 15, 2025 · Next review: Mar 31, 2026</p>
            </div>

            <div className="flex items-center gap-1 bg-[#f9fafb] border border-[#d1d5db] rounded-lg px-2 py-1.5 mb-6 w-fit">
              {[
                { label: "Bold", path: "M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6zM6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" },
                { label: "Italic", path: "M19 4h-9M14 20H5M15 4L9 20" },
                { label: "Heading", path: "M6 4v16M18 4v16M6 12h12" },
                { label: "List", path: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" },
              ].map((btn) => (
                <button key={btn.label} title={btn.label} className="w-7 h-7 flex items-center justify-center rounded text-[#6b7280] hover:text-[#111827] hover:bg-gray-100 transition-colors">
                  <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d={btn.path} /></svg>
                </button>
              ))}
              <div className="w-px h-4 bg-[#d1d5db] mx-1" />
              <button title="Undo" className="w-7 h-7 flex items-center justify-center rounded text-[#6b7280] hover:text-[#111827] hover:bg-gray-100 transition-colors">
                <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10h10a5 5 0 015 5v0a5 5 0 01-5 5H3" /><path d="M7 6l-4 4 4 4" /></svg>
              </button>
              <button title="Redo" className="w-7 h-7 flex items-center justify-center rounded text-[#6b7280] hover:text-[#111827] hover:bg-gray-100 transition-colors">
                <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10H11a5 5 0 00-5 5v0a5 5 0 005 5h10" /><path d="M17 6l4 4-4 4" /></svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-[#f9fafb] border border-[#d1d5db] rounded-lg p-5">
                <h3 className="text-sm font-semibold text-[#111827] mb-3">1. Purpose and Scope</h3>
                <p className="text-sm leading-relaxed text-[#374151]">This Code of Conduct establishes the standards of behavior expected of all employees, contractors, and agents of Acme Corporation worldwide. It applies to all business activities and interactions, both within the organization and with external parties, and reflects our commitment to ethical conduct in every jurisdiction where we operate.</p>
              </div>

              <div className="bg-[#f9fafb] border border-[#d1d5db] rounded-lg p-5">
                <h3 className="text-sm font-semibold text-[#111827] mb-3">2. Conflicts of Interest</h3>
                <p className="text-sm leading-relaxed text-[#374151]">Employees must avoid situations where personal interests conflict, or could appear to conflict, with the interests of the company. Any actual or potential conflict must be disclosed promptly to the employee&apos;s manager and the Compliance team. This includes outside employment, financial interests in competitors or suppliers, and personal relationships that may influence business decisions.</p>
              </div>

              <SuggestionBlock
                sectionNumber="3"
                sectionTitle="Anti-Bribery and Corruption"
                originalText="Employees must not offer, promise, or give any financial or other advantage to any person with the intention of inducing them to act improperly."
                suggestedText="Employees must not offer, promise, give, or receive any financial or other advantage — directly or through intermediaries — with the intention of inducing improper conduct. This includes facilitation payments, which are prohibited regardless of local custom or practice, in accordance with the UK Bribery Act 2010 as amended."
                status={suggestions.section3}
                onAccept={() => updateSuggestion("section3", "accepted")}
                onReject={() => updateSuggestion("section3", "rejected")}
              />

              <div className="bg-[#f9fafb] border border-[#d1d5db] rounded-lg p-5">
                <h3 className="text-sm font-semibold text-[#111827] mb-3">4. Data Protection and Privacy</h3>
                <p className="text-sm leading-relaxed text-[#374151]">The company is committed to protecting personal data in accordance with applicable privacy laws, including the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA). Employees must handle personal data only as necessary for legitimate business purposes, ensure appropriate safeguards are in place, and report any suspected data breaches immediately to the Data Protection Officer.</p>
              </div>

              <SuggestionBlock
                sectionNumber="5"
                sectionTitle="Whistleblower Protections"
                originalText="Any employee who reports concerns in good faith is protected from retaliation under this Code and applicable law."
                suggestedText={`Any employee who reports concerns in good faith is protected from retaliation under this Code and applicable law, including the EU Whistleblower Directive (2019/1937). Reports may be submitted through the company\u2019s confidential reporting channels, and the organization is required to acknowledge receipt within 7 days and provide feedback within 3 months.`}
                status={suggestions.section5}
                onAccept={() => updateSuggestion("section5", "accepted")}
                onReject={() => updateSuggestion("section5", "rejected")}
              />

              <div className="bg-[#f9fafb] border border-[#d1d5db] rounded-lg p-5">
                <h3 className="text-sm font-semibold text-[#111827] mb-3">6. Workplace Conduct</h3>
                <p className="text-sm leading-relaxed text-[#374151]">Acme Corporation is committed to maintaining a respectful workplace free from harassment, discrimination, and bullying. All employees are expected to treat colleagues, clients, and partners with dignity. Reports of misconduct will be investigated promptly and confidentially, and appropriate disciplinary action will be taken where warranted.</p>
              </div>

              <SuggestionBlock
                sectionNumber="7"
                sectionTitle="Training and Attestation"
                originalText="All employees are required to complete Code of Conduct training within 30 days of hire and annually thereafter."
                suggestedText="All employees are required to complete Code of Conduct training within 30 days of hire and annually thereafter. Managers and supervisors must complete enhanced training on harassment prevention, anti-bribery obligations, and their reporting responsibilities. Attestation records are maintained centrally and reported quarterly to the Compliance Committee."
                status={suggestions.section7}
                onAccept={() => updateSuggestion("section7", "accepted")}
                onReject={() => updateSuggestion("section7", "rejected")}
              />
            </div>
          </div>

          {/* Right panel */}
          <div className="w-[380px] flex-shrink-0 border-l border-[#d1d5db] flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="bg-[#f9fafb] border border-[#d1d5db] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <svg width={12} height={12} fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                  </div>
                  <h3 className="text-sm font-semibold text-[#111827]">AI Compliance Assistant</h3>
                </div>
                <p className="text-xs text-[#6b7280] mb-4 leading-relaxed">3 sections need updates based on recent regulatory changes. Here&apos;s my reasoning:</p>
                <div className="space-y-3">
                  <RationaleItem title="Anti-Bribery (Section 3)" description="Updated to explicitly prohibit facilitation payments and reference the UK Bribery Act amendments. This aligns with guidance issued Nov 2025." status={suggestions.section3} />
                  <RationaleItem title="Whistleblower (Section 5)" description="Added EU Directive requirements for acknowledgment timelines and feedback periods. Required for compliance in all EU member states." status={suggestions.section5} />
                  <RationaleItem title="Training (Section 7)" description="Added manager-specific training requirements. This addresses the correlation between low manager training completion and rising Speak Up cases in APAC." status={suggestions.section7} />
                </div>
              </div>

              <div className="bg-[#f9fafb] border border-[#d1d5db] rounded-lg p-4">
                <h3 className="text-sm font-semibold text-[#111827] mb-3">Regulatory Compliance Check</h3>
                <div className="space-y-2.5">
                  {complianceItems.map((item) => {
                    const satisfied = item.dependsOn === null ? true : suggestions[item.dependsOn] === "accepted";
                    return (
                      <div key={item.label} className="flex items-center gap-2.5">
                        {satisfied ? (
                          <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <svg width={10} height={10} fill="none" stroke="#16a34a" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                          </div>
                        )}
                        <span className={`text-xs ${satisfied ? "text-[#374151]" : "text-[#6b7280]"}`}>{item.label}</span>
                        <span className={`ml-auto text-[10px] font-medium ${satisfied ? "text-green-600" : "text-amber-600"}`}>{satisfied ? "Satisfied" : "Pending"}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 border-t border-[#d1d5db] p-4">
              {submitted ? (
                <div className="text-center py-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <svg width={20} height={20} fill="none" stroke="#16a34a" strokeWidth={2} viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
                  </div>
                  <p className="text-sm font-semibold text-[#111827] mb-1">Policy review submitted</p>
                  <p className="text-xs text-[#6b7280] mb-4 leading-relaxed">Elena Vasquez will be notified. Attestation cycle will reset upon publication.</p>
                  <Link href="/light/dashboard" className="text-xs text-[#2563eb] hover:underline font-medium">Return to Dashboard &rarr;</Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <button onClick={acceptAll} className="w-full h-9 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-semibold hover:from-blue-500 hover:to-blue-400 transition-all">Accept All Suggestions</button>
                  <div className="flex gap-2">
                    <button className="flex-1 h-9 rounded-lg border border-[#d1d5db] text-xs font-medium text-[#374151] hover:bg-gray-100 transition-colors">Save Draft</button>
                    <button onClick={() => setSubmitted(true)} className="flex-1 h-9 rounded-lg bg-gradient-to-r from-green-600 to-green-500 text-white text-xs font-semibold hover:from-green-500 hover:to-green-400 transition-all">Submit for Review</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuggestionBlock({ sectionNumber, sectionTitle, originalText, suggestedText, status, onAccept, onReject }: { sectionNumber: string; sectionTitle: string; originalText: string; suggestedText: string; status: SuggestionStatus; onAccept: () => void; onReject: () => void }) {
  return (
    <div className="bg-[#f9fafb] border border-[#d1d5db] rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#111827]">{sectionNumber}. {sectionTitle}</h3>
        {status === "accepted" && <span className="text-[10px] font-semibold bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Accepted</span>}
        {status === "rejected" && <span className="text-[10px] font-semibold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Rejected</span>}
      </div>
      <p className={`text-sm leading-relaxed mb-3 ${status === "accepted" ? "text-[#6b7280] line-through" : "text-[#374151]"}`}>{originalText}</p>
      <div className={`border-l-2 pl-4 py-2 rounded-r-md transition-all ${status === "accepted" ? "border-green-500 bg-green-50" : status === "rejected" ? "border-[#d1d5db] bg-[#f3f4f6]/50 opacity-50" : "border-purple-500 bg-purple-50"}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${status === "accepted" ? "bg-green-100 text-green-600" : status === "rejected" ? "bg-[#d1d5db] text-[#6b7280]" : "bg-purple-100 text-purple-600"}`}>AI Suggestion</span>
        </div>
        <p className={`text-sm leading-relaxed ${status === "rejected" ? "text-[#6b7280]" : "text-[#374151]"}`}>{suggestedText}</p>
      </div>
      {status === "pending" && (
        <div className="flex gap-2 mt-3">
          <button onClick={onAccept} className="h-7 px-3 rounded-md bg-green-100 text-green-600 text-xs font-medium hover:bg-green-200 transition-colors">Accept</button>
          <button onClick={onReject} className="h-7 px-3 rounded-md bg-[#f3f4f6] text-[#6b7280] text-xs font-medium hover:bg-gray-200 transition-colors">Reject</button>
        </div>
      )}
    </div>
  );
}

function RationaleItem({ title, description, status }: { title: string; description: string; status: SuggestionStatus }) {
  return (
    <div className={`p-3 rounded-md border transition-all ${status === "accepted" ? "border-green-500/30 bg-green-50" : status === "rejected" ? "border-[#d1d5db] bg-[#f3f4f6]/50 opacity-60" : "border-[#d1d5db] bg-[#ffffff]"}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-semibold text-[#111827]">{title}</span>
        {status === "accepted" && <svg width={12} height={12} fill="none" stroke="#16a34a" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>}
      </div>
      <p className="text-[11px] text-[#6b7280] leading-relaxed">{description}</p>
    </div>
  );
}
