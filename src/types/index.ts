export type RiskLevel = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ScamCategory =
  | 'Phishing'
  | 'KYC Scam'
  | 'OTP Scam'
  | 'UPI / Payment Scam'
  | 'Job Scam'
  | 'Prize / Lottery Scam'
  | 'Investment Scam'
  | 'Banking Scam'
  | 'Impersonation'
  | 'Technical Support Scam'
  | 'Normal / Legitimate';

export type ScanType = 'message' | 'url' | 'qr' | 'screenshot';

export interface ThreatIndicator {
  id: string;
  name: string;
  score: number; // 0 - 100
  severity: 'low' | 'medium' | 'high' | 'critical';
  explanation: string;
  evidence?: string;
}

export interface SecurityAnalysisResult {
  id: string;
  timestamp: string;
  type: ScanType;
  inputContent: string;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  category: ScamCategory;
  summaryExplanation: string;
  indicators: ThreatIndicator[];
  recommendedAction: string;
  signals: {
    urgencyScore: number;
    sensitiveDataScore: number;
    financialManipulationScore: number;
    urlThreatScore: number;
    impersonationScore: number;
    mlConfidence: number;
  };
  metadata?: {
    extractedUrl?: string;
    extractedText?: string;
    domainDetails?: {
      hostname: string;
      protocol: string;
      isHttps: boolean;
      isIpAddress: boolean;
      isShortener: boolean;
      suspiciousTld: boolean;
      subdomainCount: number;
      loginPathDetected: boolean;
    };
  };
}

export interface ScanHistoryItem {
  id: string;
  date: string;
  timestamp: number;
  type: ScanType;
  category: ScamCategory;
  riskScore: number;
  riskLevel: RiskLevel;
  summary: string;
  inputPreview: string;
  result: SecurityAnalysisResult;
}

export interface ThreatAnalyticsData {
  totalScans: number;
  threatsDetected: number;
  safeScans: number;
  categoriesBreakdown: { category: string; percentage: number; count: number }[];
  riskDistribution: { level: RiskLevel; count: number; percentage: number; color: string }[];
  dailyScanVolume: { date: string; scans: number; threats: number }[];
}
