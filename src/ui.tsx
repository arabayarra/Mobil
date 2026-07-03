import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
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
});
