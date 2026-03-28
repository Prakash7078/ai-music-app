import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textMuted: '#94A3B8',
    background: '#050816',
    card: '#111827',
    cardActive: '#1D2B2A',
    backgroundElement: '#111827',
    backgroundSelected: '#1D2B2A',
    border: '#1F2937',
    primary: '#1ED760',
    primaryText: '#06220E',
  },
  dark: {
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textMuted: '#94A3B8',
    background: '#050816',
    card: '#111827',
    cardActive: '#1D2B2A',
    backgroundElement: '#111827',
    backgroundSelected: '#1D2B2A',
    border: '#1F2937',
    primary: '#1ED760',
    primaryText: '#06220E',
  },
} as const;

export const AppTheme = {
  colors: Colors.dark,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 72,
} as const;

export const Radius = {
  sm: 10,
  md: 18,
  lg: 24,
  xl: 32,
  round: 999,
} as const;

export const Typography = {
  caption: 12,
  body: 16,
  h3: 20,
  h2: 28,
  h1: 36,
  display: 42,
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  android: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'system-ui, sans-serif',
    serif: 'Georgia, serif',
    rounded: 'system-ui, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
});

export const MaxContentWidth = 920;

export type ThemeColor = keyof typeof Colors.light;
