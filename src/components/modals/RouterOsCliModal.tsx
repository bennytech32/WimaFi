import React, { useState, useRef, useEffect } from 'react';
import { Terminal, X, ArrowRight } from 'lucide-react';
import { NasGateway } from '../../types';

interface RouterOsCliModalProps {
  gateway: NasGateway | null;
  onClose: () => void;
}

export const RouterOsCliModal: React.FC<RouterOsCliModalProps> = ({
  gateway,
  onClose,
}) => {
  const [history, setHistory] = useState<Array<{ command: string; output: string }>>([
    {
      command: '/system resource print',
      output: `                   uptime: 48d14h22m19s
                  version: 7.15 (stable)
               build-time: May/28/2026 11:42:01
         factory-software: 7.8
              free-memory: 3.2GiB
             total-memory: 4.0GiB
                      cpu: ARM64-Annapurna
                cpu-count: 4
            cpu-frequency: 1700MHz
                 cpu-load: 24%
           free-hdd-space: 112.4MiB
          total-hdd-space: 128.0MiB
  write-sect-since-reboot: 941092
         write-sect-total: 3108922
               bad-blocks: 0%
        architecture-name: arm64
               board-name: CCR2004-16G-2S+`,
    },
    {
      command: '/radius print',
      output: `Flags: X - disabled, D - dynamic 
 0   service=hotspot address=10.240.0.12 timeout=3s 
     accounting-port=1813 authentication-port=1812 secret="WimaFiRadSecret2026!" 
     realm="" called-id="" domain="" comment="WimaFi FreeRADIUS AAA"`,
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!gateway) return null;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    let output = '';
    const lower = cmd.toLowerCase();

    if (lower.includes('resource')) {
      output = `uptime: ${gateway.uptime} • cpu-load: ${gateway.cpuLoad}% • memory: ${gateway.memoryUsage}%`;
    } else if (lower.includes('hotspot active') || lower.includes('active print')) {
      output = `Flags: R - radius, B - blocked
 0 R server=hotspot1 user="MacBookPro-David" address=10.240.4.118 mac=D8:3B:BF:74:2A:90 uptime=4h19m bytes-in=12.1GiB
 1 R server=hotspot1 user="iPhone-Sarah-W" address=10.240.4.152 mac=4A:EE:89:12:F1:C0 uptime=5h12m bytes-in=2.1GiB
 2 R server=hotspot1 user="Galaxy-S23" address=10.240.5.210 mac=82:20:9C:B5:10:7E uptime=18m bytes-in=650MiB`;
    } else if (lower.includes('hotspot user') || lower.includes('user print')) {
      output = `Flags: X - disabled, D - dynamic 
 0 R name="WIMA-9214-KR" profile="prof-24h" uptime=0s (Active in Cache)
 1 R name="WIMA-7731-BQ" profile="prof-24h" uptime=0s (Unredeemed)
 2 R name="WIMA-4819-PL" profile="prof-24h" uptime=0s (Unredeemed)`;
    } else if (lower.includes('ping')) {
      output = `  SEQ HOST                                     SIZE TTL TIME  STATUS
    0 10.240.0.12                              56  64 1.2ms
    1 10.240.0.12                              56  64 1.1ms
    2 10.240.0.12                              56  64 1.3ms
    sent=3 received=3 packet-loss=0% min-rtt=1.1ms avg-rtt=1.2ms max-rtt=1.3ms`;
    } else if (lower.includes('help') || lower === '?') {
      output = `Supported quick commands:
  /system resource print
  /ip hotspot active print
  /ip hotspot user print
  /radius print
  /ping 10.240.0.12
  clear`;
    } else if (lower === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    } else {
      output = `syntax error (evaluating "${cmd}") - type 'help' for examples.`;
    }

    setHistory((prev) => [...prev, { command: cmd, output }]);
    setInputVal('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#0F172A] rounded-2xl shadow-2xl flex flex-col h-[520px] border border-slate-800 animate-in zoom-in-95 duration-150 overflow-hidden font-mono text-xs">
        {/* CLI Window Titlebar */}
        <div className="h-10 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">
              [admin@{gateway.nasIdentifier}] &gt; MikroTik RouterOS Terminal
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Console output */}
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-3 text-slate-200">
          <div className="text-slate-400 text-[11px] pb-1 border-b border-slate-800">
            MikroTik RouterOS v7.15 on {gateway.hardwareModel} ({gateway.ip}) • Type 'help' for commands.
          </div>

          {history.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-emerald-400">
                <span>[admin@{gateway.nasIdentifier}] &gt;</span>
                <span className="text-white font-bold">{item.command}</span>
              </div>
              <pre className="text-slate-300 text-[11px] whitespace-pre-wrap pl-2 leading-relaxed">
                {item.output}
              </pre>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input line */}
        <form onSubmit={handleCommand} className="h-12 px-4 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <span className="text-emerald-400 shrink-0 font-bold">
            [admin@{gateway.nasIdentifier}] &gt;
          </span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="/ip hotspot active print"
            autoFocus
            className="flex-1 bg-transparent text-white focus:outline-none font-mono text-xs"
          />
        </form>
      </div>
    </div>
  );
};
