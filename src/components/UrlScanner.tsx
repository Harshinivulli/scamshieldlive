import React, { useState } from 'react';
import { SecurityAnalysisResult } from '../types';
import { analyzeContent, analyzeUrlSafety, UrlInspectionDetails } from '../utils/engine';
import { recordNewScan } from '../utils/storage';
import { RiskMeter } from './RiskMeter';
import {
  Link2,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  Server,
  Globe,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface UrlScannerProps {
  onScanComplete?: (result: SecurityAnalysisResult) => void;
}

export const UrlScanner: React.FC<UrlScannerProps> = ({ onScanComplete }) => {
  const [urlInput, setUrlInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<SecurityAnalysisResult | null>(null);
  const [urlDetails, setUrlDetails] = useState<UrlInspectionDetails | null>(null);

  const sampleUrls = [
    { label: 'Raw IP Bank Phishing', url: 'http://192.168.1.1/sbi-kyc-update/login.php' },
    { label: 'Unverified URL Shortener', url: 'https://bit.ly/claim-lottery-won' },
    { label: 'Fake HDFC Subdomain (.xyz)', url: 'https://hdfc-bank-verify.support-portal.xyz/update' },
    { label: 'Legitimate Safe Website', url: 'https://www.google.com' }
  ];

  const handleScan = (urlToScan: string) => {
    if (!urlToScan.trim()) return;
    setIsScanning(true);

    setTimeout(() => {
      const details = analyzeUrlSafety(urlToScan);
      setUrlDetails(details);

      // Run through overall content & category engine
      const scanResult = analyzeContent(urlToScan, 'url');
      // Sync scores with detailed URL analysis
      scanResult.riskScore = details.riskScore;
      if (details.riskScore <= 20) scanResult.riskLevel = 'SAFE';
      else if (details.riskScore <= 40) scanResult.riskLevel = 'LOW';
      else if (details.riskScore <= 60) scanResult.riskLevel = 'MEDIUM';
      else if (details.riskScore <= 80) scanResult.riskLevel = 'HIGH';
      else scanResult.riskLevel = 'CRITICAL';

      setResult(scanResult);
      recordNewScan(scanResult);
      if (onScanComplete) onScanComplete(scanResult);
      setIsScanning(false);
    }, 250);
  };

  const handleClear = () => {
    setUrlInput('');
    setResult(null);
    setUrlDetails(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
          <Link2 className="w-3.5 h-3.5" />
          <span>Domain & Link Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Check a Suspicious URL
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Safely decompose and evaluate unverified web links without sending browser requests or executing client-side scripts.
        </p>
      </div>

      {/* Input Box */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 shadow-xl">
        <label htmlFor="url-input" className="text-xs font-mono text-slate-300 uppercase tracking-wider font-semibold block">
          Paste URL here…
        </label>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Globe className="w-4 h-4" />
            </div>
            <input
              id="url-input"
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="e.g. http://192.168.1.1/update-kyc or https://secure-bank.xyz"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition-all"
            />
          </div>

          <button
            type="button"
            onClick={() => handleScan(urlInput)}
            disabled={isScanning || !urlInput.trim()}
            className="px-6 py-3 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm shadow-cyan-950 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Inspecting Structure...</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Analyze URL</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Sample Presets */}
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Test Samples:</span>
          </span>
          {sampleUrls.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setUrlInput(sample.url);
                handleScan(sample.url);
              }}
              className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* URL Security Report */}
      {result && urlDetails && (
        <div className="space-y-6 pt-2 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
              <span>URL Security Report</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">
              Safe Quarantine Analysis
            </span>
          </div>

          {/* Risk Gauge */}
          <RiskMeter score={result.riskScore} level={result.riskLevel} />

          {/* Detailed Structural Inspection Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Transport Security</div>
              <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold">
                {urlDetails.isHttps ? (
                  <>
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">HTTPS Enforced</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-rose-400" />
                    <span className="text-rose-400">Plain HTTP (Insecure)</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Host Format</div>
              <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold">
                {urlDetails.isIpAddress ? (
                  <>
                    <Server className="w-3.5 h-3.5 text-rose-400" />
                    <span className="text-rose-400">Raw IP Address</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-slate-200">Registered Domain</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Obfuscation</div>
              <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold">
                {urlDetails.isShortener ? (
                  <span className="text-amber-400">Shortened Redirect</span>
                ) : (
                  <span className="text-slate-300">Direct FQDN</span>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Subdomain Depth</div>
              <div className="mt-1 flex items-center gap-1.5 text-xs font-mono font-semibold">
                <span className={urlDetails.subdomainCount >= 2 ? 'text-amber-400' : 'text-slate-300'}>
                  {urlDetails.subdomainCount} subdomains
                </span>
              </div>
            </div>
          </div>

          {/* Indicators Section */}
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Structural Risk Indicators</span>
            </h3>

            {urlDetails.riskReasons.length > 0 ? (
              <ul className="space-y-2.5">
                {urlDetails.riskReasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{reason}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>No high-risk structural anomalies identified on this URL.</span>
              </div>
            )}
          </div>

          {/* Defensive Recommendation */}
          <div className="p-5 rounded-xl bg-cyan-950/40 border border-cyan-500/40">
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Recommended Safe Action</span>
            </div>
            <p className="text-sm text-slate-100 font-medium leading-relaxed">
              {result.recommendedAction}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleClear}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg transition-colors"
            >
              Scan Another URL
            </button>
            <span className="text-[11px] font-mono text-slate-400">
              Sandbox Policy: Zero-click safe quarantine
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
