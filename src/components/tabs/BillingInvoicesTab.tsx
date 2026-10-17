import React, { useState } from 'react';
import { 
  Receipt, 
  Smartphone, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  Send, 
  ShieldCheck, 
  CreditCard,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  Check
} from 'lucide-react';
import { PaymentTransaction } from '../../types';
import { formatCurrency, formatTZS } from '../../utils/formatters';

interface BillingInvoicesTabProps {
  transactions: PaymentTransaction[];
  onAddTransaction: (tx: PaymentTransaction) => void;
  currency: 'USD' | 'TZS';
  language: 'en' | 'sw';
}

export const BillingInvoicesTab: React.FC<BillingInvoicesTabProps> = ({
  transactions,
  onAddTransaction,
  currency,
  language,
}) => {
  const [phoneInput, setPhoneInput] = useState('+255 754 819 203');
  const [selectedProvider, setSelectedProvider] = useState<'M-Pesa' | 'Tigo Pesa' | 'Airtel Money' | 'Halopesa'>('M-Pesa');
  const [selectedPlanAmount, setSelectedPlanAmount] = useState<number>(5000);
  const [planLabel, setPlanLabel] = useState('24-Hour Day Pass');
  
  // USSD Push Simulator State
  const [isPushing, setIsPushing] = useState(false);
  const [showUssdPhoneModal, setShowUssdPhoneModal] = useState(false);
  const [ussdPin, setUssdPin] = useState('');
  const [ussdSuccessVoucher, setUssdSuccessVoucher] = useState<string | null>(null);

  // Search & Filters
  const [searchFilter, setSearchFilter] = useState('');
  const [providerFilter, setProviderFilter] = useState('all');

  const handleTriggerUssdPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim()) return;
    setIsPushing(true);
    setTimeout(() => {
      setIsPushing(false);
      setShowUssdPhoneModal(true);
    }, 800);
  };

  const handleConfirmUssdPin = () => {
    if (!ussdPin.trim()) return;
    const newVoucherCode = `WIMA-${Math.floor(1000 + Math.random() * 9000)}-TZ`;
    const newTx: PaymentTransaction = {
      id: `tx-${Date.now()}`,
      reference: `STK-${Math.floor(10000000 + Math.random() * 90000000)}`,
      customerPhone: phoneInput,
      provider: selectedProvider,
      amountUSD: Number((selectedPlanAmount / 2600).toFixed(2)),
      amountTZS: selectedPlanAmount,
      planName: planLabel,
      status: 'completed',
      timestamp: 'Just now',
      voucherCode: newVoucherCode,
    };

    onAddTransaction(newTx);
    setUssdSuccessVoucher(newVoucherCode);
    setTimeout(() => {
      setShowUssdPhoneModal(false);
      setUssdPin('');
      setUssdSuccessVoucher(null);
    }, 2200);
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = 
      tx.customerPhone.includes(searchFilter) ||
      tx.reference.toLowerCase().includes(searchFilter.toLowerCase()) ||
      tx.voucherCode.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesProvider = providerFilter === 'all' || tx.provider === providerFilter;
    return matchesSearch && matchesProvider;
  });

  const totalCollectedTZS = transactions.reduce((acc, t) => acc + t.amountTZS, 0);

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6">
      {/* Header Context Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#3F4850]">
            <span>Accounting</span>
            <span>/</span>
            <span>Payment Aggregator</span>
            <span>/</span>
            <span className="font-bold text-[#0B1C30]">Tanzania Mobile Money (Push USSD)</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B1C30] tracking-tight">
            {language === 'sw' ? 'Malipo ya Simu (M-Pesa, Tigo, Airtel)' : 'Billing & Mobile Money Aggregator'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-[#E5EEFF] text-[#006947] text-xs font-bold rounded-lg flex items-center gap-1.5 border border-[#D3E4FE]">
            <ShieldCheck className="w-4 h-4 text-[#00855B]" />
            <span>Selcom & AzamPay Webhooks Active</span>
          </span>
        </div>
      </div>

      {/* KPI Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-[#DCE9FF] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-[#3F4850] uppercase">
            <span>TODAY'S MOBILE MONEY</span>
            <Smartphone className="w-4 h-4 text-[#00855B]" />
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#0B1C30] tabular-nums font-mono">
              {formatTZS(totalCollectedTZS)}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#006947] font-semibold">
            <span>+19.2% vs yesterday</span>
            <span className="text-[#3F4850]">99.8% Success</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#DCE9FF] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-[#3F4850] uppercase">
            <span>M-PESA WALLET SETTLEMENT</span>
            <CheckCircle2 className="w-4 h-4 text-[#006194]" />
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#0B1C30] tabular-nums font-mono">
              {currency === 'TZS' ? 'TSh 3,850,000' : '$1,480.00'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#3F4850]">
            <span>Auto-sweep to CRDB Bank</span>
            <span className="text-[#00855B] font-bold">Ready</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#DCE9FF] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-[#3F4850] uppercase">
            <span>TIGO PESA & AIRTEL</span>
            <TrendingUp className="w-4 h-4 text-[#0051D5]" />
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#0B1C30] tabular-nums font-mono">
              {currency === 'TZS' ? 'TSh 1,620,000' : '$623.00'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#3F4850]">
            <span>AzamPay Escrow Pooled</span>
            <span className="text-[#00855B] font-bold">Synchronized</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#DCE9FF] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-[#3F4850] uppercase">
            <span>STRIPE & CARD PAYMENTS</span>
            <CreditCard className="w-4 h-4 text-[#707881]" />
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#0B1C30] tabular-nums font-mono">
              {currency === 'TZS' ? 'TSh 2,860,000' : '$1,100.00'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#3F4850]">
            <span>International roaming guests</span>
            <span className="text-[#006194] font-bold">Payout in 2d</span>
          </div>
        </div>
      </div>

      {/* Interactive Mobile Money Push USSD Simulator */}
      <div className="bg-white rounded-xl p-5 lg:p-6 border border-[#DCE9FF] shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#DCE9FF]">
          <div>
            <h2 className="text-base font-bold text-[#0B1C30] flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#006194]" />
              <span>{language === 'sw' ? 'Jaribu Kutuma USSD Push (STK Push Simulator)' : 'Test USSD Push Gateway Simulator'}</span>
            </h2>
            <p className="text-xs text-[#3F4850]">
              Simulates Selcom / AzamPay Push USSD where subscriber receives PIN prompt directly on phone, approves, and gets WiFi access immediately.
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded font-mono text-xs bg-[#EFF4FF] text-[#006194] font-bold border border-[#DCE9FF]">
            Selcom REST API v2
          </span>
        </div>

        <form onSubmit={handleTriggerUssdPush} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#EFF4FF] p-4 rounded-xl border border-[#DCE9FF]">
          {/* Operator Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#0B1C30]">Mobile Operator</label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value as any)}
              className="bg-white py-2 px-3 rounded-lg text-xs font-bold text-[#0B1C30] border border-[#DCE9FF] focus:outline-none"
            >
              <option value="M-Pesa">Vodacom M-Pesa</option>
              <option value="Tigo Pesa">Tigo Pesa / Yas</option>
              <option value="Airtel Money">Airtel Money</option>
              <option value="Halopesa">Halopesa</option>
            </select>
          </div>

          {/* Customer Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#0B1C30]">Customer Phone Number</label>
            <input
              type="text"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="e.g. +255 754 000 000"
              className="bg-white py-2 px-3 rounded-lg text-xs font-mono font-bold text-[#0B1C30] border border-[#DCE9FF] focus:outline-none"
            />
          </div>

          {/* Package / Amount */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#0B1C30]">WiFi Package</label>
            <select
              value={selectedPlanAmount}
              onChange={(e) => {
                const amt = parseInt(e.target.value);
                setSelectedPlanAmount(amt);
                if (amt === 2500) setPlanLabel('1-Hour Express');
                else if (amt === 5000) setPlanLabel('24-Hour Day Pass');
                else if (amt === 25000) setPlanLabel('Weekly Remote Worker');
                else setPlanLabel('Monthly VIP Business');
              }}
              className="bg-white py-2 px-3 rounded-lg text-xs font-bold text-[#0B1C30] border border-[#DCE9FF] focus:outline-none"
            >
              <option value={2500}>1-Hour Express - TSh 2,500</option>
              <option value={5000}>24-Hour Day Pass - TSh 5,000</option>
              <option value={2500}>Weekly Remote - TSh 25,000</option>
              <option value={90000}>Monthly VIP - TSh 90,000</option>
            </select>
          </div>

          {/* Trigger Button */}
          <div className="flex flex-col justify-end">
            <button
              type="submit"
              disabled={isPushing}
              className="w-full py-2 bg-[#00855B] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Send className={`w-4 h-4 ${isPushing ? 'animate-bounce' : ''}`} />
              <span>{isPushing ? 'Dispatching Push USSD...' : 'Send USSD Push Prompt'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Transactions Ledger Table */}
      <div className="bg-white rounded-xl border border-[#DCE9FF] shadow-xs overflow-hidden flex flex-col">
        <div className="p-4 lg:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#EFF4FF] border-b border-[#DCE9FF]">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-[#0B1C30]">Payment Transactions Ledger</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-white text-[#3F4850] text-xs font-semibold border border-[#DCE9FF]">
              {transactions.length} Transactions
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#707881] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search phone or ref..."
                className="pl-8 pr-3 py-1 bg-white border border-[#DCE9FF] rounded-lg text-xs text-[#0B1C30] focus:outline-none"
              />
            </div>

            <select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              className="px-2.5 py-1 bg-white border border-[#DCE9FF] rounded-lg text-xs font-medium text-[#0B1C30] focus:outline-none"
            >
              <option value="all">All Providers</option>
              <option value="M-Pesa">M-Pesa</option>
              <option value="Tigo Pesa">Tigo Pesa</option>
              <option value="Airtel Money">Airtel Money</option>
              <option value="Card">Card</option>
              <option value="Cash POS">Cash POS</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#DCE9FF] text-[#3F4850] font-bold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-4">Tx Reference</th>
                <th className="py-2.5 px-4">Customer Phone</th>
                <th className="py-2.5 px-4">Payment Method</th>
                <th className="py-2.5 px-4">WiFi Plan</th>
                <th className="py-2.5 px-4 text-right">Amount (TZS / USD)</th>
                <th className="py-2.5 px-4">Issued Voucher Token</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EEFF]">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#F8F9FF] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#006194]">{tx.reference}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-[#0B1C30]">{tx.customerPhone}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.provider === 'M-Pesa'
                          ? 'bg-emerald-100 text-emerald-800'
                          : tx.provider === 'Tigo Pesa'
                          ? 'bg-blue-100 text-blue-800'
                          : tx.provider === 'Airtel Money'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-[#EFF4FF] text-[#0B1C30]'
                      }`}
                    >
                      {tx.provider}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-[#0B1C30]">{tx.planName}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#0B1C30]">
                    {formatTZS(tx.amountTZS)}
                    <span className="text-[10px] text-[#707881] block">(${tx.amountUSD.toFixed(2)})</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#006194] font-bold">{tx.voucherCode}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#E5EEFF] text-[#006947]">
                      <CheckCircle2 className="w-3 h-3 text-[#00855B]" />
                      <span>{tx.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#707881] font-mono">{tx.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulated Phone Prompt Modal for Push USSD */}
      {showUssdPhoneModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 text-center border-4 border-slate-900 animate-in zoom-in-95 duration-150">
            {/* Phone speaker notch */}
            <div className="w-16 h-1.5 bg-slate-300 rounded-full mb-1"></div>

            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-mono font-bold text-[#00855B] uppercase">
                {selectedProvider} Push USSD Prompt
              </span>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Idhinisha Malipo / Approve Payment
              </h3>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 text-left font-mono w-full">
              <p className="font-semibold text-slate-900">
                WimaFi WiFi: Weka namba yako ya siri kulipia TSh {selectedPlanAmount.toLocaleString()} kwa ajili ya {planLabel}.
              </p>
              <div className="mt-2 text-[10px] text-slate-500">
                Namba ya Simu: {phoneInput}
              </div>
            </div>

            {ussdSuccessVoucher ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl w-full flex flex-col items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold">Malipo Yamekamilika! / Approved!</span>
                <span className="font-mono text-sm font-extrabold text-emerald-700">
                  Vocha: {ussdSuccessVoucher}
                </span>
                <span className="text-[10px] text-emerald-600">
                  Umewezeshwa kuunganishwa kwenye intaneti mara moja.
                </span>
              </div>
            ) : (
              <div className="w-full flex flex-col gap-3">
                <div className="flex flex-col items-start gap-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">
                    Weka PIN ya {selectedProvider} (Mfano: 1234)
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={ussdPin}
                    onChange={(e) => setUssdPin(e.target.value)}
                    placeholder="••••"
                    className="w-full py-2.5 px-3 bg-slate-100 border border-slate-300 rounded-xl text-center text-lg font-mono tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    autoFocus
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowUssdPhoneModal(false)}
                    className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                  >
                    Katisha / Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmUssdPin}
                    className="flex-1 py-2 rounded-xl bg-[#00855B] hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                  >
                    Thibitisha / Confirm
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
