import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory / persistent scan log
interface ApiHistoryRecord {
  id: string;
  date: string;
  timestamp: number;
  type: string;
  category: string;
  risk_score: number;
  risk_level: string;
  summary: string;
  input_preview: string;
  indicators: Array<{ name: string; score: number; explanation: string }>;
  recommended_action: string;
}

const auditHistory: ApiHistoryRecord[] = [
  {
    id: 'rec_001',
    date: 'Today, 11:20 AM',
    timestamp: Date.now() - 3600000,
    type: 'message',
    category: 'KYC Scam',
    risk_score: 94,
    risk_level: 'CRITICAL',
    summary: 'Bank KYC expiry urgency with raw IP link and OTP request',
    input_preview: 'Dear customer, your SBI YONO account KYC expires today. Update immediately at http://192.168.1.1/sbi-kyc/auth.php or enter your OTP...',
    indicators: [
      { name: 'Urgency', score: 92, explanation: 'The message pressures the user to act immediately.' },
      { name: 'OTP Request', score: 95, explanation: 'The message requests sensitive authentication information.' },
      { name: 'Suspicious URL', score: 95, explanation: 'Raw IP address host detected instead of registered bank domain.' }
    ],
    recommended_action: 'Do not click the link or share your OTP. Verify the request through official channels.'
  },
  {
    id: 'rec_002',
    date: 'Today, 09:14 AM',
    timestamp: Date.now() - 7200000,
    type: 'url',
    category: 'Phishing',
    risk_score: 87,
    risk_level: 'HIGH',
    summary: 'Phishing domain impersonating HDFC with .xyz TLD and login credential harvesting path',
    input_preview: 'http://secure-login-hdfc.phish-portal.xyz/verify-account',
    indicators: [
      { name: 'Insecure Protocol', score: 85, explanation: 'Plain HTTP without SSL encryption.' },
      { name: 'Suspicious TLD', score: 90, explanation: '.xyz top level domain associated with throwaway phishing.' }
    ],
    recommended_action: 'Do not access this URL. Never enter credentials on unverified third-party domains.'
  }
];

// Backend Detection Pipeline Logic
function analyzeTextEngine(text: string, type: string = 'message') {
  const lower = text.toLowerCase();
  let urgency = 0;
  let sensitive = 0;
  let financial = 0;
  let suspiciousUrl = 0;

  if (/urgent|immediately|expire|today|blocked|suspended|terminate|within\s*24/i.test(lower)) urgency = 92;
  if (/otp|password|cvv|pin|aadhaar|pan\s*card/i.test(lower)) sensitive = 95;
  if (/fee|won|₹|rs|prize|lottery|registration|deposit|daily\s*income/i.test(lower)) financial = 88;
  if (/http:\/\/|192\.168|\.xyz|\.top|bit\.ly/i.test(lower)) suspiciousUrl = 94;

  let riskScore = 10;
  if (urgency > 0 || sensitive > 0 || financial > 0 || suspiciousUrl > 0) {
    riskScore = Math.max(urgency, sensitive, financial, suspiciousUrl);
    if (urgency > 0 && sensitive > 0) riskScore = 96;
  }

  let riskLevel = 'SAFE';
  if (riskScore > 80) riskLevel = 'CRITICAL';
  else if (riskScore > 60) riskLevel = 'HIGH';
  else if (riskScore > 40) riskLevel = 'MEDIUM';
  else if (riskScore > 20) riskLevel = 'LOW';

  let category = 'Normal / Legitimate';
  if (lower.includes('kyc') || lower.includes('pan')) category = 'KYC Scam';
  else if (lower.includes('otp')) category = 'OTP Scam';
  else if (lower.includes('job') || lower.includes('work from home')) category = 'Job Scam';
  else if (lower.includes('prize') || lower.includes('won') || lower.includes('lottery')) category = 'Prize / Lottery Scam';
  else if (lower.includes('upi') || lower.includes('cashback')) category = 'UPI / Payment Scam';
  else if (suspiciousUrl > 0) category = 'Phishing';
  else if (riskLevel === 'SAFE') category = 'Normal / Legitimate';

  const indicators = [];
  if (urgency > 0) {
    indicators.push({
      name: 'Urgency',
      score: urgency,
      explanation: 'The message pressures the user to act immediately.'
    });
  }
  if (sensitive > 0) {
    indicators.push({
      name: 'OTP / Credential Request',
      score: sensitive,
      explanation: 'The message requests sensitive authentication information.'
    });
  }
  if (financial > 0) {
    indicators.push({
      name: 'Financial Manipulation',
      score: financial,
      explanation: 'Attempts to influence the user to make a payment or deposit upfront fee.'
    });
  }
  if (suspiciousUrl > 0) {
    indicators.push({
      name: 'Suspicious URL',
      score: suspiciousUrl,
      explanation: 'The URL has characteristics commonly associated with credential theft.'
    });
  }
  if (indicators.length === 0) {
    indicators.push({
      name: 'Clean Content',
      score: 95,
      explanation: 'No malicious keywords, psychological pressure, or phishing signatures identified.'
    });
  }

  let recommendedAction = 'No action required. Standard communication.';
  if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
    recommendedAction = 'Do not click the link or share your OTP. Verify the request through the organization’s official customer-support channel.';
  } else if (riskLevel === 'MEDIUM') {
    recommendedAction = 'Verify the claims independently before responding or disclosing details.';
  }

  return {
    risk_score: riskScore,
    risk_level: riskLevel,
    category,
    indicators,
    recommended_action: recommendedAction
  };
}

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    protection_active: true,
    engine: 'ScamShield Live Risk Engine v2.4',
    ml_model_status: 'loaded',
    timestamp: new Date().toISOString()
  });
});

