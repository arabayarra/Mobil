import { useColorScheme } from 'react-native';

export type Theme = {
  bg: string;
  surface: string;
  surface2: string;
  ink: string;
  muted: string;
  faint: string;
  line: string;
  accent: string;
  accentInk: string;
  positive: string;
  negative: string;
  memberColors: string[];
};

const light: Theme = {
  bg: '#F1F1EE',
  surface: '#FCFCFB',
  surface2: '#F5F5F2',
  ink: '#0B0B0B',
  muted: '#52514E',
  faint: '#898781',
  line: '#E1E0D9',
  accent: '#2A78D6',
  accentInk: '#FFFFFF',
  positive: '#006300',
  negative: '#D03B3B',
  memberColors: ['#2A78D6', '#1BAF7A', '#EDA100', '#4A3AA7', '#E34948', '#E87BA4', '#EB6834', '#008300'],
};

const dark: Theme = {
  bg: '#0D0D0D',
  surface: '#1A1A19',
  surface2: '#222220',
  ink: '#FFFFFF',
  muted: '#C3C2B7',
  faint: '#898781',
  line: '#2C2C2A',
  accent: '#3987E5',
  accentInk: '#FFFFFF',
  positive: '#0CA30C',
  negative: '#E66767',
  memberColors: ['#3987E5', '#199E70', '#C98500', '#9085E9', '#E66767', '#D55181', '#D95926', '#008300'],
};

export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? dark : light;
}

export function memberColor(theme: Theme, members: string[], name: string): string {
  const idx = Math.max(0, members.indexOf(name));
  return theme.memberColors[idx % theme.memberColors.length];
}

export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toLocaleUpperCase('tr-TR') ?? '')
    .join('');
}
