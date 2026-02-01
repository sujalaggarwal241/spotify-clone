"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSongs } from "@/hooks/useSongs";

export type Song = {
  _id: string; // ✅ mongo id
  id?: string | number; // (optional) old numeric id support
  title?: string;
  audioUrl?: string;
  coverUrl?: string;
  artist?: string;
  artistId?: string;
  albumId?: string;
};

type PlaybackContextType = {
  currentSong: Song | null;
  queue: Song[];
  isPlaying: boolean;
  shuffle: boolean;
  loop: boolean;
  playSong: (song: Song, playlist?: Song[]) => void;
  next: () => void;
  prev: () => void;
  togglePlay: () => void;
  toggleShuffle: () => void;
  toggleLoop: () => void;
};

const PlaybackContext = createContext<PlaybackContextType | null>(null);

// ✅ stable key: prefer mongo _id, fallback to old id
function songKey(s: Song | null | undefined) {
  if (!s) return "";
  return String((s as any)._id ?? (s as any).id ?? "");
}

export function PlaybackProvider({ children }: { children: React.ReactNode }) {
  const { data: allSongs = [] } = useSongs();

  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [loop, setLoop] = useState(false);

  // ✅ Keep queue in sync after songs load (only if queue empty)
  useEffect(() => {
    if (!allSongs.length) return;

    setQueue((prevQueue) => (prevQueue.length > 0 ? prevQueue : allSongs));
    setCurrentIndex((idx) => (idx < allSongs.length ? idx : 0));
  }, [allSongs]);

  // ✅ currentSong safe
  const currentSong = useMemo(() => {
    if (!queue.length) return null;
    return queue[currentIndex] ?? queue[0] ?? null;
  }, [queue, currentIndex]);

  const playSong = (song: Song, playlist?: Song[]) => {
    const list = (playlist && playlist.length ? playlist : allSongs) as Song[];
    if (!list.length) return;

    const target = songKey(song);

    // ✅ find by _id (fallback id)
    const index = list.findIndex((s) => songKey(s) === target);
    const safeIndex = index >= 0 ? index : 0;

    setQueue(list);
    setCurrentIndex(safeIndex);
    setIsPlaying(true);
  };

  const next = () => {
    if (!queue.length) return;

    if (shuffle) {
      const random = Math.floor(Math.random() * queue.length);
      setCurrentIndex(random);
      return;
    }

    setCurrentIndex((i) => {
      const atEnd = i >= queue.length - 1;
      if (atEnd) return loop ? 0 : i;
      return i + 1;
    });
  };

  const prev = () => {
    if (!queue.length) return;
    setCurrentIndex((i) => Math.max(i - 1, 0));
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
