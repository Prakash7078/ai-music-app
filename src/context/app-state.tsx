import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { mockSongs } from '@/data/mock-songs';
import { Song, SupportedLanguage } from '@/types/music';

type AppStateValue = {
  songs: Song[];
  currentSong: Song;
  currentSongIndex: number;
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

function getActiveLyricIndex(song: Song, progressMs: number) {
  return song.lyrics.findLastIndex((line) => line.timestampMs <= progressMs);
}

export function AppProvider({ children }: React.PropsWithChildren) {
  const songs = mockSongs;
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('english');
  const [shouldAutoPlay, setShouldAutoPlay] = useState(true);

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
    const activeLyricIndex = Math.max(getActiveLyricIndex(currentSong, progressMs), 0);

    return {
      songs,
      currentSong,
      currentSongIndex,
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
