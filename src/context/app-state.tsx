import {
  setAudioModeAsync,
  setIsAudioActiveAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from 'expo-audio';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { mockSongs } from '@/data/mock-songs';
import { fetchTimedLyrics } from '@/services/lyrics';
import { fetchSongs, searchSongs } from '@/services/songs';
import { translateLyrics } from '@/services/translation';
import { fetchFeaturedUsers, searchUsers } from '@/services/users';
import { ArtistProfile, LyricLine, LyricsLoadState, Song, SupportedLanguage } from '@/types/music';

type AppStateValue = {
  songs: Song[];
  songsState: LyricsLoadState;
  songsError: string | null;
  artists: ArtistProfile[];
  artistsState: LyricsLoadState;
  artistsError: string | null;
  searchQuery: string;
  searchState: LyricsLoadState;
  searchError: string | null;
  currentSong: Song;
  lyrics: LyricLine[];
  lyricsState: LyricsLoadState;
  translationState: LyricsLoadState;
  lyricsError: string | null;
  selectedLanguage: SupportedLanguage;
  progressMs: number;
  durationMs: number;
  isPlaying: boolean;
  isBuffering: boolean;
  isAudioReady: boolean;
  playbackState: string;
  activeLyricIndex: number;
  setSongById: (songId: string) => void;
  setSearchQuery: (query: string) => void;
  selectLanguage: (language: SupportedLanguage) => void;
  togglePlayback: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seekTo: (nextProgressMs: number) => Promise<void>;
};

const AppStateContext = createContext<AppStateValue | null>(null);

function getActiveLyricIndex(lyrics: LyricLine[], progressMs: number) {
  return lyrics.findLastIndex((line) => line.timestampMs <= progressMs);
}

function mergeSongs(primarySongs: Song[], secondarySongs: Song[]) {
  const mergedSongs = new Map<string, Song>();

  [...primarySongs, ...secondarySongs].forEach((song) => {
    mergedSongs.set(song.id, song);
  });

  return Array.from(mergedSongs.values());
}

export function AppProvider({ children }: React.PropsWithChildren) {
  const [songs, setSongs] = useState<Song[]>(mockSongs);
  const [songsState, setSongsState] = useState<LyricsLoadState>('idle');
  const [songsError, setSongsError] = useState<string | null>(null);
  const [artists, setArtists] = useState<ArtistProfile[]>([]);
  const [artistsState, setArtistsState] = useState<LyricsLoadState>('idle');
  const [artistsError, setArtistsError] = useState<string | null>(null);
  const [searchQuery, setSearchQueryValue] = useState('');
  const [searchSongsResults, setSearchSongsResults] = useState<Song[]>([]);
  const [searchArtistsResults, setSearchArtistsResults] = useState<ArtistProfile[]>([]);
  const [searchState, setSearchState] = useState<LyricsLoadState>('idle');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [currentSongId, setCurrentSongId] = useState(mockSongs[0]?.id ?? '');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('english');
  const [shouldAutoPlay, setShouldAutoPlay] = useState(true);
  const [baseLyrics, setBaseLyrics] = useState<LyricLine[]>(mockSongs[0]?.lyrics ?? []);
  const [lyrics, setLyrics] = useState<LyricLine[]>(mockSongs[0]?.lyrics ?? []);
  const [lyricsState, setLyricsState] = useState<LyricsLoadState>('idle');
  const [translationState, setTranslationState] = useState<LyricsLoadState>('idle');
  const [lyricsError, setLyricsError] = useState<string | null>(null);
  const [pendingAutoPlay, setPendingAutoPlay] = useState(true);

  const visibleSongs = searchQuery.trim() ? searchSongsResults : songs;
  const visibleArtists = searchQuery.trim() ? searchArtistsResults : artists;
  const songCatalog = useMemo(() => mergeSongs(songs, searchSongsResults), [searchSongsResults, songs]);
  const currentSong = songCatalog.find((song) => song.id === currentSongId) ?? songCatalog[0] ?? mockSongs[0];
  const lyricsRequestSong = useMemo(
    () => ({
      id: currentSong.id,
      title: currentSong.title,
      artist: currentSong.artist,
      durationMs: currentSong.durationMs,
      lyrics: currentSong.lyrics,
    }),
    [currentSong.artist, currentSong.durationMs, currentSong.id, currentSong.lyrics, currentSong.title]
  );
  const shouldAutoPlayRef = useRef(shouldAutoPlay);
  const player = useAudioPlayer(null, {
    updateInterval: 250,
    preferredForwardBufferDuration: 10,
  });
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    shouldAutoPlayRef.current = shouldAutoPlay;
  }, [shouldAutoPlay]);

  useEffect(() => {
    let isCancelled = false;

    async function loadSongs() {
      setSongsState('loading');
      setSongsError(null);

      try {
        const fetchedSongs = await fetchSongs();

        if (isCancelled) {
          return;
        }

        if (fetchedSongs.length === 0) {
          setSongsError('No songs were returned by the backend. Using local fallback songs.');
          setSongsState('error');
          setSongs(mockSongs);
          return;
        }

        setSongs(fetchedSongs);
        setSongsState('ready');
      } catch (error) {
        if (isCancelled) {
          return;
        }

        const message = error instanceof Error ? error.message : 'Unable to load songs';
        setSongsError(message);
        setSongsState('error');
        setSongs(mockSongs);
      }
    }

    loadSongs();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    async function loadArtists() {
      setArtistsState('loading');
      setArtistsError(null);

      try {
        const fetchedArtists = await fetchFeaturedUsers();

        if (isCancelled) {
          return;
        }

        setArtists(fetchedArtists);
        setArtistsState('ready');
      } catch (error) {
        if (isCancelled) {
          return;
        }

        const message = error instanceof Error ? error.message : 'Unable to load users';
        setArtistsError(message);
        setArtistsState('error');
        setArtists([]);
      }
    }

    loadArtists();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (songCatalog.length > 0 && !songCatalog.some((song) => song.id === currentSongId)) {
      setCurrentSongId(songCatalog[0].id);
    }
  }, [currentSongId, songCatalog]);

  useEffect(() => {
    const normalizedQuery = searchQuery.trim();

    if (!normalizedQuery) {
      setSearchSongsResults([]);
      setSearchArtistsResults([]);
      setSearchState('idle');
      setSearchError(null);
      return;
    }

    let isCancelled = false;
    const timeoutId = setTimeout(async () => {
      setSearchState('loading');
      setSearchError(null);

      try {
        const [matchedSongs, matchedArtists] = await Promise.all([
          searchSongs(normalizedQuery),
          searchUsers(normalizedQuery),
        ]);

        if (isCancelled) {
          return;
        }

        setSearchSongsResults(matchedSongs);
        setSearchArtistsResults(matchedArtists);
        setSearchState('ready');
      } catch (error) {
        if (isCancelled) {
          return;
        }

        const message = error instanceof Error ? error.message : 'Unable to search right now';
        setSearchSongsResults([]);
        setSearchArtistsResults([]);
        setSearchError(message);
        setSearchState('error');
      }
    }, 350);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  useEffect(() => {
    async function configureAudioMode() {
      await setIsAudioActiveAsync(true);
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: false,
        interruptionMode: 'duckOthers',
      });
    }

    configureAudioMode().catch((error) => {
      console.warn('Failed to configure audio mode', error);
    });
  }, []);

  useEffect(() => {
    if (status.isLoaded && pendingAutoPlay) {
      player.play();
      setPendingAutoPlay(false);
    }
  }, [pendingAutoPlay, player, status.isLoaded]);

  useEffect(() => {
    player.pause();
    player.replace(currentSong.audioSource);
    setPendingAutoPlay(shouldAutoPlayRef.current);
  }, [currentSong.audioSource, currentSong.id, player]);

  useEffect(() => {
    if (status.didJustFinish) {
      const currentIndex = songCatalog.findIndex((song) => song.id === currentSong.id);
      const nextSong = songCatalog[(currentIndex + 1) % songCatalog.length];

      if (nextSong) {
        setCurrentSongId(nextSong.id);
      }

      setShouldAutoPlay(true);
    }
  }, [currentSong.id, songCatalog, status.didJustFinish]);

  useEffect(() => {
    let isCancelled = false;

    async function loadLyrics() {
      setLyricsState('loading');
      setTranslationState('idle');
      setLyricsError(null);
      setBaseLyrics([]);
      setLyrics([]);

      try {
        const fetchedLyrics = await fetchTimedLyrics(lyricsRequestSong);

        if (isCancelled) {
          return;
        }

        setBaseLyrics(fetchedLyrics);
        setLyricsState('ready');
      } catch (error) {
        if (isCancelled) {
          return;
        }

        const message = error instanceof Error ? error.message : 'Unable to load lyrics';
        if (lyricsRequestSong.lyrics.length > 0) {
          setBaseLyrics(lyricsRequestSong.lyrics);
          setLyricsState('ready');
          setLyricsError(message);
          return;
        }

        setLyricsError(message);
        setLyricsState('error');
        setBaseLyrics([]);
      }
    }

    loadLyrics();

    return () => {
      isCancelled = true;
    };
  }, [lyricsRequestSong]);

  useEffect(() => {
    let isCancelled = false;

    async function loadTranslatedLyrics() {
      if (lyricsState !== 'ready') {
        return;
      }

      setTranslationState('loading');

      try {
        const translatedLyrics = await translateLyrics(baseLyrics, selectedLanguage);

        if (isCancelled) {
          return;
        }

        setLyrics(translatedLyrics);
        setTranslationState('ready');
      } catch (error) {
        if (isCancelled) {
          return;
        }

        const message =
          error instanceof Error ? error.message : 'Unable to translate lyrics right now';
        setLyricsError(message);
        setLyrics(baseLyrics);
        setTranslationState('error');
      }
    }

    loadTranslatedLyrics();

    return () => {
      isCancelled = true;
    };
  }, [baseLyrics, lyricsState, selectedLanguage]);

  const setSongById = useCallback(
    (songId: string) => {
      if (songCatalog.some((song) => song.id === songId)) {
        setCurrentSongId(songId);
        setShouldAutoPlay(true);
      }
    },
    [songCatalog]
  );

  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryValue(query);
  }, []);

  const selectLanguage = useCallback((language: SupportedLanguage) => {
    setSelectedLanguage(language);
  }, []);

  const togglePlayback = useCallback(() => {
    if (status.playing) {
      player.pause();
      setShouldAutoPlay(false);
      setPendingAutoPlay(false);
      return;
    }

    setShouldAutoPlay(true);
    if (status.isLoaded) {
      player.play();
      setPendingAutoPlay(false);
      return;
    }

    setPendingAutoPlay(true);
  }, [player, status.isLoaded, status.playing]);

  const playNext = useCallback(() => {
    if (songCatalog.length === 0) {
      return;
    }

    const currentIndex = songCatalog.findIndex((song) => song.id === currentSong.id);
    const nextSong = songCatalog[(currentIndex + 1) % songCatalog.length];

    if (nextSong) {
      setCurrentSongId(nextSong.id);
    }

    setShouldAutoPlay(true);
  }, [currentSong.id, songCatalog]);

  const playPrevious = useCallback(() => {
    if (songCatalog.length === 0) {
      return;
    }

    const currentIndex = songCatalog.findIndex((song) => song.id === currentSong.id);
    const previousSong = songCatalog[(currentIndex - 1 + songCatalog.length) % songCatalog.length];

    if (previousSong) {
      setCurrentSongId(previousSong.id);
    }

    setShouldAutoPlay(true);
  }, [currentSong.id, songCatalog]);

  const seekTo = useCallback(
    async (nextProgressMs: number) => {
      await player.seekTo(nextProgressMs / 1000);
    },
    [player]
  );

  const progressMs = Math.round((status.currentTime ?? 0) * 1000);
  const durationMs =
    status.duration && status.duration > 0
      ? Math.round(status.duration * 1000)
      : currentSong.durationMs;

  const value = useMemo<AppStateValue>(() => {
    const activeLyricIndex = Math.max(getActiveLyricIndex(lyrics, progressMs), 0);

    return {
      songs: visibleSongs,
      songsState,
      songsError,
      artists: visibleArtists,
      artistsState,
      artistsError,
      searchQuery,
      searchState,
      searchError,
      currentSong,
      lyrics,
      lyricsState,
      translationState,
      lyricsError,
      selectedLanguage,
      progressMs,
      durationMs,
      isPlaying: status.playing,
      isBuffering: status.isBuffering,
      isAudioReady: status.isLoaded,
      playbackState: status.playbackState,
      activeLyricIndex,
      setSongById,
      setSearchQuery,
      selectLanguage,
      togglePlayback,
      playNext,
      playPrevious,
      seekTo,
    };
  }, [
    currentSong,
    durationMs,
    lyrics,
    lyricsError,
    lyricsState,
    playNext,
    playPrevious,
    progressMs,
    seekTo,
    selectLanguage,
    selectedLanguage,
    searchError,
    searchQuery,
    searchState,
    setSongById,
    setSearchQuery,
    visibleSongs,
    visibleArtists,
    artistsError,
    artistsState,
    songsError,
    songsState,
    status.isBuffering,
    status.isLoaded,
    status.playbackState,
    status.playing,
    togglePlayback,
    translationState,
  ]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppStateContext);

  if (!value) {
    throw new Error('useAppState must be used inside AppProvider');
  }

  return value;
}
