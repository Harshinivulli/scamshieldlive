import React from 'react';
import { RiskLevel } from '../types';
import { ShieldCheck, ShieldAlert, AlertTriangle, ShieldX, Info } from 'lucide-react';

interface RiskMeterProps {
  score: number;
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showGauge?: boolean;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ score, level, size = 'md', showGauge = true }) => {
  const getLevelConfig = () => {
    switch (level) {
      case 'SAFE':
        return {
          textColor: 'text-emerald-400',
          borderColor: 'border-emerald-500/30',
          bgColor: 'bg-emerald-950/40',
          progressColor: 'bg-emerald-500',
          ringColor: '#10b981',
          label: 'SAFE',
          Icon: ShieldCheck,
          description: 'No malicious signatures or deceptive coercion detected'
        };
      case 'LOW':
        return {
          textColor: 'text-cyan-400',
          borderColor: 'border-cyan-500/30',
          bgColor: 'bg-cyan-950/40',
          progressColor: 'bg-cyan-500',
          ringColor: '#06b6d4',
          label: 'LOW RISK',
          Icon: Info,
          description: 'Minimal risk indicators detected; exercise routine caution'
        };
      case 'MEDIUM':
        return {
          textColor: 'text-amber-400',
          borderColor: 'border-amber-500/30',
          bgColor: 'bg-amber-950/40',
          progressColor: 'bg-amber-500',
          ringColor: '#f59e0b',
          label: 'MEDIUM RISK',
          Icon: AlertTriangle,
          description: 'Suspicious marketing or unsolicited claims found; verify independently'
        };
      case 'HIGH':
        return {
          textColor: 'text-orange-400',
          borderColor: 'border-orange-500/30',
          bgColor: 'bg-orange-950/40',
          progressColor: 'bg-orange-500',
          ringColor: '#f97316',
          label: 'HIGH RISK',
          Icon: ShieldAlert,
          description: 'Active phishing or fee advance extortion pattern identified'
        };
      case 'CRITICAL':
        return {
          textColor: 'text-rose-400',
          borderColor: 'border-rose-500/40',
          bgColor: 'bg-rose-950/50',
          progressColor: 'bg-rose-500',
          ringColor: '#ef4444',
          label: 'CRITICAL RISK',
          Icon: ShieldX,
          description: 'Imminent fraud threat targeting banking credentials or OTPs'
        };
    }
  };

  const config = getLevelConfig();
  const IconComponent = config.Icon;

  // Circular gauge calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  if (size === 'sm') {
    return (
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1.5 font-mono text-xs font-semibold px-2 py-0.5 rounded border ${config.borderColor} ${config.bgColor} ${config.textColor}`}>
          <IconComponent className="w-3.5 h-3.5" />
          <span className="tabular-nums">{score}</span>
          <span className="text-slate-400">/100</span>
          <span>·</span>
          <span>{config.label}</span>
        </span>
      </div>
    );
  }

  return (
    <div className={`p-5 rounded-xl border ${config.borderColor} ${config.bgColor} backdrop-blur-sm transition-all duration-300`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left: Score Gauge */}
        {showGauge && (
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r={radius}
                stroke={config.ringColor}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={`text-2xl font-bold font-mono tabular-nums leading-none ${config.textColor}`}>
                {score}
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mt-0.5">
                of 100
              </span>
            </div>
          </div>
        )}

        {/* Center / Right: Details */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${config.borderColor} ${config.bgColor} ${config.textColor}`}>
              <IconComponent className="w-4 h-4" />
              {config.label}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ScamShield Threat Engine
            </span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
            {config.description}
          </p>

          {/* Segmented Risk Scale Bar */}
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
              <span>Threat Spectrum</span>
              <span className="tabular-nums text-slate-300 font-semibold">{score} %</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden flex gap-0.5 p-0.5 border border-slate-800">
              <div
                className={`h-full rounded-sm transition-all duration-500 ${config.progressColor}`}
                style={{ width: `${Math.max(4, score)}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-1">
              <span>0 SAFE</span>
              <span>40 LOW</span>
              <span>60 MED</span>
              <span>80 HIGH</span>
              <span>100 CRIT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
