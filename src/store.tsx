import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Expense, Group } from './types';

const STORAGE_KEY = 'bolus/v1';

type StoreState = {
  ready: boolean;
  groups: Group[];
  expenses: Expense[];
  addGroup: (group: Group) => void;
  deleteGroup: (groupId: string) => void;
  addExpense: (expense: Expense) => void;
  deleteExpense: (expenseId: string) => void;
};

const StoreContext = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const loaded = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const data = JSON.parse(raw) as { groups?: Group[]; expenses?: Expense[] };
          setGroups(data.groups ?? []);
          setExpenses(data.expenses ?? []);
        }
      })
      .catch(() => {})
      .finally(() => {
        loaded.current = true;
        setReady(true);
      });
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ groups, expenses })).catch(() => {});
  }, [groups, expenses]);

  const value: StoreState = {
    ready,
    groups,
    expenses,
    addGroup: (group) => setGroups((prev) => [group, ...prev]),
    deleteGroup: (groupId) => {
      setGroups((prev) => prev.filter((g) => g.id !== groupId));
      setExpenses((prev) => prev.filter((e) => e.groupId !== groupId));
    },
    addExpense: (expense) => setExpenses((prev) => [expense, ...prev]),
    deleteExpense: (expenseId) => setExpenses((prev) => prev.filter((e) => e.id !== expenseId)),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreState {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore, StoreProvider içinde kullanılmalı');
  return ctx;
}
