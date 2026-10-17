import React, { useState } from 'react';
import { 
  Palette, 
  Key, 
  Shield, 
  ShieldCheck, 
  Smartphone, 
  Monitor, 
  Wifi, 
  Lock, 
  ArrowRight, 
  Bolt, 
  CreditCard, 
  Check, 
  CloudRain, 
  UploadCloud, 
  RotateCw,
  Plus,
  X,
  Radio,
  Clock,
  Sparkles
} from 'lucide-react';
import { PortalConfig, RatePlan, Voucher } from '../../types';

interface CaptivePortalStudioTabProps {
  config: PortalConfig;
  onUpdateConfig: (newConfig: PortalConfig) => void;
  ratePlans: RatePlan[];
  vouchers: Voucher[];
  onSuccessfulLogin: (voucherCode: string, planName: string) => void;
  language: 'en' | 'sw';
}

export const CaptivePortalStudioTab: React.FC<CaptivePortalStudioTabProps> = ({
  config,
  onUpdateConfig,
  ratePlans,
  vouchers,
  onSuccessfulLogin,
  language,
}) => {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');
  const [activePortalTab, setActivePortalTab] = useState<'voucher' | 'buy'>('voucher');
  
  // Captive Portal internal test state
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Buy tab state
  const [selectedBuyPlanId, setSelectedBuyPlanId] = useState(ratePlans[1]?.id || 'tier-24h');
  const [buyPaymentMethod, setBuyPaymentMethod] = useState<'mpesa' | 'card' | 'apple'>('mpesa');
  const [buyPhoneEmail, setBuyPhoneEmail] = useState('+255 754 000 000');
  
  // Connected session state in simulator
  const [connectedSession, setConnectedSession] = useState<{
    planName: string;
    speed: string;
    remainingMinutes: number;
    downloadedMB: number;
  } | null>(null);

  // Walled garden input
  const [newDomainInput, setNewDomainInput] = useState('');

  // Deploy feedback
  const [deployFeedback, setDeployFeedback] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);

  const selectedBuyPlan = ratePlans.find((p) => p.id === selectedBuyPlanId) || ratePlans[0];

  const handleConnectWithVoucher = () => {
    setAuthError(null);
    const code = voucherCodeInput.trim().toUpperCase();
    if (!code) {
      setAuthError(language === 'sw' ? 'Tafadhali weka namba ya vocha' : 'Please enter voucher code');
      return;
    }

    setIsAuthenticating(true);

    setTimeout(() => {
      setIsAuthenticating(false);
      // Look up voucher or accept any test code
      const matched = vouchers.find((v) => v.code.toUpperCase() === code);
      const planName = matched ? matched.planName : '24-Hour Day Pass';
      const speed = matched ? matched.speedRate : '25M / 10M';

      setConnectedSession({
        planName,
        speed,
        remainingMinutes: 1440,
        downloadedMB: 12.4,
      });

      onSuccessfulLogin(code, planName);
    }, 1200);
  };

  const handleConnectFreeTier = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setConnectedSession({
        planName: '30-Minute Free Trial',
        speed: `${config.freeTierThrottleMbps}M Throttle`,
        remainingMinutes: config.freeTierMinutes,
        downloadedMB: 0.1,
      });
      onSuccessfulLogin('FREE-TIER-GUEST', '30-Minute Free Trial');
    }, 900);
  };

  const handleBuyAndConnect = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      const planName = selectedBuyPlan.name;
      setConnectedSession({
        planName,
        speed: `${selectedBuyPlan.downloadMbps}M / ${selectedBuyPlan.uploadMbps}M`,
        remainingMinutes: selectedBuyPlan.durationHours * 60,
        downloadedMB: 0.5,
      });
      onSuccessfulLogin(`AUTO-BUY-${Date.now().toString().slice(-4)}`, planName);
    }, 1400);
  };

  const handleDisconnectSimulator = () => {
    setConnectedSession(null);
    setVoucherCodeInput('');
  };

  const handleDeployToGateways = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setDeployFeedback('Captive Portal template and Walled Garden deployed to 6/6 Gateways!');
      setTimeout(() => setDeployFeedback(null), 3500);
    }, 1500);
  };

  const handleAddDomain = () => {
    if (!newDomainInput.trim()) return;
    const domain = newDomainInput.trim().toLowerCase();
    if (!config.walledGardenDomains.includes(domain)) {
      onUpdateConfig({
        ...config,
        walledGardenDomains: [...config.walledGardenDomains, domain],
      });
    }
    setNewDomainInput('');
  };

  const handleRemoveDomain = (domainToRemove: string) => {
    onUpdateConfig({
      ...config,
      walledGardenDomains: config.walledGardenDomains.filter((d) => d !== domainToRemove),
    });
  };

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6">
      {/* Top Action & Meta Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-medium text-[#3F4850]">
            <span>Gateway OS</span>
            <span>/</span>
            <span className="font-bold text-[#006194]">Captive Portal Customizer</span>
            <span className="bg-[#E5EEFF] text-[#006947] px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border border-[#D3E4FE]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00855B] animate-pulse"></span>
              Live Synchronization (Active)
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl font-bold text-[#0B1C30] tracking-tight">
              {language === 'sw' ? 'Sanidi Ukurasa wa Kuingia (Splash Screen)' : 'Customer Splash & Login Engine'}
            </h1>
            <span className="font-mono text-xs text-[#707881]">Template: WimaFi-Universal-v4</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDeployToGateways}
            disabled={isDeploying}
            className="bg-[#006194] hover:bg-[#007BB9] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
          >
            <UploadCloud className={`w-4 h-4 ${isDeploying ? 'animate-spin' : ''}`} />
            <span>{isDeploying ? 'Deploying to Gateways...' : 'Deploy to All Gateways (6/6)'}</span>
          </button>
        </div>
      </div>

      {deployFeedback && (
        <div className="p-3 rounded-lg bg-[#E5EEFF] text-[#006947] text-xs font-semibold flex items-center gap-2 animate-in fade-in border border-[#D3E4FE]">
          <Check className="w-4 h-4 text-[#00855B]" />
          <span>{deployFeedback}</span>
        </div>
      )}

      {/* Main Dynamic Studio Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT CONFIGURATION COLUMN (5 Cols on XL) */}
        <div className="xl:col-span-5 flex flex-col gap-4">
          {/* Section 1: Branding & Hero Copy */}
          <div className="bg-white rounded-xl p-5 border border-[#DCE9FF] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#006194]" />
                <h2 className="text-sm font-bold text-[#0B1C30]">Branding & Hero Copy</h2>
              </div>
              <span className="text-[10px] font-bold text-[#00855B] bg-[#E5EEFF] px-2 py-0.5 rounded">
                Sync Ready
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0B1C30]">Portal Greeting Headline</label>
              <input
                type="text"
                value={config.portalTitle}
                onChange={(e) => onUpdateConfig({ ...config, portalTitle: e.target.value })}
                className="w-full px-3 py-2 bg-[#EFF4FF] border border-[#DCE9FF] rounded-lg text-xs font-medium text-[#0B1C30] focus:outline-none focus:ring-1 focus:ring-[#006194]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0B1C30]">Sub-heading / Location Tagline</label>
              <input
                type="text"
                value={config.portalSubtitle}
                onChange={(e) => onUpdateConfig({ ...config, portalSubtitle: e.target.value })}
                className="w-full px-3 py-2 bg-[#EFF4FF] border border-[#DCE9FF] rounded-lg text-xs font-medium text-[#0B1C30] focus:outline-none focus:ring-1 focus:ring-[#006194]"
              />
            </div>

            {/* Brand Mark & Primary Tone */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-[#EFF4FF] p-2.5 rounded-lg flex items-center gap-2 border border-[#DCE9FF]">
                <div className="w-8 h-8 rounded bg-[#006194] flex items-center justify-center text-white">
                  <Wifi className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-[#0B1C30] truncate">Brand Mark</span>
                  <span className="text-[10px] text-[#707881] truncate">WimaFi Logo</span>
                </div>
              </div>

              <div className="bg-[#EFF4FF] p-2.5 rounded-lg flex items-center justify-between border border-[#DCE9FF]">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[#006194] border border-white"></span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#0B1C30]">Primary Tone</span>
                    <span className="font-mono text-[10px] text-[#707881]">#006194</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Authentication Protocols Matrix */}
          <div className="bg-white rounded-xl p-5 border border-[#DCE9FF] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-[#006194]" />
                <h2 className="text-sm font-bold text-[#0B1C30]">Authentication Protocols</h2>
              </div>
              <span className="text-[11px] font-mono text-[#707881]">4 Modules</span>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              {/* Voucher Code */}
              <label className="flex items-center justify-between p-2.5 bg-[#EFF4FF] hover:bg-[#DCE9FF] rounded-lg cursor-pointer border border-[#DCE9FF] transition-colors">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={config.enableVoucher}
                    onChange={(e) => onUpdateConfig({ ...config, enableVoucher: e.target.checked })}
                    className="w-4 h-4 text-[#006194] rounded"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-[#0B1C30]">Voucher Code / POS Receipt Entry</span>
                    <span className="text-[11px] text-[#707881]">Lookup against FreeRADIUS SQL database</span>
                  </div>
                </div>
                <span className="bg-[#DBE1FF] text-[#00174B] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Default
                </span>
              </label>

              {/* Instant Online Payment */}
              <label className="flex items-center justify-between p-2.5 bg-[#EFF4FF] hover:bg-[#DCE9FF] rounded-lg cursor-pointer border border-[#DCE9FF] transition-colors">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={config.enablePayment}
                    onChange={(e) => onUpdateConfig({ ...config, enablePayment: e.target.checked })}
                    className="w-4 h-4 text-[#006194] rounded"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-[#0B1C30]">Instant Mobile Money Pass</span>
                    <span className="text-[11px] text-[#707881]">M-Pesa, Tigo Pesa, Airtel & Selcom API</span>
                  </div>
                </div>
                <span className="bg-[#E5EEFF] text-[#006947] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Active
                </span>
              </label>

              {/* Free Tier */}
              <label className="flex items-center justify-between p-2.5 bg-[#EFF4FF] hover:bg-[#DCE9FF] rounded-lg cursor-pointer border border-[#DCE9FF] transition-colors">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={config.enableFreeTier}
                    onChange={(e) => onUpdateConfig({ ...config, enableFreeTier: e.target.checked })}
                    className="w-4 h-4 text-[#006194] rounded"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-[#0B1C30]">Complimentary Tier (5 Mbps)</span>
                    <span className="text-[11px] text-[#707881]">30-minute grace session per MAC address</span>
                  </div>
                </div>
                <span className="bg-[#E5EEFF] text-[#006947] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Active
                </span>
              </label>
            </div>
          </div>

          {/* Section 3: Walled Garden Whitelist Editor */}
          <div className="bg-white rounded-xl p-5 border border-[#DCE9FF] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#006194]" />
                <h2 className="text-sm font-bold text-[#0B1C30]">Walled Garden (Whitelist)</h2>
              </div>
              <span className="text-[11px] font-mono text-[#707881]">
                {config.walledGardenDomains.length} DOMAINS ACTIVE
              </span>
            </div>

            <p className="text-xs text-[#3F4850]">
              Zero-rated domains accessible without prior authentication (payment APIs, captive probes).
            </p>

            <div className="flex flex-wrap gap-1.5 p-2 bg-[#EFF4FF] rounded-lg border border-[#DCE9FF]">
              {config.walledGardenDomains.map((domain) => (
                <span
                  key={domain}
                  className="inline-flex items-center gap-1.5 px-2 py-1 bg-white rounded-md font-mono text-[11px] text-[#0B1C30] border border-[#DCE9FF]"
                >
                  <span>{domain}</span>
                  <button
                    onClick={() => handleRemoveDomain(domain)}
                    className="text-[#707881] hover:text-[#BA1A1A]"
                    title="Remove domain"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newDomainInput}
                onChange={(e) => setNewDomainInput(e.target.value)}
                placeholder="Add domain (e.g. airport-maps.internal)..."
                className="flex-1 px-3 py-1.5 bg-[#EFF4FF] border border-[#DCE9FF] rounded-lg text-xs text-[#0B1C30] focus:outline-none focus:ring-1 focus:ring-[#006194]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddDomain();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddDomain}
                className="bg-[#006194] hover:bg-[#007BB9] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
              >
                Add Rule
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT LIVE PORTAL PREVIEW (7 Cols on XL) */}
        <div className="xl:col-span-7 flex flex-col gap-4">
          {/* Header Switcher */}
          <div className="bg-white rounded-xl p-3 border border-[#DCE9FF] shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00855B]"></span>
              <span className="text-xs font-bold text-[#0B1C30] uppercase tracking-wider">
                Live Preview Simulator
              </span>
              <span className="bg-[#EFF4FF] px-2 py-0.5 rounded text-[#707881] font-mono text-[11px]">
                CNA Browser Emulation (iOS/Android)
              </span>
            </div>

            {/* Device Mode Switch */}
            <div className="flex items-center bg-[#EFF4FF] p-1 rounded-lg gap-1 border border-[#DCE9FF]">
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                  deviceMode === 'mobile'
                    ? 'bg-white text-[#0B1C30] shadow-xs'
                    : 'text-[#707881] hover:text-[#0B1C30]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile CNA</span>
              </button>
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                  deviceMode === 'desktop'
                    ? 'bg-white text-[#0B1C30] shadow-xs'
                    : 'text-[#707881] hover:text-[#0B1C30]'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop Frame</span>
              </button>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div className="bg-gradient-to-b from-[#EFF4FF] to-[#DCE9FF] rounded-2xl p-6 lg:p-8 flex flex-col items-center justify-center border border-[#DCE9FF] min-h-[700px] relative overflow-hidden shadow-inner">
            {/* Ambient Background Circles */}
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#006194]/10 blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#0051D5]/10 blur-3xl pointer-events-none"></div>

            {/* Device Frame */}
            <div
              className={`w-full transition-all duration-300 relative bg-white shadow-2xl border border-slate-300 ${
                deviceMode === 'mobile'
                  ? 'max-w-[390px] rounded-[36px] p-4 ring-8 ring-slate-900'
                  : 'max-w-[620px] rounded-2xl p-6'
              }`}
            >
              {/* Mobile Phone Top Notch & Status Header */}
              {deviceMode === 'mobile' && (
                <div className="flex items-center justify-between px-3 py-1 mb-2 text-slate-700 text-xs">
                  <span className="font-mono font-bold">09:41</span>
                  <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto"></div>
                  <div className="flex items-center gap-1">
                    <Wifi className="w-3 h-3 text-[#006194]" />
                    <span className="text-[10px] font-bold">5G</span>
                  </div>
                </div>
              )}

              {/* CNA Browser Bar */}
              <div className="bg-slate-100 rounded-xl px-3 py-2 flex items-center justify-between text-xs mb-3 border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-800 truncate">
                  <Lock className="w-3.5 h-3.5 text-[#00855B]" />
                  <span className="font-mono font-semibold truncate">portal.wimafi.net</span>
                </div>
                <button
                  onClick={handleDisconnectSimulator}
                  className="font-bold text-[#006194] hover:underline text-[11px]"
                >
                  Cancel
                </button>
              </div>

              {/* GUEST PORTAL BODY (Interactive Inside Simulator) */}
              <div className="bg-[#F8F9FF] rounded-2xl p-4 sm:p-5 flex flex-col gap-4 border border-[#E5EEFF]">
                {connectedSession ? (
                  /* CONNECTED STATE */
                  <div className="flex flex-col items-center text-center gap-4 py-4 animate-in zoom-in-95">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Check className="w-8 h-8" strokeWidth={3} />
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-mono font-bold text-[#00855B] uppercase tracking-wider">
                        ACCESS-ACCEPT • CONNECTED
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">
                        {language === 'sw' ? 'Umefanikiwa Kuunganishwa!' : 'You Are Online!'}
                      </h3>
                      <p className="text-xs text-slate-600">
                        Enjoy high-speed broadband on WimaFi WiFi Network.
                      </p>
                    </div>

                    <div className="w-full bg-white rounded-xl p-3 border border-slate-200 text-xs flex flex-col gap-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Active Profile:</span>
                        <span className="font-bold text-slate-900">{connectedSession.planName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Bandwidth Cap:</span>
                        <span className="font-mono font-bold text-[#006194]">{connectedSession.speed}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Time Remaining:</span>
                        <span className="font-mono font-bold text-slate-900">
                          {Math.floor(connectedSession.remainingMinutes / 60)}h {connectedSession.remainingMinutes % 60}m
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Gateway Hook:</span>
                        <span className="font-mono text-emerald-600 font-semibold">MikroTik CCR2004</span>
                      </div>
                    </div>

                    <button
                      onClick={handleDisconnectSimulator}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      {language === 'sw' ? 'Ondoka / Sitisha Intaneti' : 'Disconnect Session'}
                    </button>
                  </div>
                ) : (
                  /* SPLASH LOGIN FORM */
                  <>
                    {/* Header with Logo */}
                    <div className="flex flex-col items-center text-center gap-1.5 pt-1">
                      <div className="relative">
                        <div className="w-12 h-12 bg-white rounded-2xl p-2 shadow-sm flex items-center justify-center border border-slate-200">
                          <Wifi className="w-7 h-7 text-[#006194]" />
                        </div>
                        <span className="absolute -bottom-1 -right-1 bg-[#00855B] text-white rounded-full p-0.5">
                          <Sparkles className="w-3 h-3" />
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 leading-tight">
                        {config.portalTitle}
                      </h3>
                      <p className="text-[11px] text-slate-600 max-w-xs">
                        {config.portalSubtitle}
                      </p>
                    </div>

                    {/* Network Telemetry Pill */}
                    <div className="bg-white rounded-xl p-2.5 flex items-center justify-between text-xs border border-slate-200 shadow-xs">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded-md bg-emerald-100 text-emerald-700">
                          <Radio className="w-3.5 h-3.5" />
                        </span>
                        <div className="flex flex-col text-left">
                          <span className="text-[11px] font-bold text-slate-900">MikroTik CCR2004</span>
                          <span className="text-[10px] text-slate-500">Latency 4ms • 1 Gbps Fiber</span>
                        </div>
                      </div>
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono text-[10px] font-semibold">
                        Free Roaming
                      </span>
                    </div>

                    {/* Interactive Tabs */}
                    <div className="flex bg-slate-200/70 p-1 rounded-xl">
                      <button
                        onClick={() => setActivePortalTab('voucher')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          activePortalTab === 'voucher'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {language === 'sw' ? 'Weka Vocha' : 'Voucher Code'}
                      </button>

                      <button
                        onClick={() => setActivePortalTab('buy')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          activePortalTab === 'buy'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {language === 'sw' ? 'Nunua Bando' : 'Buy Internet Pass'}
                      </button>
                    </div>

                    {/* TAB 1: VOUCHER ENTRY */}
                    {activePortalTab === 'voucher' && (
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1 text-left">
                          <label className="text-xs font-bold text-slate-800">
                            {language === 'sw' ? 'Namba ya Vocha au PIN' : 'Access Voucher / Room PIN'}
                          </label>
                          <input
                            type="text"
                            value={voucherCodeInput}
                            onChange={(e) => setVoucherCodeInput(e.target.value)}
                            placeholder="e.g. WIMA-9214-KR"
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono uppercase tracking-wider text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006194]"
                          />
                          <span className="text-[10px] text-slate-500">
                            Found on your printed reception card or POS receipt.
                          </span>
                        </div>

                        {/* Quick Test Token autofill chips */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] text-slate-500 font-semibold">Test Vouchers:</span>
                          {['WIMA-9214-KR', 'WIMA-7731-BQ', 'WIMA-4819-PL'].map((code) => (
                            <button
                              key={code}
                              onClick={() => setVoucherCodeInput(code)}
                              className="px-1.5 py-0.5 rounded bg-slate-200 hover:bg-slate-300 text-[10px] font-mono font-bold text-[#006194]"
                            >
                              {code}
                            </button>
                          ))}
                        </div>

                        {/* Remember Device & Terms */}
                        <div className="flex flex-col gap-2 pt-1 text-left text-xs text-slate-700">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={rememberDevice}
                              onChange={(e) => setRememberDevice(e.target.checked)}
                              className="rounded text-[#006194]"
                            />
                            <span className="text-[11px]">Remember this MAC device for 30 days</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={termsAccepted}
                              onChange={(e) => setTermsAccepted(e.target.checked)}
                              className="rounded text-[#006194]"
                            />
                            <span className="text-[11px]">
                              I agree to the <span className="text-[#006194] underline font-semibold">Fair Usage Policy</span>
                            </span>
                          </label>
                        </div>

                        {authError && (
                          <div className="p-2 rounded bg-red-100 text-red-800 text-xs font-semibold text-center">
                            {authError}
                          </div>
                        )}

                        <button
                          onClick={handleConnectWithVoucher}
                          disabled={isAuthenticating}
                          className="w-full py-2.5 rounded-xl bg-[#006194] hover:bg-[#007BB9] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                        >
                          <span>{isAuthenticating ? 'Authenticating with RADIUS...' : 'Connect to High-Speed Internet'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>

                        {/* Free Tier Fallback */}
                        {config.enableFreeTier && (
                          <button
                            type="button"
                            onClick={handleConnectFreeTier}
                            className="text-xs font-semibold text-slate-600 hover:text-[#006194] flex items-center justify-center gap-1 pt-1"
                          >
                            <span>Or continue with 30-min Free Tier (5 Mbps)</span>
                            <Bolt className="w-3.5 h-3.5 text-amber-500" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* TAB 2: BUY INTERNET PASS ONLINE */}
                    {activePortalTab === 'buy' && (
                      <div className="flex flex-col gap-3 text-left">
                        <span className="text-xs font-bold text-slate-800">Select Instant Plan:</span>

                        <div className="grid grid-cols-2 gap-2">
                          {ratePlans.slice(0, 2).map((plan) => (
                            <div
                              key={plan.id}
                              onClick={() => setSelectedBuyPlanId(plan.id)}
                              className={`p-2 rounded-xl border cursor-pointer flex flex-col gap-0.5 transition-all ${
                                selectedBuyPlanId === plan.id
                                  ? 'border-[#006194] bg-[#CCE5FF]/30 ring-1 ring-[#006194]'
                                  : 'border-slate-200 bg-white hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-[#006194] uppercase">
                                  {plan.tier}
                                </span>
                                {selectedBuyPlanId === plan.id && (
                                  <span className="w-3 h-3 rounded-full bg-[#006194] text-white flex items-center justify-center text-[8px]">
                                    ✓
                                  </span>
                                )}
                              </div>
                              <span className="font-bold text-sm text-slate-900">
                                {language === 'sw' ? plan.nameSwahili : plan.name}
                              </span>
                              <span className="font-bold text-xs text-slate-800">
                                TSh {plan.priceTZS.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {plan.downloadMbps}M • {typeof plan.quotaGB === 'number' ? `${plan.quotaGB}GB` : 'Unlimited'}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Payment Method Selector */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-800">Payment Gateway</label>
                          <div className="grid grid-cols-3 gap-1.5">
                            <button
                              type="button"
                              onClick={() => setBuyPaymentMethod('mpesa')}
                              className={`py-1.5 px-2 rounded-lg text-xs font-bold flex flex-col items-center justify-center border transition-all ${
                                buyPaymentMethod === 'mpesa'
                                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                                  : 'border-slate-200 bg-white text-slate-700'
                              }`}
                            >
                              <span>M-Pesa / Tigo</span>
                              <span className="text-[9px] text-slate-500">USSD Push</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setBuyPaymentMethod('card')}
                              className={`py-1.5 px-2 rounded-lg text-xs font-bold flex flex-col items-center justify-center border transition-all ${
                                buyPaymentMethod === 'card'
                                  ? 'border-[#006194] bg-blue-50 text-[#006194]'
                                  : 'border-slate-200 bg-white text-slate-700'
                              }`}
                            >
                              <span>Card / Visa</span>
                              <span className="text-[9px] text-slate-500">Stripe/Selcom</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setBuyPaymentMethod('apple')}
                              className={`py-1.5 px-2 rounded-lg text-xs font-bold flex flex-col items-center justify-center border transition-all ${
                                buyPaymentMethod === 'apple'
                                  ? 'border-slate-900 bg-slate-100 text-slate-900'
                                  : 'border-slate-200 bg-white text-slate-700'
                              }`}
                            >
                              <span>Apple Pay</span>
                              <span className="text-[9px] text-slate-500">Instant</span>
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-bold text-slate-800">Phone or Email for Receipt</label>
                          <input
                            type="text"
                            value={buyPhoneEmail}
                            onChange={(e) => setBuyPhoneEmail(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none"
                          />
                        </div>

                        <button
                          onClick={handleBuyAndConnect}
                          disabled={isAuthenticating}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>
                            {isAuthenticating
                              ? 'Processing Push USSD...'
                              : `Pay TSh ${selectedBuyPlan.priceTZS.toLocaleString()} & Connect`}
                          </span>
                        </button>
                      </div>
                    )}

                    {/* Brand Footnote */}
                    <div className="pt-2 border-t border-slate-200 flex flex-col items-center text-center gap-0.5">
                      <span className="text-[9px] font-mono uppercase text-slate-500">
                        UNIVERSAL AAA GATEKEEPER • WIMAFI CLOUD
                      </span>
                      <p className="text-[10px] text-slate-500 max-w-[280px]">
                        Hardware powered by FreeRADIUS AAA & MikroTik RouterOS. Compatible with all devices.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sync Diagnostics Bar */}
          <div className="bg-white rounded-xl p-4 border border-[#DCE9FF] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00855B]"></span>
                <span className="font-semibold text-[#0B1C30]">MikroTik Hotspot Node A</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00855B]"></span>
                <span className="font-semibold text-[#0B1C30]">UniFi Controller v8.4</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00855B]"></span>
                <span className="font-semibold text-[#0B1C30]">FreeRADIUS AAA #1</span>
              </div>
            </div>

            <span className="font-mono text-[#707881] text-[11px]">
              Last synchronized: Today at {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
