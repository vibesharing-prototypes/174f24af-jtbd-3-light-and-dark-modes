import Link from "next/link";

const sections = [
  {
    title: "How the Signal Reaches You",
    href: "/light/alerts",
    description: "Mobile push, calendar alert, and email notification — Diligent notifies you wherever you are when compliance agents detect approaching deadlines.",
    badge: "Entry Point",
    badgeColor: "#2563eb",
  },
  {
    title: "Compliance Dashboard",
    href: "/light/dashboard",
    description: "AI agents surface 3 approaching compliance deadlines. Review signals, assign owners, and take action — styled to match the GRC Command Center.",
    badge: "Signal Surface",
    badgeColor: "#dc2626",
  },
  {
    title: "Task View — Code of Conduct Review",
    href: "/light/tasks",
    description: "Deep dive into the Global Code of Conduct review due in 21 days. See what needs to happen, AI-detected regulatory changes, and action options.",
    badge: "Task Entry",
    badgeColor: "#d97706",
  },
  {
    title: "Policy Editor",
    href: "/light/editor",
    description: "AI-assisted policy editing with inline change suggestions, compliance checklist, and accept/reject workflow. Complete the review loop.",
    badge: "Task Completion",
    badgeColor: "#16a34a",
  },
  {
    title: "Training Compliance by Region",
    href: "/light/training",
    description: "Interactive world map with drill-down from global regions to sub-regions. See training completion, manager gaps, AI insights, and recommended actions at every level.",
    badge: "Regional View",
    badgeColor: "#7c3aed",
  },
  {
    title: "Compliance Landscape",
    href: "/light/landscape",
    description: "AI-generated overview of ACME's compliance posture across Policy Manager, Speak Up, and Training — with sparkline trends, domain summaries, and suggested actions.",
    badge: "Home Screen",
    badgeColor: "#0ea5e9",
  },
  {
    title: "WhatsApp Simulation",
    href: "/whatsapp",
    description: "What if you could interact with Diligent compliance and risk agents through WhatsApp? Four conversation threads simulate real-time alerts, approvals, group collaboration, and training updates.",
    badge: "Messaging",
    badgeColor: "#25d366",
  },
];

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-white text-[#374151] flex flex-col items-center px-6 py-16">
      <div className="max-w-2xl w-full">
        <div className="flex items-center gap-3 mb-2">
          <svg viewBox="0 0 222 222" width={32} height={32} xmlns="http://www.w3.org/2000/svg">
            <path fill="#EE312E" d="M200.87,110.85c0,33.96-12.19,61.94-33.03,81.28c-0.24,0.21-0.42,0.43-0.66,0.64c-15.5,14.13-35.71,23.52-59.24,27.11l-1.59-1.62l35.07-201.75l1.32-3.69C178.64,30.36,200.87,65.37,200.87,110.85z"/>
            <path fill="#AF292E" d="M142.75,12.83l-0.99,1.47L0.74,119.34L0,118.65c0,0,0-0.03,0-0.06V0.45h85.63c5.91,0,11.64,0.34,17.19,1.01h0.21c14.02,1.66,26.93,5.31,38.48,10.78C141.97,12.46,142.75,12.83,142.75,12.83z"/>
            <path fill="#D3222A" d="M142.75,12.83L0,118.65v99.27v3.62h85.96c7.61,0,14.94-0.58,21.99-1.66C107.95,219.89,142.75,12.83,142.75,12.83z"/>
          </svg>
          <h1 className="text-2xl font-bold text-[#111827]">Connected Compliance</h1>
        </div>
        <p className="text-sm text-[#6b7280] mb-1">Diligent Prototype — For illustrative and alignment purposes</p>
        <p className="text-sm text-[#6b7280] mb-10 leading-relaxed">
          JTBD #3: Surface upcoming deadlines or events that could affect compliance posture.
          Follow the flow from notification through signal review to task completion.
        </p>

        <div className="space-y-4">
          {sections.map((s, i) => (
            <Link
              key={s.href}
              href={s.href}
              className="block rounded-xl border border-[#d1d5db] bg-white p-5 hover:border-[#2563eb]/40 hover:bg-gray-50 transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold text-[#6b7280]">Step {i + 1}</span>
                <span
                  className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: s.badgeColor, background: `${s.badgeColor}15`, border: `1px solid ${s.badgeColor}30` }}
                >
                  {s.badge}
                </span>
              </div>
              <h2 className="text-base font-bold text-[#111827] group-hover:text-[#2563eb] transition-colors mb-1">
                {s.title}
              </h2>
              <p className="text-sm text-[#6b7280] leading-relaxed">{s.description}</p>
            </Link>
          ))}
        </div>

        {/* Dark mode toggle */}
        <div className="flex justify-center mt-10 mb-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#d1d5db] bg-white text-sm text-[#6b7280] hover:text-[#111827] hover:border-[#2563eb]/40 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
            View in Dark Mode
          </Link>
        </div>

        <p className="text-center text-[11px] text-[#d1d5db] mt-4">
          Connected Compliance — &copy; Diligent 2026
        </p>
      </div>
    </div>
  );
}
