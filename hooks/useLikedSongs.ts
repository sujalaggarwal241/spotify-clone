"use client";

import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "likedSongs";

export function useLikedSongs(currentSongId?: number) {
  const [likedIds, setLikedIds] = useState<number[]>([]);
  const isLiked = currentSongId
    ? likedIds.includes(currentSongId)
    : false;

  /* ---------- LOAD ---------- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setLikedIds(parsed);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      }
    } catch {
      setLikedIds([]);
    }
  }, []);

  /* ---------- SYNC ACROSS TABS / COMPONENTS ---------- */
  useEffect(() => {
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<number[]>).detail;
      setLikedIds(detail);
    };

    window.addEventListener("likedSongsChanged", onChange);
    return () => window.removeEventListener("likedSongsChanged", onChange);
  }, []);

  /* ---------- PERSIST ---------- */
  const save = useCallback((ids: number[]) => {
    setLikedIds(ids);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(
      new CustomEvent("likedSongsChanged", { detail: ids })
    );
  }, []);

  /* ---------- ACTIONS ---------- */
  const toggleLike = useCallback(
    (songId: number) => {
      const next = likedIds.includes(songId)
        ? likedIds.filter((id) => id !== songId)
        : [...likedIds, songId];

      save(next);
    },
    [likedIds, save]
  );

  return {
    likedIds,
    isLiked,
    toggleLike,
  };
}
