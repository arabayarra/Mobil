export type Group = {
  id: string;
  name: string;
  members: string[];
  createdAt: number;
};

export type Expense = {
  id: string;
  groupId: string;
  title: string;
  /** Tutar, kuruş cinsinden tam sayı (ör. 125,50 TL => 12550) */
  amountKurus: number;
  paidBy: string;
  participants: string[];
  createdAt: number;
};

export type Settlement = {
  from: string;
  to: string;
  amountKurus: number;
};
