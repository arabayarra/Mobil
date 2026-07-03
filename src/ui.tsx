import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Theme, initials } from './theme';

export function Avatar({ name, color, size = 36 }: { name: string; color: string; size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: size * 0.38 }}>
        {initials(name)}
      </Text>
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  theme,
  disabled,
  style,
}: {
  label: string;
  onPress: () => void;
  theme: Theme;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: theme.accent, opacity: disabled ? 0.4 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      <Text style={[styles.btnLabel, { color: theme.accentInk }]}>{label}</Text>
    </Pressable>
  );
}

export function Chip({
  label,
  selected,
  onPress,
  theme,
  dotColor,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  theme: Theme;
  dotColor?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.accent : theme.surface,
          borderColor: selected ? theme.accent : theme.line,
        },
      ]}
    >
      {dotColor ? <View style={[styles.dot, { backgroundColor: dotColor }]} /> : null}
      <Text
        style={{
          color: selected ? theme.accentInk : theme.ink,
          fontWeight: selected ? '700' : '500',
          fontSize: 14,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function SectionTitle({ children, theme }: { children: string; theme: Theme }) {
  return <Text style={[styles.sectionTitle, { color: theme.muted }]}>{children}</Text>;
}

/** Alert.alert web'de çalışmadığı için her platformda çalışan onay kutusu. */
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  onCancel,
  onConfirm,
  theme,
}: {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  theme: Theme;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={[styles.dialog, { backgroundColor: theme.surface, borderColor: theme.line }]}>
          <Text style={[styles.dialogTitle, { color: theme.ink }]}>{title}</Text>
          <Text style={[styles.dialogMessage, { color: theme.muted }]}>{message}</Text>
          <View style={styles.dialogRow}>
            <Pressable
              onPress={onCancel}
              style={({ pressed }) => [
                styles.dialogBtn,
                { borderColor: theme.line, borderWidth: 1.5, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={{ color: theme.ink, fontWeight: '700', fontSize: 15 }}>Vazgeç</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.dialogBtn,
                { backgroundColor: theme.negative, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 15 }}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  btnLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderWidth: 1.5,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 22,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
    gap: 8,
  },
  dialogTitle: { fontSize: 17, fontWeight: '800' },
  dialogMessage: { fontSize: 14.5, lineHeight: 21 },
  dialogRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  dialogBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
});
