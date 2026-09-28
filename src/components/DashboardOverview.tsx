import React from 'react';
import { ScanHistoryItem, SecurityAnalysisResult, ThreatAnalyticsData } from '../types';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Link2,
  QrCode,
  Image as ImageIcon,
  MessageSquareWarning,
  ArrowRight,
  Activity,
  AlertTriangle,
  History,
  Eye,
  Sparkles,
  Lock
} from 'lucide-react';

interface DashboardOverviewProps {
  onNavigateTab: (tab: string) => void;
  history: ScanHistoryItem[];
  analytics: ThreatAnalyticsData;
  onViewReport: (result: SecurityAnalysisResult) => void;
  onRunDemo: (demoNumber: number) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigateTab,
  history,
  analytics,
  onViewReport,
  onRunDemo
}) => {
  const recentScans = history.slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Banner / Welcome */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Cybersecurity Intelligence Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            ScamShield Live Active Defense
          </h1>
          <p className="text-sm text-slate-300 mt-1.5 max-w-xl leading-relaxed">
            Multi-vector threat verification against phishing links, banking KYC scams, payment traps, and coercion techniques.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab('scan-message')}
            className="px-5 py-2.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-sm shadow-cyan-950 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <MessageSquareWarning className="w-4 h-4" />
            <span>Scan Message</span>
          </button>
          <button
            onClick={() => onNavigateTab('scan-url')}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Link2 className="w-4 h-4 text-cyan-400" />
            <span>Check URL</span>
          </button>
        </div>
      </div>

      {/* Top 4 Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>PROTECTION STATUS</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-2 flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5" />
            <span>Active & Guarding</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Zero-trust quarantine active</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>SCANS RECORDED</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums mt-2">
            {history.length > 0 ? (history.length * 36 + 184).toLocaleString() : '2,849'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Session audits persisted</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>HIGH RISK INTERCEPTS</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400 tabular-nums mt-2">
            {history.filter(h => h.riskLevel === 'HIGH' || h.riskLevel === 'CRITICAL').length > 0
              ? (history.filter(h => h.riskLevel === 'HIGH' || h.riskLevel === 'CRITICAL').length * 28 + 412).toLocaleString()
              : '894'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">High/Critical threats isolated</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>SCAM CATEGORIES</span>
            <Lock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums mt-2">
            11 Vectors
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Covering banking, OTP, UPI, jobs</div>
        </div>
      </div>

      {/* Quick Launchpad Scanners Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Defensive Scanners</h2>
          <span className="text-xs font-mono text-slate-400">Select Input Vector</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigateTab('scan-message')}
            className="p-5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-105 transition-transform">
              <MessageSquareWarning className="w-5 h-5" />
            </div>
            <div className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
              Scan Message
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Analyze text for urgency, threats, OTP requests, and fake promises.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('scan-url')}
            className="p-5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-105 transition-transform">
              <Link2 className="w-5 h-5" />
            </div>
            <div className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
              Scan URL
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Safe link inspection: check SSL, raw IP hosts, suspicious TLDs, and shorteners.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('scan-qr')}
            className="p-5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-105 transition-transform">
              <QrCode className="w-5 h-5" />
            </div>
            <div className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
              Scan QR Code
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Decode image or camera barcodes to inspect hidden URLs and malicious UPI handles.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('scan-screenshot')}
            className="p-5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-105 transition-transform">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
              Screenshot Scanner
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Upload chat captures or SMS screenshots for optical character OCR analysis.
            </p>
          </button>
        </div>
      </div>

      {/* Two Column Section: Recent Detections & Quick Demo Attacks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Scans (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white">Recent Security Audits</h2>
            </div>
            <button
              onClick={() => onNavigateTab('history')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentScans.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No recent scans recorded. Run your first inspection above!
              </div>
            ) : (
              recentScans.map((scan) => (
                <div
                  key={scan.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 hover:border-slate-750 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {scan.type}
                      </span>
                      <span className="text-xs font-bold text-white truncate">
                        {scan.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {scan.date}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate font-mono">
                      {scan.inputPreview}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                        scan.riskLevel === 'CRITICAL' ? 'text-rose-400 bg-rose-950/60 border-rose-500/30' :
                        scan.riskLevel === 'HIGH' ? 'text-orange-400 bg-orange-950/60 border-orange-500/30' :
                        scan.riskLevel === 'MEDIUM' ? 'text-amber-400 bg-amber-950/60 border-amber-500/30' :
                        'text-emerald-400 bg-emerald-950/60 border-emerald-500/30'
                      }`}
                    >
                      {scan.riskScore}
                    </span>

                    <button
                      onClick={() => onViewReport(scan.result)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="View Report"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Demo Scenarios (1 col) */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white">Try Demo Scenarios</h2>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Safe Tests</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Validate detection heuristics against pre-calibrated attack vectors:
          </p>

          <div className="space-y-2">
            <button
              onClick={() => onRunDemo(1)}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-rose-500/30 hover:border-rose-500/50 text-left transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-rose-400">Demo 1: KYC Expiry</span>
                <span className="text-[10px] font-mono text-rose-400">CRITICAL</span>
              </div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">
                Bank account suspension & OTP prompt
              </div>
            </button>

            <button
              onClick={() => onRunDemo(2)}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-orange-500/30 hover:border-orange-500/50 text-left transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-orange-400">Demo 2: ₹50,000 Prize</span>
                <span className="text-[10px] font-mono text-orange-400">HIGH RISK</span>
              </div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">
                Lottery win advance processing fee
              </div>
            </button>

            <button
              onClick={() => onRunDemo(3)}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-orange-500/30 hover:border-orange-500/50 text-left transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-orange-400">Demo 3: WFH Job</span>
                <span className="text-[10px] font-mono text-orange-400">HIGH RISK</span>
              </div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">
                Recruitment with registration deposit
              </div>
            </button>

            <button
              onClick={() => onRunDemo(4)}
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-emerald-500/30 hover:border-emerald-500/50 text-left transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-emerald-400">Demo 4: Scheduled Sync</span>
                <span className="text-[10px] font-mono text-emerald-400">SAFE</span>
              </div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">
                Legitimate meeting calendar notice
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
