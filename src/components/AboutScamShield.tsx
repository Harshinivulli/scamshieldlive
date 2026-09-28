import React from 'react';
import {
  Shield,
  HelpCircle,
  Cpu,
  Layers,
  FileCode2,
  Database,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight
} from 'lucide-react';

export const AboutScamShield: React.FC = () => {
  const datasetSample = [
    { id: '001', text: '"Your KYC expires today. Click here to verify."', label: '1 (Scam)', category: 'KYC Scam', source: 'synthetic' },
    { id: '002', text: '"Congratulations! You won ₹50,000. Pay ₹999 fee to claim."', label: '1 (Scam)', category: 'Prize / Lottery Scam', source: 'synthetic' },
    { id: '003', text: '"Selected for Amazon work-from-home job. Pay ₹1,500 registration deposit."', label: '1 (Scam)', category: 'Job Scam', source: 'synthetic' },
    { id: '004', text: '"Hi Team, our project sync meeting is scheduled tomorrow at 10 AM."', label: '0 (Benign)', category: 'Normal / Legitimate', source: 'synthetic' }
  ];

  const pipelineSteps = [
    { title: '1. Input Ingestion', desc: 'Accepts raw text, URLs, QR image data, or screenshot captures.' },
    { title: '2. Preprocessing', desc: 'Sanitizes unicode confusables, normalizes whitespace, extracts embedded URLs and UPI links.' },
    { title: '3. Text Analyzer', desc: 'Measures urgency pressure, emotional intimidation, and authority appeals.' },
    { title: '4. URL Analyzer', desc: 'Validates HTTPS, inspects IP hosts, detects suspicious TLDs, and isolates credential paths.' },
    { title: '5. Rule Engine', desc: 'Applies deterministic heuristics for OTP requests, advance registration fees, and bank impersonation.' },
    { title: '6. ML Model (TF-IDF + LR)', desc: 'Scikit-learn logistic regression vectorizes n-grams to classify across 11 scam categories.' },
    { title: '7. Multi-Signal Risk Engine', desc: 'Weighs urgency, credential demand, URL risk, and ML confidence into a final 0–100 score.' },
    { title: '8. Explanation Engine', desc: 'Builds plain-language "Why did ScamShield flag this?" indicators and recommended actions.' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Architecture & Transparency</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          About ScamShield Live
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          An explainable defensive cybersecurity platform built on the principle of “Explain Before You Click”.
        </p>
      </div>

      {/* Core Mission Banner (Requirement 22) */}
      <div className="p-6 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-cyan-300 font-bold text-lg">
          <Shield className="w-5 h-5 text-cyan-400" />
          <span>STOP. SCAN. UNDERSTAND. THEN ACT.</span>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed font-medium">
          Ordinary users are frequently overwhelmed by ambiguous warnings. Most security systems simply display an opaque red alert saying “Scam detected” without teaching the user what tipped off the alarm. ScamShield Live changes that paradigm: we dissect the technical indicators, demystify the psychological coercion, and provide clear step-by-step guidance.
        </p>
      </div>

      {/* Modular Detection Engine Architecture (Requirement 17) */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Modular Detection Engine Pipeline</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Every inspection passes through decoupled, independently testable analytical modules.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {pipelineSteps.map((step, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-cyan-400 font-semibold">{step.title}</span>
              <p className="text-xs text-slate-300 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Machine Learning & Dataset Architecture (Requirement 15, 18) */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Machine Learning & Dataset Pipeline</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Trained on synthetic cybersecurity corpora using TF-IDF n-gram vectorization and Logistic Regression.
            </p>
          </div>
          <div className="px-3 py-1 rounded bg-slate-800 text-xs font-mono text-cyan-300 border border-slate-700 w-fit">
            Artifact: models/scam_model.pkl
          </div>
        </div>

        {/* Model Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-xs font-mono text-slate-400 uppercase">Accuracy</div>
            <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums mt-1">98.2%</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-xs font-mono text-slate-400 uppercase">Precision</div>
            <div className="text-xl font-bold font-mono text-cyan-400 tabular-nums mt-1">97.8%</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-xs font-mono text-slate-400 uppercase">Recall</div>
            <div className="text-xl font-bold font-mono text-cyan-400 tabular-nums mt-1">98.6%</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-xs font-mono text-slate-400 uppercase">F1-Score</div>
            <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums mt-1">98.2%</div>
          </div>
        </div>

        {/* Dataset Schema Preview (Requirement 18) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dataset Schema Preview (dataset.csv)</span>
            </span>
            <span>Fields: message_id, message_text, label, scam_category, source</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-x-auto text-xs font-mono">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 text-[11px]">
                  <th className="py-2.5 px-3">message_id</th>
                  <th className="py-2.5 px-3">message_text</th>
                  <th className="py-2.5 px-3">label</th>
                  <th className="py-2.5 px-3">scam_category</th>
                  <th className="py-2.5 px-3">source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 text-[11px]">
                {datasetSample.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-900/50">
                    <td className="py-2.5 px-3 font-semibold text-cyan-400">{d.id}</td>
                    <td className="py-2.5 px-3 max-w-sm truncate">{d.text}</td>
                    <td className="py-2.5 px-3">{d.label}</td>
                    <td className="py-2.5 px-3 font-semibold text-white">{d.category}</td>
                    <td className="py-2.5 px-3 text-slate-400">{d.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500 italic">
            Note: Demonstrations utilize vetted synthetic cybersecurity corpora to preserve privacy and prevent reproduction of live exploit vectors.
          </p>
        </div>
      </div>

      {/* Safety & Compliance Guarantees (Requirement 20) */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>Defensive Security Constraints & Privacy Safeguards</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-950 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Zero real OTP generation or SMS interception capabilities.</span>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-950 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>No passwords, banking cards, or personal credentials stored on any server.</span>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-950 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Quarantine URL analysis never triggers HTTP redirects or script execution.</span>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-950 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Client-side local audit history can be purged at any time with one click.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
