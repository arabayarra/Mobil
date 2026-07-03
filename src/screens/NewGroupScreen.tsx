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
import { makeId } from '../format';
import { useStore } from '../store';
import { memberColor, useTheme } from '../theme';
import { Avatar, PrimaryButton, SectionTitle } from '../ui';

export function NewGroupScreen({ onDone, onBack }: {
  onDone: (groupId: string) => void;
  onBack: () => void;
}) {
  const theme = useTheme();
  const { addGroup } = useStore();
  const [name, setName] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [memberInput, setMemberInput] = useState('');

  const addMember = () => {
    const trimmed = memberInput.trim();
    if (!trimmed) return;
    if (members.some((m) => m.toLocaleLowerCase('tr-TR') === trimmed.toLocaleLowerCase('tr-TR'))) {
      setMemberInput('');
      return;
    }
    setMembers((prev) => [...prev, trimmed]);
    setMemberInput('');
  };

  const canCreate = name.trim().length > 0 && members.length >= 2;

  const create = () => {
    const group = { id: makeId(), name: name.trim(), members, createdAt: Date.now() };
    addGroup(group);
    onDone(group.id);
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
        <Text style={[styles.title, { color: theme.ink }]}>Yeni grup</Text>

        <SectionTitle theme={theme}>Grup adı</SectionTitle>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="örn. Bodrum tatili"
          placeholderTextColor={theme.faint}
          style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.line, color: theme.ink }]}
        />

        <SectionTitle theme={theme}>Üyeler (en az 2)</SectionTitle>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TextInput
            value={memberInput}
            onChangeText={setMemberInput}
            onSubmitEditing={addMember}
            placeholder="İsim yaz, ekle'ye bas"
            placeholderTextColor={theme.faint}
            returnKeyType="done"
            style={[
              styles.input,
              { flex: 1, backgroundColor: theme.surface, borderColor: theme.line, color: theme.ink },
            ]}
          />
          <Pressable
            onPress={addMember}
            style={[styles.addBtn, { backgroundColor: theme.accent }]}
          >
            <Text style={{ color: theme.accentInk, fontSize: 22, fontWeight: '700' }}>+</Text>
          </Pressable>
        </View>

        <View style={{ gap: 8, marginTop: 14 }}>
          {members.map((m) => (
            <View
              key={m}
              style={[styles.memberRow, { backgroundColor: theme.surface, borderColor: theme.line }]}
            >
              <Avatar name={m} color={memberColor(theme, members, m)} size={30} />
              <Text style={{ color: theme.ink, fontSize: 15, fontWeight: '600', flex: 1 }}>{m}</Text>
              <Pressable onPress={() => setMembers((prev) => prev.filter((x) => x !== m))} hitSlop={10}>
                <Text style={{ color: theme.negative, fontSize: 14, fontWeight: '600' }}>Çıkar</Text>
              </Pressable>
            </View>
          ))}
        </View>

        <PrimaryButton
          label="Grubu oluştur"
          onPress={create}
          theme={theme}
          disabled={!canCreate}
          style={{ marginTop: 28 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  addBtn: {
    width: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
});
