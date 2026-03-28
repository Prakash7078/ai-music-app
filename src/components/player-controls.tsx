import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppTheme, Radius, Spacing, Typography } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';

type PlayerControlsProps = {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
};

export function PlayerControls({
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
}: PlayerControlsProps) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onPrevious} style={styles.secondaryButton}>
        <ThemedText style={styles.secondaryLabel}>Prev</ThemedText>
      </Pressable>

      <Pressable onPress={onPlayPause} style={styles.primaryButton}>
        <ThemedText style={styles.primaryLabel}>{isPlaying ? 'Pause' : 'Play'}</ThemedText>
      </Pressable>

      <Pressable onPress={onNext} style={styles.secondaryButton}>
        <ThemedText style={styles.secondaryLabel}>Next</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.round,
    alignItems: 'center',
    backgroundColor: AppTheme.colors.card,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  primaryButton: {
    flex: 1.2,
    paddingVertical: Spacing.md,
    borderRadius: Radius.round,
    alignItems: 'center',
    backgroundColor: AppTheme.colors.primary,
  },
  secondaryLabel: {
    fontSize: Typography.body,
    fontWeight: '700',
    color: AppTheme.colors.text,
  },
  primaryLabel: {
    fontSize: Typography.body,
    fontWeight: '800',
    color: AppTheme.colors.primaryText,
  },
});
