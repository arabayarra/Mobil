import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { computeNet, computeSettlements } from '../balances';
import { formatDate, formatTL } from '../format';
import { useStore } from '../store';
import { memberColor, useTheme } from '../theme';
import { Avatar, ConfirmDialog, PrimaryButton, SectionTitle } from '../ui';

type PendingDelete =
  | { kind: 'group' }
  | { kind: 'expense'; expenseId: string; title: string };

export function GroupDetailScreen({ groupId, onAddExpense, onBack }: {
  groupId: string;
  onAddExpense: () => void;
  onBack: () => void;
}) {
  const theme = useTheme();
  const { groups, expenses, deleteGroup, deleteExpense } = useStore();
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);

  const group = groups.find((g) => g.id === groupId);
  const groupExpenses = useMemo(
    () => expenses.filter((e) => e.groupId === groupId),
    [expenses, groupId],
  );
  const net = useMemo(
    () => computeNet(group?.members ?? [], groupExpenses),
    [group, groupExpenses],
  );
  const settlements = useMemo(() => computeSettlements(net), [net]);
  const total = groupExpenses.reduce((sum, e) => sum + e.amountKurus, 0);

  if (!group) return null;

  const runPendingDelete = () => {
    if (!pendingDelete) return;
    if (pendingDelete.kind === 'group') {
      deleteGroup(group.id);
      setPendingDelete(null);
      onBack();
    } else {
      deleteExpense(pendingDelete.expenseId);
      setPendingDelete(null);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 16 }}>
        <View style={styles.topRow}>
          <Pressable onPress={onBack} hitSlop={12}>
            <Text style={{ color: theme.accent, fontSize: 16, fontWeight: '600' }}>‹ Gruplar</Text>
          </Pressable>
          <Pressable onPress={() => setPendingDelete({ kind: 'group' })} hitSlop={12}>
            <Text style={{ color: theme.negative, fontSize: 14, fontWeight: '600' }}>Grubu sil</Text>
          </Pressable>
        </View>

        <Text style={[styles.title, { color: theme.ink }]}>{group.name}</Text>
        <Text style={{ color: theme.muted, fontSize: 14 }}>
          Toplam harcama: <Text style={{ fontWeight: '700', color: theme.ink }}>{formatTL(total)}</Text>
        </Text>

        <SectionTitle theme={theme}>Bakiye durumu</SectionTitle>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.line }]}>
          {group.members.map((m, i) => {
            const value = net.get(m) ?? 0;
            const color = value > 0 ? theme.positive : value < 0 ? theme.negative : theme.muted;
            return (
              <View
                key={m}
                style={[
                  styles.balanceRow,
                  i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.line },
                ]}
              >
                <Avatar name={m} color={memberColor(theme, group.members, m)} size={30} />
                <Text style={{ color: theme.ink, fontSize: 15, fontWeight: '600', flex: 1 }}>{m}</Text>
                <Text style={{ color, fontSize: 15, fontWeight: '700', fontVariant: ['tabular-nums'] }}>
                  {value > 0 ? '+' : ''}{formatTL(value)}
                </Text>
              </View>
            );
          })}
        </View>

        {settlements.length > 0 && (
          <>
            <SectionTitle theme={theme}>Kim kime öder?</SectionTitle>
            <View style={{ gap: 8 }}>
              {settlements.map((s, i) => (
                <View
                  key={i}
                  style={[styles.settleRow, { backgroundColor: theme.surface, borderColor: theme.line }]}
                >
                  <Text style={{ color: theme.ink, fontSize: 14.5, flex: 1 }}>
                    <Text style={{ fontWeight: '700' }}>{s.from}</Text>
                    <Text style={{ color: theme.muted }}> → </Text>
                    <Text style={{ fontWeight: '700' }}>{s.to}</Text>
                  </Text>
                  <Text style={{ color: theme.ink, fontWeight: '800', fontVariant: ['tabular-nums'] }}>
                    {formatTL(s.amountKurus)}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        <SectionTitle theme={theme}>Harcamalar</SectionTitle>
        {groupExpenses.length === 0 ? (
          <Text style={{ color: theme.muted, fontSize: 14, lineHeight: 21 }}>
            Henüz harcama yok. İlk harcamayı ekleyin; bakiyeler otomatik hesaplanır.
          </Text>
        ) : (
          <View style={{ gap: 8 }}>
            {groupExpenses.map((e) => (
              <Pressable
                key={e.id}
                onLongPress={() => setPendingDelete({ kind: 'expense', expenseId: e.id, title: e.title })}
                style={[styles.expenseRow, { backgroundColor: theme.surface, borderColor: theme.line }]}
              >
                <Avatar name={e.paidBy} color={memberColor(theme, group.members, e.paidBy)} size={34} />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{ color: theme.ink, fontSize: 15, fontWeight: '700' }}>{e.title}</Text>
                  <Text style={{ color: theme.muted, fontSize: 12.5 }}>
                    {e.paidBy} ödedi · {e.participants.length} kişi · {formatDate(e.createdAt)}
                  </Text>
                </View>
                <Text style={{ color: theme.ink, fontSize: 15, fontWeight: '700', fontVariant: ['tabular-nums'] }}>
                  {formatTL(e.amountKurus)}
                </Text>
              </Pressable>
            ))}
            <Text style={{ color: theme.faint, fontSize: 12, textAlign: 'center', marginTop: 4 }}>
              Silmek için harcamaya basılı tutun
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={{ paddingHorizontal: 20, paddingBottom: 8 }}>
        <PrimaryButton label="Harcama ekle" onPress={onAddExpense} theme={theme} />
      </View>

      <ConfirmDialog
        visible={pendingDelete !== null}
        title={pendingDelete?.kind === 'group' ? 'Grubu sil' : 'Harcamayı sil'}
        message={
          pendingDelete?.kind === 'group'
            ? `"${group.name}" ve tüm harcamaları silinecek. Emin misiniz?`
            : pendingDelete?.kind === 'expense'
              ? `"${pendingDelete.title}" silinsin mi?`
              : ''
        }
        confirmLabel="Sil"
        onCancel={() => setPendingDelete(null)}
        onConfirm={runPendingDelete}
        theme={theme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginTop: 12, marginBottom: 4 },
  card: { borderWidth: 1, borderRadius: 16, paddingHorizontal: 14 },
  balanceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11 },
  settleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
});
