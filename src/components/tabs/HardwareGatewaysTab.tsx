import React, { useState } from 'react';
import { 
  Router, 
  PlusCircle, 
  Cable, 
  Terminal, 
  RotateCw, 
  Activity, 
  CheckCircle2, 
  ExternalLink, 
  Download, 
  Radio, 
  Radar, 
  Trash2,
  Sliders,
  Settings
} from 'lucide-react';
import { NasGateway, RadiusEvent } from '../../types';

interface HardwareGatewaysTabProps {
  gateways: NasGateway[];
  radiusEvents: RadiusEvent[];
  onOpenRegisterGatewayModal: () => void;
  onOpenCliModal: (gateway: NasGateway) => void;
  language: 'en' | 'sw';
}

export const HardwareGatewaysTab: React.FC<HardwareGatewaysTabProps> = ({
  gateways,
  radiusEvents,
  onOpenRegisterGatewayModal,
  onOpenCliModal,
  language,
}) => {
  const [selectedProbeTarget, setSelectedProbeTarget] = useState(gateways[0]?.ip || '192.168.10.1');
  const [probePort, setProbePort] = useState('3799');
  const [isProbing, setIsProbing] = useState(false);
  const [probeResult, setProbeResult] = useState<{
    status: string;
    rtt: string;
    active: boolean;
  }>({
    status: '192.168.10.1:3799 RESPONSIVE',
    rtt: '1.2ms RTT',
    active: true,
  });

  const [localEvents, setLocalEvents] = useState<RadiusEvent[]>(radiusEvents);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleRunProbe = () => {
    setIsProbing(true);
    setTimeout(() => {
      const ping = (Math.random() * 2.2 + 0.9).toFixed(1);
      setProbeResult({
        status: `${selectedProbeTarget}:${probePort} RESPONSIVE (ACK)`,
        rtt: `${ping}ms RTT`,
        active: true,
      });
      setIsProbing(false);
    }, 600);
  };

  const handleClearFeed = () => {
    setLocalEvents([]);
  };

  const handleForceSync = () => {
    setSyncFeedback('Synchronizing MikroTik firewall walled-garden & FreeRADIUS clients across 4 gateways...');
    setTimeout(() => {
      setSyncFeedback('All gateways synced successfully at ' + new Date().toLocaleTimeString());
      setTimeout(() => setSyncFeedback(null), 3000);
    }, 1200);
  };

  const handleExportRsc = () => {
    const rscScript = `# WimaFi Gateway OS - RouterOS Configuration Script
# Generated for: MikroTik RouterOS 7.x
# Target: FreeRADIUS AAA Integration (UDP 1812/1813)

/radius
add address=10.240.0.12 secret="WimaFiRadSecret2026!" service=hotspot authentication-port=1812 accounting-port=1813 timeout=3000ms

/radius incoming
set accept=yes port=3799

/ip hotspot profile
set [ find default=yes ] use-radius=yes radius-accounting=yes radius-interim-update=5m login-by=http-pap,http-chap,mac-cookie split-user-domain=no

/ip hotspot walled-garden
add comment="WimaFi Apple Captive Probe" dst-host=captive.apple.com
add comment="WimaFi Google Connectivity" dst-host=connectivitycheck.gstatic.com
add comment="WimaFi Payment Gateway Selcom" dst-host=*.selcom.net
add comment="WimaFi Payment Gateway AzamPay" dst-host=*.azampay.com
add comment="WimaFi M-Pesa Safaricom/Vodacom" dst-host=*.safaricom.co.ke

/ip hotspot user profile
add name="prof-24h" rate-limit="25M/10M 40M/20M 30s" shared-users=2 transparent-proxy=no
add name="prof-1h" rate-limit="10M/2M" shared-users=1
add name="prof-weekly" rate-limit="50M/20M" shared-users=3
`;
    const blob = new Blob([rscScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wimafi_mikrotik_config_${Date.now()}.rsc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col">
      {/* Top Command Context Bar */}
      <div className="px-6 py-3 bg-[#EFF4FF] border-b border-[#DCE9FF] flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#3F4850]">
            <span>Network Infrastructure</span>
            <span className="text-[#BFC7D2]">/</span>
            <span className="font-bold text-[#0B1C30]">Hardware & Gateways (NAS Hub)</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#DCE9FF] text-[#006194] font-mono text-[10px] font-bold">
            NAS CLUSTER ID #09-EAST
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-xl border border-[#DCE9FF] text-xs font-mono shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#00855B] animate-pulse"></span>
            <span className="text-[#3F4850] font-bold text-[10px] uppercase">RADIUS ENGINE:</span>
            <span className="text-[#00855B] font-bold">ONLINE (1812/1813)</span>
            <span className="text-[#BFC7D2]">|</span>
            <span className="text-[#006194] font-bold">2.4ms RTT</span>
          </div>

          <button
            onClick={onOpenRegisterGatewayModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#006194] hover:bg-[#007BB9] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === 'sw' ? 'Sajili Kipanga-njia Jipya' : 'Register New Gateway'}</span>
          </button>
        </div>
      </div>

      <div className="p-6 lg:p-8 flex flex-col gap-6">
        {/* Universal Protocol Interoperability Strip */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Cable className="w-4 h-4 text-[#006194]" />
              <span className="text-[11px] font-bold text-[#3F4850] uppercase tracking-wider">
                Hardware-Agnostic Vendor Protocol Bridges
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#707881]">
              RFC 2865 • RFC 2866 • RFC 3576 / 5176 CoA Enabled
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {/* MikroTik */}
            <div className="bg-white p-3 rounded-xl border border-[#DCE9FF] shadow-xs flex flex-col gap-1 transition-transform hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <span className="px-1.5 py-0.5 rounded bg-[#EFF4FF] text-[#0B1C30] font-mono text-[10px] font-bold">
                  MikroTik
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00855B]"></span>
              </div>
              <span className="text-xs font-bold text-[#0B1C30] truncate">RouterOS API + CoA</span>
              <span className="font-mono text-[10px] text-[#707881]">Port 8728 / 3799</span>
            </div>

            {/* Ubiquiti */}
            <div className="bg-white p-3 rounded-xl border border-[#DCE9FF] shadow-xs flex flex-col gap-1 transition-transform hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <span className="px-1.5 py-0.5 rounded bg-[#DCE9FF] text-[#006194] font-mono text-[10px] font-bold">
                  Ubiquiti
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00855B]"></span>
              </div>
              <span className="text-xs font-bold text-[#0B1C30] truncate">UniFi Controller API</span>
              <span className="font-mono text-[10px] text-[#707881]">v8.4.1 Gateway Bridge</span>
            </div>

            {/* Cisco */}
            <div className="bg-white p-3 rounded-xl border border-[#DCE9FF] shadow-xs flex flex-col gap-1 transition-transform hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <span className="px-1.5 py-0.5 rounded bg-[#EFF4FF] text-[#0051D5] font-mono text-[10px] font-bold">
                  Cisco ISG
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00855B]"></span>
              </div>
              <span className="text-xs font-bold text-[#0B1C30] truncate">Catalyst / WLC 9800</span>
              <span className="font-mono text-[10px] text-[#707881]">RFC 3576 CoA Disconnect</span>
            </div>

            {/* CoovaChilli */}
            <div className="bg-white p-3 rounded-xl border border-[#DCE9FF] shadow-xs flex flex-col gap-1 transition-transform hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <span className="px-1.5 py-0.5 rounded bg-[#E5EEFF] text-[#00855B] font-mono text-[10px] font-bold">
                  CoovaChilli
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00855B]"></span>
              </div>
              <span className="text-xs font-bold text-[#0B1C30] truncate">Hotspot Daemon</span>
              <span className="font-mono text-[10px] text-[#707881]">UAM Portal redirect</span>
            </div>

            {/* OpenWrt */}
            <div className="bg-white p-3 rounded-xl border border-[#DCE9FF] shadow-xs flex flex-col gap-1 transition-transform hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <span className="px-1.5 py-0.5 rounded bg-[#EFF4FF] text-[#0B1C30] font-mono text-[10px] font-bold">
                  OpenWrt
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00855B]"></span>
              </div>
              <span className="text-xs font-bold text-[#0B1C30] truncate">NoDogSplash / LuCI</span>
              <span className="font-mono text-[10px] text-[#707881]">Iptables Queue Forward</span>
            </div>

            {/* Standard AAA FreeRADIUS */}
            <div className="bg-white p-3 rounded-xl border border-[#DCE9FF] shadow-xs flex flex-col gap-1 transition-transform hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <span className="px-1.5 py-0.5 rounded bg-[#DCE9FF] text-[#006194] font-mono text-[10px] font-bold">
                  Standard AAA
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00855B]"></span>
              </div>
              <span className="text-xs font-bold text-[#0B1C30] truncate">FreeRADIUS v3.2</span>
              <span className="font-mono text-[10px] text-[#707881]">PAP / CHAP / MS-CHAP</span>
            </div>
          </div>
        </div>

        {/* Universal NAS Hardware Fleet Grid */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#0B1C30]">Universal NAS Hardware Fleet</h2>
              <span className="px-2.5 py-0.5 bg-[#CCE5FF] text-[#001D31] rounded-full text-xs font-bold">
                {gateways.length} Online / 0 Offline
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#3F4850] bg-white px-3 py-1 rounded-lg border border-[#DCE9FF]">
              <span>Aggregated Bandwidth:</span>
              <strong className="text-[#006194]">14.8 Gbps / 40 Gbps</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {gateways.map((gw) => (
              <div
                key={gw.id}
                className="bg-white rounded-xl p-5 border border-[#DCE9FF] shadow-xs flex flex-col justify-between relative group hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-[#707881] uppercase tracking-wider">
                        {gw.vendor === 'mikrotik'
                          ? 'Core Campus NAS'
                          : gw.vendor === 'ubiquiti'
                          ? 'Conference Center APs'
                          : gw.vendor === 'cisco'
                          ? 'Enterprise Tower NAS'
                          : 'Outdoor Food Court'}
                      </span>
                      <h3 className="text-sm font-bold text-[#0B1C30]">{gw.name}</h3>
                      <span className="font-mono text-[11px] text-[#707881] truncate">{gw.hardwareModel}</span>
                    </div>

                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E5EEFF] text-[#006947] font-mono text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00855B]"></span>
                      <span>{gw.rttMs}ms</span>
                    </span>
                  </div>

                  {/* Hardware Spec & Address Block */}
                  <div className="bg-[#EFF4FF] rounded-lg p-2.5 flex flex-col gap-1 font-mono text-xs border border-[#DCE9FF]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#707881]">IPv4 Address</span>
                      <span className="font-bold text-[#0B1C30]">{gw.ip}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#707881]">Protocol Hook</span>
                      <span className="text-[#006194] font-semibold">{gw.protocolHook}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#707881]">NAS Identifier</span>
                      <span className="text-[#0B1C30]">{gw.nasIdentifier}</span>
                    </div>
                  </div>

                  {/* Telemetry Gauges */}
                  <div className="grid grid-cols-2 gap-3 py-1">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#707881]">CPU Load</span>
                        <span className="font-bold text-[#0B1C30]">{gw.cpuLoad}%</span>
                      </div>
                      <div className="w-full bg-[#E5EEFF] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#006194] h-full" style={{ width: `${gw.cpuLoad}%` }}></div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#707881]">Memory</span>
                        <span className="font-bold text-[#0B1C30]">{gw.memoryUsage}%</span>
                      </div>
                      <div className="w-full bg-[#E5EEFF] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#0051D5] h-full" style={{ width: `${gw.memoryUsage}%` }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Active Hotspot Users counter */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-[#707881] uppercase">Active Hotspot Users</span>
                      <span className="text-2xl font-bold text-[#0B1C30] leading-none tabular-nums">
                        {gw.activeClients}
                      </span>
                    </div>
                    <div className="w-20 h-7 flex items-end gap-1">
                      <div className="flex-1 bg-[#DCE9FF] rounded-t" style={{ height: '35%' }}></div>
                      <div className="flex-1 bg-[#DCE9FF] rounded-t" style={{ height: '60%' }}></div>
                      <div className="flex-1 bg-[#DCE9FF] rounded-t" style={{ height: '45%' }}></div>
                      <div className="flex-1 bg-[#006194] rounded-t" style={{ height: '85%' }}></div>
                      <div className="flex-1 bg-[#006194] rounded-t" style={{ height: '90%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions Row */}
                <div className="flex items-center gap-1.5 pt-3 mt-3 border-t border-[#DCE9FF]">
                  <button
                    onClick={() => {
                      alert(`Synchronized RADIUS QoS bandwidth rules to ${gw.name} (${gw.ip}).`);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-[#EFF4FF] hover:bg-[#DCE9FF] text-[#0B1C30] hover:text-[#006194] text-xs font-bold transition-all"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Sync Rules</span>
                  </button>

                  <button
                    onClick={() => onOpenCliModal(gw)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-[#EFF4FF] hover:bg-[#DCE9FF] text-[#0B1C30] hover:text-[#006194] text-xs font-bold transition-all"
                    title="Open MikroTik CLI Terminal"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>ROS CLI</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Diagnostic Split: Live RADIUS AAA Event Stream & Hardware Probe */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Live Packet Telemetry Feed (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-xl p-5 border border-[#DCE9FF] shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#DCE9FF]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#EFF4FF] text-[#006194] flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-sm font-bold text-[#0B1C30]">Real-Time RADIUS AAA Event Stream</h4>
                  <span className="text-xs text-[#707881]">
                    Live UDP 1812 / 1813 authentication, authorization, and accounting trace
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearFeed}
                  className="px-2.5 py-1 bg-[#EFF4FF] hover:bg-[#DCE9FF] text-[#3F4850] rounded-lg text-xs font-bold transition-colors"
                >
                  Clear
                </button>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#E5EEFF] text-[#006947] rounded-lg font-mono text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00855B] animate-ping"></span>
                  <span>STREAMING</span>
                </div>
              </div>
            </div>

            {/* Visual Terminal Window */}
            <div className="rounded-xl bg-[#0F172A] text-[#EAF1FF] p-4 font-mono text-xs overflow-x-auto shadow-inner flex flex-col gap-2 min-h-[300px] border border-slate-800">
              <div className="flex items-center justify-between text-[#707881] text-[10px] pb-1 border-b border-slate-800">
                <span>PACKET PROTOCOL DISPATCHER v4.19</span>
                <span>NAS-PORT MAPPING: DYNAMIC</span>
              </div>

              <div className="flex flex-col gap-2 font-mono leading-tight">
                {localEvents.length === 0 ? (
                  <div className="text-slate-500 py-8 text-center">
                    Feed cleared. Listening for incoming RADIUS datagrams on UDP 1812/1813...
                  </div>
                ) : (
                  localEvents.map((evt) => (
                    <div key={evt.id} className="flex flex-wrap items-center gap-x-2 text-xs">
                      <span className="text-slate-400 font-mono text-[11px]">{evt.time}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          evt.type === 'ACCESS-ACCEPT'
                            ? 'bg-[#00855B] text-white'
                            : evt.type === 'ACCESS-REJECT'
                            ? 'bg-[#BA1A1A] text-white'
                            : 'bg-[#006194] text-white'
                        }`}
                      >
                        {evt.type}
                      </span>
                      <span className="text-[#93CCFF]">NAS: {evt.nasIp} ({evt.nasName})</span>
                      <span className="text-slate-300">User: "{evt.user}"</span>
                      <span className="text-slate-400">MAC: {evt.mac}</span>
                      <span className="text-emerald-400 ml-auto">{evt.details}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Metric row under stream */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-[#EFF4FF] p-3 rounded-lg flex flex-col border border-[#DCE9FF]">
                <span className="text-[10px] font-bold text-[#707881] uppercase">AUTH REQUEST RATE</span>
                <span className="font-mono text-[#0B1C30] font-bold text-sm">48.2 req / sec</span>
              </div>
              <div className="bg-[#EFF4FF] p-3 rounded-lg flex flex-col border border-[#DCE9FF]">
                <span className="text-[10px] font-bold text-[#707881] uppercase">SUCCESS RATIO</span>
                <span className="font-mono text-[#00855B] font-bold text-sm">99.84% (0 Rejects)</span>
              </div>
              <div className="bg-[#EFF4FF] p-3 rounded-lg flex flex-col border border-[#DCE9FF]">
                <span className="text-[10px] font-bold text-[#707881] uppercase">COA LATENCY SPREAD</span>
                <span className="font-mono text-[#006194] font-bold text-sm">1.8ms - 3.1ms</span>
              </div>
            </div>
          </div>

          {/* Quick NAS Maintenance & Ping Tester (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Live Ping & Socket Tester */}
            <div className="bg-white rounded-xl p-5 border border-[#DCE9FF] shadow-xs flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Radar className="w-5 h-5 text-[#006194]" />
                <h4 className="text-sm font-bold text-[#0B1C30]">Hardware Connectivity Probe</h4>
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#3F4850]">Select NAS Target</label>
                  <select
                    value={selectedProbeTarget}
                    onChange={(e) => setSelectedProbeTarget(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-[#EFF4FF] border border-[#DCE9FF] text-xs font-mono text-[#0B1C30] focus:outline-none"
                  >
                    {gateways.map((g) => (
                      <option key={g.id} value={g.ip}>{g.ip} - {g.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#3F4850]">Port Target</label>
                    <input
                      type="text"
                      value={probePort}
                      onChange={(e) => setProbePort(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-[#EFF4FF] border border-[#DCE9FF] text-xs font-mono text-[#0B1C30] focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#3F4850]">Protocol</label>
                    <div className="h-9 px-3 rounded-lg bg-[#EFF4FF] border border-[#DCE9FF] text-xs font-mono text-[#3F4850] flex items-center">
                      UDP Datagram
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleRunProbe}
                  disabled={isProbing}
                  className="w-full py-2 bg-[#006194] hover:bg-[#007BB9] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 mt-1"
                >
                  <Radar className={`w-4 h-4 ${isProbing ? 'animate-spin' : ''}`} />
                  <span>{isProbing ? 'Probing Socket...' : 'Send ICMP / RADIUS Echo Packet'}</span>
                </button>

                <div className="p-3 bg-[#EFF4FF] border border-[#DCE9FF] rounded-lg flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00855B]"></span>
                    <span className="font-bold text-[#0B1C30] truncate">{probeResult.status}</span>
                  </div>
                  <span className="text-[#00855B] font-bold">{probeResult.rtt}</span>
                </div>
              </div>
            </div>

            {/* Vendor Backup & Firmware Policy Card */}
            <div className="bg-white rounded-xl p-5 border border-[#DCE9FF] shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#707881] uppercase tracking-wider">
                  Automated Configuration Sync
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#E5EEFF] text-[#006947] text-[10px] font-mono font-bold">
                  Synced 10m ago
                </span>
              </div>

              <p className="text-xs text-[#3F4850]">
                Universal NAS configs, Hotspot captive redirect firewall rules, and FreeRADIUS authentication profiles are mirrored across all {gateways.length} gateways.
              </p>

              {syncFeedback && (
                <div className="p-2 rounded bg-[#E5EEFF] text-[#006947] text-xs font-semibold animate-in fade-in">
                  {syncFeedback}
                </div>
              )}

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={handleForceSync}
                  className="flex-1 px-3 py-2 bg-[#EFF4FF] hover:bg-[#DCE9FF] text-[#0B1C30] rounded-lg text-xs font-bold transition-colors"
                >
                  Force Cluster Re-Sync
                </button>
                <button
                  onClick={handleExportRsc}
                  className="flex-1 px-3 py-2 bg-[#EFF4FF] hover:bg-[#DCE9FF] text-[#006194] rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export RSC / Tar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
