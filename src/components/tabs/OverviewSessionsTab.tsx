import React, { useState } from 'react';
import { 
  Wifi, 
  RotateCw, 
  TrendingUp, 
  ArrowDown, 
  ArrowUp, 
  Search, 
  Filter, 
  Copy, 
  Check, 
  Unlink, 
  Gauge, 
  CheckCircle2, 
  Ban, 
  ShieldAlert, 
  Ticket, 
  Laptop, 
  Smartphone, 
  Tv, 
  Cpu
} from 'lucide-react';
import { WifiSession, NasGateway, RadiusEvent, RatePlan } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface OverviewSessionsTabProps {
  sessions: WifiSession[];
  onDisconnectSession: (sessionId: string) => void;
  onThrottleSession: (sessionId: string) => void;
  gateways: NasGateway[];
  ratePlans: RatePlan[];
  radiusEvents: RadiusEvent[];
  currency: 'USD' | 'TZS';
  language: 'en' | 'sw';
}

export const OverviewSessionsTab: React.FC<OverviewSessionsTabProps> = ({
  sessions,
  onDisconnectSession,
  onThrottleSession,
  gateways,
  ratePlans,
  radiusEvents,
  currency,
  language,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedGateway, setSelectedGateway] = useState('all');
  const [selectedPlan, setSelectedPlan] = useState('all');
  const [timeframe, setTimeframe] = useState<'1h' | '6h' | '24h' | '7d'>('1h');
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedMac, setCopiedMac] = useState<string | null>(null);

  // Instant kick form
  const [targetMacInput, setTargetMacInput] = useState('');
  const [blacklistCheck, setBlacklistCheck] = useState(false);
  const [kickFeedback, setKickFeedback] = useState<string | null>(null);

  // Fast voucher lookup
  const [voucherLookupInput, setVoucherLookupInput] = useState('');
  const [voucherResult, setVoucherResult] = useState<{
    code: string;
    status: string;
    profile: string;
    created: string;
  } | null>({
    code: 'WIMA-9214-KR',
    status: 'UNUSED / ACTIVE',
    profile: '24-Hour High Speed (25M/10M)',
    created: 'Today at 08:14 by Operator 02',
  });

  const handleCopyMac = (mac: string) => {
    navigator.clipboard.writeText(mac);
    setCopiedMac(mac);
    setTimeout(() => setCopiedMac(null), 1500);
  };

  const handleSyncMetrics = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 700);
  };

  const handleKickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetMacInput.trim()) return;
    const target = targetMacInput.trim();
    setKickFeedback(`Dispatched RADIUS CoA disconnect (RFC 3576) to NAS for ${target}${blacklistCheck ? ' & added to Blacklist' : ''}`);
    setTargetMacInput('');
    setTimeout(() => setKickFeedback(null), 4000);
  };

  const handleVoucherLookup = () => {
    if (!voucherLookupInput.trim()) return;
    const code = voucherLookupInput.trim().toUpperCase();
    setVoucherResult({
      code: code,
      status: 'VERIFIED IN SQL+CACHE',
      profile: '24-Hour Day Pass (25M/10M)',
      created: 'Issued by Front Desk POS',
    });
  };

  // Filtered sessions
  const filteredSessions = sessions.filter((s) => {
    const matchesSearch = 
      s.hostname.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.mac.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.ip.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.planName.toLowerCase().includes(searchFilter.toLowerCase());
    
    const matchesGateway = selectedGateway === 'all' || s.assignedNas.toLowerCase().includes(selectedGateway.toLowerCase());
    const matchesPlan = selectedPlan === 'all' || s.planId === selectedPlan;

    return matchesSearch && matchesGateway && matchesPlan;
  });

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="w-5 h-5 text-[#006194]" />;
      case 'tv':
        return <Tv className="w-5 h-5 text-[#006194]" />;
      default:
        return <Laptop className="w-5 h-5 text-[#006194]" />;
    }
  };

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6">
      {/* Top Bar Context & Breadcrumb Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-[#3F4850]">
          <span>Infrastructure</span>
          <span>/</span>
          <span>Gateways</span>
          <span>/</span>
          <span className="font-bold text-[#0B1C30]">Overview & Sessions</span>
          <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-mono bg-[#DCE9FF] text-[#006194] font-bold">
            REALTIME SYNC
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#3F4850]">Auth Server:</span>
          <span className="px-2.5 py-1 bg-[#DCE9FF] text-[#006194] font-mono text-xs font-semibold rounded-lg flex items-center gap-1.5 border border-[#D3E4FE]">
            <span className="w-2 h-2 rounded-full bg-[#00855B]"></span>
            radius01.wimafi.net (10.240.0.12)
          </span>
          <button
            onClick={handleSyncMetrics}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#E5EEFF] hover:bg-[#DCE9FF] text-[#0B1C30] rounded-lg transition-colors text-xs font-semibold"
          >
            <RotateCw className={`w-3.5 h-3.5 text-[#006194] ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Executive KPI Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI 1: Active Sessions */}
        <div className="bg-white rounded-xl p-5 border border-[#DCE9FF] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#3F4850] uppercase tracking-wider">
              {language === 'sw' ? 'VIPINDI HEWANI' : 'TOTAL ACTIVE SESSIONS'}
            </span>
            <Wifi className="w-5 h-5 text-[#006194]" />
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#0B1C30] tracking-tight tabular-nums">
              {sessions.length.toLocaleString()}
            </span>
            <span className="text-xs text-[#006947] font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +14.2%
            </span>
          </div>
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex justify-between text-[11px] text-[#3F4850]">
              <span>Mobile 68%</span>
              <span>Laptop 28%</span>
              <span>IoT 4%</span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden flex bg-[#E5EEFF]">
              <div className="bg-[#006194] h-full" style={{ width: '68%' }} title="Mobile"></div>
              <div className="bg-[#0051D5] h-full" style={{ width: '28%' }} title="Laptop"></div>
              <div className="bg-[#00855B] h-full" style={{ width: '4%' }} title="IoT"></div>
            </div>
          </div>
        </div>

        {/* KPI 2: Live Bandwidth */}
        <div className="bg-white rounded-xl p-5 border border-[#DCE9FF] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#3F4850] uppercase tracking-wider">
              {language === 'sw' ? 'KASI YA BOMBA (THROUGHPUT)' : 'LIVE THROUGHPUT / PIPE'}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#E5EEFF] text-[#00855B] font-bold">
              84% SATURATED
            </span>
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#0B1C30] tracking-tight tabular-nums">842.6</span>
            <span className="text-xs text-[#3F4850] font-semibold">Mbps / 1.0G</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <div className="flex items-center gap-1 text-[#006194] font-mono font-semibold">
              <ArrowDown className="w-3.5 h-3.5" />
              <span>710.0 Mbps In</span>
            </div>
            <div className="flex items-center gap-1 text-[#0051D5] font-mono font-semibold">
              <ArrowUp className="w-3.5 h-3.5" />
              <span>132.6 Mbps Out</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Revenue & Vouchers */}
        <div className="bg-white rounded-xl p-5 border border-[#DCE9FF] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#3F4850] uppercase tracking-wider">
              {language === 'sw' ? 'MAPATO YA LEO' : "TODAY'S REVENUE"}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#DBE1FF] text-[#00174B] font-bold">
              342 TICKETS
            </span>
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#0B1C30] tracking-tight tabular-nums">
              {formatCurrency(1845.50, currency)}
            </span>
            <span className="text-xs text-[#006947] font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +8.4%
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#3F4850] pt-1">
            <span>M-Pesa: {currency === 'TZS' ? 'TSh 1.35M' : '$520'}</span>
            <span>Tigo: {currency === 'TZS' ? 'TSh 850k' : '$330'}</span>
            <span>Card: {currency === 'TZS' ? 'TSh 2.65M' : '$1.1k'}</span>
          </div>
        </div>

        {/* KPI 4: Gateway Fleet Health */}
        <div className="bg-white rounded-xl p-5 border border-[#DCE9FF] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#3F4850] uppercase tracking-wider">
              {language === 'sw' ? 'HALI YA VIPANGA-NJIA' : 'GATEWAYS STATE'}
            </span>
            <span className="flex items-center gap-1 text-[#006947] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#00855B] animate-pulse"></span>
              {gateways.length}/{gateways.length} Online
            </span>
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#0B1C30] tracking-tight tabular-nums">99.98%</span>
            <span className="text-xs text-[#3F4850] font-semibold">Uptime 30d</span>
          </div>
          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto text-[11px] font-mono">
            {gateways.map((gw) => (
              <span key={gw.id} className="px-1.5 py-0.5 rounded bg-[#EFF4FF] text-[#0B1C30] text-[10px] font-semibold">
                {gw.vendor === 'mikrotik' ? 'CCR2004' : gw.vendor === 'ubiquiti' ? 'UDM-Pro' : gw.vendor === 'cisco' ? 'Cat9300' : 'EdgeWrt'}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Live Traffic & Throughput Section */}
      <div className="bg-white rounded-xl p-5 border border-[#DCE9FF] shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#0B1C30]">
              {language === 'sw' ? 'Mwenendo wa Intaneti Moja kwa Moja' : 'Live Traffic Telemetry'}
            </h2>
            <p className="text-xs text-[#3F4850]">
              Aggregated edge egress and ingress monitoring across all 6 core gateways
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-xs text-[#3F4850]">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-[#006194] rounded-full inline-block"></span>
                <span>Downlink (In)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-[#0051D5] rounded-full inline-block border-b border-dashed"></span>
                <span>Uplink (Out)</span>
              </span>
            </div>

            <div className="flex bg-[#EFF4FF] p-0.5 rounded-lg border border-[#DCE9FF]">
              {(['1h', '6h', '24h', '7d'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    timeframe === t
                      ? 'bg-white text-[#006194] shadow-xs'
                      : 'text-[#3F4850] hover:text-[#0B1C30]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Traffic Visualization Chart SVG */}
        <div className="relative w-full h-56 bg-[#EFF4FF] rounded-xl p-4 overflow-hidden flex flex-col justify-between border border-[#DCE9FF]">
          {/* Background guide markings */}
          <div className="absolute inset-x-4 top-4 bottom-4 flex flex-col justify-between pointer-events-none opacity-40">
            <div className="border-b border-[#BFC7D2] w-full flex justify-between text-[11px] font-mono text-[#3F4850]">
              <span>1.0 Gbps (Peak Pipe Limit)</span>
            </div>
            <div className="border-b border-[#BFC7D2] w-full flex justify-between text-[11px] font-mono text-[#3F4850]">
              <span>750 Mbps</span>
            </div>
            <div className="border-b border-[#BFC7D2] w-full flex justify-between text-[11px] font-mono text-[#3F4850]">
              <span>500 Mbps</span>
            </div>
            <div className="border-b border-[#BFC7D2] w-full flex justify-between text-[11px] font-mono text-[#3F4850]">
              <span>250 Mbps</span>
            </div>
            <div className="w-full flex justify-between text-[11px] font-mono text-[#3F4850]">
              <span>0 Mbps</span>
            </div>
          </div>

          {/* SVG Curves */}
          <div className="relative w-full h-40 z-10">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 160">
              <defs>
                <linearGradient id="downstreamGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#006194" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#006194" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Downstream Area Fill */}
              <path
                d="M 0 160 L 0 110 Q 70 95, 140 85 T 280 50 T 420 40 T 560 30 T 700 25 T 840 35 T 1000 22 L 1000 160 Z"
                fill="url(#downstreamGradient)"
              />
              {/* Downstream Stroke */}
              <path
                d="M 0 110 Q 70 95, 140 85 T 280 50 T 420 40 T 560 30 T 700 25 T 840 35 T 1000 22"
                fill="none"
                stroke="#006194"
                strokeWidth="2.5"
              />
              {/* Upstream Stroke */}
              <path
                d="M 0 145 Q 70 140, 140 135 T 280 120 T 420 110 T 560 95 T 700 90 T 840 92 T 1000 88"
                fill="none"
                stroke="#0051d5"
                strokeDasharray="4 3"
                strokeWidth="2"
              />
              {/* Live Pulse Dot */}
              <circle cx="1000" cy="22" r="6" fill="#006194" opacity="0.4" className="animate-ping" />
              <circle cx="1000" cy="22" r="4" fill="#006194" />
              <circle cx="1000" cy="88" r="3.5" fill="#0051d5" />
            </svg>
          </div>

          {/* Time Ticks */}
          <div className="relative z-10 flex justify-between font-mono text-[11px] text-[#3F4850] pt-1 border-t border-[#DCE9FF]">
            <span>09:00</span>
            <span>11:00</span>
            <span>13:00 (Lunch Rush)</span>
            <span>15:00</span>
            <span>17:00</span>
            <span>19:00 (Peak Evening)</span>
            <span className="font-bold text-[#006194]">Now (710M / 132M)</span>
          </div>
        </div>
      </div>

      {/* Active Sessions Main Area & Side Drawer Container */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left/Main: Active Sessions Data Table (8 Cols on XL) */}
        <div className="xl:col-span-8 flex flex-col gap-4 bg-white rounded-xl p-5 border border-[#DCE9FF] shadow-xs">
          {/* Search and Filters Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-sm relative">
              <Search className="w-4 h-4 text-[#707881] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search MAC, IP, hostname or plan..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#EFF4FF] border border-[#DCE9FF] rounded-lg text-xs text-[#0B1C30] placeholder:text-[#707881] focus:outline-none focus:ring-1 focus:ring-[#006194]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedGateway}
                onChange={(e) => setSelectedGateway(e.target.value)}
                className="px-2.5 py-1.5 bg-[#EFF4FF] border border-[#DCE9FF] text-xs font-medium text-[#0B1C30] rounded-lg focus:outline-none"
              >
                <option value="all">All Gateways ({gateways.length})</option>
                {gateways.map((g) => (
                  <option key={g.id} value={g.name}>{g.name}</option>
                ))}
              </select>

              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="px-2.5 py-1.5 bg-[#EFF4FF] border border-[#DCE9FF] text-xs font-medium text-[#0B1C30] rounded-lg focus:outline-none"
              >
                <option value="all">All Rate Plans</option>
                {ratePlans.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <button
                onClick={() => {
                  setSearchFilter('');
                  setSelectedGateway('all');
                  setSelectedPlan('all');
                }}
                className="px-2.5 py-1.5 bg-[#EFF4FF] hover:bg-[#DCE9FF] text-[#0B1C30] text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Sessions Data Table */}
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#EFF4FF] text-[#3F4850] font-bold text-[11px] uppercase tracking-wider h-9">
                  <th className="px-3 py-1 rounded-l-lg">Client & Hostname</th>
                  <th className="px-3 py-1">IP / MAC Address</th>
                  <th className="px-3 py-1">Assigned NAS</th>
                  <th className="px-3 py-1">Active Plan</th>
                  <th className="px-3 py-1 text-right">Data In/Out</th>
                  <th className="px-3 py-1">Time Remaining</th>
                  <th className="px-3 py-1 text-center rounded-r-lg">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EEFF]">
                {filteredSessions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-[#707881]">
                      No active sessions matching filter.
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map((client) => (
                    <tr key={client.id} className="hover:bg-[#F8F9FF] transition-colors h-14">
                      {/* Hostname & Specs */}
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2.5">
                          {getDeviceIcon(client.deviceType)}
                          <div className="flex flex-col">
                            <span className="font-semibold text-[#0B1C30]">{client.hostname}</span>
                            <span className="text-[11px] text-[#707881]">
                              {client.deviceVendor} • {client.specs}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* IP & MAC with copy button */}
                      <td className="px-3 py-2 font-mono text-[11px]">
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#0B1C30]">{client.ip}</span>
                          <div className="flex items-center gap-1.5 text-[#707881]">
                            <span>{client.mac}</span>
                            <button
                              onClick={() => handleCopyMac(client.mac)}
                              className="hover:text-[#006194]"
                              title="Copy MAC Address"
                            >
                              {copiedMac === client.mac ? (
                                <Check className="w-3 h-3 text-[#00855B]" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* NAS */}
                      <td className="px-3 py-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#E5EEFF] text-[#0B1C30] font-semibold">
                          {client.assignedNas}
                        </span>
                      </td>

                      {/* Plan */}
                      <td className="px-3 py-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#DCE9FF] text-[#006194]">
                          {client.planName}
                        </span>
                      </td>

                      {/* Data */}
                      <td className="px-3 py-2 text-right font-mono text-[11px]">
                        <div className="font-semibold text-[#0B1C30]">
                          {(client.dataDownGB + client.dataUpGB).toFixed(1)} GB
                        </div>
                        <div className="text-[10px] text-[#707881]">
                          Down: {client.dataDownGB}G / Up: {client.dataUpGB}G
                        </div>
                      </td>

                      {/* Time Remaining Bar */}
                      <td className="px-3 py-2">
                        <div className="w-28 flex flex-col gap-1">
                          <div className="flex justify-between text-[10px] font-mono text-[#3F4850]">
                            <span>{client.timeRemaining}</span>
                            <span>{client.percentRemaining}%</span>
                          </div>
                          <div className="w-full bg-[#E5EEFF] h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                client.percentRemaining < 25 ? 'bg-[#BA1A1A]' : 'bg-[#00855B]'
                              }`}
                              style={{ width: `${client.percentRemaining}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onDisconnectSession(client.id)}
                            className="p-1 hover:bg-[#FFDAD6] text-[#707881] hover:text-[#BA1A1A] rounded transition-colors"
                            title="Disconnect Session via RADIUS CoA"
                          >
                            <Unlink className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onThrottleSession(client.id)}
                            className="p-1 hover:bg-[#DCE9FF] text-[#707881] hover:text-[#006194] rounded transition-colors"
                            title="Throttle Bandwidth (PCQ Queue)"
                          >
                            <Gauge className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-[#707881] border-t border-[#DCE9FF]">
            <span>
              Showing <strong className="text-[#0B1C30] font-mono">{filteredSessions.length}</strong> of{' '}
              <strong className="text-[#0B1C30] font-mono">1,428</strong> connected subscribers
            </span>
            <div className="flex items-center gap-1 font-mono text-xs">
              <button className="px-2 py-1 bg-[#EFF4FF] rounded hover:bg-[#DCE9FF] text-[#0B1C30]">Previous</button>
              <button className="px-2 py-1 bg-[#006194] text-white rounded font-bold">1</button>
              <button className="px-2 py-1 bg-[#EFF4FF] rounded hover:bg-[#DCE9FF] text-[#0B1C30]">2</button>
              <button className="px-2 py-1 bg-[#EFF4FF] rounded hover:bg-[#DCE9FF] text-[#0B1C30]">3</button>
              <span className="px-1 text-[#707881]">…</span>
              <button className="px-2 py-1 bg-[#EFF4FF] rounded hover:bg-[#DCE9FF] text-[#0B1C30]">Next</button>
            </div>
          </div>
        </div>

        {/* Right: Fast Actions & RADIUS Event Stream (4 Cols on XL) */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          {/* Action Card 1: Fast MAC Disconnect / Ban */}
          <div className="bg-white rounded-xl p-5 border border-[#DCE9FF] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0B1C30] flex items-center gap-2">
                <Ban className="w-4 h-4 text-[#BA1A1A]" />
                <span>Instant Kick / MAC Blacklist</span>
              </h3>
            </div>
            <p className="text-xs text-[#3F4850]">
              Dispatches immediate RADIUS CoA disconnect packet (RFC 3576 / 5176) to subscriber gateway.
            </p>

            <form onSubmit={handleKickSubmit} className="flex flex-col gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-[#3F4850] uppercase tracking-wider mb-1">
                  TARGET MAC / IP
                </label>
                <input
                  type="text"
                  value={targetMacInput}
                  onChange={(e) => setTargetMacInput(e.target.value)}
                  placeholder="e.g. AA:BB:CC:11:22:33 or 10.240.x.x"
                  className="w-full px-3 py-1.5 bg-[#EFF4FF] border border-[#DCE9FF] font-mono text-xs text-[#0B1C30] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#BA1A1A]"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-[#3F4850] cursor-pointer">
                <input
                  type="checkbox"
                  checked={blacklistCheck}
                  onChange={(e) => setBlacklistCheck(e.target.checked)}
                  className="rounded text-[#BA1A1A] focus:ring-0"
                />
                <span>Add to Global Blacklist</span>
              </label>

              <button
                type="submit"
                className="w-full py-2 bg-[#BA1A1A] hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Disconnect Client Now</span>
              </button>
            </form>

            {kickFeedback && (
              <div className="p-2 rounded bg-[#FFDAD6] text-[#93000A] text-xs font-mono animate-in fade-in">
                {kickFeedback}
              </div>
            )}
          </div>

          {/* Action Card 2: Fast Voucher Verification */}
          <div className="bg-white rounded-xl p-5 border border-[#DCE9FF] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0B1C30] flex items-center gap-2">
                <Ticket className="w-4 h-4 text-[#006194]" />
                <span>Fast Voucher Lookup</span>
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#E5EEFF] text-[#006194] font-bold">
                SQL+REDIS
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={voucherLookupInput}
                onChange={(e) => setVoucherLookupInput(e.target.value)}
                placeholder="VOUCHER-XXXX-XXXX"
                className="flex-1 px-3 py-1.5 uppercase font-mono text-xs bg-[#EFF4FF] border border-[#DCE9FF] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006194]"
              />
              <button
                onClick={handleVoucherLookup}
                className="px-3 py-1.5 bg-[#006194] hover:bg-[#007BB9] text-white rounded-lg text-xs font-bold transition-colors"
              >
                Verify
              </button>
            </div>

            {voucherResult && (
              <div className="p-2.5 bg-[#EFF4FF] border border-[#DCE9FF] rounded-lg text-xs flex flex-col gap-1">
                <div className="flex justify-between font-semibold text-[#0B1C30]">
                  <span>Token: <strong className="font-mono text-[#006194]">{voucherResult.code}</strong></span>
                  <span className="text-[#00855B]">{voucherResult.status}</span>
                </div>
                <div className="text-[#3F4850] text-[11px]">Profile: {voucherResult.profile}</div>
                <div className="text-[#707881] text-[10px]">{voucherResult.created}</div>
              </div>
            )}
          </div>

          {/* Action Card 3: Live RADIUS Telemetry Event Ticker */}
          <div className="bg-white rounded-xl p-5 border border-[#DCE9FF] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0B1C30] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00855B] animate-ping"></span>
                <span>Live RADIUS Auth Feed</span>
              </h3>
              <span className="font-mono text-[10px] text-[#707881]">UDP 1812/1813</span>
            </div>

            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto custom-scrollbar">
              {radiusEvents.slice(0, 4).map((evt) => (
                <div key={evt.id} className="p-2.5 bg-[#EFF4FF] border border-[#DCE9FF] rounded-lg flex flex-col gap-0.5 text-xs">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span
                      className={`font-bold flex items-center gap-1 ${
                        evt.type === 'ACCESS-ACCEPT'
                          ? 'text-[#00855B]'
                          : evt.type === 'ACCESS-REJECT'
                          ? 'text-[#BA1A1A]'
                          : 'text-[#006194]'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" /> {evt.type}
                    </span>
                    <span className="text-[#707881]">{evt.time}</span>
                  </div>
                  <div className="font-mono text-[#0B1C30] text-[11px]">
                    User: <strong className="font-bold">{evt.user}</strong>
                  </div>
                  <div className="text-[#3F4850] text-[10px] truncate">{evt.details}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Infrastructure Hardware Quick Status Row */}
      <div className="bg-white rounded-xl p-5 border border-[#DCE9FF] shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[#0B1C30]">Active Gateway Fleet & Interconnects</h3>
            <p className="text-xs text-[#3F4850]">
              Real-time CPU load, temperature, active sessions, and MikroTik RouterOS / UniFi Controller API health
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {gateways.map((gw) => (
            <div key={gw.id} className="p-4 bg-[#EFF4FF] border border-[#DCE9FF] rounded-xl flex flex-col justify-between gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-[#0B1C30]">{gw.name}</span>
                  <div className="text-[11px] text-[#707881]">{gw.osVersion}</div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-[#00855B]" title="Online"></span>
              </div>
              <div className="flex items-center justify-between font-mono text-xs pt-1 border-t border-[#DCE9FF]">
                <span className="text-[#3F4850]">CPU: {gw.cpuLoad}%</span>
                <span className="text-[#3F4850]">Temp: {gw.temperature}°C</span>
                <span className="font-bold text-[#006194]">{gw.activeClients} Clients</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
