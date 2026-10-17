import React, { useState } from 'react';
import { 
  Plus, 
  Ticket, 
  QrCode, 
  Printer, 
  FileText, 
  Download, 
  Clock, 
  HardDrive, 
  Zap, 
  TrendingUp, 
  Eye, 
  Ban, 
  CheckCircle2, 
  X,
  Search,
  Wifi,
  Radio,
  Sliders
} from 'lucide-react';
import { RatePlan, VoucherBatch, Voucher } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { VoucherQrCode } from '../VoucherQrCode';

interface PlansVouchersTabProps {
  ratePlans: RatePlan[];
  voucherBatches: VoucherBatch[];
  vouchers: Voucher[];
  onGenerateBatch: (params: {
    planId: string;
    quantity: number;
    format: string;
    venueTag: string;
    expiresAt: string;
  }) => void;
  onOpenCreatePlanModal: () => void;
  currency: 'USD' | 'TZS';
  language: 'en' | 'sw';
}

export const PlansVouchersTab: React.FC<PlansVouchersTabProps> = ({
  ratePlans,
  voucherBatches,
  vouchers,
  onGenerateBatch,
  onOpenCreatePlanModal,
  currency,
  language,
}) => {
  // Batch Generator Form State
  const [selectedPlanId, setSelectedPlanId] = useState<string>(ratePlans[1]?.id || 'tier-24h');
  const [quantity, setQuantity] = useState<number>(100);
  const [formatPattern, setFormatPattern] = useState<string>('alpha6');
  const [expiryDate, setExpiryDate] = useState<string>('2026-11-30');
  const [venueTag, setVenueTag] = useState<string>('Hotel-Lobby');
  const [autoPushRadius, setAutoPushRadius] = useState<boolean>(true);
  const [embedQr, setEmbedQr] = useState<boolean>(true);
  const [batchGenFeedback, setBatchGenFeedback] = useState<string | null>(null);

  // Inspector Drawer State
  const [showInspector, setShowInspector] = useState<boolean>(false);
  const [inspectorCode, setInspectorCode] = useState<string>('WIMA-9214-KR');
  const [inspectorResult, setInspectorResult] = useState<Voucher | null>(vouchers[0] || null);

  // Selected plan calculation
  const currentPlan = ratePlans.find((p) => p.id === selectedPlanId) || ratePlans[0];
  const yieldPotentialUSD = (currentPlan?.priceUSD || 0) * quantity;

  const handleTriggerGenerate = () => {
    onGenerateBatch({
      planId: selectedPlanId,
      quantity,
      format: formatPattern,
      venueTag,
      expiresAt: expiryDate,
    });
    setBatchGenFeedback(`Successfully generated batch of ${quantity} vouchers for ${currentPlan.name}. Saved to RADIUS AAA cache.`);
    setTimeout(() => setBatchGenFeedback(null), 4000);
  };

  const handleInspectLookup = () => {
    const found = vouchers.find((v) => v.code.toLowerCase() === inspectorCode.toLowerCase());
    if (found) {
      setInspectorResult(found);
    } else {
      setInspectorResult({
        code: inspectorCode.toUpperCase(),
        pin: '1234',
        batchId: 'BAT-DYNAMIC-QUERY',
        planId: 'tier-24h',
        planName: '24-Hour Day Pass',
        priceUSD: 5.50,
        priceTZS: 5000,
        status: 'unused',
        createdAt: 'Just now',
        expiresAt: '2026-12-31',
        speedRate: '25M/10M',
      });
    }
  };

  const handlePrintSlips = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Code,PIN,Plan,PriceUSD,Status,ExpiresAt\n" + 
      vouchers.map(v => `${v.code},${v.pin},"${v.planName}",${v.priceUSD},${v.status},${v.expiresAt}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wimafi_vouchers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6">
      {/* Header Context Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-medium text-[#3F4850]">
            <span>Gateway Control</span>
            <span>/</span>
            <span>Bandwidth Profiles</span>
            <span>/</span>
            <span className="font-bold text-[#0B1C30]">Voucher Studio & QoS</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#0B1C30] tracking-tight">
              {language === 'sw' ? 'Mabando & Studio ya Vocha' : 'Plans & Voucher Orchestration'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#E5EEFF] text-[#006947] text-xs font-bold flex items-center gap-1.5 border border-[#D3E4FE]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00855B] animate-pulse"></span>
              RADIUS AAA Synced
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowInspector(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#EFF4FF] border border-[#DCE9FF] text-[#006194] text-xs font-bold shadow-xs transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>{language === 'sw' ? 'Mkaguzi wa Vocha' : 'Live Voucher Inspector'}</span>
          </button>

          <button
            onClick={onOpenCreatePlanModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#006194] hover:bg-[#007BB9] text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'sw' ? '+ Tengeneza Bando Jipya' : '+ Create New Plan'}</span>
          </button>
        </div>
      </div>

      {/* Telemetry Snapshot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-[#DCE9FF] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#3F4850] uppercase tracking-wider">
              ACTIVE VOUCHERS IN POOL
            </span>
            <Ticket className="w-5 h-5 text-[#006194]" />
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#0B1C30] tracking-tight tabular-nums">3,842</span>
            <span className="text-xs text-[#006947] font-bold">+18.4% today</span>
          </div>
          <div className="w-full bg-[#E5EEFF] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#006194] h-full" style={{ width: '64%' }}></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#DCE9FF] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#3F4850] uppercase tracking-wider">
              CURRENT 24H REVENUE
            </span>
            <TrendingUp className="w-5 h-5 text-[#00855B]" />
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#0B1C30] tracking-tight tabular-nums">
              {formatCurrency(1429.50, currency)}
            </span>
            <span className="text-xs text-[#006947] font-bold">+8.2% vs avg</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#3F4850]">
            <span>M-Pesa / Stripe: Active</span>
            <span className="text-[#006947] font-semibold">99.8% Success</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#DCE9FF] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#3F4850] uppercase tracking-wider">
              BANDWIDTH SHAPING CAP
            </span>
            <Radio className="w-5 h-5 text-[#0051D5]" />
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#0B1C30] tracking-tight tabular-nums">1.28</span>
            <span className="text-xs text-[#3F4850] font-mono">Gbps Aggregate</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#3F4850]">
            <span>MikroTik Simple Queues</span>
            <span className="text-[#006194] font-semibold">14ms Jitter</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#DCE9FF] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#3F4850] uppercase tracking-wider">
              EXPIRED IN LAST 2H
            </span>
            <Clock className="w-5 h-5 text-[#707881]" />
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#0B1C30] tracking-tight tabular-nums">184</span>
            <span className="text-xs text-[#3F4850]">Auto-reclaimed</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#3F4850]">
            <span>DHCP Pool Leases freed</span>
            <span className="text-[#0B1C30] font-semibold font-mono">184 IPs</span>
          </div>
        </div>
      </div>

      {/* Configured Bandwidth Tiers Grid */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0B1C30]">
              {language === 'sw' ? 'Viwango vya Kasi Vilivyosanidiwa' : 'Configured Bandwidth Tiers'}
            </h2>
            <p className="text-xs text-[#3F4850]">
              Carrier-grade rate limits pushed live to MikroTik & UniFi gateway controllers.
            </p>
          </div>
          <span className="text-xs font-bold text-[#707881] uppercase tracking-wider">
            {ratePlans.length} ACTIVE PROFILES
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {ratePlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-xl p-5 border shadow-xs flex flex-col justify-between relative transition-all hover:shadow-md ${
                plan.isPopular ? 'border-[#006194] ring-2 ring-[#006194]/20' : 'border-[#DCE9FF]'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#006194] text-white px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider shadow-xs uppercase">
                  MOST POPULAR
                </div>
              )}

              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between mt-1">
                  <span className="px-2 py-0.5 rounded bg-[#EFF4FF] text-[#3F4850] text-[10px] font-bold">
                    {plan.tier}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E5EEFF] text-[#006194]">
                    {plan.statusBadge}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#0B1C30]">
                    {language === 'sw' ? plan.nameSwahili : plan.name}
                  </h3>
                  <p className="text-xs text-[#707881] line-clamp-1">
                    {language === 'sw' ? plan.taglineSwahili : plan.tagline}
                  </p>
                </div>

                <div className="flex items-baseline gap-1 my-1">
                  <span className="text-2xl font-bold text-[#0B1C30]">
                    {currency === 'TZS' ? `TSh ${plan.priceTZS.toLocaleString()}` : `$${plan.priceUSD.toFixed(2)}`}
                  </span>
                  <span className="text-xs text-[#707881]">
                    {language === 'sw' ? plan.durationLabelSwahili : plan.durationLabel}
                  </span>
                </div>

                {/* Technical Limits Box */}
                <div className="space-y-1.5 text-xs pt-1">
                  <div className="flex items-center justify-between bg-[#EFF4FF] px-2.5 py-1.5 rounded-lg">
                    <span className="text-[#3F4850]">Rate Limit:</span>
                    <span className="font-mono font-semibold text-[#0B1C30]">
                      {plan.downloadMbps}M / {plan.uploadMbps}M
                    </span>
                  </div>

                  {plan.initialBurstMbps && (
                    <div className="flex items-center justify-between bg-[#EFF4FF] px-2.5 py-1.5 rounded-lg">
                      <span className="text-[#3F4850]">Initial Burst:</span>
                      <span className="font-mono font-semibold text-[#006194]">
                        {plan.initialBurstMbps}M ({plan.burstDurationSec}s)
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between bg-[#EFF4FF] px-2.5 py-1.5 rounded-lg">
                    <span className="text-[#3F4850]">Quota Limit:</span>
                    <span className="font-mono font-semibold text-[#0B1C30]">
                      {typeof plan.quotaGB === 'number' ? `${plan.quotaGB} GB Hard Cap` : 'Unlimited'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-[#EFF4FF] px-2.5 py-1.5 rounded-lg">
                    <span className="text-[#3F4850]">Concurrency:</span>
                    <span className="font-mono font-semibold text-[#0B1C30]">
                      {plan.concurrencyDevices} Device{plan.concurrencyDevices > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#DCE9FF] flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[11px] text-[#3F4850]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00855B]"></span> Active Rule
                </span>
                <button
                  onClick={() => {
                    setSelectedPlanId(plan.id);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#EFF4FF] hover:bg-[#DCE9FF] text-[#006194] text-xs font-bold transition-colors"
                >
                  Configure
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Batch Voucher Generator Studio */}
      <div className="bg-white rounded-xl p-5 lg:p-6 border border-[#DCE9FF] shadow-xs flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-2 border-b border-[#DCE9FF]">
          <div>
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-[#006194]" />
              <h2 className="text-base font-bold text-[#0B1C30]">
                {language === 'sw' ? 'Studio ya Kutengeneza Vocha kwa Mkupuo' : 'Batch Voucher Generator Studio'}
              </h2>
            </div>
            <p className="text-xs text-[#3F4850]">
              Synthesize cryptographically pseudo-random PIN or Alphanumeric credentials for high-throughput front-desk dispatch.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#707881] uppercase">Hardware Driver:</span>
            <span className="px-2.5 py-1 bg-[#EFF4FF] rounded font-mono text-xs text-[#0B1C30] font-semibold border border-[#DCE9FF]">
              MikroTik RouterOS 7.x + FreeRADIUS
            </span>
          </div>
        </div>

        {/* Generator Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#EFF4FF] p-4 rounded-xl border border-[#DCE9FF]">
          {/* 1. Target Plan Tier */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#0B1C30]">Target Plan Tier</label>
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="w-full bg-white py-2 px-3 rounded-lg text-xs font-medium text-[#0B1C30] border border-[#DCE9FF] focus:outline-none focus:ring-1 focus:ring-[#006194]"
            >
              {ratePlans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({currency === 'TZS' ? `TSh ${p.priceTZS.toLocaleString()}` : `$${p.priceUSD.toFixed(2)}`})
                </option>
              ))}
            </select>
            <span className="text-[11px] text-[#707881]">
              Profile mapping: <code className="text-[#006194]">prof-{currentPlan.id}</code>
            </span>
          </div>

          {/* 2. Quantity */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#0B1C30]">Quantity of Codes</label>
            <div className="flex items-center gap-1.5">
              {[50, 100, 250, 500].map((qty) => (
                <button
                  key={qty}
                  onClick={() => setQuantity(qty)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    quantity === qty
                      ? 'bg-[#006194] text-white shadow-xs'
                      : 'bg-white text-[#0B1C30] border border-[#DCE9FF] hover:bg-[#DCE9FF]'
                  }`}
                >
                  {qty}
                </button>
              ))}
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 bg-white py-1.5 px-2 text-center rounded-lg font-mono text-xs text-[#0B1C30] border border-[#DCE9FF] focus:outline-none"
              />
            </div>
            <span className="text-[11px] text-[#707881]">
              Yield:{' '}
              <strong className="text-[#00855B] font-mono">
                {currency === 'TZS' ? `TSh ${(currentPlan.priceTZS * quantity).toLocaleString()}` : `$${yieldPotentialUSD.toFixed(2)}`}
              </strong>{' '}
              Total Potential
            </span>
          </div>

          {/* 3. Format & Character Set */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#0B1C30]">Format & Character Set</label>
            <select
              value={formatPattern}
              onChange={(e) => setFormatPattern(e.target.value)}
              className="w-full bg-white py-2 px-3 rounded-lg text-xs font-medium text-[#0B1C30] border border-[#DCE9FF] focus:outline-none focus:ring-1 focus:ring-[#006194]"
            >
              <option value="alpha6">WIMA-XXXX-XX (Alphanumeric 6-char)</option>
              <option value="pin4">Numeric PIN (4-digit Guest Friendly)</option>
              <option value="pin8">Numeric PIN (8-digit High Security)</option>
              <option value="macbound">MAC Bound (Self-Registering Link)</option>
            </select>
            <span className="text-[11px] text-[#707881]">Entropy: ~36^6 unique combinations</span>
          </div>

          {/* 4. Expiration Policy */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#0B1C30]">Expiration Policy & Venue</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-white py-1.5 px-2 rounded-lg text-xs font-mono text-[#0B1C30] border border-[#DCE9FF] focus:outline-none"
              />
              <input
                type="text"
                value={venueTag}
                onChange={(e) => setVenueTag(e.target.value)}
                placeholder="Tag: Hotel-Lobby"
                className="w-full bg-white py-1.5 px-2 rounded-lg text-xs text-[#0B1C30] border border-[#DCE9FF] focus:outline-none"
              />
            </div>
            <span className="text-[11px] text-[#707881]">Auto-purges 30 days after physical issuance</span>
          </div>
        </div>

        {/* Action & Export Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-[#3F4850] cursor-pointer">
              <input
                type="checkbox"
                checked={autoPushRadius}
                onChange={(e) => setAutoPushRadius(e.target.checked)}
                className="rounded text-[#006194] focus:ring-0"
              />
              <span>Auto-push to RADIUS Auth Cache</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-[#3F4850] cursor-pointer">
              <input
                type="checkbox"
                checked={embedQr}
                onChange={(e) => setEmbedQr(e.target.checked)}
                className="rounded text-[#006194] focus:ring-0"
              />
              <span>Embed QR Code in Output</span>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleTriggerGenerate}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#006194] hover:bg-[#007BB9] text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>Generate {quantity} Vouchers Now</span>
            </button>
            <button
              onClick={handlePrintSlips}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#EFF4FF] hover:bg-[#DCE9FF] text-[#0B1C30] rounded-xl text-xs font-bold transition-colors"
            >
              <Printer className="w-4 h-4 text-[#006194]" />
              <span>Print Thermal Slips</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#EFF4FF] hover:bg-[#DCE9FF] text-[#0B1C30] rounded-xl text-xs font-bold transition-colors"
            >
              <Download className="w-4 h-4 text-[#006194]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {batchGenFeedback && (
          <div className="p-3 rounded-lg bg-[#E5EEFF] text-[#006947] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#00855B]" />
            <span>{batchGenFeedback}</span>
          </div>
        )}
      </div>

      {/* Live Voucher Slip Preview Strip (Interactive Visual Delight matching Image 5) */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-[#3F4850] uppercase tracking-wider">
          Thermal Slip Preview (Print-Ready)
        </span>
        <div id="printable-voucher-zone" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vouchers.slice(0, 3).map((voucher, idx) => (
            <div
              key={voucher.code}
              className="bg-white rounded-xl p-4 border border-[#DCE9FF] shadow-xs flex flex-col justify-between relative overflow-hidden"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#DCE9FF]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#006194] text-white flex items-center justify-center">
                    <Wifi className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-[#0B1C30]">WimaFi Guest Pass</span>
                </div>
                <span className="font-mono text-[10px] text-[#707881] font-semibold">
                  BATCH #{voucher.batchId.slice(-4) || '884'}
                </span>
              </div>

              <div className="py-3 px-2 text-center bg-[#EFF4FF] rounded-lg my-2.5 flex items-center justify-between gap-3 border border-[#DCE9FF]">
                <div className="flex flex-col items-start text-left">
                  <span className="text-[10px] font-bold text-[#707881] uppercase">SSID: WimaFi-HighSpeed</span>
                  <div className="font-mono text-base font-extrabold tracking-widest text-[#006194] select-all">
                    {voucher.code}
                  </div>
                  <span className="text-[10px] text-[#3F4850] mt-0.5">
                    Tier: {voucher.planName} ({voucher.speedRate})
                  </span>
                </div>
                <VoucherQrCode value={voucher.code} size={52} />
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#707881]">
                <span>Exp: {voucher.expiresAt}</span>
                <span className="text-[#00855B] font-bold">Active Voucher</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Voucher Inventory Batches Table */}
      <div className="bg-white rounded-xl border border-[#DCE9FF] shadow-xs overflow-hidden flex flex-col">
        <div className="p-4 lg:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#EFF4FF] border-b border-[#DCE9FF]">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-[#0B1C30]">Voucher Inventory Batches</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-white text-[#3F4850] text-xs font-semibold border border-[#DCE9FF]">
              {voucherBatches.length} Batches On-File
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 bg-white hover:bg-[#DCE9FF] border border-[#DCE9FF] text-[#0B1C30] rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#006194]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#DCE9FF] text-[#3F4850] font-bold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-4">Batch Identifier</th>
                <th className="py-2.5 px-4">Batch Label / Venue</th>
                <th className="py-2.5 px-4">Tier Profile</th>
                <th className="py-2.5 px-4 text-right">Total</th>
                <th className="py-2.5 px-4 text-right">Redeemed / Active</th>
                <th className="py-2.5 px-4 text-right">Collected Rev</th>
                <th className="py-2.5 px-4">Created Timestamp</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EEFF]">
              {voucherBatches.map((batch) => (
                <tr key={batch.id} className="hover:bg-[#F8F9FF] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#006194]">{batch.id}</td>
                  <td className="py-3 px-4 font-semibold text-[#0B1C30]">{batch.label}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-[#EFF4FF] font-semibold text-[#3F4850]">
                      {batch.planName}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-right font-semibold">{batch.total}</td>
                  <td className="py-3 px-4 font-mono text-right">
                    <span className="text-[#00855B] font-bold">{batch.redeemed}</span>
                    <span className="text-[#707881]"> / {batch.active}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-right font-bold text-[#0B1C30]">
                    {formatCurrency(batch.collectedRevUSD, currency)}
                  </td>
                  <td className="py-3 px-4 text-[#707881] font-mono">{batch.createdAt}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        batch.status === 'active'
                          ? 'bg-[#E5EEFF] text-[#006947]'
                          : 'bg-[#EFF4FF] text-[#707881]'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${batch.status === 'active' ? 'bg-[#00855B]' : 'bg-[#707881]'}`} />
                      {batch.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => {
                        setInspectorCode(batch.id);
                        setShowInspector(true);
                      }}
                      className="p-1 rounded hover:bg-[#EFF4FF] text-[#707881] hover:text-[#0B1C30]"
                      title="Inspect Batch"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handlePrintSlips}
                      className="p-1 rounded hover:bg-[#EFF4FF] text-[#707881] hover:text-[#0B1C30]"
                      title="Print Slips"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Code Inspection & Voucher Testing Drawer (matching Image 5 drawer) */}
      {showInspector && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex justify-end">
          <div className="w-full sm:w-[460px] bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div>
              <div className="h-16 px-6 bg-[#EFF4FF] border-b border-[#DCE9FF] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-[#006194]" />
                  <span className="font-bold text-base text-[#0B1C30]">
                    Voucher Testing & Inspector
                  </span>
                </div>
                <button
                  onClick={() => setShowInspector(false)}
                  className="p-1.5 rounded-lg hover:bg-white text-[#707881] hover:text-[#0B1C30]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-6 space-y-5 overflow-y-auto">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0B1C30]">Search or Scan Voucher Code</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={inspectorCode}
                      onChange={(e) => setInspectorCode(e.target.value)}
                      className="w-full pl-3 pr-20 py-2 bg-[#EFF4FF] border border-[#DCE9FF] rounded-lg font-mono font-bold text-xs text-[#0B1C30] uppercase"
                    />
                    <button
                      onClick={handleInspectLookup}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded bg-[#006194] text-white text-xs font-bold hover:bg-[#007BB9]"
                    >
                      Verify
                    </button>
                  </div>
                  <span className="text-[11px] text-[#707881]">
                    Real-time query directly against FreeRADIUS accounting engine.
                  </span>
                </div>

                {inspectorResult && (
                  <div className="bg-[#EFF4FF] border border-[#DCE9FF] rounded-xl p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#707881] uppercase">RADIUS AAA STATE</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#E5EEFF] text-[#006947] text-[10px] font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00855B] animate-pulse"></span>
                        ONLINE / ACTIVE
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white p-2.5 rounded-lg border border-[#DCE9FF]">
                        <span className="text-[10px] text-[#707881] block">Bound Plan</span>
                        <span className="font-bold text-[#0B1C30]">{inspectorResult.planName}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-[#DCE9FF]">
                        <span className="text-[10px] text-[#707881] block">Bandwidth Quota</span>
                        <span className="font-bold text-[#00855B]">
                          {typeof inspectorResult.dataLimitGB === 'number' ? `${inspectorResult.dataLimitGB} GB` : 'Unlimited'}
                        </span>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-[#DCE9FF]">
                        <span className="text-[10px] text-[#707881] block">First Login NAS</span>
                        <span className="font-mono text-[#0B1C30]">CCR2004-East</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-[#DCE9FF]">
                        <span className="text-[10px] text-[#707881] block">Client IP (DHCP)</span>
                        <span className="font-mono font-semibold text-[#006194]">10.240.4.152</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#3F4850]">Session Time Remaining:</span>
                        <span className="font-mono font-bold text-[#0B1C30]">18 Hours 42 Mins</span>
                      </div>
                      <div className="w-full bg-[#DCE9FF] h-2 rounded-full overflow-hidden">
                        <div className="bg-[#006194] h-full rounded-full" style={{ width: '77.8%' }}></div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#707881] pt-1 font-mono">
                        <span>Consumed: 4.82 GB</span>
                        <span>MAC: 4A:2B:99:E1:CC:03</span>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold text-[#707881] uppercase block">
                        ACCOUNTING PACKET LOG
                      </span>
                      <div className="p-2.5 rounded bg-[#0F172A] text-[#93CCFF] font-mono text-[10px] space-y-1">
                        <div>[09:14:02] RAD-AUTH: Access-Accept via eth1_pool</div>
                        <div>[09:14:05] RAD-ACCT: Interim-Update 4.82 GB transferred</div>
                        <div>[09:30:00] QOS-ACK: 25Mbps DL / 10Mbps UL queue active</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 bg-[#EFF4FF] border-t border-[#DCE9FF] flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  alert(`Session for ${inspectorCode} terminated via RADIUS CoA.`);
                  setShowInspector(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#FFDAD6] text-[#BA1A1A] hover:bg-red-200 text-xs font-bold transition-colors"
              >
                Disconnect MAC
              </button>
              <button
                onClick={() => {
                  alert(`Voucher ${inspectorCode} revoked and removed from FreeRADIUS pool.`);
                  setShowInspector(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#DCE9FF] hover:bg-[#DCE9FF] text-[#0B1C30] text-xs font-bold transition-colors"
              >
                Revoke Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
