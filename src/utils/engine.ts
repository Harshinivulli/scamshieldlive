import { RiskLevel, ScamCategory, SecurityAnalysisResult, ThreatIndicator, ScanType } from '../types';

// URL Regular Expression
const URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(?:com|org|net|xyz|top|icu|biz|info|site|online|live|tech|club|vip|shop|in|co|us|cc|to|tk|ml|ga|cf|gq)[^\s]*)/gi;

// Known URL shorteners
const SHORTENER_DOMAINS = [
  'bit.ly', 'tinyurl.com', 'is.gd', 'cutt.ly', 'rb.gy', 't.co', 'ow.ly',
  'buff.ly', 'goo.gl', 'bl.ink', 'shorturl.at', 'rebrand.ly', 'v.gd'
];

// Suspicious / high-abuse TLDs
const SUSPICIOUS_TLDS = ['.xyz', '.top', '.icu', '.work', '.click', '.buzz', '.fit', '.tk', '.ml', '.ga', '.cf', '.gq', '.rest', '.quest', '.cam', '.country'];

// Bank & brand impersonation targets
const TARGET_BRANDS = [
  { name: 'SBI', regex: /\b(sbi|state\s*bank|yono)\b/i },
  { name: 'HDFC', regex: /\b(hdfc|hdfcbank)\b/i },
  { name: 'ICICI', regex: /\b(icici|imobile)\b/i },
  { name: 'Axis Bank', regex: /\b(axis|axisbank)\b/i },
  { name: 'PayPal', regex: /\b(paypal|pay-pal)\b/i },
  { name: 'Netflix', regex: /\b(netflix)\b/i },
  { name: 'Amazon', regex: /\b(amazon|prime)\b/i },
  { name: 'Apple', regex: /\b(apple|icloud|itunes)\b/i },
  { name: 'Microsoft', regex: /\b(microsoft|windows|office365)\b/i },
  { name: 'Income Tax / GST', regex: /\b(income\s*tax|gst\s*department|tax\s*refund)\b/i },
  { name: 'Telecom / TRAI', regex: /\b(trai|sim\s*block|jio|airtel|vi\s*telecom)\b/i }
];

export interface UrlInspectionDetails {
  rawUrl: string;
  normalizedUrl: string;
  hostname: string;
  protocol: string;
  isHttps: boolean;
  isIpAddress: boolean;
  isShortener: boolean;
  suspiciousTld: boolean;
  subdomainCount: number;
  loginPathDetected: boolean;
  brandImpersonation: string | null;
  riskScore: number;
  riskReasons: string[];
}

/**
 * URL Analyzer component
 */
