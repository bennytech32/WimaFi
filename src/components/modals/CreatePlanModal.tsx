import React, { useState } from 'react';
import { Sliders, X } from 'lucide-react';
import { RatePlan } from '../../types';

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: RatePlan) => void;
}

export const CreatePlanModal: React.FC<CreatePlanModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('Conference Premium Pass 48h');
  const [nameSwahili, setNameSwahili] = useState('Bando la Mkutano (Masaa 48)');
  const [downloadMbps, setDownloadMbps] = useState(50);
  const [uploadMbps, setUploadMbps] = useState(25);
  const [initialBurst, setInitialBurst] = useState(60);
  const [burstDuration, setBurstDuration] = useState(20);
  const [quotaGB, setQuotaGB] = useState('Unlimited');
  const [priceUSD, setPriceUSD] = useState(10.0);
  const [priceTZS, setPriceTZS] = useState(25000);
  const [durationHours, setDurationHours] = useState(48);
  const [concurrency, setConcurrency] = useState(2);
  const [queueDiscipline, setQueueDiscipline] = useState('MikroTik Simple Queues (PCQ / Cake)');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlan: RatePlan = {
      id: `plan-${Date.now()}`,
      tier: 'CUSTOM TIER',
      name: name,
      nameSwahili: nameSwahili,
      tagline: `${durationHours}h High-Speed Carrier Pass`,
      taglineSwahili: `Intaneti ya haraka masaa ${durationHours}`,
      priceUSD: Number(priceUSD),
      priceTZS: Number(priceTZS),
      durationLabel: `/ ${durationHours}h`,
      durationLabelSwahili: `/ masaa ${durationHours}`,
      durationHours: Number(durationHours),
      downloadMbps: Number(downloadMbps),
      uploadMbps: Number(uploadMbps),
      initialBurstMbps: initialBurst > 0 ? Number(initialBurst) : undefined,
      burstDurationSec: burstDuration > 0 ? Number(burstDuration) : undefined,
      quotaGB: quotaGB.toLowerCase() === 'unlimited' ? 'Unlimited' : Number(quotaGB),
      concurrencyDevices: Number(concurrency),
      statusBadge: 'READY',
    };
    onSave(newPlan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 flex flex-col gap-4 animate-in zoom-in-95 duration-150 border border-[#DCE9FF]">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#DCE9FF]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EFF4FF] text-[#006194] flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#0B1C30]">
              Provision New Bandwidth Tier
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#EFF4FF] text-[#707881] hover:text-[#0B1C30]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-[#0B1C30]">Plan Friendly Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#EFF4FF] border border-[#DCE9FF] rounded-lg font-medium text-[#0B1C30] focus:outline-none focus:ring-1 focus:ring-[#006194]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-[#0B1C30]">Download Rate (Mbps)</label>
              <input
                type="number"
                value={downloadMbps}
                onChange={(e) => setDownloadMbps(Number(e.target.value))}
                required
                className="w-full px-3 py-2 bg-[#EFF4FF] border border-[#DCE9FF] font-mono rounded-lg text-[#0B1C30] focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-[#0B1C30]">Upload Rate (Mbps)</label>
              <input
                type="number"
                value={uploadMbps}
                onChange={(e) => setUploadMbps(Number(e.target.value))}
                required
                className="w-full px-3 py-2 bg-[#EFF4FF] border border-[#DCE9FF] font-mono rounded-lg text-[#0B1C30] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-[#0B1C30]">Initial Burst Rate (Mbps)</label>
              <input
                type="number"
                value={initialBurst}
                onChange={(e) => setInitialBurst(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#EFF4FF] border border-[#DCE9FF] font-mono rounded-lg text-[#0B1C30] focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-[#0B1C30]">Burst Duration (Seconds)</label>
              <input
                type="number"
                value={burstDuration}
                onChange={(e) => setBurstDuration(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#EFF4FF] border border-[#DCE9FF] font-mono rounded-lg text-[#0B1C30] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-[#0B1C30]">Quota Limit (GB or Unlimited)</label>
              <input
                type="text"
                value={quotaGB}
                onChange={(e) => setQuotaGB(e.target.value)}
                className="w-full px-3 py-2 bg-[#EFF4FF] border border-[#DCE9FF] rounded-lg text-[#0B1C30] focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-[#0B1C30]">Base Price (USD)</label>
              <input
                type="number"
                step="0.5"
                value={priceUSD}
                onChange={(e) => {
                  const p = Number(e.target.value);
                  setPriceUSD(p);
                  setPriceTZS(Math.round(p * 2600));
                }}
                className="w-full px-3 py-2 bg-[#EFF4FF] border border-[#DCE9FF] font-mono rounded-lg text-[#0B1C30] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-[#0B1C30]">Price in Tanzanian Shilling (TZS)</label>
              <input
                type="number"
                value={priceTZS}
                onChange={(e) => setPriceTZS(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#EFF4FF] border border-[#DCE9FF] font-mono rounded-lg text-[#0B1C30] focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-[#0B1C30]">Concurrency (Max Devices)</label>
              <input
                type="number"
                value={concurrency}
                onChange={(e) => setConcurrency(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#EFF4FF] border border-[#DCE9FF] font-mono rounded-lg text-[#0B1C30] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-[#0B1C30]">Hardware Queue Discipline</label>
            <select
              value={queueDiscipline}
              onChange={(e) => setQueueDiscipline(e.target.value)}
              className="w-full px-3 py-2 bg-[#EFF4FF] border border-[#DCE9FF] rounded-lg text-[#0B1C30] focus:outline-none"
            >
              <option>MikroTik Simple Queues (PCQ / Cake)</option>
              <option>UniFi Controller Voucher API</option>
              <option>CoovaChilli Bandwidth Tuner</option>
              <option>Standard FreeRADIUS wispr-rate</option>
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#DCE9FF]">
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
              Save & Deploy Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
