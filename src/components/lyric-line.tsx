import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppTheme, Radius, Spacing, Typography } from '@/constants/theme';
import { LyricLine as LyricLineType, SupportedLanguage } from '@/types/music';
import { formatDuration } from '@/utils/time';
import { ThemedText } from '@/components/themed-text';

type LyricLineProps = {
  line: LyricLineType;
  language: SupportedLanguage;
  isActive: boolean;
};

export function LyricLine({ line, language, isActive }: LyricLineProps) {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isActive ? AppTheme.colors.cardActive : AppTheme.colors.card },
      ]}>
      <ThemedText style={styles.timestamp} themeColor="textMuted">
        {formatDuration(line.timestampMs)}
      </ThemedText>
      <ThemedText style={[styles.text, isActive && styles.activeText]}>
        {line.translations[language]}
      </ThemedText>
      {language !== 'english' ? (
        <ThemedText style={styles.original} themeColor="textMuted">
          {line.original}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  timestamp: {
    fontSize: Typography.caption,
    fontWeight: '700',
  },
  text: {
    color: AppTheme.colors.textSecondary,
    fontSize: Typography.body,
    lineHeight: 22,
    fontWeight: '600',
  },
  activeText: {
    color: AppTheme.colors.text,
  },
  original: {
    fontSize: Typography.caption,
    lineHeight: 18,
  },
});
