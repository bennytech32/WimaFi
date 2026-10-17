import React, { useState } from 'react';
import { Wifi, X, Lock, ArrowRight, Bolt, Radio, Smartphone, Check } from 'lucide-react';
import { PortalConfig, RatePlan, Voucher } from '../../types';

interface LivePortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PortalConfig;
  ratePlans: RatePlan[];
  vouchers: Voucher[];
  onSuccessfulLogin: (voucherCode: string, planName: string) => void;
  language: 'en' | 'sw';
}

export const LivePortalModal: React.FC<LivePortalModalProps> = ({
  isOpen,
  onClose,
  config,
  ratePlans,
  vouchers,
  onSuccessfulLogin,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'voucher' | 'buy'>('voucher');
  const [voucherCode, setVoucherCode] = useState('');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Buy pass
  const [selectedPlanId, setSelectedPlanId] = useState(ratePlans[1]?.id || 'tier-24h');
  const [customerPhone, setCustomerPhone] = useState('+255 754 000 000');
  const [provider, setProvider] = useState<'mpesa' | 'tigo' | 'airtel'>('mpesa');

  // Connected state
  const [activeSession, setActiveSession] = useState<{
    planName: string;
    speed: string;
    durationMinutes: number;
  } | null>(null);

  if (!isOpen) return null;

  const selectedPlan = ratePlans.find((p) => p.id === selectedPlanId) || ratePlans[0];

  const handleConnect = () => {
    setErrorMessage(null);
    if (!voucherCode.trim()) {
      setErrorMessage(language === 'sw' ? 'Weka namba ya vocha' : 'Please enter voucher code');
      return;
    }

    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      const code = voucherCode.trim().toUpperCase();
      const matched = vouchers.find((v) => v.code === code);
      const planName = matched ? matched.planName : '24-Hour Day Pass';
      const speed = matched ? matched.speedRate : '25M / 10M';

      setActiveSession({
        planName,
        speed,
        durationMinutes: 1440,
      });

      onSuccessfulLogin(code, planName);
    }, 1000);
  };

  const handleFreeTier = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setActiveSession({
        planName: '30-Minute Free Pass',
        speed: `${config.freeTierThrottleMbps}M (Complimentary)`,
        durationMinutes: config.freeTierMinutes,
      });
      onSuccessfulLogin('FREE-PASS-30M', '30-Minute Free Pass');
    }, 800);
  };

  const handleBuyPass = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setActiveSession({
        planName: selectedPlan.name,
        speed: `${selectedPlan.downloadMbps}M / ${selectedPlan.uploadMbps}M`,
        durationMinutes: selectedPlan.durationHours * 60,
      });
      onSuccessfulLogin(`MOBILE-TX-${Date.now().toString().slice(-4)}`, selectedPlan.name);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-300 animate-in zoom-in-95 duration-150">
        {/* Captive Network Bar */}
        <div className="bg-slate-900 px-4 py-2 text-white flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>portal.wimafi.net (Hotspot Login)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Splash Body */}
        <div className="p-6 flex flex-col gap-5 text-center">
          {activeSession ? (
            /* ACTIVE SESSION VIEW */
            <div className="flex flex-col items-center gap-4 py-3 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Check className="w-8 h-8" strokeWidth={3} />
              </div>

              <div>
                <span className="text-[11px] font-mono font-bold text-emerald-600 uppercase">
                  ACCESS-ACCEPT • RADIUS AUTHORIZED
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {language === 'sw' ? 'Umeunganishwa Kikamilifu!' : 'Connected to WimaFi!'}
                </h3>
                <p className="text-xs text-slate-500">
                  Carrier-Grade Gigabit Internet is now active on your device.
                </p>
              </div>

              <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs flex flex-col gap-2.5 text-left font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Plan:</span>
                  <span className="font-bold text-slate-900">{activeSession.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bandwidth:</span>
                  <span className="font-bold text-[#006194]">{activeSession.speed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Session Lease:</span>
                  <span className="font-bold text-slate-900">{activeSession.durationMinutes} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Gateway:</span>
                  <span className="font-bold text-emerald-600">MikroTik RouterOS 7.x</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveSession(null);
                  setVoucherCode('');
                }}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
              >
                {language === 'sw' ? 'Sitisha / Ondoka' : 'Disconnect Session'}
              </button>
            </div>
          ) : (
            /* SPLASH FORM */
            <>
              {/* Brand Header */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-2xl bg-[#006194] text-white flex items-center justify-center shadow-md">
                  <Wifi className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 leading-tight">
                  {config.portalTitle}
                </h2>
                <p className="text-xs text-slate-500 max-w-xs">
                  {config.portalSubtitle}
                </p>
              </div>

              {/* Status pill */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-600" />
                  <div className="text-left">
                    <span className="font-bold text-slate-900 block">CCR2004 Core Node</span>
                    <span className="text-[10px] text-slate-500">1 Gbps Fiber • WimaFi Mesh</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                  Online
                </span>
              </div>

              {/* Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('voucher')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'voucher'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {language === 'sw' ? 'Weka Vocha' : 'Voucher Code'}
                </button>
                <button
                  onClick={() => setActiveTab('buy')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'buy'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {language === 'sw' ? 'Nunua Bando (M-Pesa)' : 'Buy Pass (M-Pesa)'}
                </button>
              </div>

              {activeTab === 'voucher' ? (
                <div className="flex flex-col gap-3 text-left">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-800">
                      {language === 'sw' ? 'Namba ya Vocha' : 'Voucher Code'}
                    </label>
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      placeholder="e.g. WIMA-9214-KR"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#006194]"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-500 font-bold">Quick test:</span>
                    {['WIMA-9214-KR', 'WIMA-7731-BQ'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setVoucherCode(c)}
                        className="px-2 py-0.5 rounded bg-slate-200 text-[#006194] text-[10px] font-mono font-bold"
                      >
                        {c}
                      </button>
                    ))}
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-1 text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberDevice}
                      onChange={(e) => setRememberDevice(e.target.checked)}
                      className="rounded text-[#006194]"
                    />
                    <span>Remember this device for 30 days</span>
                  </label>

                  {errorMessage && (
                    <div className="p-2 rounded bg-red-100 text-red-800 text-xs font-semibold">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="w-full py-3 bg-[#006194] hover:bg-[#007BB9] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <span>{isConnecting ? 'Verifying with FreeRADIUS...' : 'Connect to High-Speed Internet'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {config.enableFreeTier && (
                    <button
                      onClick={handleFreeTier}
                      className="text-xs font-semibold text-slate-600 hover:text-[#006194] flex items-center justify-center gap-1 pt-1"
                    >
                      <span>Or continue with 30-min Free Tier (5 Mbps)</span>
                      <Bolt className="w-3.5 h-3.5 text-amber-500" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-3 text-left">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-800">Choose Package:</label>
                    <div className="grid grid-cols-2 gap-2">
                      {ratePlans.slice(0, 2).map((p) => (
                        <div
                          key={p.id}
                          onClick={() => setSelectedPlanId(p.id)}
                          className={`p-2.5 rounded-xl border cursor-pointer flex flex-col gap-0.5 ${
                            selectedPlanId === p.id
                              ? 'border-[#006194] bg-[#CCE5FF]/30 ring-1 ring-[#006194]'
                              : 'border-slate-200 bg-white'
                          }`}
                        >
                          <span className="font-bold text-xs text-slate-900">{p.name}</span>
                          <span className="font-extrabold text-sm text-[#006194]">
                            TSh {p.priceTZS.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-800">Phone for M-Pesa / Tigo Pesa Prompt</label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs font-bold text-slate-900"
                    />
                  </div>

                  <button
                    onClick={handleBuyPass}
                    disabled={isConnecting}
                    className="w-full py-3 bg-[#00855B] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <span>{isConnecting ? 'Sending Push USSD...' : `Pay TSh ${selectedPlan.priceTZS.toLocaleString()} & Connect`}</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
