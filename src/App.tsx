import React, { useState } from 'react';
import { NavigationSidebar, TabId } from './components/NavigationSidebar';
import { HeaderBar } from './components/HeaderBar';
import { OverviewSessionsTab } from './components/tabs/OverviewSessionsTab';
import { PlansVouchersTab } from './components/tabs/PlansVouchersTab';
import { HardwareGatewaysTab } from './components/tabs/HardwareGatewaysTab';
import { BillingInvoicesTab } from './components/tabs/BillingInvoicesTab';
import { CaptivePortalStudioTab } from './components/tabs/CaptivePortalStudioTab';
import { SettingsApiTab } from './components/tabs/SettingsApiTab';

import { RegisterGatewayModal } from './components/modals/RegisterGatewayModal';
import { CreatePlanModal } from './components/modals/CreatePlanModal';
import { RouterOsCliModal } from './components/modals/RouterOsCliModal';
import { LivePortalModal } from './components/modals/LivePortalModal';

import { 
  INITIAL_GATEWAYS, 
  INITIAL_RATE_PLANS, 
  INITIAL_SESSIONS, 
  INITIAL_VOUCHER_BATCHES, 
  INITIAL_VOUCHERS, 
  INITIAL_RADIUS_EVENTS, 
  INITIAL_TRANSACTIONS, 
  DEFAULT_PORTAL_CONFIG 
} from './data/mockData';
import { WifiSession, RatePlan, NasGateway, VoucherBatch, Voucher, RadiusEvent, PaymentTransaction, PortalConfig } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [currency, setCurrency] = useState<'USD' | 'TZS'>('USD');
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [globalSearch, setGlobalSearch] = useState('');

  // Primary System State
  const [sessions, setSessions] = useState<WifiSession[]>(INITIAL_SESSIONS);
  const [ratePlans, setRatePlans] = useState<RatePlan[]>(INITIAL_RATE_PLANS);
  const [gateways, setGateways] = useState<NasGateway[]>(INITIAL_GATEWAYS);
  const [voucherBatches, setVoucherBatches] = useState<VoucherBatch[]>(INITIAL_VOUCHER_BATCHES);
  const [vouchers, setVouchers] = useState<Voucher[]>(INITIAL_VOUCHERS);
  const [radiusEvents, setRadiusEvents] = useState<RadiusEvent[]>(INITIAL_RADIUS_EVENTS);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(INITIAL_TRANSACTIONS);
  const [portalConfig, setPortalConfig] = useState<PortalConfig>(DEFAULT_PORTAL_CONFIG);

  // Modals state
  const [showRegisterGatewayModal, setShowRegisterGatewayModal] = useState(false);
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [cliGateway, setCliGateway] = useState<NasGateway | null>(null);
  const [showLivePortalModal, setShowLivePortalModal] = useState(false);

  // Handlers
  const handleDisconnectSession = (sessionId: string) => {
    const target = sessions.find((s) => s.id === sessionId);
    if (!target) return;

    setSessions((prev) => prev.filter((s) => s.id !== sessionId));

    // Append RADIUS CoA Event
    const newEvent: RadiusEvent = {
      id: `rad-${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      type: 'COA-DISCONNECT',
      nasName: target.assignedNas,
      nasIp: '192.168.10.1',
      user: target.hostname,
      mac: target.mac,
      ip: target.ip,
      details: 'RADIUS CoA Packet Dispatched (RFC 3576). Session de-authenticated.',
      tag: 'Operator Kick',
    };
    setRadiusEvents((prev) => [newEvent, ...prev]);
  };

  const handleThrottleSession = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? { ...s, status: 'throttled', rateLimit: '5M/1M (Throttled)' }
          : s
      )
    );
  };

  const handleGenerateBatch = (params: {
    planId: string;
    quantity: number;
    format: string;
    venueTag: string;
    expiresAt: string;
  }) => {
    const plan = ratePlans.find((p) => p.id === params.planId) || ratePlans[0];
    const batchId = `BAT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newGeneratedVouchers: Voucher[] = [];
    for (let i = 0; i < params.quantity; i++) {
      const codeSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const codeEnd = Math.random().toString(36).substring(2, 4).toUpperCase();
      const code = params.format === 'pin4'
        ? Math.floor(1000 + Math.random() * 9000).toString()
        : params.format === 'pin8'
        ? Math.floor(10000000 + Math.random() * 90000000).toString()
        : `WIMA-${codeSuffix}-${codeEnd}`;

      newGeneratedVouchers.push({
        code,
        pin: Math.floor(1000 + Math.random() * 9000).toString(),
        batchId,
        planId: plan.id,
        planName: plan.name,
        priceUSD: plan.priceUSD,
        priceTZS: plan.priceTZS,
        status: 'unused',
        createdAt: 'Just now',
        expiresAt: params.expiresAt,
        venueTag: params.venueTag,
        dataLimitGB: plan.quotaGB,
        speedRate: `${plan.downloadMbps}M/${plan.uploadMbps}M`,
      });
    }

    const newBatch: VoucherBatch = {
      id: batchId,
      label: `${params.venueTag} Generated Batch`,
      venue: params.venueTag,
      planId: plan.id,
      planName: plan.name,
      total: params.quantity,
      redeemed: 0,
      active: params.quantity,
      collectedRevUSD: plan.priceUSD * params.quantity,
      collectedRevTZS: plan.priceTZS * params.quantity,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'active',
    };

    setVoucherBatches((prev) => [newBatch, ...prev]);
    setVouchers((prev) => [...newGeneratedVouchers, ...prev]);
  };

  const handleRegisterGateway = (newGw: NasGateway) => {
    setGateways((prev) => [...prev, newGw]);
  };

  const handleCreatePlan = (newPlan: RatePlan) => {
    setRatePlans((prev) => [...prev, newPlan]);
  };

  const handleAddTransaction = (newTx: PaymentTransaction) => {
    setTransactions((prev) => [newTx, ...prev]);

    // Also issue voucher to the active pool
    const newVoucher: Voucher = {
      code: newTx.voucherCode,
      pin: Math.floor(1000 + Math.random() * 9000).toString(),
      batchId: 'BAT-MOBILE-USSD',
      planId: 'tier-24h',
      planName: newTx.planName,
      priceUSD: newTx.amountUSD,
      priceTZS: newTx.amountTZS,
      status: 'active',
      createdAt: 'Just now',
      expiresAt: '2026-11-30',
      venueTag: 'USSD-Push',
      dataLimitGB: 'Unlimited',
      speedRate: '25M/10M',
    };
    setVouchers((prev) => [newVoucher, ...prev]);

    // Add RADIUS event
    const newRadEvent: RadiusEvent = {
      id: `rad-${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      type: 'ACCESS-ACCEPT',
      nasName: 'CCR2004-East',
      nasIp: '192.168.10.1',
      user: newTx.voucherCode,
      mac: 'MOBILE-USSD-AUTO',
      details: `Paid TSh ${newTx.amountTZS.toLocaleString()} via ${newTx.provider}`,
      tag: 'STK-Push OK',
    };
    setRadiusEvents((prev) => [newRadEvent, ...prev]);
  };

  const handleSuccessfulPortalLogin = (voucherCode: string, planName: string) => {
    // Add new active session in table
    const randomIp = `10.240.4.${Math.floor(Math.random() * 200 + 20)}`;
    const randomMac = `4A:${Math.floor(10 + Math.random() * 89)}:${Math.floor(10 + Math.random() * 89)}:22:90:EE`;
    const newSession: WifiSession = {
      id: `sess-${Date.now()}`,
      hostname: `Guest-${voucherCode.slice(-4)}`,
      deviceType: 'mobile',
      deviceVendor: 'Mobile Subscriber',
      specs: 'Wi-Fi 6 • 802.11ax',
      ip: randomIp,
      mac: randomMac,
      assignedNas: 'CCR2004-East',
      planId: 'tier-24h',
      planName: planName,
      dataDownGB: 0.1,
      dataUpGB: 0.05,
      startTime: 'Just now',
      timeRemaining: '23h 59m',
      percentRemaining: 99,
      status: 'active',
      rateLimit: '25M/10M',
    };
    setSessions((prev) => [newSession, ...prev]);

    // Mark voucher as redeemed if in pool
    setVouchers((prev) =>
      prev.map((v) =>
        v.code === voucherCode ? { ...v, status: 'active', usedByMac: randomMac, usedByIp: randomIp } : v
      )
    );

    // Add RADIUS accept event
    const newRadEvent: RadiusEvent = {
      id: `rad-${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      type: 'ACCESS-ACCEPT',
      nasName: 'CCR2004-East',
      nasIp: '192.168.10.1',
      user: voucherCode,
      mac: randomMac,
      ip: randomIp,
      details: `Framed-IP: ${randomIp} • Profile: ${planName}`,
      tag: 'Captive Auth OK',
    };
    setRadiusEvents((prev) => [newRadEvent, ...prev]);
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FF] text-[#0B1C30]">
      {/* Persistent Left Navigation Rail */}
      <NavigationSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        activeLeases={1428 + sessions.length - INITIAL_SESSIONS.length}
        totalLeases={2000}
        language={language}
        onToggleLanguage={() => setLanguage((prev) => (prev === 'en' ? 'sw' : 'en'))}
        onOpenLivePortalModal={() => setShowLivePortalModal(true)}
      />

      {/* Main Content Workspace Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Top Header Bar */}
        <HeaderBar
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          onOpenNewBatchModal={() => setActiveTab('plans')}
          currency={currency}
          onToggleCurrency={() => setCurrency((prev) => (prev === 'USD' ? 'TZS' : 'USD'))}
          gatewaysCount={gateways.length}
        />

        {/* Tab Viewports */}
        <main className="flex-1 overflow-x-hidden">
          {activeTab === 'overview' && (
            <OverviewSessionsTab
              sessions={sessions}
              onDisconnectSession={handleDisconnectSession}
              onThrottleSession={handleThrottleSession}
              gateways={gateways}
              ratePlans={ratePlans}
              radiusEvents={radiusEvents}
              currency={currency}
              language={language}
            />
          )}

          {activeTab === 'plans' && (
            <PlansVouchersTab
              ratePlans={ratePlans}
              voucherBatches={voucherBatches}
              vouchers={vouchers}
              onGenerateBatch={handleGenerateBatch}
              onOpenCreatePlanModal={() => setShowCreatePlanModal(true)}
              currency={currency}
              language={language}
            />
          )}

          {activeTab === 'hardware' && (
            <HardwareGatewaysTab
              gateways={gateways}
              radiusEvents={radiusEvents}
              onOpenRegisterGatewayModal={() => setShowRegisterGatewayModal(true)}
              onOpenCliModal={(gw) => setCliGateway(gw)}
              language={language}
            />
          )}

          {activeTab === 'billing' && (
            <BillingInvoicesTab
              transactions={transactions}
              onAddTransaction={handleAddTransaction}
              currency={currency}
              language={language}
            />
          )}

          {activeTab === 'captive-portal' && (
            <CaptivePortalStudioTab
              config={portalConfig}
              onUpdateConfig={setPortalConfig}
              ratePlans={ratePlans}
              vouchers={vouchers}
              onSuccessfulLogin={handleSuccessfulPortalLogin}
              language={language}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsApiTab language={language} />
          )}
        </main>
      </div>

      {/* Modals */}
      <RegisterGatewayModal
        isOpen={showRegisterGatewayModal}
        onClose={() => setShowRegisterGatewayModal(false)}
        onSave={handleRegisterGateway}
      />

      <CreatePlanModal
        isOpen={showCreatePlanModal}
        onClose={() => setShowCreatePlanModal(false)}
        onSave={handleCreatePlan}
      />

      <RouterOsCliModal
        gateway={cliGateway}
        onClose={() => setCliGateway(null)}
      />

      <LivePortalModal
        isOpen={showLivePortalModal}
        onClose={() => setShowLivePortalModal(false)}
        config={portalConfig}
        ratePlans={ratePlans}
        vouchers={vouchers}
        onSuccessfulLogin={handleSuccessfulPortalLogin}
        language={language}
      />
    </div>
  );
}
