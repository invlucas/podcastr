import { createContext, useCallback, useContext, useState } from 'react';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  play: (episode: Episode) => void;
  playlist: (list: Episode[], index: number) => void;
  toggleShuffle: () => void;
  toggleLoop: () => void;
  togglePlay: () => void;
  setPlayingState: (state: boolean) => void;
  hasPrevious: () => boolean;
  hasNext: () => boolean;
  playPrevious: () => void;
  playNext: () => void;
  clearPlayerState: () => void;
};

const PlayerContext = createContext({} as PlayerContextData);

export const PlayerContextProvider: React.FC = ({ children }) => {
  const [episodeList, setEpisodeList] = useState<Episode[]>([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const play = useCallback((episode: Episode) => {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }, []);

  const playlist = useCallback((list: Episode[], index: number) => {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const toggleLoop = useCallback(() => {
    setIsLooping(!isLooping);
  }, [isLooping]);

  const toggleShuffle = useCallback(() => {
    setIsShuffling(!isShuffling);
  }, [isShuffling]);

  const setPlayingState = useCallback((state: boolean) => {
    setIsPlaying(state);
  }, []);

  const hasPrevious = useCallback(
    () => currentEpisodeIndex > 0,
    [currentEpisodeIndex],
  );

  const hasNext = useCallback(
    () => isShuffling || currentEpisodeIndex + 1 < episodeList.length,
    [currentEpisodeIndex, episodeList.length, isShuffling],
  );

  const clearPlayerState = useCallback(() => {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }, []);

  const playNext = useCallback(() => {
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(
        Math.random() * episodeList.length,
      );
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (hasNext()) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }, [hasNext, currentEpisodeIndex, isShuffling, episodeList.length]);

  const playPrevious = useCallback(() => {
    if (hasPrevious()) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }, [currentEpisodeIndex, hasPrevious]);

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        play,
        playlist,
        isPlaying,
        isLooping,
        isShuffling,
        toggleShuffle,
        toggleLoop,
        togglePlay,
        setPlayingState,
        hasNext,
        hasPrevious,
        playPrevious,
        playNext,
        clearPlayerState,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export function usePlayer() {
  const context = useContext(PlayerContext);

  return context;
}
