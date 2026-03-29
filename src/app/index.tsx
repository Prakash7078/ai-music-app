import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ArtistCard } from '@/components/artist-card';
import { LanguageSelector } from '@/components/language-selector';
import { ScreenContainer } from '@/components/screen-container';
import { SearchBar } from '@/components/search-bar';
import { SectionHeader } from '@/components/section-header';
import { SongCard } from '@/components/song-card';
import { API_BASE_URL } from '@/config/api';
import { AppTheme, Radius, Spacing, Typography } from '@/constants/theme';
import { useAppState } from '@/context/app-state';
import { ThemedText } from '@/components/themed-text';

export default function HomeScreen() {
  const router = useRouter();
  const {
    songs,
    songsState,
    songsError,
    artists,
    artistsState,
    artistsError,
    searchQuery,
    searchState,
    searchError,
    currentSong,
    selectedLanguage,
    setSearchQuery,
    selectLanguage,
    setSongById,
  } = useAppState();

  const isSearching = Boolean(searchQuery.trim());

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
          eyebrow="Discovery"
          title="Search Audius songs and artists"
          subtitle="This uses your Express backend search routes so you can practice full-stack fetching from React Native."
        />
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <View style={styles.noteCard}>
          <ThemedText style={styles.noteTitle}>Search status</ThemedText>
          <ThemedText style={styles.noteText} themeColor="textSecondary">
            {isSearching
              ? searchState === 'loading'
                ? `Searching for "${searchQuery}"...`
                : searchState === 'error'
                  ? `Search failed for "${searchQuery}".`
                  : `Showing results for "${searchQuery}".`
              : 'Type in the search bar to query tracks and users from the backend.'}
          </ThemedText>
          {searchError ? <ThemedText style={styles.apiErrorText}>{searchError}</ThemedText> : null}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader
          eyebrow="Backend"
          title={isSearching ? 'Search-backed songs API' : 'Songs from backend API'}
          subtitle={
            isSearching
              ? 'These results come from your backend search routes when the API base URL is configured.'
              : 'The frontend now supports fetching songs from Express. Without a backend URL, it keeps using local fallback data so development stays smooth.'
          }
        />
        <View style={styles.noteCard}>
          <ThemedText style={styles.noteTitle}>Songs API status</ThemedText>
          <ThemedText style={styles.noteText} themeColor="textSecondary">
            API base URL: {API_BASE_URL || 'not set'}
          </ThemedText>
          <ThemedText style={styles.noteText} themeColor="textSecondary">
            Songs in memory: {songs.length}
          </ThemedText>
          <ThemedText style={styles.noteText} themeColor="textSecondary">
            {songsState === 'loading'
              ? 'Loading songs from the backend...'
              : songsState === 'error'
                ? 'Backend fetch failed. Falling back to local songs.'
                : 'Songs are ready.'}
          </ThemedText>
          {songs[0] ? (
            <ThemedText style={styles.noteText} themeColor="textSecondary">
              First song: {songs[0].title}
            </ThemedText>
          ) : null}
          {songsError ? (
            <ThemedText style={styles.apiErrorText}>{songsError}</ThemedText>
          ) : null}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader
          eyebrow="Artists"
          title={isSearching ? 'Matched Audius users' : 'Audius users on frontend'}
          subtitle={
            isSearching
              ? 'Artist results update from the backend as your search query changes.'
              : 'This section now fetches artist/user data from the backend so you can confirm Audius data is reaching the UI.'
          }
        />
        <View style={styles.noteCard}>
          <ThemedText style={styles.noteTitle}>Users API status</ThemedText>
          <ThemedText style={styles.noteText} themeColor="textSecondary">
            Users in memory: {artists.length}
          </ThemedText>
          <ThemedText style={styles.noteText} themeColor="textSecondary">
            {artistsState === 'loading'
              ? 'Loading users from the backend...'
              : artistsState === 'error'
                ? 'Users request failed.'
                : artists.length > 0
                  ? 'Users are ready.'
                  : 'No users returned yet.'}
          </ThemedText>
          {artistsError ? (
            <ThemedText style={styles.apiErrorText}>{artistsError}</ThemedText>
          ) : null}
        </View>

        <View style={styles.songList}>
          {artists.length > 0 ? (
            artists.map((artist) => <ArtistCard key={artist.id} artist={artist} />)
          ) : (
            <View style={styles.noteCard}>
              <ThemedText style={styles.noteText} themeColor="textSecondary">
                {isSearching
                  ? 'No artist matches yet for this search.'
                  : 'No artists have been loaded yet.'}
              </ThemedText>
            </View>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader
          eyebrow="Translation"
          title="Preferred lyric language"
          subtitle="The app now plays real streaming audio. Lyrics are still demo content for now, and the next step is replacing translations with a real API."
        />
        <LanguageSelector value={selectedLanguage} onChange={selectLanguage} />
      </View>

      <View style={styles.section}>
        <SectionHeader
          eyebrow="Songs"
          title={isSearching ? 'Track results' : 'Trending for you'}
          subtitle={
            isSearching
              ? 'Tap a search result to make it the active track and open the player.'
              : 'Tap any song card to set it as the active track and open the player screen.'
          }
        />

        <View style={styles.songList}>
          {songs.length > 0 ? (
            songs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                isActive={song.id === currentSong.id}
                onPress={() => {
                  setSongById(song.id);
                  router.push(`/player/${song.id}`);
                }}
              />
            ))
          ) : (
            <View style={styles.noteCard}>
              <ThemedText style={styles.noteText} themeColor="textSecondary">
                {isSearching
                  ? 'No songs matched your search. Try another title or artist name.'
                  : 'No songs are available right now.'}
              </ThemedText>
            </View>
          )}
        </View>
      </View>

      <View style={styles.noteCard}>
        <ThemedText style={styles.noteTitle}>How this maps to your learning flow</ThemedText>
        <ThemedText style={styles.noteText} themeColor="textSecondary">
          Frontend: screens, reusable components, shared state, design system, and real audio playback.
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
  apiErrorText: {
    color: '#FCA5A5',
    fontSize: Typography.caption,
    lineHeight: 18,
    fontWeight: '600',
  },
});
