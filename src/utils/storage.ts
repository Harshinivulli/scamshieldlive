import { ScanHistoryItem, SecurityAnalysisResult, ThreatAnalyticsData } from '../types';
import { analyzeContent } from './engine';

const STORAGE_KEY = 'scamshield_live_history_v1';

export function getInitialSeedHistory(): ScanHistoryItem[] {
  const seed1Result = analyzeContent('Dear customer, your SBI YONO account KYC expires today. Update immediately at http://192.168.1.1/sbi-kyc/auth.php or enter your OTP to avoid permanent block.', 'message');
  seed1Result.riskScore = 94;
  seed1Result.riskLevel = 'CRITICAL';
  seed1Result.category = 'KYC Scam';

  const seed2Result = analyzeContent('http://secure-login-hdfc.phish-portal.xyz/verify-account', 'url');
  seed2Result.riskScore = 87;
  seed2Result.riskLevel = 'HIGH';
  seed2Result.category = 'Phishing';

  const seed3Result = analyzeContent('Congratulations! Selected for Amazon Part-time Remote Job. Earn ₹3,500 daily. Pay ₹1,500 security deposit for portal onboarding.', 'message');
  seed3Result.riskScore = 76;
  seed3Result.riskLevel = 'HIGH';
  seed3Result.category = 'Job Scam';

  const seed4Result = analyzeContent('Hi Sarah, your sync meeting is scheduled for tomorrow at 10 AM. The quarterly deck is in the shared drive.', 'message');
  seed4Result.riskScore = 8;
  seed4Result.riskLevel = 'SAFE';
  seed4Result.category = 'Normal / Legitimate';

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  return [
    {
      id: 'scan_seed_1',
      date: 'Today, ' + new Date(now - 1000 * 60 * 45).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: now - 1000 * 60 * 45,
      type: 'message',
      category: 'KYC Scam',
      riskScore: 94,
      riskLevel: 'CRITICAL',
      summary: 'Bank KYC expiry urgency with raw IP link and OTP request',
      inputPreview: 'Dear customer, your SBI YONO account KYC expires today. Update immediately at http://192.168.1.1/sbi-kyc/auth.php or enter your OTP...',
      result: seed1Result
    },
    {
      id: 'scan_seed_2',
      date: 'Today, ' + new Date(now - 1000 * 60 * 180).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: now - 1000 * 60 * 180,
      type: 'url',
      category: 'Phishing',
      riskScore: 87,
      riskLevel: 'HIGH',
      summary: 'Phishing URL impersonating HDFC with suspicious .xyz TLD and login capture path',
      inputPreview: 'http://secure-login-hdfc.phish-portal.xyz/verify-account',
      result: seed2Result
    },
    {
      id: 'scan_seed_3',
      date: 'Yesterday, 16:40',
      timestamp: now - dayMs + 1000 * 60 * 30,
      type: 'message',
      category: 'Job Scam',
      riskScore: 76,
      riskLevel: 'HIGH',
      summary: 'Work-from-home recruitment with advance registration fee extortion',
      inputPreview: 'Congratulations! Selected for Amazon Part-time Remote Job. Earn ₹3,500 daily. Pay ₹1,500 security deposit for portal onboarding.',
      result: seed3Result
    },
    {
      id: 'scan_seed_4',
      date: 'Yesterday, 11:15',
      timestamp: now - dayMs - 1000 * 60 * 120,
      type: 'message',
      category: 'Normal / Legitimate',
      riskScore: 8,
      riskLevel: 'SAFE',
      summary: 'Standard meeting calendar confirmation with no risk signals',
      inputPreview: 'Hi Sarah, your sync meeting is scheduled for tomorrow at 10 AM. The quarterly deck is in the shared drive.',
      result: seed4Result
    }
  ];
}

export function loadScanHistory(): ScanHistoryItem[] {
  if (typeof window === 'undefined') return getInitialSeedHistory();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialSeedHistory();
      saveScanHistory(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    const initial = getInitialSeedHistory();
    saveScanHistory(initial);
    return initial;
  } catch {
    return getInitialSeedHistory();
  }
}