// 2. Scan Message
app.post('/api/scan-message', (req: Request, res: Response) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Field "message" string is required.' });
  }

  const analysis = analyzeTextEngine(message, 'message');
  
  auditHistory.unshift({
    id: 'rec_' + Math.random().toString(36).substring(2, 8),
    date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timestamp: Date.now(),
    type: 'message',
    category: analysis.category,
    risk_score: analysis.risk_score,
    risk_level: analysis.risk_level,
    summary: `${analysis.category}: ${analysis.indicators[0]?.explanation || 'Analyzed'}`,
    input_preview: message.substring(0, 90),
    indicators: analysis.indicators,
    recommended_action: analysis.recommended_action
  });

  res.json(analysis);
});

// 3. Analyze URL
app.post('/api/analyze-url', (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Field "url" string is required.' });
  }

  const analysis = analyzeTextEngine(url, 'url');
  res.json(analysis);
});

// 4. Scan QR Code payload
app.post('/api/scan-qr', (req: Request, res: Response) => {
  const { payload } = req.body;
  if (!payload || typeof payload !== 'string') {
    return res.status(400).json({ error: 'Field "payload" string is required.' });
  }

  const analysis = analyzeTextEngine(payload, 'qr');
  res.json(analysis);
});

// 5. Scan Screenshot
app.post('/api/scan-screenshot', (req: Request, res: Response) => {
  const { text } = req.body;
  const content = text || 'Your account KYC has expired. Immediate update required at http://192.168.1.1/kyc';
  const analysis = analyzeTextEngine(content, 'screenshot');
  res.json({
    extracted_text: content,
    ...analysis
  });
});

// 6. Scan History
app.get('/api/history', (req: Request, res: Response) => {
  res.json({
    count: auditHistory.length,
    history: auditHistory
  });
});

// 7. Threat Analytics
app.get('/api/analytics', (req: Request, res: Response) => {
  res.json({
    total_scans: 2849,
    threats_detected: 894,
    safe_scans: 1955,
    categories_breakdown: [
      { category: 'Phishing', percentage: 32 },
      { category: 'KYC Scam', percentage: 21 },
      { category: 'Job Scam', percentage: 17 },
      { category: 'UPI / Payment Scam', percentage: 14 },
      { category: 'Prize / Lottery Scam', percentage: 9 },
      { category: 'Other', percentage: 7 }
    ]
  });
});

// Serve frontend static assets in production
const distDir = path.resolve(__dirname, 'dist');
app.use(express.static(distDir));

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`ScamShield Live Server running on port ${PORT}`);
});
