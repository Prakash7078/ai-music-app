import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppTheme, Radius, Spacing, Typography } from '@/constants/theme';
import { Song } from '@/types/music';
import { formatDuration } from '@/utils/time';
import { ThemedText } from '@/components/themed-text';

type SongCardProps = {
  song: Song;
  isActive: boolean;
  onPress: () => void;
};

export function SongCard({ song, isActive, onPress }: SongCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: isActive ? AppTheme.colors.cardActive : AppTheme.colors.card },
        pressed && styles.cardPressed,
      ]}>
      <View style={[styles.cover, { backgroundColor: song.coverColor }]}>
        <ThemedText style={styles.coverText}>{song.album}</ThemedText>
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <ThemedText style={styles.title}>{song.title}</ThemedText>
          <ThemedText style={styles.duration} themeColor="textMuted">
            {formatDuration(song.durationMs)}
          </ThemedText>
        </View>

        <ThemedText style={styles.artist} themeColor="textSecondary">
          {song.artist}
        </ThemedText>
        <ThemedText style={styles.description} themeColor="textMuted">
          {song.description}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  cover: {
    width: 76,
    height: 76,
    borderRadius: Radius.md,
    justifyContent: 'flex-end',
    padding: Spacing.sm,
  },
  coverText: {
    color: '#F8FAFC',
    fontSize: Typography.caption,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: Typography.h3,
    fontWeight: '700',
    color: AppTheme.colors.text,
  },
  duration: {
    fontSize: Typography.caption,
  },
  artist: {
    fontSize: Typography.body,
    fontWeight: '600',
  },
  description: {
    fontSize: Typography.caption,
    lineHeight: 18,
  },
});
