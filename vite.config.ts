import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

// Built-in API plugin to handle /api/* endpoints during Vite dev server
function apiDevPlugin(): Plugin {
  return {
    name: 'scamshield-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        res.setHeader('Content-Type', 'application/json');

        if (req.url === '/api/health') {
          res.statusCode = 200;
          return res.end(JSON.stringify({
            status: 'healthy',
            protection_active: true,
            engine: 'ScamShield Live Risk Engine v2.4',
            ml_model_status: 'loaded',
            timestamp: new Date().toISOString()
          }));
        }

        if (req.url === '/api/analytics') {
          res.statusCode = 200;
          return res.end(JSON.stringify({
            total_scans: 2849,
            threats_detected: 894,
            safe_scans: 1955,
            threat_distribution: [
              { category: 'Phishing', percentage: 32 },
              { category: 'KYC Scam', percentage: 21 },
              { category: 'Job Scam', percentage: 17 },
              { category: 'UPI / Payment Scam', percentage: 14 },
              { category: 'Prize / Lottery Scam', percentage: 9 },
              { category: 'Other', percentage: 7 }
            ]
          }));
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            let parsed: any = {};
            try { parsed = JSON.parse(body); } catch {}

            const text = parsed.message || parsed.url || parsed.payload || parsed.text || '';
            const lower = text.toLowerCase();

            let urgency = 0;
            let sensitive = 0;
            let financial = 0;
            let urlThreat = 0;

            if (/urgent|immediately|expire|today|blocked|suspended|action required/i.test(lower)) urgency = 92;
            if (/otp|password|cvv|pin|aadhaar|pan/i.test(lower)) sensitive = 95;
            if (/fee|won|₹|rs|prize|lottery|deposit|cashback/i.test(lower)) financial = 88;
            if (/http:\/\/|192\.168|\.xyz|\.top|bit\.ly/i.test(lower)) urlThreat = 94;

            let riskScore = Math.max(urgency, sensitive, financial, urlThreat, 8);
            if (urgency > 0 && sensitive > 0) riskScore = 96;

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
            else if (urlThreat > 0) category = 'Phishing';

            const indicators = [];
            if (urgency > 0) indicators.push({ name: 'Urgency', score: urgency, explanation: 'The message pressures the user to act immediately.' });
            if (sensitive > 0) indicators.push({ name: 'OTP Request', score: sensitive, explanation: 'The message requests sensitive authentication information.' });
            if (financial > 0) indicators.push({ name: 'Financial Manipulation', score: financial, explanation: 'Demands upfront registration or processing fee.' });
            if (urlThreat > 0) indicators.push({ name: 'Suspicious URL', score: urlThreat, explanation: 'The link has characteristics commonly associated with phishing.' });

            if (indicators.length === 0) {
              indicators.push({ name: 'Clean Communication', score: 95, explanation: 'No threat signatures detected.' });
            }

            res.statusCode = 200;
            return res.end(JSON.stringify({
              risk_score: riskScore,
              risk_level: riskLevel,
              category,
              indicators,
              recommended_action: riskLevel === 'CRITICAL' || riskLevel === 'HIGH'
                ? 'Do not click the link or share your OTP. Verify the request through the organization’s official customer-support channel.'
                : 'Routine digital awareness recommended.'
            }));
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