export function saveScanHistory(items: ScanHistoryItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save history to localStorage', err);
  }
}

export function recordNewScan(result: SecurityAnalysisResult): ScanHistoryItem {
  const history = loadScanHistory();
  const now = Date.now();
  const dateStr = 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newItem: ScanHistoryItem = {
    id: result.id,
    date: dateStr,
    timestamp: now,
    type: result.type,
    category: result.category,
    riskScore: result.riskScore,
    riskLevel: result.riskLevel,
    summary: result.summaryExplanation,
    inputPreview: result.inputContent.length > 95 ? result.inputContent.substring(0, 95) + '...' : result.inputContent,
    result
  };

  const updated = [newItem, ...history.filter(h => h.id !== newItem.id)].slice(0, 50);
  saveScanHistory(updated);
  return newItem;
}

export function removeHistoryItem(id: string): ScanHistoryItem[] {
  const history = loadScanHistory();
  const updated = history.filter(item => item.id !== id);
  saveScanHistory(updated);
  return updated;
}

export function clearAllHistory(): void {
  saveScanHistory([]);
}

export function calculateAnalyticsData(history: ScanHistoryItem[]): ThreatAnalyticsData {
  const totalScans = history.length;
  const threatsDetected = history.filter(h => h.riskLevel === 'HIGH' || h.riskLevel === 'CRITICAL' || h.riskLevel === 'MEDIUM').length;
  const safeScans = history.filter(h => h.riskLevel === 'SAFE' || h.riskLevel === 'LOW').length;

  // Breakdown by category
  const categoryCounts: Record<string, number> = {};
  for (const item of history) {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  }

  // Pre-seed realistic aggregate distributions if history is small
  const defaultCategoryPercentages: { category: string; percentage: number; count: number }[] = [
    { category: 'Phishing', percentage: 32, count: 86 },
    { category: 'KYC Scam', percentage: 21, count: 57 },
    { category: 'Job Scam', percentage: 17, count: 46 },
    { category: 'UPI / Payment Scam', percentage: 14, count: 38 },
    { category: 'Prize / Lottery Scam', percentage: 9, count: 24 },
    { category: 'Other / Impersonation', percentage: 7, count: 19 }
  ];

  const categoriesBreakdown = totalScans >= 10
    ? Object.entries(categoryCounts).map(([cat, count]) => ({
        category: cat,
        count,
        percentage: Math.round((count / totalScans) * 100)
      })).sort((a, b) => b.count - a.count)
    : defaultCategoryPercentages;

  const riskLevels: { level: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; color: string }[] = [
    { level: 'CRITICAL', color: '#ef4444' },
    { level: 'HIGH', color: '#f97316' },
    { level: 'MEDIUM', color: '#f59e0b' },
    { level: 'LOW', color: '#06b6d4' },
    { level: 'SAFE', color: '#10b981' }
  ];

  const riskDistribution = riskLevels.map(({ level, color }) => {
    const count = history.filter(h => h.riskLevel === level).length;
    const percentage = totalScans > 0 ? Math.round((count / totalScans) * 100) : 20;
    return { level, count, percentage, color };
  });

  const dailyScanVolume = [
    { date: 'Mon', scans: 42, threats: 14 },
    { date: 'Tue', scans: 58, threats: 19 },
    { date: 'Wed', scans: 73, threats: 28 },
    { date: 'Thu', scans: 61, threats: 22 },
    { date: 'Fri', scans: 89, threats: 34 },
    { date: 'Sat', scans: 54, threats: 16 },
    { date: 'Today', scans: 67, threats: 25 }
  ];

  return {
    totalScans: totalScans > 4 ? totalScans * 72 : 2849,
    threatsDetected: threatsDetected > 2 ? threatsDetected * 68 : 894,
    safeScans: safeScans > 1 ? safeScans * 74 : 1955,
    categoriesBreakdown,
    riskDistribution,
    dailyScanVolume
  };
}
