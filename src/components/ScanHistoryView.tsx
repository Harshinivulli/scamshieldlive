import React, { useState } from 'react';
import { ScanHistoryItem, SecurityAnalysisResult, RiskLevel } from '../types';
import { removeHistoryItem, clearAllHistory } from '../utils/storage';
import {
  History,
  Trash2,
  Download,
  Search,
  Filter,
  Eye,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ShieldX,
  FileSpreadsheet
} from 'lucide-react';

interface ScanHistoryViewProps {
  history: ScanHistoryItem[];
  onRefreshHistory: () => void;
  onViewReport: (result: SecurityAnalysisResult) => void;
}

export const ScanHistoryView: React.FC<ScanHistoryViewProps> = ({
  history,
  onRefreshHistory,
  onViewReport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  const filteredItems = history.filter((item) => {
    const matchesSearch =
      item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.inputPreview.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesRisk = riskFilter === 'all' || item.riskLevel === riskFilter;

    return matchesSearch && matchesType && matchesRisk;
  });

  const handleDelete = (id: string) => {
    removeHistoryItem(id);
    onRefreshHistory();
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your local scan history?')) {
      clearAllHistory();
      onRefreshHistory();
    }
  };

  const handleExportCsv = () => {
    const headers = ['Date', 'Type', 'Category', 'Risk Score', 'Risk Level', 'Summary', 'Input Preview'];
    const rows = history.map((item) => [
      `"${item.date}"`,
      `"${item.type}"`,
      `"${item.category}"`,
      item.riskScore,
      `"${item.riskLevel}"`,
      `"${item.summary.replace(/"/g, '""')}"`,
      `"${item.inputPreview.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `scamshield_audit_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRiskBadge = (level: RiskLevel, score: number) => {
    switch (level) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-rose-400 bg-rose-950/60 border border-rose-500/30 px-2 py-0.5 rounded">
            <ShieldX className="w-3 h-3" />
            <span>CRITICAL ({score})</span>
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-orange-400 bg-orange-950/60 border border-orange-500/30 px-2 py-0.5 rounded">
            <ShieldAlert className="w-3 h-3" />
            <span>HIGH ({score})</span>
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded">
            <AlertTriangle className="w-3 h-3" />
            <span>MEDIUM ({score})</span>
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
            <ShieldCheck className="w-3 h-3" />
            <span>LOW ({score})</span>
          </span>
        );
      case 'SAFE':
        return (
          <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
            <ShieldCheck className="w-3 h-3" />
            <span>SAFE ({score})</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail & Persistence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Scan History
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review past security investigations, forensic indicator breakdowns, and risk logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleClearAll}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search category, text, or summary..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Type filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="all">All Types</option>
              <option value="message">Message</option>
              <option value="url">URL</option>
              <option value="qr">QR Code</option>
              <option value="screenshot">Screenshot</option>
            </select>
          </div>

          {/* Risk Level filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Risk:</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="all">All Levels</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
              <option value="SAFE">Safe</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Scan Type</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Input Preview / Findings</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <History className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <p className="font-semibold text-slate-400">No matching scan records found</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Try adjusting your search criteria or run a new scan</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                    {/* Date */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {item.date}
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono uppercase text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {item.type}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 font-semibold text-white whitespace-nowrap">
                      {item.category}
                    </td>

                    {/* Risk Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getRiskBadge(item.riskLevel, item.riskScore)}
                    </td>

                    {/* Preview */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="truncate text-slate-300 font-mono text-[11px]">
                        {item.inputPreview}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {item.summary}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewReport(item.result)}
                          className="p-1.5 rounded-lg text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                          title="View Full Threat Report"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
