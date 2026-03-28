import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppTheme, Radius, Spacing } from '@/constants/theme';

type ProgressSliderProps = {
  progress: number;
  onSeek: (progressRatio: number) => void;
};

const SEEK_POINTS = [0, 0.25, 0.5, 0.75, 1];

export function ProgressSlider({ progress, onSeek }: ProgressSliderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.max(progress, 0.03) * 100}%` }]} />
      </View>

      <View style={styles.seekButtons}>
        {SEEK_POINTS.map((point) => (
          <Pressable key={point} onPress={() => onSeek(point)} style={styles.seekPill} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  track: {
    height: 6,
    borderRadius: Radius.round,
    backgroundColor: AppTheme.colors.card,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.round,
    backgroundColor: AppTheme.colors.primary,
  },
  seekButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  seekPill: {
    width: 18,
    height: 18,
    borderRadius: Radius.round,
    backgroundColor: AppTheme.colors.border,
  },
});
