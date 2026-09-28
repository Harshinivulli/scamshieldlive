import React from 'react';
import {
  Shield,
  ShieldAlert,
  ArrowRight,
  Link2,
  QrCode,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';

interface LandingPageProps {
  onStartScan: (tab: string) => void;
  onRunDemo: (demoNumber: number) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartScan, onRunDemo }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-6">
              <Shield className="w-3.5 h-3.5" />
              <span>DEFENSIVE CYBERSECURITY INTELLIGENCE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-4">
              SCAMSHIELD LIVE
            </h1>

            <p className="text-xl sm:text-2xl font-semibold text-cyan-400 mb-6 tracking-tight">
              “Know the Risk Before You Click.”
            </p>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-10 max-w-2xl mx-auto">
              Real-time protection against phishing, payment scams, fake job offers, KYC fraud, malicious links, and social-engineering attacks.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onStartScan('scan-message')}
                className="w-full sm:w-auto px-7 py-3.5 text-sm font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-lg shadow-cyan-950 transition-all flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Scan a Message</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('pipeline-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-750 rounded-lg transition-all"
              >
                Explore Protection
              </button>
            </div>
          </div>

          {/* Security Visual Pipeline: Message -> AI Analysis -> Risk Detection -> User Protection */}
          <div id="pipeline-section" className="mt-16 pt-8">
            <div className="text-center mb-6">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                End-to-End Defensive Verification Pipeline
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {/* Step 1 */}
              <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 text-left relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-cyan-400">01</span>
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Message Input</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  SMS, WhatsApp, Email, URL, QR, or screenshot captured safely without execution.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 text-left relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-cyan-400">02</span>
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">AI & Heuristics</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Multi-signal inspection analyzes urgency, credential harvesting, IP domains & tone.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 text-left relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-cyan-400">03</span>
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Risk Detection</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  0–100 threat scoring mapped to 11 scam categories with explainable indicators.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 text-left relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-cyan-400">04</span>
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400">
                    <Shield className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">User Protection</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Plain-language defense: explain exactly why it was flagged and what to do next.
                </p>
              </div>
            </div>

            {/* Generated Cybersecurity Visual Media */}
            <div className="mt-8 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/50 shadow-2xl relative">
              <img
                src="/src/assets/images/scamshield_threat_matrix_1790602573411.jpg"
                alt="ScamShield Live Security Verification Matrix"
                className="w-full h-64 sm:h-80 object-cover object-center brightness-90"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback container if local image fails
                  const target = e.currentTarget;
                  target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-6">
                <div className="max-w-lg">
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                    Core Detection Matrix
                  </span>
                  <h4 className="text-base font-bold text-white mt-1">
                    Explain Before You Click Architecture
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Combining multi-vector social-engineering classification, cryptographic heuristics, and domain telemetry to uncover deception before damage occurs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Statistics (Requirement 3) */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
                284,912
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">
                Messages Analyzed
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-rose-400 tabular-nums">
                41,208
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">
                Threats Detected
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400 tabular-nums">
                11
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">
                Scam Categories
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 tabular-nums flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Active</span>
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">
                Protection Status (99.4%)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Scanners Grid */}
      <section className="py-16 border-b border-slate-800 bg-slate-950/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Choose Your Security Vector
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Inspect suspicious communications across any format without executing payloads.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <button
              onClick={() => onStartScan('scan-message')}
              className="p-6 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">
                Scan Message
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Paste SMS, WhatsApp, emails, job offers, or payment requests for multi-signal threat evaluation.
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-cyan-400">
                <span>Launch Scanner</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => onStartScan('scan-url')}
              className="p-6 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
                <Link2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">
                Scan URL
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Inspect IP hosts, shortened links, suspicious TLDs, and fake bank portals safely without visiting.
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-cyan-400">
                <span>Check Domain</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => onStartScan('scan-qr')}
              className="p-6 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">
                Scan QR Code
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Extract hidden URLs or malicious UPI payment intents from printed or digital QR images.
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-cyan-400">
                <span>Decode QR</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => onStartScan('scan-screenshot')}
              className="p-6 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">
                Screenshot Scanner
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Upload image captures of chat dialogues, notifications, or receipts for OCR extraction & risk scoring.
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-cyan-400">
                <span>Extract & Scan</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Demo Attack Simulator Strip (Requirement 21) */}
      <section className="py-14 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
                Interactive Demonstration
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Try Synthetic Scam Scenarios
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Safe demonstration attacks designed to test multi-signal classification without real victim data or live malware.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-rose-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-rose-400 font-bold">Demo 1</span>
                  <span className="text-rose-400">CRITICAL</span>
                </div>
                <div className="text-xs font-semibold text-white mb-1">KYC Expiry & OTP Demand</div>
                <p className="text-[11px] text-slate-300 italic mb-4">
                  “KYC expires today. Click this link and enter your OTP.”
                </p>
              </div>
              <button
                onClick={() => onRunDemo(1)}
                className="w-full py-1.5 px-3 rounded text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
              >
                Analyze Scenario 1
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-orange-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-orange-400 font-bold">Demo 2</span>
                  <span className="text-orange-400">HIGH RISK</span>
                </div>
                <div className="text-xs font-semibold text-white mb-1">₹50,000 Prize Advance Fee</div>
                <p className="text-[11px] text-slate-300 italic mb-4">
                  “Congratulations! You won ₹50,000. Pay a processing fee to claim.”
                </p>
              </div>
              <button
                onClick={() => onRunDemo(2)}
                className="w-full py-1.5 px-3 rounded text-xs font-semibold bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border border-orange-500/30 transition-colors"
              >
                Analyze Scenario 2
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-orange-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-orange-400 font-bold">Demo 3</span>
                  <span className="text-orange-400">HIGH RISK</span>
                </div>
                <div className="text-xs font-semibold text-white mb-1">WFH Job Registration Fee</div>
                <p className="text-[11px] text-slate-300 italic mb-4">
                  “Congratulations! Selected for work-from-home job. Pay ₹1,500 registration fee.”
                </p>
              </div>
              <button
                onClick={() => onRunDemo(3)}
                className="w-full py-1.5 px-3 rounded text-xs font-semibold bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border border-orange-500/30 transition-colors"
              >
                Analyze Scenario 3
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-emerald-400 font-bold">Demo 4</span>
                  <span className="text-emerald-400">SAFE</span>
                </div>
                <div className="text-xs font-semibold text-white mb-1">Scheduled Meeting Invite</div>
                <p className="text-[11px] text-slate-300 italic mb-4">
                  “Your meeting is scheduled tomorrow at 10 AM.”
                </p>
              </div>
              <button
                onClick={() => onRunDemo(4)}
                className="w-full py-1.5 px-3 rounded text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
              >
                Analyze Scenario 4
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Banner */}
      <footer className="py-8 bg-slate-950 text-slate-400 text-xs border-t border-slate-900 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-slate-300">ScamShield Live</span>
            <span>·</span>
            <span>Stop. Scan. Understand. Then Act.</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Client-side Privacy Protected</span>
            <span>·</span>
            <span>No Credentials Stored</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
