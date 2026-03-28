import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { mockSongs } from '@/data/mock-songs';
import { clamp } from '@/utils/time';
import { Song, SupportedLanguage } from '@/types/music';

type AppStateValue = {
  songs: Song[];
  currentSong: Song;
  currentSongIndex: number;
  selectedLanguage: SupportedLanguage;
  progressMs: number;
  isPlaying: boolean;
  activeLyricIndex: number;
  setSongById: (songId: string) => void;
  selectLanguage: (language: SupportedLanguage) => void;
  togglePlayback: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seekTo: (nextProgressMs: number) => void;
};

const AppStateContext = createContext<AppStateValue | null>(null);

function getActiveLyricIndex(song: Song, progressMs: number) {
  return song.lyrics.findLastIndex((line) => line.timestampMs <= progressMs);
}

export function AppProvider({ children }: React.PropsWithChildren) {
  const [songs] = useState(mockSongs);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('english');
  const [progressMs, setProgressMs] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentSong = songs[currentSongIndex] ?? songs[0];

  const setSongById = useCallback(
    (songId: string) => {
      const nextIndex = songs.findIndex((song) => song.id === songId);
      if (nextIndex >= 0) {
        setCurrentSongIndex(nextIndex);
      }
    },
    [songs]
  );

  const selectLanguage = useCallback((language: SupportedLanguage) => {
    setSelectedLanguage(language);
  }, []);

  const togglePlayback = useCallback(() => {
    setIsPlaying((currentValue) => !currentValue);
  }, []);

  const playNext = useCallback(() => {
    setCurrentSongIndex((currentIndex) => (currentIndex + 1) % songs.length);
  }, [songs.length]);

  const playPrevious = useCallback(() => {
    setCurrentSongIndex((currentIndex) => (currentIndex - 1 + songs.length) % songs.length);
  }, [songs.length]);

  const seekTo = useCallback(
    (nextProgressMs: number) => {
      setProgressMs(clamp(nextProgressMs, 0, currentSong.durationMs));
    },
    [currentSong.durationMs]
  );

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timer = setInterval(() => {
      setProgressMs((currentProgress) => {
        const nextProgress = currentProgress + 1000;

        if (nextProgress >= currentSong.durationMs) {
          setCurrentSongIndex((currentIndex) => (currentIndex + 1) % songs.length);
          return 0;
        }

        return nextProgress;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSong.durationMs, isPlaying, songs.length]);

  useEffect(() => {
    setProgressMs(0);
  }, [currentSongIndex]);

  const value = useMemo<AppStateValue>(() => {
    const activeLyricIndex = Math.max(getActiveLyricIndex(currentSong, progressMs), 0);

    return {
      songs,
      currentSong,
      currentSongIndex,
      selectedLanguage,
      progressMs,
      isPlaying,
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
    isPlaying,
    playNext,
    playPrevious,
    progressMs,
    seekTo,
    selectLanguage,
    selectedLanguage,
    setSongById,
    songs,
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
