"use client";

import Link from "next/link";

function DiligentLogo({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 222 222" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <path fill="#EE312E" d="M200.87,110.85c0,33.96-12.19,61.94-33.03,81.28c-0.24,0.21-0.42,0.43-0.66,0.64c-15.5,14.13-35.71,23.52-59.24,27.11l-1.59-1.62l35.07-201.75l1.32-3.69C178.64,30.36,200.87,65.37,200.87,110.85z" />
      <path fill="#AF292E" d="M142.75,12.83l-0.99,1.47L0.74,119.34L0,118.65c0,0,0-0.03,0-0.06V0.45h85.63c5.91,0,11.64,0.34,17.19,1.01h0.21c14.02,1.66,26.93,5.31,38.48,10.78C141.97,12.46,142.75,12.83,142.75,12.83z" />
      <path fill="#D3222A" d="M142.75,12.83L0,118.65v99.27v3.62h85.96c7.61,0,14.94-0.58,21.99-1.66C107.95,219.89,142.75,12.83,142.75,12.83z" />
    </svg>
  );
}

export default function AlertsPage() {
  return (
    <div className="min-h-screen bg-white text-[#374151] flex flex-col items-center px-6 py-12">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-10">
          <p className="text-[11px] uppercase tracking-widest text-[#6b7280] font-semibold mb-3">How the signal reaches you</p>
          <h1 className="text-2xl font-bold text-[#111827] mb-2">Your agents detected 3 compliance deadlines</h1>
          <p className="text-sm text-[#6b7280] max-w-lg mx-auto">
            Diligent notifies you wherever you are — mobile push, calendar, and email — so nothing slips through.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

          {/* -------------------------------------------------------- */}
          {/*  MOBILE PUSH NOTIFICATION                                 */}
          {/* -------------------------------------------------------- */}
          <Link href="/light/dashboard" className="group block">
            <div className="rounded-[2rem] border border-[#d1d5db] bg-white p-3 mx-auto max-w-[280px] hover:border-[#2563eb]/40 transition-all">
              {/* Phone chrome */}
              <div className="rounded-[1.4rem] bg-white border border-[#e5e7eb] overflow-hidden">
                {/* Status bar */}
                <div className="flex items-center justify-between px-5 pt-3 pb-2">
                  <span className="text-[10px] font-semibold text-[#6b7280]">9:41</span>
                  <div className="flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.56 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01" /></svg>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><rect x="1" y="6" width="18" height="12" rx="2" /><path d="M23 13v-2" /></svg>
                  </div>
                </div>

                {/* Lock screen wallpaper area */}
                <div className="px-4 pt-6 pb-3 text-center">
                  <p className="text-[10px] text-[#6b7280] uppercase tracking-widest">Monday, March 10</p>
                </div>

                {/* Push notification */}
                <div className="mx-3 mb-4 rounded-2xl bg-[#f9fafb] border border-[#d1d5db] p-3.5 shadow-sm group-hover:border-[#2563eb]/30 transition-all">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#f3f4f6] border border-[#d1d5db] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <DiligentLogo size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wide">Diligent</span>
                        <span className="text-[9px] text-[#9ca3af]">now</span>
                      </div>
                      <p className="text-[12px] font-semibold text-[#111827] leading-tight mb-1">
                        Compliance Deadlines Detected
                      </p>
                      <p className="text-[11px] text-[#6b7280] leading-snug">
                        Your agents identified 3 upcoming deadlines that may affect Acme&apos;s compliance posture. Code of Conduct review is critical — due in 21 days.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <div className="flex-1 rounded-lg bg-[#f3f4f6] py-1.5 text-center text-[10px] font-semibold text-[#2563eb]">
                      Review Now
                    </div>
                    <div className="flex-1 rounded-lg bg-[#f3f4f6] py-1.5 text-center text-[10px] font-semibold text-[#6b7280]">
                      Later
                    </div>
                  </div>
                </div>

                {/* Second notification peek */}
                <div className="mx-3 mb-6 rounded-2xl bg-[#f9fafb] border border-[#d1d5db] p-3 opacity-60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#f3f4f6] border border-[#d1d5db] flex items-center justify-center flex-shrink-0">
                      <DiligentLogo size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-[#374151] truncate">EU Whistleblower Report due in 34 days</p>
                    </div>
                  </div>
                </div>

                {/* Home indicator */}
                <div className="flex justify-center pb-2">
                  <div className="w-28 h-1 rounded-full bg-[#9ca3af]" />
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-[#6b7280] mt-3 group-hover:text-[#2563eb] transition-colors">Mobile Push Notification</p>
          </Link>

          {/* -------------------------------------------------------- */}
          {/*  CALENDAR ALERT                                           */}
          {/* -------------------------------------------------------- */}
          <Link href="/light/dashboard" className="group block">
            <div className="rounded-xl border border-[#d1d5db] bg-white overflow-hidden hover:border-[#2563eb]/40 transition-all max-w-[340px] mx-auto">
              {/* Calendar chrome */}
              <div className="bg-[#f9fafb] border-b border-[#e5e7eb] px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                  <span className="text-xs font-semibold text-[#111827]">Calendar</span>
                </div>
                <span className="text-[10px] text-[#6b7280]">March 2026</span>
              </div>

              {/* Mini calendar grid */}
              <div className="px-4 py-3">
                <div className="grid grid-cols-7 gap-0 text-center text-[9px] text-[#9ca3af] font-medium mb-2">
                  {["S","M","T","W","T","F","S"].map((d,i) => <span key={i}>{d}</span>)}
                </div>
                <div className="grid grid-cols-7 gap-0 text-center text-[10px]">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                    const isToday = day === 10;
                    const isDeadline = day === 31;
                    const isHighlight = day === 13 || day === 26;
                    return (
                      <div key={day} className="py-1 relative">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] ${
                          isToday ? "bg-[#2563eb] text-white font-bold" :
                          isDeadline ? "bg-[#dc2626]/20 text-[#dc2626] font-bold ring-1 ring-[#dc2626]/40" :
                          isHighlight ? "bg-[#d97706]/15 text-[#d97706] font-semibold" :
                          "text-[#6b7280]"
                        }`}>{day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Auto-added events */}
              <div className="border-t border-[#e5e7eb] px-4 py-3 space-y-2">
                <div className="flex items-center gap-1.5 mb-2">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                  <span className="text-[10px] font-semibold text-[#16a34a] uppercase tracking-wider">Auto-added by Diligent AI</span>
                </div>

                <div className="rounded-lg bg-white border border-[#e5e7eb] border-l-[3px] border-l-[#dc2626] px-3 py-2.5 group-hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] font-semibold text-[#111827]">Code of Conduct Review</span>
                    <span className="text-[9px] font-bold text-[#dc2626]">CRITICAL</span>
                  </div>
                  <p className="text-[10px] text-[#6b7280]">Mar 31 · Deadline in 21 days · Policy Manager</p>
                </div>

                <div className="rounded-lg bg-white border border-[#e5e7eb] border-l-[3px] border-l-[#d97706] px-3 py-2.5">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] font-semibold text-[#111827]">EU Whistleblower Report</span>
                    <span className="text-[9px] font-bold text-[#d97706]">HIGH</span>
                  </div>
                  <p className="text-[10px] text-[#6b7280]">Apr 13 · Deadline in 34 days · Speak Up</p>
                </div>

                <div className="rounded-lg bg-white border border-[#e5e7eb] border-l-[3px] border-l-[#d97706] px-3 py-2.5">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] font-semibold text-[#111827]">APAC Training Renewal</span>
                    <span className="text-[9px] font-bold text-[#d97706]">HIGH</span>
                  </div>
                  <p className="text-[10px] text-[#6b7280]">Apr 26 · Expires in 45 days · Training</p>
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-[#6b7280] mt-3 group-hover:text-[#2563eb] transition-colors">Calendar Alert — Auto-Added</p>
          </Link>

          {/* -------------------------------------------------------- */}
          {/*  EMAIL NOTIFICATION                                       */}
          {/* -------------------------------------------------------- */}
          <Link href="/light/dashboard" className="group block">
            <div className="rounded-xl border border-[#d1d5db] bg-white overflow-hidden hover:border-[#2563eb]/40 transition-all max-w-[340px] mx-auto">
              {/* Email chrome */}
              <div className="bg-[#f9fafb] border-b border-[#e5e7eb] px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                  <span className="text-xs font-semibold text-[#111827]">Inbox</span>
                </div>
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#dc2626] text-[9px] font-bold text-white">1</span>
              </div>

              {/* Email list */}
              <div className="divide-y divide-[#e5e7eb]">
                {/* Primary email — unread */}
                <div className="px-4 py-3.5 bg-[#f9fafb]/50 group-hover:bg-[#f9fafb] transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#f3f4f6] border border-[#d1d5db] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <DiligentLogo size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[12px] font-bold text-[#111827]">Diligent Connected Compliance</span>
                        <span className="text-[9px] text-[#6b7280]">2:40 PM</span>
                      </div>
                      <p className="text-[12px] font-semibold text-[#374151] mb-0.5">
                        Action Required: 3 Compliance Deadlines Approaching
                      </p>
                      <p className="text-[11px] text-[#6b7280] leading-snug">
                        Ronald — Your compliance monitoring agents have identified 3 upcoming deadlines that require attention. One is critical.
                      </p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-[#2563eb] flex-shrink-0 mt-2" />
                  </div>
                </div>

                {/* Older emails — faded */}
                <div className="px-4 py-3 opacity-40">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center text-[10px] font-semibold text-[#6b7280]">TK</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-[#6b7280] truncate">Tom Kim — Q1 compliance metrics attached</p>
                    </div>
                    <span className="text-[9px] text-[#9ca3af]">1:15 PM</span>
                  </div>
                </div>
                <div className="px-4 py-3 opacity-30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center text-[10px] font-semibold text-[#6b7280]">LR</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-[#6b7280] truncate">Lisa Rodriguez — APAC training update for review</p>
                    </div>
                    <span className="text-[9px] text-[#9ca3af]">11:02 AM</span>
                  </div>
                </div>
              </div>

              {/* Email preview body */}
              <div className="border-t border-[#e5e7eb] px-4 py-4">
                <div className="space-y-3">
                  <p className="text-[11px] text-[#6b7280] leading-relaxed">Hi Ronald,</p>
                  <p className="text-[11px] text-[#6b7280] leading-relaxed">
                    Your Diligent compliance agents have detected <span className="text-[#111827] font-semibold">3 deadlines</span> approaching in the next 45 days:
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626]" />
                      <span className="text-[11px] text-[#374151]">Code of Conduct Review — <span className="text-[#dc2626] font-semibold">21 days</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]" />
                      <span className="text-[11px] text-[#374151]">EU Whistleblower Report — <span className="text-[#d97706] font-semibold">34 days</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]" />
                      <span className="text-[11px] text-[#374151]">APAC Training Renewal — <span className="text-[#d97706] font-semibold">45 days</span></span>
                    </div>
                  </div>
                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#2563eb] group-hover:underline">
                      Review in Connected Compliance →
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-[#6b7280] mt-3 group-hover:text-[#2563eb] transition-colors">Email Notification</p>
          </Link>

        </div>

        {/* Bottom hint */}
        <div className="text-center mt-10">
          <p className="text-[11px] text-[#9ca3af] mb-3">Click any notification to open the Connected Compliance dashboard</p>
          <Link
            href="/light/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563eb] hover:text-[#3b82f6] transition-colors"
          >
            Go directly to Dashboard
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
