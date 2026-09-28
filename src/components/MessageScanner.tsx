import React, { useState } from 'react';
import { SecurityAnalysisResult } from '../types';
import { analyzeContent } from '../utils/engine';
import { recordNewScan } from '../utils/storage';
import { RiskMeter } from './RiskMeter';
import {
  ShieldAlert,
  Trash2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

interface MessageScannerProps {
  initialText?: string;
  onScanComplete?: (result: SecurityAnalysisResult) => void;
}

export const MessageScanner: React.FC<MessageScannerProps> = ({
  initialText = '',
  onScanComplete
}) => {
  const [message, setMessage] = useState(initialText);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SecurityAnalysisResult | null>(() => {
    if (initialText) {
      return analyzeContent(initialText, 'message');
    }
    return null;
  });
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  // Sync if initialText changes from parent demo trigger
  React.useEffect(() => {
    if (initialText) {
      setMessage(initialText);
      runAnalysis(initialText);
    }
  }, [initialText]);

  const runAnalysis = (textToAnalyze: string) => {
    if (!textToAnalyze.trim()) return;
    setIsAnalyzing(true);

    // Realistic scanning latency (250ms) to illustrate multi-engine processing
    setTimeout(() => {
      const scanResult = analyzeContent(textToAnalyze, 'message');
      setResult(scanResult);
      recordNewScan(scanResult);
      if (onScanComplete) {
        onScanComplete(scanResult);
      }
      setIsAnalyzing(false);
    }, 280);
  };

  const handleClear = () => {
    setMessage('');
    setResult(null);
  };

  const loadDemo = (scenario: number) => {
    setShowDemoMenu(false);
    let sample = '';
    if (scenario === 1) {
      sample = 'Dear customer, your SBI YONO account KYC expires today. Update immediately at http://192.168.1.1/sbi-kyc/auth.php or enter your OTP to prevent immediate account suspension.';
    } else if (scenario === 2) {
      sample = 'Congratulations! You won ₹50,000 in our international lucky draw. Pay a processing fee of ₹999 to claim your cash reward instantly.';
    } else if (scenario === 3) {
      sample = 'Congratulations! You have been selected for a work-from-home Amazon job. Earn ₹3,000 daily. Pay ₹1,500 registration fee to receive task portal credentials.';
    } else if (scenario === 4) {
      sample = 'Hi Team, our project sync meeting is scheduled tomorrow at 10 AM. Please review the attached slide deck ahead of the call.';
    }
    setMessage(sample);
    runAnalysis(sample);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Message Threat Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Scan a Suspicious Message
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Inspect SMS messages, WhatsApp chats, emails, or job postings for deceptive psychological coercion and fraud signatures.
        </p>
      </div>

      {/* Input Section */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <label htmlFor="message-input" className="text-xs font-mono text-slate-300 uppercase tracking-wider font-semibold">
            Paste a suspicious message
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 rounded-lg transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Try Demo Scam</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showDemoMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-750 shadow-2xl p-2 z-20 space-y-1">
                <button
                  onClick={() => loadDemo(1)}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-xs transition-colors"
                >
                  <div className="font-semibold text-rose-400">Demo 1: KYC & OTP Urgency</div>
                  <div className="text-[11px] text-slate-400 truncate">Bank account suspension notice</div>
                </button>
                <button
                  onClick={() => loadDemo(2)}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-xs transition-colors"
                >
                  <div className="font-semibold text-orange-400">Demo 2: ₹50,000 Prize Fee</div>
                  <div className="text-[11px] text-slate-400 truncate">Lottery win advance fee scam</div>
                </button>
                <button
                  onClick={() => loadDemo(3)}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-xs transition-colors"
                >
                  <div className="font-semibold text-orange-400">Demo 3: WFH Job Registration</div>
                  <div className="text-[11px] text-slate-400 truncate">Recruitment with deposit demand</div>
                </button>
                <button
                  onClick={() => loadDemo(4)}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-xs transition-colors"
                >
                  <div className="font-semibold text-emerald-400">Demo 4: Legitimate Meeting</div>
                  <div className="text-[11px] text-slate-400 truncate">Safe calendar synchronization</div>
                </button>
              </div>
            )}
          </div>
        </div>

        <textarea
          id="message-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Paste SMS, WhatsApp message, email, job offer, payment request, or any suspicious message here…"
          rows={5}
          className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-sans leading-relaxed resize-y"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>{message.length} characters</span>
            {message.length > 0 && <span>· UTF-8 payload</span>}
          </div>

          <div className="flex items-center gap-3">
            {message && (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => runAnalysis(message)}
              disabled={isAnalyzing || !message.trim()}
              className="px-6 py-2.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm shadow-cyan-950 transition-all flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Evaluating Risk Signals...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Analyze Message</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Results View */}
      {result && (
        <div className="space-y-6 pt-2 animate-in fade-in duration-300">
          {/* Risk Score & Gauge */}
          <RiskMeter score={result.riskScore} level={result.riskLevel} />

          {/* Threat Category Card */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Threat Classification
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                {result.category}
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                {result.summaryExplanation}
              </p>
            </div>
            <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-1">
              <span className="text-[10px] font-mono text-slate-400">ML Confidence</span>
              <span className="text-base font-mono font-bold text-cyan-400 tabular-nums">
                {result.signals.mlConfidence}%
              </span>
            </div>
          </div>

          {/* Section 11: Explainable Detection ("Why Did ScamShield Flag This?") */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>Why did ScamShield flag this?</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">
                {result.indicators.length} Threat Vectors Isolated
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.indicators.map((indicator) => (
                <div
                  key={indicator.id}
                  className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`w-4 h-4 ${
                          indicator.severity === 'critical' ? 'text-rose-400' :
                          indicator.severity === 'high' ? 'text-orange-400' :
                          indicator.severity === 'medium' ? 'text-amber-400' : 'text-emerald-400'
                        }`} />
                        <h4 className="text-xs font-bold text-white">
                          {indicator.name}
                        </h4>
                      </div>
                      <span className="text-xs font-mono font-bold tabular-nums text-cyan-400">
                        {indicator.score}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {indicator.explanation}
                    </p>
                  </div>

                  {indicator.evidence && (
                    <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                      <span className="text-slate-500">Trigger: </span>
                      <span className="text-slate-300">{indicator.evidence}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Defensive Action (Requirement 5) */}
          <div className="p-5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 shadow-lg">
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Recommended Defensive Action</span>
            </div>
            <p className="text-sm text-slate-100 font-medium leading-relaxed">
              {result.recommendedAction}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleClear}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Scan Another Message</span>
            </button>

            <div className="text-xs font-mono text-slate-400">
              Audit Record Saved to Scan History
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
