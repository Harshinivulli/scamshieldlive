import React from 'react';
import { Shield, ShieldAlert, Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenMobileMenu: () => void;
  isMobileMenuOpen: boolean;
  isLandingPage: boolean;
  onToggleLanding: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenMobileMenu,
  isMobileMenuOpen,
  isLandingPage,
  onToggleLanding
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors whitespace-nowrap">
              ScamShield Live
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 clean single-line nav links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => {
              if (isLandingPage) onToggleLanding();
              onSelectTab('dashboard');
            }}
            className={`hover:text-white transition-colors whitespace-nowrap ${currentTab === 'dashboard' && !isLandingPage ? 'text-cyan-400 font-semibold' : ''}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              if (isLandingPage) onToggleLanding();
              onSelectTab('scan-message');
            }}
            className={`hover:text-white transition-colors whitespace-nowrap ${currentTab === 'scan-message' && !isLandingPage ? 'text-cyan-400 font-semibold' : ''}`}
          >
            Scan Message
          </button>
          <button
            onClick={() => {
              if (isLandingPage) onToggleLanding();
              onSelectTab('scan-url');
            }}
            className={`hover:text-white transition-colors whitespace-nowrap ${currentTab === 'scan-url' && !isLandingPage ? 'text-cyan-400 font-semibold' : ''}`}
          >
            Scan URL
          </button>
          <button
            onClick={() => {
              if (isLandingPage) onToggleLanding();
              onSelectTab('scan-qr');
            }}
            className={`hover:text-white transition-colors whitespace-nowrap ${currentTab === 'scan-qr' && !isLandingPage ? 'text-cyan-400 font-semibold' : ''}`}
          >
            Scan QR
          </button>
          <button
            onClick={() => {
              if (isLandingPage) onToggleLanding();
              onSelectTab('history');
            }}
            className={`hover:text-white transition-colors whitespace-nowrap ${currentTab === 'history' && !isLandingPage ? 'text-cyan-400 font-semibold' : ''}`}
          >
            History
          </button>
          <button
            onClick={() => {
              if (isLandingPage) onToggleLanding();
              onSelectTab('analytics');
            }}
            className={`hover:text-white transition-colors whitespace-nowrap ${currentTab === 'analytics' && !isLandingPage ? 'text-cyan-400 font-semibold' : ''}`}
          >
            Analytics
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions & live status */}
        <div className="flex items-center gap-3">
          {/* Status Indicator (Requirement 4: ● Protection Active) */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-medium whitespace-nowrap">Protection Active</span>
          </div>

          {/* Mode Switch or Quick Scan CTA */}
          {isLandingPage ? (
            <button
              onClick={onToggleLanding}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-cyan-950"
            >
              <span>Open Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => onSelectTab('scan-message')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-cyan-950"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Quick Scan</span>
            </button>
          )}

          {/* Landing / Dashboard Toggle Button */}
          <button
            onClick={onToggleLanding}
            className="text-xs text-slate-400 hover:text-white px-2 py-1.5 rounded hover:bg-slate-900 transition-colors whitespace-nowrap"
            title="Toggle between Landing Page and App Dashboard"
          >
            {isLandingPage ? 'App Console' : 'Landing'}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={onOpenMobileMenu}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
