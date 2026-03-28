import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppTheme, Spacing, Typography } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export function SectionHeader({ eyebrow, title, subtitle }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      {eyebrow ? (
        <ThemedText style={styles.eyebrow} themeColor="textMuted">
          {eyebrow}
        </ThemedText>
      ) : null}
      <ThemedText style={styles.title}>{title}</ThemedText>
      {subtitle ? (
        <ThemedText style={styles.subtitle} themeColor="textMuted">
          {subtitle}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  eyebrow: {
    fontSize: Typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    fontWeight: '700',
  },
  title: {
    color: AppTheme.colors.text,
    fontSize: Typography.h1,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: Typography.body,
    lineHeight: 22,
  },
});
