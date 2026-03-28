import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { LanguageSelector } from '@/components/language-selector';
import { ScreenContainer } from '@/components/screen-container';
import { SectionHeader } from '@/components/section-header';
import { SongCard } from '@/components/song-card';
import { AppTheme, Radius, Spacing, Typography } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { ThemedText } from '@/components/themed-text';

export default function HomeScreen() {
  const router = useRouter();
  const { songs, currentSong, selectedLanguage, selectLanguage, setSongById } = useAppState();

  return (
    <ScreenContainer>
      <View style={styles.heroCard}>
        <SectionHeader
          eyebrow="AI Music App"
          title="Build your Spotify-style streaming app"
          subtitle="We’ve replaced the starter template with a real app foundation. This first step gives you navigation, shared state, multilingual lyric data, and a player screen to extend next."
        />

        <View style={styles.heroFooter}>
          <View style={styles.nowPlayingBadge}>
            <ThemedText style={styles.badgeLabel}>Now queued</ThemedText>
            <ThemedText style={styles.badgeValue}>{currentSong.title}</ThemedText>
          </View>

          <Pressable
            onPress={() => router.push(`/player/${currentSong.id}`)}
            style={styles.primaryButton}>
            <ThemedText style={styles.primaryButtonLabel}>Open player</ThemedText>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader
          eyebrow="Translation"
          title="Preferred lyric language"
          subtitle="Right now this uses local multilingual demo data. In the next step, we’ll replace this with a real translation API."
        />
        <LanguageSelector value={selectedLanguage} onChange={selectLanguage} />
      </View>

      <View style={styles.section}>
        <SectionHeader
          eyebrow="Songs"
          title="Trending for you"
          subtitle="Tap any song card to set it as the active track and open the player screen."
        />

        <View style={styles.songList}>
          {songs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              isActive={song.id === currentSong.id}
              onPress={() => {
                setSongById(song.id);
                router.push(`/player/${song.id}`);
              }}
            />
          ))}
        </View>
      </View>

      <View style={styles.noteCard}>
        <ThemedText style={styles.noteTitle}>How this maps to your learning flow</ThemedText>
        <ThemedText style={styles.noteText} themeColor="textSecondary">
          Frontend: screens, reusable components, shared state, and design system first.
        </ThemedText>
        <ThemedText style={styles.noteText} themeColor="textSecondary">
          Backend next: auth routes, song APIs, lyrics API proxy, translation controller, and DB models.
        </ThemedText>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: '#121A16',
    padding: Spacing.xl,
    borderRadius: Radius.xl,
    gap: Spacing.lg,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  heroFooter: {
    gap: Spacing.md,
  },
  nowPlayingBadge: {
    gap: 4,
  },
  badgeLabel: {
    color: AppTheme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontSize: Typography.caption,
    fontWeight: '700',
  },
  badgeValue: {
    color: AppTheme.colors.text,
    fontSize: Typography.h3,
    fontWeight: '700',
  },
  primaryButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.round,
    backgroundColor: AppTheme.colors.primary,
  },
  primaryButtonLabel: {
    color: AppTheme.colors.primaryText,
    fontWeight: '800',
    fontSize: Typography.body,
  },
  section: {
    gap: Spacing.md,
  },
  songList: {
    gap: Spacing.md,
  },
  noteCard: {
    gap: 8,
    backgroundColor: AppTheme.colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  noteTitle: {
    color: AppTheme.colors.text,
    fontSize: Typography.h3,
    fontWeight: '700',
  },
  noteText: {
    fontSize: Typography.body,
    lineHeight: 22,
  },
});
