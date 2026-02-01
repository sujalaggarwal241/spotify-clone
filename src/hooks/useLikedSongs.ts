"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "likedSongs"; // array of songId strings

// Converts Mongo ObjectId / $oid / number / etc -> string
const toId = (v: any) => {
  if (!v) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (typeof v === "object" && v.$oid) return String(v.$oid);
  if (typeof v === "object" && typeof v.toString === "function") return v.toString();
  return String(v);
};

export function useLikedSongs(currentSongId?: any) {
  const [likedIds, setLikedIds] = useState<string[]>([]);

  const normalizedCurrentId = useMemo(
    () => toId(currentSongId),
    [currentSongId]
  );

  const isLiked = useMemo(() => {
    if (!normalizedCurrentId) return false;
    return likedIds.includes(normalizedCurrentId);
  }, [likedIds, normalizedCurrentId]);

  /* ---------- LOAD ---------- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        setLikedIds([]);
        return;
      }

      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setLikedIds(parsed.map(toId).filter(Boolean));
      } else {
        setLikedIds([]);
      }
    } catch {
      setLikedIds([]);
    }
  }, []);

  /* ---------- SYNC (same tab) ---------- */
  useEffect(() => {
    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent<string[]>).detail ?? [];
      setLikedIds(detail.map(toId).filter(Boolean));
    };

    window.addEventListener("likedSongsChanged", onCustom);
    return () => window.removeEventListener("likedSongsChanged", onCustom);
  }, []);

  /* ---------- SYNC (other tabs) ---------- */
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      try {
        const parsed = e.newValue ? JSON.parse(e.newValue) : [];
        if (Array.isArray(parsed)) setLikedIds(parsed.map(toId).filter(Boolean));
      } catch {}
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* ---------- PERSIST ---------- */
  const save = useCallback((ids: string[]) => {
    setLikedIds(ids);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new CustomEvent("likedSongsChanged", { detail: ids }));
  }, []);

  /* ---------- ACTIONS ---------- */
  const toggleLike = useCallback(
    (songId: any) => {
      const id = toId(songId);
      if (!id) return;

      const next = likedIds.includes(id)
        ? likedIds.filter((x) => x !== id)
        : [...likedIds, id];

      save(next);
    },
    [likedIds, save]
  );

  return {
    likedIds,     // string[]
    isLiked,      // boolean
    toggleLike,   // (songId: any) => void
  };
}
