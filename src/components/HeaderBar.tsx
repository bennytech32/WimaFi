import React, { useState } from 'react';
import { Search, Plus, Bell, CheckCircle2, DollarSign, X } from 'lucide-react';

interface HeaderBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenNewBatchModal: () => void;
  currency: 'USD' | 'TZS';
  onToggleCurrency: () => void;
  gatewaysCount: number;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenNewBatchModal,
  currency,
  onToggleCurrency,
  gatewaysCount,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const mockAlerts = [
    { id: 1, title: 'RADIUS CoA Disconnect Executed', target: 'MAC 10.240.8.21 (Quota Expired)', time: '2m ago', type: 'info' },
    { id: 2, title: 'New M-Pesa Payment Received', target: 'TSh 5,000 (+255 754 819 203)', time: '8m ago', type: 'success' },
    { id: 3, title: 'MikroTik CCR2004 Sync Successful', target: 'Walled Garden IP rules mirrored', time: '14m ago', type: 'info' },
  ];

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-[#DCE9FF] sticky top-0 z-30 px-6 flex items-center justify-between gap-4">
      {/* Global Search Input */}
      <div className="flex-1 max-w-md relative">
        <Search className="w-4 h-4 text-[#707881] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search IP, MAC, Voucher or NAS..."
          className="w-full pl-9 pr-4 py-1.5 bg-[#EFF4FF] border border-[#DCE9FF] rounded-lg text-xs font-medium text-[#0B1C30] placeholder:text-[#707881] focus:outline-none focus:ring-1 focus:ring-[#006194] focus:bg-white transition-all shadow-xs"
        />
        {searchQuery && (
          <button 
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#707881] hover:text-[#0B1C30]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Right Action Icons & Operator Info */}
      <div className="flex items-center gap-3">
        {/* Gateway Health Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5EEFF] text-[#006947] text-xs font-semibold border border-[#D3E4FE]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00855B] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00855B]"></span>
          </span>
          <span>All {gatewaysCount} Gateways Online - 99.98%</span>
        </div>

        {/* Currency Switcher */}
        <button
          onClick={onToggleCurrency}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-[#EFF4FF] hover:bg-[#DCE9FF] border border-[#DCE9FF] rounded-lg text-xs font-bold text-[#006194] transition-colors"
          title="Toggle display currency (USD / Tanzanian Shilling TZS)"
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>{currency}</span>
        </button>

        {/* New Voucher Batch Button */}
        <button
          onClick={onOpenNewBatchModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#006194] hover:bg-[#007BB9] text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Voucher Batch</span>
        </button>

        {/* Notifications Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-[#3F4850] hover:text-[#0B1C30] hover:bg-[#EFF4FF] rounded-lg transition-colors relative"
            title="System alerts & RADIUS notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#BA1A1A] ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#DCE9FF] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#DCE9FF]">
                <span className="text-xs font-bold text-[#0B1C30] uppercase tracking-wider">
                  NOC Live Alerts
                </span>
                <span className="text-[10px] font-mono text-[#006194] font-semibold">
                  3 New Events
                </span>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                {mockAlerts.map((alert) => (
                  <div key={alert.id} className="p-2 rounded-lg bg-[#EFF4FF] text-xs flex flex-col gap-0.5">
                    <div className="flex items-center justify-between font-semibold text-[#0B1C30]">
                      <span className="truncate">{alert.title}</span>
                      <span className="text-[10px] text-[#707881] font-mono shrink-0 ml-1">{alert.time}</span>
                    </div>
                    <span className="text-[11px] text-[#3F4850] font-mono truncate">{alert.target}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-[#BFC7D2]" />

        {/* Admin Operator Profile */}
        <div className="flex items-center gap-2 pl-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#006194] to-[#316BF3] text-white flex items-center justify-center font-bold text-xs shadow-xs ring-1 ring-[#BFC7D2]">
            AO
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-[#0B1C30] leading-tight">Admin Operator</span>
            <span className="text-[10px] font-bold text-[#707881] uppercase tracking-wider leading-tight">
              NOC Level 3
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
