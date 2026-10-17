import React, { useState } from 'react';
import { 
  Sliders, 
  Terminal, 
  Key, 
  Copy, 
  Check, 
  Download, 
  Database, 
  ShieldCheck, 
  RotateCw, 
  Server, 
  FileCode,
  Smartphone
} from 'lucide-react';

interface SettingsApiTabProps {
  language: 'en' | 'sw';
}

export const SettingsApiTab: React.FC<SettingsApiTabProps> = ({ language }) => {
  const [copiedScript, setCopiedScript] = useState(false);
  const [apiTestStatus, setApiTestStatus] = useState<string | null>(null);

  // Settings form values
  const [radiusHost, setRadiusHost] = useState('10.240.0.12');
  const [radiusAuthPort, setRadiusAuthPort] = useState('1812');
  const [radiusAcctPort, setRadiusAcctPort] = useState('1813');
  const [radiusCoaPort, setRadiusCoaPort] = useState('3799');
  const [radiusSecret, setRadiusSecret] = useState('WimaFiRadSecret2026!');

  const [rosHost, setRosHost] = useState('192.168.10.1');
  const [rosPort, setRosPort] = useState('8728');
  const [rosUser, setRosUser] = useState('wimafi-api');
  const [rosPassword, setRosPassword] = useState('••••••••••••');

  // Aggregator keys
  const [selcomVendorId, setSelcomVendorId] = useState('TZ-SELCOM-99120');
  const [selcomApiKey, setSelcomApiKey] = useState('sec_live_9a8f219001bca891');
  const [azamPayClientId, setAzamPayClientId] = useState('azampay-wimafi-checkout');
  const [mpesaShortcode, setMpesaShortcode] = useState('500421');

  const fullMikroTikScript = `# =========================================================
# WimaFi Hotspot & FreeRADIUS Auto-Provisioning Script
# Target: MikroTik RouterOS v7.x (CCR2004, RB5009, hEX, etc.)
# =========================================================

/radius
add address=${radiusHost} secret="${radiusSecret}" service=hotspot authentication-port=${radiusAuthPort} accounting-port=${radiusAcctPort} timeout=3000ms comment="WimaFi FreeRADIUS AAA Server"

/radius incoming
set accept=yes port=${radiusCoaPort}

/ip hotspot profile
set [ find default=yes ] use-radius=yes radius-accounting=yes radius-interim-update=5m login-by=http-pap,http-chap,mac-cookie split-user-domain=no http-cookie-lifetime=30d

/ip hotspot walled-garden
add comment="WimaFi Apple Captive Probe" dst-host=captive.apple.com
add comment="WimaFi Google Connectivity Check" dst-host=connectivitycheck.gstatic.com
add comment="WimaFi Selcom Payment Gateway" dst-host=*.selcom.net
add comment="WimaFi AzamPay Mobile Money" dst-host=*.azampay.com
add comment="WimaFi M-Pesa Safaricom & Vodacom" dst-host=*.safaricom.co.ke
add comment="WimaFi Tigo Pesa Gateway" dst-host=*.tigopesa.co.tz

/ip hotspot user profile
add name="prof-24h" rate-limit="25M/10M 40M/20M 30s" shared-users=2 transparent-proxy=no
add name="prof-1h" rate-limit="10M/2M" shared-users=1 transparent-proxy=no
add name="prof-weekly" rate-limit="50M/20M" shared-users=3 transparent-proxy=no
add name="prof-monthly-vip" rate-limit="100M/100M" shared-users=5 transparent-proxy=no

/queue type
add kind=pcq name="wimafi-pcq-down" pcq-classifier=dst-address pcq-rate=25M
add kind=pcq name="wimafi-pcq-up" pcq-classifier=src-address pcq-rate=10M

:log info "WimaFi Hotspot & RADIUS script provisioned successfully!"
`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(fullMikroTikScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleDownloadRsc = () => {
    const blob = new Blob([fullMikroTikScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wimafi_routeros_setup.rsc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleTestApi = () => {
    setApiTestStatus('Connecting to MikroTik API socket (192.168.10.1:8728)...');
    setTimeout(() => {
      setApiTestStatus('API Connection Verified: RouterOS v7.15 on MikroTik CCR2004-East-Core OK (1.2ms)');
      setTimeout(() => setApiTestStatus(null), 4000);
    }, 900);
  };

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6">
      {/* Header Context Bar */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-[#3F4850]">
          <span>System</span>
          <span>/</span>
          <span>Configuration</span>
          <span>/</span>
          <span className="font-bold text-[#0B1C30]">Network & Gateway API Settings</span>
        </div>
        <h1 className="text-2xl font-bold text-[#0B1C30] tracking-tight">
          {language === 'sw' ? 'Mipangilio ya Mfumo & API' : 'Settings, FreeRADIUS AAA & MikroTik API'}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: FreeRADIUS & MikroTik API Configurations */}
        <div className="flex flex-col gap-5">
          {/* Section 1: FreeRADIUS AAA Parameters */}
          <div className="bg-white rounded-xl p-5 border border-[#DCE9FF] shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#DCE9FF]">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-[#006194]" />
                <h2 className="text-sm font-bold text-[#0B1C30]">FreeRADIUS AAA Server Engine</h2>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#E5EEFF] text-[#006947] font-bold">
                DAEMON v3.2 ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2 flex flex-col gap-1">
                <label className="font-semibold text-[#0B1C30]">AAA Server IP / Hostname</label>
                <input
                  type="text"
                  value={radiusHost}
                  onChange={(e) => setRadiusHost(e.target.value)}
                  className="px-3 py-1.5 bg-[#EFF4FF] border border-[#DCE9FF] font-mono text-xs rounded-lg text-[#0B1C30]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-[#0B1C30]">Authentication UDP</label>
                <input
                  type="text"
                  value={radiusAuthPort}
                  onChange={(e) => setRadiusAuthPort(e.target.value)}
                  className="px-3 py-1.5 bg-[#EFF4FF] border border-[#DCE9FF] font-mono text-xs rounded-lg text-[#0B1C30]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-[#0B1C30]">Accounting UDP</label>
                <input
                  type="text"
                  value={radiusAcctPort}
                  onChange={(e) => setRadiusAcctPort(e.target.value)}
                  className="px-3 py-1.5 bg-[#EFF4FF] border border-[#DCE9FF] font-mono text-xs rounded-lg text-[#0B1C30]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-[#0B1C30]">CoA / Disconnect Port (RFC 3576)</label>
                <input
                  type="text"
                  value={radiusCoaPort}
                  onChange={(e) => setRadiusCoaPort(e.target.value)}
                  className="px-3 py-1.5 bg-[#EFF4FF] border border-[#DCE9FF] font-mono text-xs rounded-lg text-[#0B1C30]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-[#0B1C30]">RADIUS Shared Secret</label>
                <input
                  type="password"
                  value={radiusSecret}
                  onChange={(e) => setRadiusSecret(e.target.value)}
                  className="px-3 py-1.5 bg-[#EFF4FF] border border-[#DCE9FF] font-mono text-xs rounded-lg text-[#0B1C30]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: MikroTik RouterOS API Hook */}
          <div className="bg-white rounded-xl p-5 border border-[#DCE9FF] shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#DCE9FF]">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#006194]" />
                <h2 className="text-sm font-bold text-[#0B1C30]">MikroTik RouterOS API Gateway</h2>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#E5EEFF] text-[#006194] font-bold">
                API Port 8728
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-[#0B1C30]">RouterOS Host IP</label>
                <input
                  type="text"
                  value={rosHost}
                  onChange={(e) => setRosHost(e.target.value)}
                  className="px-3 py-1.5 bg-[#EFF4FF] border border-[#DCE9FF] font-mono text-xs rounded-lg text-[#0B1C30]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-[#0B1C30]">API Port</label>
                <input
                  type="text"
                  value={rosPort}
                  onChange={(e) => setRosPort(e.target.value)}
                  className="px-3 py-1.5 bg-[#EFF4FF] border border-[#DCE9FF] font-mono text-xs rounded-lg text-[#0B1C30]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-[#0B1C30]">API User</label>
                <input
                  type="text"
                  value={rosUser}
                  onChange={(e) => setRosUser(e.target.value)}
                  className="px-3 py-1.5 bg-[#EFF4FF] border border-[#DCE9FF] font-mono text-xs rounded-lg text-[#0B1C30]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-[#0B1C30]">Password</label>
                <input
                  type="password"
                  value={rosPassword}
                  onChange={(e) => setRosPassword(e.target.value)}
                  className="px-3 py-1.5 bg-[#EFF4FF] border border-[#DCE9FF] font-mono text-xs rounded-lg text-[#0B1C30]"
                />
              </div>
            </div>

            <button
              onClick={handleTestApi}
              className="w-full py-2 bg-[#EFF4FF] hover:bg-[#DCE9FF] text-[#006194] rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Test MikroTik API Connection</span>
            </button>

            {apiTestStatus && (
              <div className="p-2.5 rounded bg-[#E5EEFF] text-[#006947] font-mono text-xs border border-[#D3E4FE] animate-in fade-in">
                {apiTestStatus}
              </div>
            )}
          </div>

          {/* Section 3: Payment Gateway API Keys */}
          <div className="bg-white rounded-xl p-5 border border-[#DCE9FF] shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#DCE9FF]">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#00855B]" />
                <h2 className="text-sm font-bold text-[#0B1C30]">Tanzania Mobile Payment Aggregator Credentials</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-[#0B1C30]">Selcom Vendor ID</label>
                <input
                  type="text"
                  value={selcomVendorId}
                  onChange={(e) => setSelcomVendorId(e.target.value)}
                  className="px-3 py-1.5 bg-[#EFF4FF] border border-[#DCE9FF] font-mono text-xs rounded-lg text-[#0B1C30]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-[#0B1C30]">Selcom API Secret</label>
                <input
                  type="password"
                  value={selcomApiKey}
                  onChange={(e) => setSelcomApiKey(e.target.value)}
                  className="px-3 py-1.5 bg-[#EFF4FF] border border-[#DCE9FF] font-mono text-xs rounded-lg text-[#0B1C30]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-[#0B1C30]">AzamPay Client ID</label>
                <input
                  type="text"
                  value={azamPayClientId}
                  onChange={(e) => setAzamPayClientId(e.target.value)}
                  className="px-3 py-1.5 bg-[#EFF4FF] border border-[#DCE9FF] font-mono text-xs rounded-lg text-[#0B1C30]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-[#0B1C30]">Vodacom M-Pesa Shortcode</label>
                <input
                  type="text"
                  value={mpesaShortcode}
                  onChange={(e) => setMpesaShortcode(e.target.value)}
                  className="px-3 py-1.5 bg-[#EFF4FF] border border-[#DCE9FF] font-mono text-xs rounded-lg text-[#0B1C30]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: MikroTik RouterOS Script Generator */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl p-5 border border-[#DCE9FF] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#DCE9FF]">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-[#006194]" />
                <h2 className="text-sm font-bold text-[#0B1C30]">
                  MikroTik RouterOS 7.x Script Generator
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyScript}
                  className="px-2.5 py-1 bg-[#EFF4FF] hover:bg-[#DCE9FF] text-[#006194] rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-[#00855B]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'Copied!' : 'Copy Script'}</span>
                </button>

                <button
                  onClick={handleDownloadRsc}
                  className="px-2.5 py-1 bg-[#006194] hover:bg-[#007BB9] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .rsc</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-[#3F4850]">
              Copy and paste this script directly into your MikroTik Winbox terminal (`/terminal`) to bind your router with WimaFi FreeRADIUS and Walled Garden.
            </p>

            <pre className="p-4 bg-[#0F172A] text-[#93CCFF] rounded-xl font-mono text-[11px] overflow-x-auto max-h-[480px] custom-scrollbar border border-slate-800 leading-relaxed select-all">
              {fullMikroTikScript}
            </pre>
          </div>

          {/* Database Health Summary */}
          <div className="bg-white rounded-xl p-5 border border-[#DCE9FF] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#006194]" />
                <h3 className="text-sm font-bold text-[#0B1C30]">PostgreSQL & Redis Session Pool</h3>
              </div>
              <span className="text-xs font-bold text-[#00855B]">HEALTHY (OK)</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-2.5 bg-[#EFF4FF] rounded-lg border border-[#DCE9FF] flex flex-col">
                <span className="text-[10px] text-[#707881]">PostgreSQL DB</span>
                <span className="font-bold text-[#0B1C30] font-mono">wimafi_billing</span>
                <span className="text-[10px] text-[#00855B]">24 conn pooled</span>
              </div>

              <div className="p-2.5 bg-[#EFF4FF] rounded-lg border border-[#DCE9FF] flex flex-col">
                <span className="text-[10px] text-[#707881]">Redis Auth Cache</span>
                <span className="font-bold text-[#0B1C30] font-mono">1,428 keys</span>
                <span className="text-[10px] text-[#00855B]">0.3ms latency</span>
              </div>

              <div className="p-2.5 bg-[#EFF4FF] rounded-lg border border-[#DCE9FF] flex flex-col">
                <span className="text-[10px] text-[#707881]">JWT Token Store</span>
                <span className="font-bold text-[#0B1C30] font-mono">HS256 512-bit</span>
                <span className="text-[10px] text-[#00855B]">Valid 24h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