export function analyzeUrlSafety(rawInput: string): UrlInspectionDetails {
  let url = rawInput.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  let hostname = '';
  let protocol = 'https:';
  let pathname = '';

  try {
    const parsed = new URL(url);
    hostname = parsed.hostname.toLowerCase();
    protocol = parsed.protocol;
    pathname = parsed.pathname.toLowerCase() + parsed.search.toLowerCase();
  } catch {
    hostname = url.replace(/^https?:\/\//i, '').split('/')[0].toLowerCase();
    protocol = rawInput.toLowerCase().startsWith('http://') ? 'http:' : 'https:';
    pathname = '/';
  }

  const isHttps = protocol === 'https:';
  const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
  const isShortener = SHORTENER_DOMAINS.some(d => hostname === d || hostname.endsWith('.' + d));
  const suspiciousTld = SUSPICIOUS_TLDS.some(tld => hostname.endsWith(tld));
  const subdomainParts = hostname.split('.');
  const subdomainCount = subdomainParts.length > 2 ? subdomainParts.length - 2 : 0;
  
  const loginKeywords = ['login', 'signin', 'auth', 'verify', 'update', 'kyc', 'secure', 'account', 'password', 'banking', 'wallet', 'pan', 'aadhaar', 'claim', 'reward', 'portal'];
  const loginPathDetected = loginKeywords.some(kw => pathname.includes(kw) || hostname.includes(kw));

  let brandImpersonation: string | null = null;
  for (const b of TARGET_BRANDS) {
    if (b.regex.test(hostname) && !hostname.endsWith(`.${b.name.toLowerCase()}.com`) && !hostname.endsWith(`.${b.name.toLowerCase()}.in`)) {
      brandImpersonation = b.name;
      break;
    }
  }

  const riskReasons: string[] = [];
  let score = 5; // Baseline clean

  if (!isHttps) {
    score += 25;
    riskReasons.push('Insecure connection (Plain HTTP without SSL/TLS encryption)');
  }
  if (isIpAddress) {
    score += 45;
    riskReasons.push('Raw IP address host detected instead of registered domain');
  }
  if (isShortener) {
    score += 30;
    riskReasons.push('URL shortener obscures the destination address');
  }
  if (suspiciousTld) {
    score += 30;
    riskReasons.push('High-risk top-level domain frequently associated with throwaway phishing kits');
  }
  if (subdomainCount >= 3) {
    score += 25;
    riskReasons.push(`Excessive subdomain nesting (${subdomainCount} subdomains) masking real host`);
  }
  if (loginPathDetected) {
    score += 20;
    riskReasons.push('Sensitive credential or KYC collection keywords in path');
  }
  if (brandImpersonation) {
    score += 45;
    riskReasons.push(`Possible unauthorized domain impersonating brand: ${brandImpersonation}`);
  }
  if (/[0-9-]{6,}/.test(hostname)) {
    score += 15;
    riskReasons.push('Heavily hyphenated or numeric randomized hostname');
  }

  const boundedScore = Math.min(100, Math.max(0, score));

  return {
    rawUrl: rawInput,
    normalizedUrl: url,
    hostname,
    protocol,
    isHttps,
    isIpAddress,
    isShortener,
    suspiciousTld,
    subdomainCount,
    loginPathDetected,
    brandImpersonation,
    riskScore: boundedScore,
    riskReasons
  };
}

/**
 * Text Preprocessing & Tokenization
 */
function preprocessText(text: string): { cleaned: string; urls: string[]; upiStrings: string[] } {
  const urls: string[] = [];
  const upiStrings: string[] = [];

  // Extract URLs
  let match;
  const urlRegexClone = new RegExp(URL_REGEX);
  while ((match = urlRegexClone.exec(text)) !== null) {
    urls.push(match[0]);
  }

  // Extract UPI payment links
  const upiRegex = /upi:\/\/[^\s]+/gi;
  while ((match = upiRegex.exec(text)) !== null) {
    upiStrings.push(match[0]);
  }

  const cleaned = text
    .toLowerCase()
    .replace(/[^\w\s@.₹$€£:-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return { cleaned, urls, upiStrings };
}

/**
 * Category & Risk Engine
 */
export function analyzeContent(rawText: string, type: ScanType = 'message'): SecurityAnalysisResult {
  const { cleaned, urls, upiStrings } = preprocessText(rawText);
  const id = 'scan_' + Math.random().toString(36).substring(2, 9);
  const timestamp = new Date().toISOString();

  // 1. Urgency & Panic Signals
  const urgencyKeywords = [
    'immediately', 'urgent', 'urgently', 'expires today', 'within 24 hours', 'within 2 hours',
    'last chance', 'account suspended', 'account blocked', 'deactivated', 'terminated', 'action required',
    'fail to update', 'instant block', 'police complaint', 'legal notice', 'fir registered', 'arrest warrant'
  ];
  let urgencyMatches = 0;
  for (const kw of urgencyKeywords) {
    if (cleaned.includes(kw)) urgencyMatches++;
  }
  const urgencyScore = Math.min(100, urgencyMatches * 32);

  // 2. Sensitive Information Demand
  const sensitiveKeywords = [
    'otp', 'one time password', 'cvv', 'pin', 'atm pin', 'password', 'netbanking password',
    'pan card', 'aadhaar', 'debit card number', 'credit card number', 'secret code', 'security question'
  ];
  let sensitiveMatches = 0;
  for (const kw of sensitiveKeywords) {
    if (cleaned.includes(kw)) sensitiveMatches++;
  }
  const sensitiveDataScore = Math.min(100, sensitiveMatches * 42);

  // 3. Financial Manipulation & Upfront Fee Extortion
  const financialKeywords = [
    'processing fee', 'registration fee', 'security deposit', 'pay ₹', 'pay rs', 'send money',
    'lottery won', 'cash prize', 'transfer fee', 'guaranteed returns', 'double your money',
    'claim 50000', 'claim 25000', 'won 50,000', 'won ₹', 'refund approved', 'credited to account',
    'part time job', 'work from home', 'daily income', 'earn 5000 daily', 'telegram task'
  ];
  let financialMatches = 0;
  for (const kw of financialKeywords) {
    if (cleaned.includes(kw)) financialMatches++;
  }
  const financialManipulationScore = Math.min(100, financialMatches * 35);

  // 4. URL Threat Analysis
  let urlThreatScore = 0;
  let primaryUrlInspection: UrlInspectionDetails | undefined = undefined;
  if (urls.length > 0) {
    primaryUrlInspection = analyzeUrlSafety(urls[0]);
    urlThreatScore = primaryUrlInspection.riskScore;
  }

  // 5. Brand Impersonation Signals
  let impersonationMatches = 0;
  let impersonatedBrandName = '';
  for (const b of TARGET_BRANDS) {
    if (b.regex.test(cleaned)) {
      impersonationMatches++;
      impersonatedBrandName = b.name;
    }
  }
  const impersonationScore = Math.min(100, impersonationMatches * 38);

  // 6. UPI String Threat
  let upiThreatScore = 0;
  if (upiStrings.length > 0) {
    upiThreatScore = 75;
  }

  // 7. ML Model Feature Simulation
  // Simulates TF-IDF vector weightings for scam vocabulary vs benign communication
  const scamVocabularyWeights: Record<string, number> = {
    'kyc': 0.85, 'block': 0.72, 'expire': 0.78, 'otp': 0.95, 'claim': 0.75,
    'lottery': 0.92, 'winner': 0.88, 'selected': 0.65, 'registration': 0.70,
    'fee': 0.68, 'refund': 0.62, 'yono': 0.82, 'update': 0.45, 'link': 0.50,
    'crypto': 0.72, 'bitcoin': 0.65, 'invest': 0.68, 'guaranteed': 0.85,
    'telegram': 0.74, 'whatsapp': 0.35, 'click': 0.55
  };

  const benignVocabularyWeights: Record<string, number> = {
    'meeting': -0.75, 'tomorrow': -0.40, 'schedule': -0.60, 'agenda': -0.70,
    'lunch': -0.80, 'project': -0.50, 'attached': -0.45, 'notes': -0.55,
    'calendar': -0.65, 'sincerely': -0.50, 'regards': -0.50, 'thanks': -0.45
  };

  let mlFeatureSum = 0;
  for (const [word, weight] of Object.entries(scamVocabularyWeights)) {
    if (cleaned.includes(word)) mlFeatureSum += weight;
  }
  for (const [word, weight] of Object.entries(benignVocabularyWeights)) {
    if (cleaned.includes(word)) mlFeatureSum += weight;
  }

  const mlConfidence = Math.min(100, Math.max(0, Math.round((1 / (1 + Math.exp(-mlFeatureSum))) * 100)));

  // Combine Signals into Multi-Factor Risk Score
  let calculatedScore = 0;

  if (cleaned.length === 0 && urls.length === 0) {
    calculatedScore = 0;
  } else {
    // Weighted combination of multi-signal architecture
    calculatedScore = Math.round(
      urgencyScore * 0.22 +
      sensitiveDataScore * 0.28 +
      financialManipulationScore * 0.20 +
      urlThreatScore * 0.18 +
      impersonationScore * 0.07 +
      (mlConfidence > 50 ? (mlConfidence - 50) * 0.5 : 0)
    );

    // Boost if critical dangerous combinations detected
    if (sensitiveMatches > 0 && urgencyMatches > 0) {
      calculatedScore = Math.max(calculatedScore, 85);
    }
    if (cleaned.includes('kyc') && (cleaned.includes('block') || cleaned.includes('expire') || urls.length > 0)) {
      calculatedScore = Math.max(calculatedScore, 88);
    }
    if (financialMatches > 0 && cleaned.includes('fee')) {
      calculatedScore = Math.max(calculatedScore, 78);
    }
    if (primaryUrlInspection && primaryUrlInspection.isIpAddress && primaryUrlInspection.loginPathDetected) {
      calculatedScore = Math.max(calculatedScore, 95);
    }
    if (cleaned.includes('meeting') && !cleaned.includes('otp') && !cleaned.includes('kyc') && urls.length === 0 && financialMatches === 0) {
      calculatedScore = Math.min(calculatedScore, 10);
    }
  }

  calculatedScore = Math.min(100, Math.max(0, calculatedScore));

  // Determine Risk Level (Requirement 6)
  let riskLevel: RiskLevel = 'SAFE';
  if (calculatedScore <= 20) riskLevel = 'SAFE';
  else if (calculatedScore <= 40) riskLevel = 'LOW';
  else if (calculatedScore <= 60) riskLevel = 'MEDIUM';
  else if (calculatedScore <= 80) riskLevel = 'HIGH';
  else riskLevel = 'CRITICAL';

  // Determine Scam Category (Requirement 7)
  let category: ScamCategory = 'Normal / Legitimate';

  if (riskLevel === 'SAFE') {
    category = 'Normal / Legitimate';
  } else if (cleaned.includes('kyc') || cleaned.includes('pan card') || cleaned.includes('aadhaar')) {
    category = 'KYC Scam';
  } else if (cleaned.includes('otp') || cleaned.includes('one time password')) {
    category = 'OTP Scam';
  } else if (cleaned.includes('upi') || upiStrings.length > 0 || cleaned.includes('cashback') || cleaned.includes('qr code payment')) {
    category = 'UPI / Payment Scam';
  } else if (cleaned.includes('job') || cleaned.includes('work from home') || cleaned.includes('registration fee') || cleaned.includes('daily income') || cleaned.includes('part time')) {
    category = 'Job Scam';
  } else if (cleaned.includes('lottery') || cleaned.includes('won') || cleaned.includes('prize') || cleaned.includes('lucky draw') || cleaned.includes('claim 50000')) {
    category = 'Prize / Lottery Scam';
  } else if (cleaned.includes('invest') || cleaned.includes('crypto') || cleaned.includes('bitcoin') || cleaned.includes('returns') || cleaned.includes('double money')) {
    category = 'Investment Scam';
  } else if (impersonatedBrandName && (impersonatedBrandName.includes('Bank') || impersonatedBrandName === 'SBI' || impersonatedBrandName === 'HDFC' || impersonatedBrandName === 'ICICI')) {
    category = 'Banking Scam';
  } else if (cleaned.includes('support') || cleaned.includes('anydesk') || cleaned.includes('teamviewer') || cleaned.includes('technician') || cleaned.includes('windows support')) {
    category = 'Technical Support Scam';
  } else if (impersonationMatches > 0) {
    category = 'Impersonation';
  } else if (urls.length > 0 || primaryUrlInspection?.loginPathDetected) {
    category = 'Phishing';
  } else {
    category = 'Phishing';
  }

  // Generate Explainable Indicators (Requirement 11)
  const indicators: ThreatIndicator[] = [];

  if (urgencyMatches > 0) {
    const scoreVal = Math.min(99, 70 + urgencyMatches * 10);
    indicators.push({
      id: 'ind_urgency',
      name: 'Urgency & Coercion Detected',
      score: scoreVal,
      severity: scoreVal > 80 ? 'critical' : 'high',
      explanation: 'The message pressures the recipient to act immediately under threat of service termination, fine, or legal consequence.',
      evidence: 'Contains urgency keywords enforcing immediate compliance.'
    });
  }

  if (sensitiveMatches > 0) {
    const scoreVal = Math.min(99, 75 + sensitiveMatches * 10);
    indicators.push({
      id: 'ind_sensitive',
      name: 'Sensitive Credential Demand',
      score: scoreVal,
      severity: 'critical',
      explanation: 'Legitimate institutions never request confidential authentication factors like OTPs, MPINs, passwords, or CVVs via unsolicited messages.',
      evidence: 'Directly asks for authentication credentials or one-time verification tokens.'
    });
  }

  if (financialMatches > 0) {
    const scoreVal = Math.min(98, 70 + financialMatches * 9);
    indicators.push({
      id: 'ind_financial',
      name: 'Financial Manipulation & Advance Fee',
      score: scoreVal,
      severity: scoreVal > 80 ? 'critical' : 'high',
      explanation: 'Attacker promises an unreal prize, lucrative salary, or pending refund contingent on the victim sending upfront fees or clicking an unauthorized link.',
      evidence: 'Demands advance registration, verification deposit, or processing fee.'
    });
  }

  if (urls.length > 0 && primaryUrlInspection) {
    indicators.push({
      id: 'ind_url',
      name: 'Suspicious Destination Link',
      score: primaryUrlInspection.riskScore,
      severity: primaryUrlInspection.riskScore > 80 ? 'critical' : primaryUrlInspection.riskScore > 50 ? 'high' : 'medium',
      explanation: primaryUrlInspection.riskReasons.length > 0 
        ? primaryUrlInspection.riskReasons.join('. ') + '.'
        : 'The link directs users to an unverified external domain that must be handled with caution.',
      evidence: `Target link: ${primaryUrlInspection.hostname}`
    });
  }

  if (impersonationMatches > 0) {
    indicators.push({
      id: 'ind_brand',
      name: 'Brand & Authority Impersonation',
      score: 89,
      severity: 'high',
      explanation: `The communication mimics recognized authority "${impersonatedBrandName}" to lower psychological resistance and trigger obedience.`,
      evidence: `Impersonates trusted institution: ${impersonatedBrandName}`
    });
  }

  if (upiStrings.length > 0) {
    indicators.push({
      id: 'ind_upi',
      name: 'Embedded UPI Payment String',
      score: 93,
      severity: 'critical',
      explanation: 'Contains an automatic UPI payment handler link designed to drain funds upon biometric/PIN authorization.',
      evidence: 'Unverified UPI intent address embedded in communication.'
    });
  }

  // If Safe, provide affirming indicators
  if (indicators.length === 0) {
    indicators.push({
      id: 'ind_clean',
      name: 'No Common Threat Signatures',
      score: 95,
      severity: 'low',
      explanation: 'Content does not demonstrate urgency pressure, credential harvesting, upfront fees, or malicious links.',
      evidence: 'Standard conversational or administrative phrasing.'
    });
  }

  // Generate Recommended Action
  let recommendedAction = '';
  if (riskLevel === 'CRITICAL') {
    recommendedAction = 'STOP. Do NOT click the link, scan the code, or share your OTP under any circumstance. Verify the claim exclusively through official customer support channels listed on your physical card or bank portal.';
  } else if (riskLevel === 'HIGH') {
    recommendedAction = 'HIGH RISK DETECTED. Do not make any payments, pay registration fees, or provide personal identity proofs. Block the sender and report the message to cybercrime authorities.';
  } else if (riskLevel === 'MEDIUM') {
    recommendedAction = 'Proceed with extreme caution. The communication contains promotional or unverified claims. Independently verify the organization before responding or disclosing details.';
  } else if (riskLevel === 'LOW') {
    recommendedAction = 'Minimal risk patterns found, but always exercise standard cybersecurity hygiene. Never disclose passwords or authentication codes.';
  } else {
    recommendedAction = 'No active security threats identified. The content appears routine and non-threatening. Practice standard digital awareness.';
  }

  // Summary explanation
  let summaryExplanation = '';
  if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
    summaryExplanation = `ScamShield detected critical signals characteristic of ${category}. The sender uses coercive social-engineering techniques to prompt immediate compliance before you have time to verify.`;
  } else if (riskLevel === 'MEDIUM') {
    summaryExplanation = `The content has elevated indicators of unsolicited marketing or unverified third-party claims. Independent verification recommended.`;
  } else {
    summaryExplanation = `Content analysis completed. No malicious vectors, credential harvesting patterns, or fraudulent social-engineering tactics detected.`;
  }

  return {
    id,
    timestamp,
    type,
    inputContent: rawText,
    riskScore: calculatedScore,
    riskLevel,
    category,
    summaryExplanation,
    indicators,
    recommendedAction,
    signals: {
      urgencyScore,
      sensitiveDataScore,
      financialManipulationScore,
      urlThreatScore,
      impersonationScore,
      mlConfidence
    },
    metadata: {
      extractedUrl: urls[0],
      domainDetails: primaryUrlInspection ? {
        hostname: primaryUrlInspection.hostname,
        protocol: primaryUrlInspection.protocol,
        isHttps: primaryUrlInspection.isHttps,
        isIpAddress: primaryUrlInspection.isIpAddress,
        isShortener: primaryUrlInspection.isShortener,
        suspiciousTld: primaryUrlInspection.suspiciousTld,
        subdomainCount: primaryUrlInspection.subdomainCount,
        loginPathDetected: primaryUrlInspection.loginPathDetected
      } : undefined
    }
  };
}
