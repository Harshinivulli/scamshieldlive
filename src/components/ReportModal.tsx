import React from 'react';
import { SecurityAnalysisResult } from '../types';
import { RiskMeter } from './RiskMeter';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Share2, Copy, Check } from 'lucide-react';

interface ReportModalProps {
  result: SecurityAnalysisResult | null;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ result, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!result) return null;

  const copyReportSummary = () => {
    const summary = `[ScamShield Live Report]
Threat Category: ${result.category}
Risk Score: ${result.riskScore}/100 (${result.riskLevel})
Summary: ${result.summaryExplanation}
Recommended Action: ${result.recommendedAction}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Threat Intelligence Report</h3>
              <div className="text-[11px] font-mono text-slate-400">
                ID: {result.id} · {new Date(result.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Risk Meter */}
          <RiskMeter score={result.riskScore} level={result.riskLevel} />

          {/* Threat Category */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Detected Category</div>
              <div className="text-lg font-bold text-white mt-0.5">{result.category}</div>
            </div>
            <div className="px-3 py-1 rounded bg-slate-800 text-xs font-mono text-cyan-300 border border-slate-700">
              Vector: {result.type.toUpperCase()}
            </div>
          </div>

          {/* Analyzed Content Preview */}
          <div className="space-y-1.5">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400">Inspected Content</div>
            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 break-all whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
              {result.inputContent}
            </div>
          </div>

          {/* Explain Before You Click: Why Did ScamShield Flag This? */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">Why Did ScamShield Flag This?</h4>
              <span className="text-xs font-mono text-slate-400">Multi-Signal Indicators</span>
            </div>

            <div className="space-y-2.5">
              {result.indicators.map((ind) => (
                <div
                  key={ind.id}
                  className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        ind.severity === 'critical' ? 'bg-rose-400' :
                        ind.severity === 'high' ? 'bg-orange-400' :
                        ind.severity === 'medium' ? 'bg-amber-400' : 'bg-emerald-400'
                      }`} />
                      <span className="text-xs font-semibold text-white">{ind.name}</span>
                    </div>
                    <span className="text-xs font-mono font-semibold tabular-nums text-cyan-400">
                      {ind.score}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {ind.explanation}
                  </p>
                  {ind.evidence && (
                    <div className="mt-1.5 text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <span>Signal:</span>
                      <span className="text-slate-300">{ind.evidence}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Action (Requirement 5) */}
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-slate-200">
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Recommended Defensive Action</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              {result.recommendedAction}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <button
            onClick={copyReportSummary}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
