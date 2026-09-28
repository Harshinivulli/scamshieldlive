import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { DashboardOverview } from './components/DashboardOverview';
import { MessageScanner } from './components/MessageScanner';
import { UrlScanner } from './components/UrlScanner';
import { QrScanner } from './components/QrScanner';
import { ScreenshotScanner } from './components/ScreenshotScanner';
import { ScanHistoryView } from './components/ScanHistoryView';
import { ThreatAnalytics } from './components/ThreatAnalytics';
import { SecurityTips } from './components/SecurityTips';
import { AboutScamShield } from './components/AboutScamShield';
import { ReportModal } from './components/ReportModal';
import { ScanHistoryItem, SecurityAnalysisResult } from './types';
import { loadScanHistory, calculateAnalyticsData } from './utils/storage';

export default function App() {
  const [isLandingPage, setIsLandingPage] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [activeReportResult, setActiveReportResult] = useState<SecurityAnalysisResult | null>(null);
  const [demoMessageText, setDemoMessageText] = useState<string>('');

  useEffect(() => {
    setHistory(loadScanHistory());
  }, []);

  const refreshHistory = () => {
    setHistory(loadScanHistory());
  };

  const handleScanCompleted = (result: SecurityAnalysisResult) => {
    refreshHistory();
  };

  const handleRunDemo = (demoNumber: number) => {
    setIsLandingPage(false);
    let sample = '';
    if (demoNumber === 1) {
      sample = 'Dear customer, your SBI YONO account KYC expires today. Update immediately at http://192.168.1.1/sbi-kyc/auth.php or enter your OTP to prevent immediate account suspension.';
    } else if (demoNumber === 2) {
      sample = 'Congratulations! You won ₹50,000 in our international lucky draw. Pay a processing fee of ₹999 to claim your cash reward instantly.';
    } else if (demoNumber === 3) {
      sample = 'Congratulations! You have been selected for a work-from-home Amazon job. Earn ₹3,000 daily. Pay ₹1,500 registration fee to receive task portal credentials.';
    } else if (demoNumber === 4) {
      sample = 'Hi Team, our project sync meeting is scheduled tomorrow at 10 AM. Please review the attached slide deck ahead of the call.';
    }
    setDemoMessageText(sample);
    setCurrentTab('scan-message');
  };

  const analyticsData = calculateAnalyticsData(history);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setIsLandingPage(false);
          setCurrentTab(tab);
        }}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        isMobileMenuOpen={isMobileMenuOpen}
        isLandingPage={isLandingPage}
        onToggleLanding={() => setIsLandingPage(!isLandingPage)}
      />

      {isLandingPage ? (
        <LandingPage
          onStartScan={(tab) => {
            setIsLandingPage(false);
            setCurrentTab(tab);
          }}
          onRunDemo={handleRunDemo}
        />
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            currentTab={currentTab}
            onSelectTab={(tab) => setCurrentTab(tab)}
            isMobileOpen={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
            onTriggerDemo={handleRunDemo}
          />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950">
            {currentTab === 'dashboard' && (
              <DashboardOverview
                onNavigateTab={(tab) => setCurrentTab(tab)}
                history={history}
                analytics={analyticsData}
                onViewReport={(result) => setActiveReportResult(result)}
                onRunDemo={handleRunDemo}
              />
            )}

            {currentTab === 'scan-message' && (
              <MessageScanner
                initialText={demoMessageText}
                onScanComplete={handleScanCompleted}
              />
            )}

            {currentTab === 'scan-url' && (
              <UrlScanner onScanComplete={handleScanCompleted} />
            )}

            {currentTab === 'scan-qr' && (
              <QrScanner onScanComplete={handleScanCompleted} />
            )}

            {currentTab === 'scan-screenshot' && (
              <ScreenshotScanner onScanComplete={handleScanCompleted} />
            )}

            {currentTab === 'history' && (
              <ScanHistoryView
                history={history}
                onRefreshHistory={refreshHistory}
                onViewReport={(result) => setActiveReportResult(result)}
              />
            )}

            {currentTab === 'analytics' && (
              <ThreatAnalytics analytics={analyticsData} />
            )}

            {currentTab === 'security-tips' && (
              <SecurityTips />
            )}

            {currentTab === 'about' && (
              <AboutScamShield />
            )}
          </main>
        </div>
      )}

      {/* Forensic Report Modal */}
      {activeReportResult && (
        <ReportModal
          result={activeReportResult}
          onClose={() => setActiveReportResult(null)}
        />
      )}
    </div>
  );
}
