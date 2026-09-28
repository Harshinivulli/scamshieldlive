import React from 'react';
import {
  ShieldCheck,
  KeyRound,
  CreditCard,
  Briefcase,
  QrCode,
  Link2,
  TrendingUp,
  AlertOctagon,
  PhoneCall,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export const SecurityTips: React.FC = () => {
  const tips = [
    {
      id: 'otp',
      title: 'OTP Safety',
      icon: KeyRound,
      color: 'text-rose-400',
      borderColor: 'border-rose-500/30',
      bgColor: 'bg-rose-950/20',
      headline: '“Never share OTPs with callers, messages, or unknown websites.”',
      description:
        'One-Time Passwords are the final cryptographic hurdle preventing an attacker from transferring your funds or resetting your credentials. Bank representatives, telecommunications staff, and payment gateways will NEVER ask you to read out an OTP.',
      doList: [
        'Read the SMS body carefully — notice whether it says "debited" or "authorization for login"',
        'Use authenticator apps (TOTP) instead of SMS wherever supported',
        'Immediately disconnect any call where the caller urges you to forward a verification text'
      ],
      dontList: [
        'Never forward verification SMS messages to unknown numbers',
        'Never enter an OTP on a website accessed via an SMS/WhatsApp link'
      ]
    },
    {
      id: 'payment',
      title: 'Payment Safety',
      icon: CreditCard,
      color: 'text-orange-400',
      borderColor: 'border-orange-500/30',
      bgColor: 'bg-orange-950/20',
      headline: '“Verify payment requests through an independent official channel.”',
      description:
        'Scammers send fake payment requests claiming you are receiving a prize, refund, or marketplace payment. In UPI and modern banking protocols: YOU NEVER ENTER YOUR PIN TO RECEIVE MONEY. PIN entry is strictly for debiting your balance.',
      doList: [
        'Remember: Receiving funds never requires entering your UPI MPIN or ATM PIN',
        'Verify merchant credibility before approving collect requests on payment apps'
      ],
      dontList: [
        'Never scan a QR code sent by a buyer claiming it will "credit your account"',
        'Never approve unexpected UPI pop-up requests'
      ]
    },
    {
      id: 'job',
      title: 'Job Scam Safety',
      icon: Briefcase,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      bgColor: 'bg-amber-950/20',
      headline: '“Do not pay registration or processing fees to secure a job.”',
      description:
        'Legitimate employers, MNCs, and freelance marketplaces never demand registration fees, equipment deposits, or task trial payments. Any job that asks you to pay money to earn money is an advance-fee fraud.',
      doList: [
        'Verify recruiters directly through official corporate LinkedIn directories or career portals',
        'Demand a signed offer letter on verified company letterhead before any engagement'
      ],
      dontList: [
        'Never pay for "portal access", "document verification", or "training kits"',
        'Never join unverified Telegram channels promising ₹3,000–₹5,000 for YouTube likes or reviews'
      ]
    },
    {
      id: 'qr',
      title: 'QR Safety',
      icon: QrCode,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
      bgColor: 'bg-cyan-950/20',
      headline: '“Treat unexpected QR codes as potentially risky.”',
      description:
        'QR codes are simply optical links. Attackers place malicious QR stickers over legitimate restaurant or parking payment stands (quishing) or send QR codes over WhatsApp to drain balances.',
      doList: [
        'Always preview the decoded URL destination before proceeding',
        'Check physical stickers at merchant checkouts to ensure they have not been placed over genuine codes'
      ],
      dontList: [
        'Never scan a QR code to "receive cashbacks" or "claim lottery winnings"'
      ]
    },
    {
      id: 'phishing',
      title: 'Phishing Safety',
      icon: Link2,
      color: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      bgColor: 'bg-blue-950/20',
      headline: '“Do not click links simply because a message creates urgency.”',
      description:
        'Phishing attacks exploit urgency, panic, or greed. A deadline of "within 2 hours" or "account blocked today" is engineered to prevent you from taking time to think or independently verify.',
      doList: [
        'Inspect domain names: look at the actual domain before the first slash',
        'Navigate to the bank or service by typing the official URL directly in your browser'
      ],
      dontList: [
        'Never click links in unexpected emails claiming "Your account has been locked"',
        'Never trust sender display names alone'
      ]
    },
    {
      id: 'investment',
      title: 'Investment Scam Safety',
      icon: TrendingUp,
      color: 'text-purple-400',
      borderColor: 'border-purple-500/30',
      bgColor: 'bg-purple-950/20',
      headline: '“Guaranteed returns or crypto doubling are always fraudulent.”',
      description:
        'Ponzi schemes and fake crypto exchanges promise 20% to 50% weekly returns. They show artificial dashboards with escalating paper profits to entice you to deposit more before locking withdrawals.',
      doList: [
        'Only invest through registered, regulated brokerages and asset management funds',
        'Recognize that high reward without risk does not exist in regulated financial markets'
      ],
      dontList: [
        'Never transfer funds to personal UPI handles or private crypto wallets for "VIP trading signals"'
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Defensive Best Practices</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Security Tips & Countermeasures
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Actionable cybersecurity guidance designed to neutralize psychological coercion, credential harvesting, and payment traps.
        </p>
      </div>

      {/* Emergency Response Box */}
      <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-500/40 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5 text-rose-300 font-bold text-base">
          <AlertOctagon className="w-5 h-5 text-rose-400" />
          <span>Emergency Incident Response: What To Do If You Were Tricked</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-200">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-rose-500/20 space-y-1.5">
            <span className="font-mono text-rose-400 font-semibold uppercase">Step 1 · 0 to 5 mins</span>
            <h4 className="font-bold text-white">Freeze Cards & Netbanking</h4>
            <p className="text-slate-300 leading-relaxed">
              Open your official banking app and immediately lock all debit/credit cards, disable UPI transactions, and change netbanking passwords.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-rose-500/20 space-y-1.5">
            <span className="font-mono text-rose-400 font-semibold uppercase">Step 2 · 5 to 30 mins</span>
            <h4 className="font-bold text-white">Call Bank Cybercell Helpline</h4>
            <p className="text-slate-300 leading-relaxed">
              Call your bank’s dedicated emergency fraud reporting number (e.g. 1930 in India or 1-800 on physical bank card) to flag unauthorized debits.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-rose-500/20 space-y-1.5">
            <span className="font-mono text-rose-400 font-semibold uppercase">Step 3 · Same Day</span>
            <h4 className="font-bold text-white">File Official Cybercrime Complaint</h4>
            <p className="text-slate-300 leading-relaxed">
              Submit transaction IDs, sender phone numbers, and screenshots to your national cybercrime reporting portal (e.g. cybercrime.gov.in).
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Security Guidance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tips.map((tip) => {
          const Icon = tip.icon;
          return (
            <div
              key={tip.id}
              className={`p-6 rounded-2xl border ${tip.borderColor} ${tip.bgColor} space-y-4 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${tip.color}`} />
                    <h3 className="text-base font-bold text-white">{tip.title}</h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Defensive Protocol
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-100 italic mb-2">
                  {tip.headline}
                </p>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {tip.description}
                </p>

                {/* DO & DON'T */}
                <div className="space-y-3 pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold uppercase block mb-1.5">
                      ✓ Best Practices
                    </span>
                    <ul className="space-y-1.5">
                      {tip.doList.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono text-rose-400 font-semibold uppercase block mb-1.5">
                      ✕ Critical Warnings
                    </span>
                    <ul className="space-y-1.5">
                      {tip.dontList.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                          <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
