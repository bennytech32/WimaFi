import React from 'react';
import { 
  LayoutDashboard, 
  Ticket, 
  Router, 
  Receipt, 
  Globe, 
  Sliders, 
  Wifi, 
  ExternalLink,
  Languages
} from 'lucide-react';

export type TabId = 
  | 'overview' 
  | 'plans' 
  | 'hardware' 
  | 'billing' 
  | 'captive-portal' 
  | 'settings';

interface NavigationSidebarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  activeLeases: number;
  totalLeases: number;
  language: 'en' | 'sw';
  onToggleLanguage: () => void;
  onOpenLivePortalModal: () => void;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  activeTab,
  onSelectTab,
  activeLeases,
  totalLeases,
  language,
  onToggleLanguage,
  onOpenLivePortalModal,
}) => {
  const leasePercent = Math.round((activeLeases / totalLeases) * 100);

  const navItems = [
    {
      id: 'overview' as TabId,
      labelEn: 'Overview & Sessions',
      labelSw: 'Muhtasari & Vipindi',
      icon: LayoutDashboard,
    },
    {
      id: 'plans' as TabId,
      labelEn: 'Plans & Vouchers',
      labelSw: 'Mabando & Vocha',
      icon: Ticket,
    },
    {
      id: 'hardware' as TabId,
      labelEn: 'Hardware & Gateways',
      labelSw: 'Vifaa & Vipanga-njia (NAS)',
      icon: Router,
    },
    {
      id: 'billing' as TabId,
      labelEn: 'Billing & Invoices',
      labelSw: 'Malipo & M-Pesa USSD',
      icon: Receipt,
    },
    {
      id: 'captive-portal' as TabId,
      labelEn: 'Captive Portal',
      labelSw: 'Ukurasa wa Wateja (Portal)',
      icon: Globe,
    },
    {
      id: 'settings' as TabId,
      labelEn: 'Settings & API',
      labelSw: 'Mipangilio & MikroTik API',
      icon: Sliders,
    },
  ];

  return (
    <aside className="w-64 bg-[#EFF4FF] border-r border-[#DCE9FF] flex flex-col justify-between shrink-0 select-none min-h-screen">
      {/* Top Header & Brand */}
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center gap-3 bg-white border-b border-[#DCE9FF]">
          <div className="w-9 h-9 rounded-xl bg-[#006194] flex items-center justify-center text-white shadow-sm shadow-[#006194]/20">
            <Wifi className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-[#0B1C30] tracking-tight">WimaFi</span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#E5EEFF] text-[#006194] tracking-wider">
                CORE
              </span>
            </div>
            <span className="text-[10px] uppercase font-semibold text-[#3F4850] tracking-wider">
              Gateway OS v4.19
            </span>
          </div>
        </div>

        {/* RADIUS AAA Active Status Pill */}
        <div className="px-4 py-2.5">
          <div className="bg-[#DCE9FF] rounded-lg px-3 py-2 flex items-center justify-between border border-[#D3E4FE]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00855B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00855B]"></span>
              </span>
              <span className="text-[11px] font-bold text-[#0B1C30] uppercase tracking-wider">
                RADIUS AAA Active
              </span>
            </div>
            <span className="font-mono text-[11px] font-semibold text-[#006194]">
              v4.19
            </span>
          </div>
        </div>

        {/* Main Navigation Items */}
        <nav className="flex flex-col gap-1 px-3 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const label = language === 'sw' ? item.labelSw : item.labelEn;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all text-xs font-semibold ${
                  isActive
                    ? 'bg-[#006194] text-white shadow-sm shadow-[#006194]/25'
                    : 'text-[#3F4850] hover:bg-[#DCE9FF] hover:text-[#0B1C30]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#707881]'}`} />
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Launch Customer Splash / Captive Portal Button */}
        <div className="px-3 mt-4">
          <button
            onClick={onOpenLivePortalModal}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white hover:bg-[#DCE9FF] border border-[#BFC7D2] text-[#006194] text-xs font-semibold transition-colors group shadow-xs"
            title="Open customer splash portal simulator"
          >
            <div className="flex items-center gap-2 truncate">
              <Globe className="w-3.5 h-3.5 text-[#006194]" />
              <span className="truncate">
                {language === 'sw' ? 'Fungua Splash Portal' : 'Launch Guest Splash'}
              </span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[#707881] group-hover:text-[#006194] shrink-0" />
          </button>
        </div>
      </div>

      {/* Bottom Area: Active Leases + Language Toggle */}
      <div className="p-3 flex flex-col gap-2.5">
        {/* DHCP Pool Leases Capacity Gauge */}
        <div className="p-3.5 rounded-xl bg-white border border-[#DCE9FF] shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-[#3F4850] uppercase tracking-wider">
              {language === 'sw' ? 'WATEJA HEWANI' : 'ACTIVE LEASES'}
            </span>
            <span className="font-mono text-xs font-bold text-[#006194]">
              {activeLeases.toLocaleString()} / {totalLeases.toLocaleString()}
            </span>
          </div>

          <div className="w-full bg-[#E5EEFF] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#006194] h-full rounded-full transition-all duration-500"
              style={{ width: `${leasePercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#3F4850]">
            <span>DHCP Pool 1 (Core)</span>
            <span className="text-[#006947] font-semibold">{leasePercent}% Capacity</span>
          </div>
        </div>

        {/* Language switch */}
        <div className="flex items-center justify-between px-2 py-1 bg-white/70 rounded-lg border border-[#DCE9FF] text-xs">
          <div className="flex items-center gap-1.5 text-[#3F4850]">
            <Languages className="w-3.5 h-3.5 text-[#006194]" />
            <span className="text-[11px] font-medium">Lugha / Language</span>
          </div>
          <button
            onClick={onToggleLanguage}
            className="px-2 py-0.5 rounded bg-[#E5EEFF] hover:bg-[#DCE9FF] text-[#006194] font-bold text-[10px] uppercase transition-colors"
          >
            {language === 'sw' ? '🇹🇿 Swahili' : '🇬🇧 English'}
          </button>
        </div>
      </div>
    </aside>
  );
};
