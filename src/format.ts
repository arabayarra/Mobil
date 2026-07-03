/** 12550 kuruş => "125,50 TL" (binlik ayraçlı) */
export function formatTL(amountKurus: number): string {
  const negative = amountKurus < 0;
  const abs = Math.abs(Math.round(amountKurus));
  const lira = Math.floor(abs / 100);
  const kurus = abs % 100;
  const liraStr = lira.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const kurusStr = kurus === 0 ? '' : ',' + kurus.toString().padStart(2, '0');
  return `${negative ? '−' : ''}${liraStr}${kurusStr} TL`;
}

/** "125,50" veya "125.50" girdisini kuruşa çevirir; geçersizse null */
export function parseTL(input: string): number | null {
  const cleaned = input.trim().replace(/\s/g, '').replace(',', '.');
  if (!cleaned || !/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  const value = Math.round(parseFloat(cleaned) * 100);
  return value > 0 ? value : null;
}

export function formatDate(ts: number): string {
  const d = new Date(ts);
  const months = [
    'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
    'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara',
  ];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

export function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
