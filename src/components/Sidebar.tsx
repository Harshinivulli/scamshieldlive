import React from 'react';
import {
  LayoutDashboard,
  MessageSquareWarning,
  Link2,
  QrCode,
  Image as ImageIcon,
  History,
  BarChart3,
  ShieldCheck,
  HelpCircle,
  AlertOctagon
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onTriggerDemo: (demoNumber: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile,
  onTriggerDemo
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scan-message', label: 'Scan Message', icon: MessageSquareWarning },
    { id: 'scan-url', label: 'Scan URL', icon: Link2 },
    { id: 'scan-qr', label: 'Scan QR', icon: QrCode },
    { id: 'scan-screenshot', label: 'Screenshot Scanner', icon: ImageIcon },
    { id: 'history', label: 'Scan History', icon: History },
    { id: 'analytics', label: 'Threat Analytics', icon: BarChart3 },
    { id: 'security-tips', label: 'Security Tips', icon: ShieldCheck },
    { id: 'about', label: 'About ScamShield', icon: HelpCircle },
  ];

  const content = (
    <aside className="w-64 h-full flex flex-col justify-between py-5 px-3 bg-slate-950 border-r border-slate-800 overflow-y-auto">
      <div className="space-y-6">
        {/* Navigation list */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Security Workspaces
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Demo Attacks Section (Requirement 21) */}
        <div className="pt-2 border-t border-slate-800">
          <div className="px-3 pb-2.5 flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            <span className="flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
              <span>Try Demo Scams</span>
            </span>
          </div>
          <div className="space-y-1">
            <button
              onClick={() => {
                onTriggerDemo(1);
                onCloseMobile();
              }}
              className="w-full text-left px-3 py-1.5 rounded text-[11px] text-slate-300 hover:text-white hover:bg-slate-900 transition-colors border border-transparent hover:border-slate-800"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-rose-400">Demo 1</span>
                <span className="text-[10px] text-slate-400 font-mono">CRITICAL</span>
              </div>
              <div className="truncate text-slate-400 text-[10px]">KYC Expiry & OTP Demand</div>
            </button>

            <button
              onClick={() => {
                onTriggerDemo(2);
                onCloseMobile();
              }}
              className="w-full text-left px-3 py-1.5 rounded text-[11px] text-slate-300 hover:text-white hover:bg-slate-900 transition-colors border border-transparent hover:border-slate-800"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-orange-400">Demo 2</span>
                <span className="text-[10px] text-slate-400 font-mono">HIGH RISK</span>
              </div>
              <div className="truncate text-slate-400 text-[10px]">₹50,000 Prize Advance Fee</div>
            </button>

            <button
              onClick={() => {
                onTriggerDemo(3);
                onCloseMobile();
              }}
              className="w-full text-left px-3 py-1.5 rounded text-[11px] text-slate-300 hover:text-white hover:bg-slate-900 transition-colors border border-transparent hover:border-slate-800"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-orange-400">Demo 3</span>
                <span className="text-[10px] text-slate-400 font-mono">HIGH RISK</span>
              </div>
              <div className="truncate text-slate-400 text-[10px]">WFH Job Registration Fee</div>
            </button>

            <button
              onClick={() => {
                onTriggerDemo(4);
                onCloseMobile();
              }}
              className="w-full text-left px-3 py-1.5 rounded text-[11px] text-slate-300 hover:text-white hover:bg-slate-900 transition-colors border border-transparent hover:border-slate-800"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-emerald-400">Demo 4</span>
                <span className="text-[10px] text-slate-400 font-mono">SAFE</span>
              </div>
              <div className="truncate text-slate-400 text-[10px]">Scheduled Meeting Invite</div>
            </button>
          </div>
        </div>
      </div>

      {/* Philosophy banner (Requirement 22) */}
      <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
        <div className="font-semibold text-slate-300 text-xs mb-1">
          Stop. Scan. Understand.
        </div>
        <p className="leading-snug text-slate-400">
          ScamShield explains the psychological & technical vectors before you click.
        </p>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">{content}</div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-72 bg-slate-950 h-full shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
