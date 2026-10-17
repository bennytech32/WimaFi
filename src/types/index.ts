export type DeviceType = 'mobile' | 'laptop' | 'iot' | 'tv';

export type SessionStatus = 'active' | 'throttled' | 'expired';

export interface WifiSession {
  id: string;
  hostname: string;
  deviceType: DeviceType;
  deviceVendor: string;
  specs: string;
  ip: string;
  mac: string;
  assignedNas: string;
  planId: string;
  planName: string;
  dataDownGB: number;
  dataUpGB: number;
  startTime: string;
  timeRemaining: string;
  percentRemaining: number;
  status: SessionStatus;
  rateLimit: string;
}

export interface RatePlan {
  id: string;
  tier: string;
  name: string;
  nameSwahili: string;
  tagline: string;
  taglineSwahili: string;
  priceUSD: number;
  priceTZS: number;
  durationLabel: string;
  durationLabelSwahili: string;
  durationHours: number;
  downloadMbps: number;
  uploadMbps: number;
  initialBurstMbps?: number;
  burstDurationSec?: number;
  quotaGB?: number | 'Unlimited';
  concurrencyDevices: number;
  fupLimitGB?: number;
  postFupRateMbps?: number;
  dedicatedVlan?: number;
  qosPriority?: string;
  isPopular?: boolean;
  statusBadge: string;
}

export interface Voucher {
  code: string;
  pin: string;
  batchId: string;
  planId: string;
  planName: string;
  priceUSD: number;
  priceTZS: number;
  status: 'unused' | 'active' | 'expired' | 'revoked';
  createdAt: string;
  expiresAt: string;
  usedByMac?: string;
  usedByIp?: string;
  venueTag?: string;
  dataLimitGB?: number | 'Unlimited';
  speedRate: string;
}

export interface VoucherBatch {
  id: string;
  label: string;
  venue: string;
  planId: string;
  planName: string;
  total: number;
  redeemed: number;
  active: number;
  collectedRevUSD: number;
  collectedRevTZS: number;
  createdAt: string;
  status: 'active' | 'exhausted' | 'revoked';
}

export type NasVendor = 'mikrotik' | 'ubiquiti' | 'cisco' | 'openwrt' | 'generic';

export interface NasGateway {
  id: string;
  name: string;
  vendor: NasVendor;
  vendorLabel: string;
  hardwareModel: string;
  osVersion: string;
  ip: string;
  protocolHook: string;
  nasIdentifier: string;
  cpuLoad: number;
  temperature: number;
  memoryUsage: number;
  activeClients: number;
  status: 'online' | 'warning' | 'offline';
  rttMs: number;
  uptime: string;
  secret: string;
  authPort: number;
  acctPort: number;
  coaPort: number;
  coAEnabled: boolean;
  localFallback: boolean;
}

export type RadiusEventType = 
  | 'ACCESS-ACCEPT' 
  | 'ACCESS-REQUEST' 
  | 'ACCESS-REJECT' 
  | 'ACCT-START' 
  | 'ACCT-UPDATE' 
  | 'ACCT-STOP'
  | 'COA-DISCONNECT';

export interface RadiusEvent {
  id: string;
  time: string;
  type: RadiusEventType;
  nasName: string;
  nasIp: string;
  user: string;
  mac: string;
  ip?: string;
  details: string;
  tag?: string;
}

export type PaymentMethod = 'M-Pesa' | 'Tigo Pesa' | 'Airtel Money' | 'Halopesa' | 'Card' | 'Cash POS';

export interface PaymentTransaction {
  id: string;
  reference: string;
  customerPhone: string;
  provider: PaymentMethod;
  amountUSD: number;
  amountTZS: number;
  planName: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  voucherCode: string;
}

export interface PortalConfig {
  portalTitle: string;
  portalSubtitle: string;
  brandName: string;
  primaryToneHex: string;
  enableVoucher: boolean;
  enablePayment: boolean;
  enableSmsOtp: boolean;
  enableFreeTier: boolean;
  freeTierMinutes: number;
  freeTierThrottleMbps: number;
  showBandwidthQuota: boolean;
  mandatoryTos: boolean;
  sessionAutoRenew: boolean;
  sslPinning: boolean;
  walledGardenDomains: string[];
}
