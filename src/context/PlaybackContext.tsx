"use client";

import { createContext, useContext, useState } from "react";
import { songs as allSongs } from "../../public/data/songs";
type PlaybackContextType = {
  currentSong: any;
  queue: any[];
  isPlaying: boolean;
  shuffle: boolean;
  loop: boolean;
  playSong: (song: any, playlist?: any[]) => void;
  next: () => void;
  prev: () => void;
  togglePlay: () => void;
  toggleShuffle: () => void;
  toggleLoop: () => void;
};

const PlaybackContext = createContext<PlaybackContextType | null>(null);

export function PlaybackProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState(allSongs);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [loop, setLoop] = useState(false);

  const currentSong = queue[currentIndex];

  const playSong = (song: any, playlist = allSongs) => {
    setQueue(playlist);
    const index = playlist.findIndex((s) => s.id === song.id);
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const next = () => {
    if (shuffle) {
      const random = Math.floor(Math.random() * queue.length);
      setCurrentIndex(random);
    } else if (currentIndex < queue.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else if (loop) {
      setCurrentIndex(0);
    }
  };

  const prev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  return (
    <PlaybackContext.Provider
      value={{
        currentSong,
        queue,
        isPlaying,
        shuffle,
        loop,
        playSong,
        next,
        prev,
        togglePlay: () => setIsPlaying((p) => !p),
        toggleShuffle: () => setShuffle((s) => !s),
        toggleLoop: () => setLoop((l) => !l),
      }}
    >
      {children}
    </PlaybackContext.Provider>
  );
}

export const usePlayback = () => {
  const ctx = useContext(PlaybackContext);
  if (!ctx) throw new Error("usePlayback must be inside PlaybackProvider");
  return ctx;
};
