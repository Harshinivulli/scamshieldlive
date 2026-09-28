import React, { useState, useRef, useEffect } from 'react';
import { SecurityAnalysisResult } from '../types';
import { analyzeContent } from '../utils/engine';
import { recordNewScan } from '../utils/storage';
import { decodeQRCodeFromImage, drawDemoQrToCanvas } from '../utils/qrUtils';
import { RiskMeter } from './RiskMeter';
import {
  QrCode,
  Upload,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  FileImage,
  ExternalLink,
  Sparkles,
  Camera
} from 'lucide-react';

interface QrScannerProps {
  onScanComplete?: (result: SecurityAnalysisResult) => void;
}

export const QrScanner: React.FC<QrScannerProps> = ({ onScanComplete }) => {
  const [extractedPayload, setExtractedPayload] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<SecurityAnalysisResult | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const presets = [
    {
      id: 'kyc_qr',
      title: 'Fake SBI KYC Portal QR',
      risk: 'CRITICAL',
      theme: 'danger' as const,
      payload: 'http://192.168.1.1/sbi-portal/kyc-renew.php?otp=verify'
    },
    {
      id: 'upi_scam',
      title: 'UPI Advance Fee QR',
      risk: 'HIGH',
      theme: 'danger' as const,
      payload: 'upi://pay?pa=prize-reward-claim@okaxis&pn=LuckyPrizeDept&am=1499&tn=ReleaseFee'
    },
    {
      id: 'job_telegram',
      title: 'Recruitment Phishing QR',
      risk: 'HIGH',
      theme: 'warning' as const,
      payload: 'https://workfromhome-amazon-verify.site/deposit-fee'
    },
    {
      id: 'safe_qr',
      title: 'Legitimate Corporate Portal',
      risk: 'SAFE',
      theme: 'safe' as const,
      payload: 'https://security.scamshield.live/guidelines/whitepaper.pdf'
    }
  ];

  const handleSelectPreset = (preset: typeof presets[0]) => {
    setActivePreset(preset.id);
    setErrorMsg(null);
    setExtractedPayload(preset.payload);

    if (canvasRef.current) {
      drawDemoQrToCanvas(canvasRef.current, preset.payload, preset.theme);
    }

    runSecurityAnalysis(preset.payload);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setIsProcessing(true);
    setActivePreset(null);

    try {
      const decoded = await decodeQRCodeFromImage(file);
      if (decoded.success && decoded.text) {
        setExtractedPayload(decoded.text);

        // Draw preview to canvas
        const img = new Image();
        img.onload = () => {
          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
              canvasRef.current.width = 240;
              canvasRef.current.height = 240;
              ctx.drawImage(img, 0, 0, 240, 240);
            }
          }
        };
        img.src = URL.createObjectURL(file);

        runSecurityAnalysis(decoded.text);
      } else {
        setErrorMsg(decoded.error || 'Could not find a valid QR code in this image.');
        setResult(null);
        setExtractedPayload('');
      }
    } catch {
      setErrorMsg('An unexpected error occurred while reading the image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const runSecurityAnalysis = (payload: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      const scanResult = analyzeContent(payload, 'qr');
      setResult(scanResult);
      recordNewScan(scanResult);
      if (onScanComplete) onScanComplete(scanResult);
      setIsProcessing(false);
    }, 240);
  };

  const handleClear = () => {
    setExtractedPayload('');
    setResult(null);
    setErrorMsg(null);
    setActivePreset(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
          <QrCode className="w-3.5 h-3.5" />
          <span>Optical Barcode Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Scan a QR Code
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Safely extract embedded web URLs, UPI payment requests, or text strings from QR barcodes before scanning with your mobile device.
        </p>
      </div>

      {/* Main Upload / Sandbox Area */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Left: Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-750 hover:border-cyan-500/50 bg-slate-950/60 rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[220px]"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-white">
              Upload QR Code Image
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Supports PNG, JPG, WEBP screenshots or photos of physical posters
            </p>
            <span className="mt-3 inline-block px-3 py-1 rounded-md text-[11px] font-mono bg-slate-900 text-cyan-400 border border-slate-800">
              Browse Local File
            </span>
          </div>

          {/* Right: Optical Canvas & State */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-950 rounded-xl border border-slate-800 min-h-[220px]">
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={200}
                height={200}
                className="w-40 h-40 rounded-lg border border-slate-800 bg-slate-900 object-contain"
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
                  <span className="text-[10px] font-mono text-cyan-300">Decoding Matrix...</span>
                </div>
              )}
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-3 text-center">
              {activePreset ? 'Simulated QR Pattern Loaded' : 'QR Preview Frame'}
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Demo Presets (Requirement 9 & 21) */}
        <div className="pt-2 border-t border-slate-800">
          <div className="text-xs font-mono text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Or test with synthetic sample QR codes:</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  activePreset === preset.id
                    ? 'bg-cyan-950/50 border-cyan-500/50 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  {preset.risk}
                </div>
                <div className="text-xs font-semibold truncate mt-0.5">
                  {preset.title}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Results View */}
      {result && extractedPayload && (
        <div className="space-y-6 pt-2 animate-in fade-in duration-300">
          {/* Risk Gauge */}
          <RiskMeter score={result.riskScore} level={result.riskLevel} />

          {/* Extracted QR Content Card */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Extracted QR Payload
              </span>
              <span className="text-xs font-mono text-cyan-400">
                {extractedPayload.startsWith('upi://') ? 'UPI Payment Intent' : extractedPayload.startsWith('http') ? 'Web URL Link' : 'Plain Text'}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 break-all select-all">
              {extractedPayload}
            </div>
          </div>

          {/* Indicators */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <span>QR Security Analysis Indicators</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.indicators.map((indicator) => (
                <div
                  key={indicator.id}
                  className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white">{indicator.name}</span>
                      <span className="text-xs font-mono font-bold text-cyan-400">{indicator.score}%</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {indicator.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation (Requirement 9: Do not open until verified) */}
          <div className="p-5 rounded-xl bg-cyan-950/40 border border-cyan-500/40">
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Recommended Action</span>
            </div>
            <p className="text-sm text-slate-100 font-medium leading-relaxed">
              {result.recommendedAction}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleClear}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Scan Another QR Code</span>
            </button>
            <span className="text-xs font-mono text-slate-400">
              Audit Record Recorded
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
