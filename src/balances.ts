import { Expense, Settlement } from './types';

/**
 * Üye başına net bakiye (kuruş): pozitif = alacaklı, negatif = borçlu.
 * Pay bölümünden kalan kuruşlar ilk katılımcılara birer birer dağıtılır,
 * böylece toplam her zaman sıfırlanır.
 */
export function computeNet(members: string[], expenses: Expense[]): Map<string, number> {
  const net = new Map<string, number>();
  members.forEach((m) => net.set(m, 0));

  for (const e of expenses) {
    const participants = e.participants.filter((p) => net.has(p));
    if (participants.length === 0) continue;

    const share = Math.floor(e.amountKurus / participants.length);
    let remainder = e.amountKurus - share * participants.length;

    if (net.has(e.paidBy)) {
      net.set(e.paidBy, (net.get(e.paidBy) ?? 0) + e.amountKurus);
    }
    for (const p of participants) {
      const extra = remainder > 0 ? 1 : 0;
      remainder -= extra;
      net.set(p, (net.get(p) ?? 0) - share - extra);
    }
  }
  return net;
}

/** Borçları en az transferle kapatan öneri listesi (açgözlü eşleştirme). */
export function computeSettlements(net: Map<string, number>): Settlement[] {
  const debtors = [...net.entries()]
    .filter(([, v]) => v < 0)
    .map(([name, v]) => ({ name, left: -v }))
    .sort((a, b) => b.left - a.left);
  const creditors = [...net.entries()]
    .filter(([, v]) => v > 0)
    .map(([name, v]) => ({ name, left: v }))
    .sort((a, b) => b.left - a.left);

  const result: Settlement[] = [];
  let d = 0;
  let c = 0;
  while (d < debtors.length && c < creditors.length) {
    const pay = Math.min(debtors[d].left, creditors[c].left);
    if (pay > 0) {
      result.push({ from: debtors[d].name, to: creditors[c].name, amountKurus: pay });
    }
    debtors[d].left -= pay;
    creditors[c].left -= pay;
    if (debtors[d].left === 0) d++;
    if (creditors[c].left === 0) c++;
  }
  return result;
}
