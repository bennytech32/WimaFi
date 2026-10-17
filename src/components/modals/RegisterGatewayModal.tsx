import React, { useState } from 'react';
import { Router, X, Eye, EyeOff, Radio, CheckCircle2 } from 'lucide-react';
import { NasGateway, NasVendor } from '../../types';

interface RegisterGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (gateway: NasGateway) => void;
}

export const RegisterGatewayModal: React.FC<RegisterGatewayModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [vendor, setVendor] = useState<NasVendor>('mikrotik');
  const [nasIdentifier, setNasIdentifier] = useState('MK-NORTH-CORE02');
  const [ip, setIp] = useState('192.168.40.1');
  const [secret, setSecret] = useState('RadiusSecr3t2026!');
  const [showSecret, setShowSecret] = useState(false);
  const [authPort, setAuthPort] = useState(1812);
  const [acctPort, setAcctPort] = useState(1813);
  const [coaPort, setCoaPort] = useState(3799);
  const [enableCoA, setEnableCoA] = useState(true);
  const [localFallback, setLocalFallback] = useState(true);

  const [testState, setTestState] = useState<'idle' | 'testing' | 'success'>('idle');

  if (!isOpen) return null;

  const handleTestSocket = () => {
    setTestState('testing');
    setTimeout(() => {
      setTestState('success');
      setTimeout(() => setTestState('idle'), 3000);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGw: NasGateway = {
      id: `gw-${Date.now()}`,
      name: nasIdentifier,
      vendor: vendor,
      vendorLabel: vendor === 'mikrotik' ? 'MikroTik' : vendor === 'ubiquiti' ? 'Ubiquiti' : vendor === 'cisco' ? 'Cisco ISG' : 'OpenWrt',
      hardwareModel: vendor === 'mikrotik' ? 'CCR2004-16G-2S+' : 'UniFi Gateway Max',
      osVersion: vendor === 'mikrotik' ? 'RouterOS v7.15' : 'UniFi OS v3.2',
      ip: ip,
      protocolHook: vendor === 'mikrotik' ? 'RouterOS API + CoA' : 'RFC 3576 Disconnect',
      nasIdentifier: nasIdentifier,
      cpuLoad: Math.floor(Math.random() * 15 + 10),
      temperature: 41,
      memoryUsage: 30,
      activeClients: 0,
      status: 'online',
      rttMs: 1.4,
      uptime: '1d 02h 10m',
      secret: secret,
      authPort: Number(authPort),
      acctPort: Number(acctPort),
      coaPort: Number(coaPort),
      coAEnabled: enableCoA,
      localFallback: localFallback,
    };
    onSave(newGw);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-6 flex flex-col gap-5 animate-in zoom-in-95 duration-150 border border-[#DCE9FF]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#DCE9FF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EFF4FF] flex items-center justify-center text-[#006194]">
              <Router className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0B1C30]">
                Register Hardware Gateway / NAS
              </h3>
              <p className="text-xs text-[#707881]">
                Universal AAA & Hotspot Equipment Integration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#707881] hover:text-[#0B1C30] hover:bg-[#EFF4FF]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-[#0B1C30]">Equipment Vendor Driver</label>
              <select
                value={vendor}
                onChange={(e) => setVendor(e.target.value as any)}
                className="w-full h-9 px-3 rounded-lg bg-[#EFF4FF] border border-[#DCE9FF] text-xs font-semibold text-[#0B1C30] focus:outline-none"
              >
                <option value="mikrotik">MikroTik RouterOS (API + CoA)</option>
                <option value="ubiquiti">Ubiquiti UniFi (OS v3+ / Portal API)</option>
                <option value="cisco">Cisco Catalyst / WLC (RFC 3576 CoA)</option>
                <option value="openwrt">OpenWrt / CoovaChilli Hotspot</option>
                <option value="generic">Generic RFC 2865 RADIUS Gateway</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-[#0B1C30]">NAS Identifier (Unique)</label>
              <input
                type="text"
                value={nasIdentifier}
                onChange={(e) => setNasIdentifier(e.target.value)}
                placeholder="e.g. MK-NORTH-CORE02"
                required
                className="w-full h-9 px-3 rounded-lg bg-[#EFF4FF] border border-[#DCE9FF] text-xs font-mono text-[#0B1C30] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-[#0B1C30]">Gateway IP / Hostname</label>
              <input
                type="text"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="192.168.1.1 or nas.local"
                required
                className="w-full h-9 px-3 rounded-lg bg-[#EFF4FF] border border-[#DCE9FF] text-xs font-mono text-[#0B1C30] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-[#0B1C30]">RADIUS Shared Secret</label>
              <div className="relative">
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  required
                  className="w-full h-9 pl-3 pr-8 rounded-lg bg-[#EFF4FF] border border-[#DCE9FF] text-xs font-mono text-[#0B1C30] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#707881] hover:text-[#0B1C30]"
                >
                  {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Ports config */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-[#0B1C30]">Auth UDP</label>
              <input
                type="number"
                value={authPort}
                onChange={(e) => setAuthPort(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-lg bg-[#EFF4FF] border border-[#DCE9FF] text-xs font-mono text-[#0B1C30] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-[#0B1C30]">Acct UDP</label>
              <input
                type="number"
                value={acctPort}
                onChange={(e) => setAcctPort(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-lg bg-[#EFF4FF] border border-[#DCE9FF] text-xs font-mono text-[#0B1C30] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-[#0B1C30]">CoA / Disconnect</label>
              <input
                type="number"
                value={coaPort}
                onChange={(e) => setCoaPort(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-lg bg-[#EFF4FF] border border-[#DCE9FF] text-xs font-mono text-[#0B1C30] focus:outline-none"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="bg-[#EFF4FF] p-3 rounded-xl border border-[#DCE9FF] flex flex-col gap-2">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex flex-col">
                <span className="font-bold text-[#0B1C30]">Enable CoA Disconnect Support (RFC 3576)</span>
                <span className="text-[11px] text-[#707881]">Allows billing core to kick expired subscribers instantly</span>
              </div>
              <input
                type="checkbox"
                checked={enableCoA}
                onChange={(e) => setEnableCoA(e.target.checked)}
                className="w-4 h-4 text-[#006194] rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer pt-1 border-t border-[#DCE9FF]">
              <div className="flex flex-col">
                <span className="font-bold text-[#0B1C30]">Local Fallback Captive Portal</span>
                <span className="text-[11px] text-[#707881]">Host offline splash if WAN connection drops</span>
              </div>
              <input
                type="checkbox"
                checked={localFallback}
                onChange={(e) => setLocalFallback(e.target.checked)}
                className="w-4 h-4 text-[#006194] rounded"
              />
            </label>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleTestSocket}
              disabled={testState === 'testing'}
              className="px-3.5 py-2 rounded-xl bg-[#EFF4FF] hover:bg-[#DCE9FF] text-[#006194] font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Radio className={`w-3.5 h-3.5 ${testState === 'testing' ? 'animate-spin' : ''}`} />
              <span>
                {testState === 'testing'
                  ? 'Testing Socket...'
                  : testState === 'success'
                  ? 'Reachable (1.4ms OK)'
                  : 'Test Connection Socket'}
              </span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#EFF4FF] hover:bg-[#DCE9FF] text-[#3F4850] font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#006194] hover:bg-[#007BB9] text-white font-bold text-xs shadow-sm transition-all"
              >
                Save & Bind NAS
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
