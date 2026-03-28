import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { LanguageSelector } from '@/components/language-selector';
import { LyricLine } from '@/components/lyric-line';
import { PlayerControls } from '@/components/player-controls';
import { ProgressSlider } from '@/components/progress-slider';
import { ScreenContainer } from '@/components/screen-container';
import { AppTheme, Radius, Spacing, Typography } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { formatDuration } from '@/utils/time';
import { ThemedText } from '@/components/themed-text';

export default function PlayerScreen() {
  const router = useRouter();
  const { songId } = useLocalSearchParams<{ songId: string }>();
  const {
    currentSong,
    isPlaying,
    progressMs,
    selectedLanguage,
    activeLyricIndex,
    selectLanguage,
    setSongById,
    togglePlayback,
    playNext,
    playPrevious,
    seekTo,
  } = useAppState();

  useEffect(() => {
    if (songId) {
      setSongById(songId);
    }
  }, [setSongById, songId]);

  const progressRatio = progressMs / currentSong.durationMs;

  return (
    <ScreenContainer>
      <View style={[styles.coverArt, { backgroundColor: currentSong.coverColor }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backButtonLabel}>Back</ThemedText>
        </Pressable>

        <View style={styles.coverContent}>
          <ThemedText style={styles.albumLabel}>{currentSong.album}</ThemedText>
          <ThemedText style={styles.songTitle}>{currentSong.title}</ThemedText>
          <ThemedText style={styles.artistName}>{currentSong.artist}</ThemedText>
        </View>
      </View>

      <View style={styles.panel}>
        <View style={styles.timeRow}>
          <ThemedText style={styles.timeLabel} themeColor="textMuted">
            {formatDuration(progressMs)}
          </ThemedText>
          <ThemedText style={styles.timeLabel} themeColor="textMuted">
            {formatDuration(currentSong.durationMs)}
          </ThemedText>
        </View>

        <ProgressSlider progress={progressRatio} onSeek={(ratio) => seekTo(ratio * currentSong.durationMs)} />
        <PlayerControls
          isPlaying={isPlaying}
          onPlayPause={togglePlayback}
          onNext={playNext}
          onPrevious={playPrevious}
        />
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Lyric language</ThemedText>
        <LanguageSelector value={selectedLanguage} onChange={selectLanguage} />
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Time-synced lyrics</ThemedText>
        <ThemedText style={styles.sectionSubtitle} themeColor="textMuted">
          The highlighted line changes with playback progress. Next we’ll connect this to real audio and API-powered translation.
        </ThemedText>

        <View style={styles.lyricList}>
          {currentSong.lyrics.map((line, index) => (
            <LyricLine
              key={line.id}
              line={line}
              language={selectedLanguage}
              isActive={index === activeLyricIndex}
            />
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  coverArt: {
    minHeight: 300,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    justifyContent: 'space-between',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.round,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
  },
  backButtonLabel: {
    color: '#F8FAFC',
    fontWeight: '700',
  },
  coverContent: {
    gap: 8,
  },
  albumLabel: {
    color: 'rgba(248, 250, 252, 0.75)',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontSize: Typography.caption,
    fontWeight: '800',
  },
  songTitle: {
    color: '#F8FAFC',
    fontSize: Typography.display,
    fontWeight: '900',
  },
  artistName: {
    color: '#E2E8F0',
    fontSize: Typography.h3,
    fontWeight: '600',
  },
  panel: {
    backgroundColor: AppTheme.colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeLabel: {
    fontSize: Typography.caption,
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    color: AppTheme.colors.text,
    fontSize: Typography.h3,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: Typography.body,
    lineHeight: 22,
  },
  lyricList: {
    gap: Spacing.sm,
  },
});
