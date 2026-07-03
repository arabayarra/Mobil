import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { formatTL } from '../format';
import { useStore } from '../store';
import { memberColor, useTheme } from '../theme';
import { Avatar, PrimaryButton } from '../ui';

export function GroupsScreen({ onOpenGroup, onNewGroup }: {
  onOpenGroup: (groupId: string) => void;
  onNewGroup: () => void;
}) {
  const theme = useTheme();
  const { groups, expenses } = useStore();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.ink }]}>Bölüş</Text>
      <Text style={[styles.subtitle, { color: theme.muted }]}>
        Ortak masrafları kaydet, kim kime ne borçlu anında gör.
      </Text>

      {groups.length === 0 ? (
        <View style={[styles.empty, { backgroundColor: theme.surface, borderColor: theme.line }]}>
          <Text style={[styles.emptyTitle, { color: theme.ink }]}>Henüz grup yok</Text>
          <Text style={[styles.emptyText, { color: theme.muted }]}>
            Tatil, ev arkadaşları, kamp… Bir grup kur, üyeleri ekle, harcamaları yazmaya başla.
          </Text>
        </View>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(g) => g.id}
          contentContainerStyle={{ gap: 10, paddingBottom: 12 }}
          renderItem={({ item }) => {
            const groupExpenses = expenses.filter((e) => e.groupId === item.id);
            const total = groupExpenses.reduce((sum, e) => sum + e.amountKurus, 0);
            return (
              <Pressable
                onPress={() => onOpenGroup(item.id)}
                style={({ pressed }) => [
                  styles.card,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.line,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <View style={{ flex: 1, gap: 3 }}>
                  <Text style={[styles.cardTitle, { color: theme.ink }]}>{item.name}</Text>
                  <Text style={{ color: theme.muted, fontSize: 13 }}>
                    {item.members.length} üye · {groupExpenses.length} harcama
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 6 }}>
                  <Text style={[styles.cardTotal, { color: theme.ink }]}>{formatTL(total)}</Text>
                  <View style={{ flexDirection: 'row' }}>
                    {item.members.slice(0, 4).map((m, i) => (
                      <View key={m} style={{ marginLeft: i === 0 ? 0 : -8 }}>
                        <Avatar name={m} color={memberColor(theme, item.members, m)} size={24} />
                      </View>
                    ))}
                  </View>
                </View>
              </Pressable>
            );
          }}
        />
      )}

      <PrimaryButton label="Yeni grup kur" onPress={onNewGroup} theme={theme} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 8, gap: 12 },
  title: { fontSize: 34, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 15, marginBottom: 8 },
  empty: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    gap: 8,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 21 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  cardTitle: { fontSize: 17, fontWeight: '700' },
  cardTotal: { fontSize: 15, fontWeight: '700', fontVariant: ['tabular-nums'] },
});
