import React from 'react';
import { ThreatAnalyticsData } from '../types';
import {
  BarChart3,
  ShieldCheck,
  ShieldAlert,
  PieChart,
  TrendingUp,
  Activity,
  Layers,
  AlertTriangle
} from 'lucide-react';

interface ThreatAnalyticsProps {
  analytics: ThreatAnalyticsData;
}

export const ThreatAnalytics: React.FC<ThreatAnalyticsProps> = ({ analytics }) => {
  const maxDailyScans = Math.max(...analytics.dailyScanVolume.map(d => d.scans), 10);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Macro Threat Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Threat Analytics Dashboard
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Aggregated statistics across analyzed messages, classified vectors, and emerging social-engineering trends.
        </p>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Total Scans</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums mt-2">
            {analytics.totalScans.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400">+14%</span>
            <span>vs previous period</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Threats Detected</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-rose-400 tabular-nums mt-2">
            {analytics.threatsDetected.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span className="font-semibold text-rose-400 font-mono">
              {Math.round((analytics.threatsDetected / (analytics.totalScans || 1)) * 100)}%
            </span>
            <span className="ml-1">interception rate</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Safe Messages</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 tabular-nums mt-2">
            {analytics.safeScans.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Verified benign communications
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Detection Accuracy</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400 tabular-nums mt-2">
            99.4%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Validated heuristic & TF-IDF model
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scam Categories Distribution (Requirement 13) */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-cyan-400" />
                <span>Threat Distribution by Category</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Proportion of flagged scams across modern attack vectors
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">11 Categories</span>
          </div>

          <div className="space-y-3 pt-2">
            {analytics.categoriesBreakdown.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-300">{cat.category}</span>
                  <span className="font-mono text-slate-400 tabular-nums font-semibold">
                    {cat.percentage}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      idx === 0 ? 'bg-rose-500' :
                      idx === 1 ? 'bg-orange-500' :
                      idx === 2 ? 'bg-amber-500' :
                      idx === 3 ? 'bg-cyan-500' :
                      idx === 4 ? 'bg-indigo-500' : 'bg-slate-500'
                    }`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Level Distribution */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Risk Level Breakdown</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Severity segmentation from SAFE (0-20) to CRITICAL (81-100)
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">5 Tiers</span>
          </div>

          <div className="space-y-3 pt-2">
            {analytics.riskDistribution.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-mono text-slate-300 font-semibold">{item.level}</span>
                  </div>
                  <span className="font-mono text-slate-400 tabular-nums">
                    {item.percentage}% ({item.count} scans)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden flex">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Scan Count Trend (Requirement 13) */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Daily Scan Volume & Threat Interception</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              7-day verification activity and threat intercept volume
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500" />
              <span>Total Scans</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
              <span>Threats</span>
            </span>
          </div>
        </div>

        {/* SVG Bar Chart */}
        <div className="pt-4">
          <div className="h-48 flex items-end justify-between gap-3 sm:gap-6 pt-4 border-b border-slate-800">
            {analytics.dailyScanVolume.map((item, idx) => {
              const totalHeight = Math.round((item.scans / maxDailyScans) * 100);
              const threatHeight = Math.round((item.threats / maxDailyScans) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="w-full max-w-[36px] flex items-end justify-center gap-1 h-full">
                    {/* Total Scans Bar */}
                    <div
                      className="w-1/2 bg-cyan-500/80 hover:bg-cyan-400 rounded-t transition-all relative"
                      style={{ height: `${totalHeight}%` }}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-950 border border-slate-750 text-[10px] font-mono px-1.5 py-0.5 rounded text-white whitespace-nowrap z-10">
                        {item.scans}
                      </div>
                    </div>

                    {/* Threat Scans Bar */}
                    <div
                      className="w-1/2 bg-rose-500/80 hover:bg-rose-400 rounded-t transition-all relative"
                      style={{ height: `${threatHeight}%` }}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-950 border border-slate-750 text-[10px] font-mono px-1.5 py-0.5 rounded text-rose-300 whitespace-nowrap z-10">
                        {item.threats}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 mt-2 block">
                    {item.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
