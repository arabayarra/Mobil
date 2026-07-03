import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { makeId, parseTL } from '../format';
import { useStore } from '../store';
import { memberColor, useTheme } from '../theme';
import { Chip, PrimaryButton, SectionTitle } from '../ui';

export function AddExpenseScreen({ groupId, onDone, onBack }: {
  groupId: string;
  onDone: () => void;
  onBack: () => void;
}) {
  const theme = useTheme();
  const { groups, addExpense } = useStore();
  const group = groups.find((g) => g.id === groupId);

  const [title, setTitle] = useState('');
  const [amountText, setAmountText] = useState('');
  const [paidBy, setPaidBy] = useState<string | null>(group?.members[0] ?? null);
  const [participants, setParticipants] = useState<string[]>(group?.members ?? []);

  if (!group) return null;

  const amountKurus = parseTL(amountText);
  const canSave = title.trim().length > 0 && amountKurus !== null && paidBy !== null && participants.length > 0;

  const toggleParticipant = (m: string) => {
    setParticipants((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );
  };

  const save = () => {
    if (!canSave || amountKurus === null || paidBy === null) return;
    addExpense({
      id: makeId(),
      groupId,
      title: title.trim(),
      amountKurus,
      paidBy,
      participants: group.members.filter((m) => participants.includes(m)),
      createdAt: Date.now(),
    });
    onDone();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={onBack} hitSlop={12}>
          <Text style={{ color: theme.accent, fontSize: 16, fontWeight: '600' }}>‹ Geri</Text>
        </Pressable>
        <Text style={[styles.title, { color: theme.ink }]}>Harcama ekle</Text>
        <Text style={{ color: theme.muted, fontSize: 14 }}>{group.name}</Text>

        <SectionTitle theme={theme}>Ne alındı?</SectionTitle>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="örn. Market alışverişi"
          placeholderTextColor={theme.faint}
          style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.line, color: theme.ink }]}
        />

        <SectionTitle theme={theme}>Tutar</SectionTitle>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TextInput
            value={amountText}
            onChangeText={setAmountText}
            placeholder="0"
            placeholderTextColor={theme.faint}
            keyboardType="decimal-pad"
            style={[
              styles.input,
              styles.amountInput,
              { backgroundColor: theme.surface, borderColor: theme.line, color: theme.ink },
            ]}
          />
          <Text style={{ color: theme.muted, fontSize: 20, fontWeight: '700' }}>TL</Text>
        </View>
        {amountText.length > 0 && amountKurus === null && (
          <Text style={{ color: theme.negative, fontSize: 13, marginTop: 6 }}>
            Geçerli bir tutar girin (örn. 250 veya 125,50)
          </Text>
        )}

        <SectionTitle theme={theme}>Kim ödedi?</SectionTitle>
        <View style={styles.chipWrap}>
          {group.members.map((m) => (
            <Chip
              key={m}
              label={m}
              selected={paidBy === m}
              onPress={() => setPaidBy(m)}
              theme={theme}
              dotColor={paidBy === m ? undefined : memberColor(theme, group.members, m)}
            />
          ))}
        </View>

        <SectionTitle theme={theme}>Kimler dahil?</SectionTitle>
        <View style={styles.chipWrap}>
          {group.members.map((m) => (
            <Chip
              key={m}
              label={m}
              selected={participants.includes(m)}
              onPress={() => toggleParticipant(m)}
              theme={theme}
            />
          ))}
        </View>
        <Text style={{ color: theme.faint, fontSize: 12.5, marginTop: 8 }}>
          Tutar, dahil olanlar arasında eşit bölünür.
        </Text>

        <PrimaryButton
          label="Kaydet"
          onPress={save}
          theme={theme}
          disabled={!canSave}
          style={{ marginTop: 28 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginTop: 12, marginBottom: 2 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
  },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
