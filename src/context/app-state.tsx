import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { mockSongs } from '@/data/mock-songs';
import { fetchTimedLyrics } from '@/services/lyrics';
import { translateLyrics } from '@/services/translation';
import { LyricLine, LyricsLoadState, Song, SupportedLanguage } from '@/types/music';

type AppStateValue = {
  songs: Song[];
  currentSong: Song;
  currentSongIndex: number;
  lyrics: LyricLine[];
  lyricsState: LyricsLoadState;
  translationState: LyricsLoadState;
  lyricsError: string | null;
  selectedLanguage: SupportedLanguage;
  progressMs: number;
  durationMs: number;
  isPlaying: boolean;
  isBuffering: boolean;
  activeLyricIndex: number;
  setSongById: (songId: string) => void;
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

export function AppProvider({ children }: React.PropsWithChildren) {
  const songs = mockSongs;
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('english');
  const [shouldAutoPlay, setShouldAutoPlay] = useState(true);
  const [baseLyrics, setBaseLyrics] = useState<LyricLine[]>(songs[0]?.lyrics ?? []);
  const [lyrics, setLyrics] = useState<LyricLine[]>(songs[0]?.lyrics ?? []);
  const [lyricsState, setLyricsState] = useState<LyricsLoadState>('idle');
  const [translationState, setTranslationState] = useState<LyricsLoadState>('idle');
  const [lyricsError, setLyricsError] = useState<string | null>(null);

  const currentSong = songs[currentSongIndex] ?? songs[0];
  const player = useAudioPlayer(currentSong.audioSource, {
    updateInterval: 250,
    downloadFirst: false,
  });
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    async function configureAudioMode() {
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
    if (status.isLoaded && shouldAutoPlay) {
      player.play();
    }
  }, [player, shouldAutoPlay, status.isLoaded]);

  useEffect(() => {
    if (status.didJustFinish) {
      setCurrentSongIndex((currentIndex) => (currentIndex + 1) % songs.length);
      setShouldAutoPlay(true);
    }
  }, [songs.length, status.didJustFinish]);

  useEffect(() => {
    let isCancelled = false;

    async function loadLyrics() {
      setLyricsState('loading');
      setTranslationState(selectedLanguage === 'english' ? 'loading' : 'idle');
      setLyricsError(null);

      try {
        const fetchedLyrics = await fetchTimedLyrics(currentSong.id);

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
        setLyricsError(message);
        setLyricsState('error');
        setBaseLyrics(currentSong.lyrics);
      }
    }

    loadLyrics();

    return () => {
      isCancelled = true;
    };
  }, [currentSong.id, currentSong.lyrics, selectedLanguage]);

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
      const nextIndex = songs.findIndex((song) => song.id === songId);
      if (nextIndex >= 0) {
        setCurrentSongIndex(nextIndex);
        setShouldAutoPlay(true);
      }
    },
    [songs]
  );

  const selectLanguage = useCallback((language: SupportedLanguage) => {
    setSelectedLanguage(language);
  }, []);

  const togglePlayback = useCallback(() => {
    if (status.playing) {
      player.pause();
      setShouldAutoPlay(false);
      return;
    }

    player.play();
    setShouldAutoPlay(true);
  }, [player, status.playing]);

  const playNext = useCallback(() => {
    setCurrentSongIndex((currentIndex) => (currentIndex + 1) % songs.length);
    setShouldAutoPlay(true);
  }, [songs.length]);

  const playPrevious = useCallback(() => {
    setCurrentSongIndex((currentIndex) => (currentIndex - 1 + songs.length) % songs.length);
    setShouldAutoPlay(true);
  }, [songs.length]);

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
      songs,
      currentSong,
      currentSongIndex,
      lyrics,
      lyricsState,
      translationState,
      lyricsError,
      selectedLanguage,
      progressMs,
      durationMs,
      isPlaying: status.playing,
      isBuffering: status.isBuffering,
      activeLyricIndex,
      setSongById,
      selectLanguage,
      togglePlayback,
      playNext,
      playPrevious,
      seekTo,
    };
  }, [
    currentSong,
    currentSongIndex,
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
    setSongById,
    songs,
    status.isBuffering,
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
