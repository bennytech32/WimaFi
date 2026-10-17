export function formatCurrency(amountUSD: number, currency: 'USD' | 'TZS' = 'USD'): string {
  if (currency === 'TZS') {
    const tzs = Math.round(amountUSD * 2600);
    return `TSh ${tzs.toLocaleString()}`;
  }
  return `$${amountUSD.toFixed(2)}`;
}

export function formatTZS(amountTZS: number): string {
  return `TSh ${amountTZS.toLocaleString()}`;
}

export function formatBytes(gigabytes: number): string {
  if (gigabytes < 1) {
    return `${Math.round(gigabytes * 1024)} MB`;
  }
  return `${gigabytes.toFixed(1)} GB`;
}
