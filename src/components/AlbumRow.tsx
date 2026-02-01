"use client";

import { useEffect, useRef, useState } from "react";
import { usePlayback } from "@/context/PlaybackContext";
import type { Song } from "../types/songs";
import { useLikedSongs } from "../hooks/useLikedSongs";
import SongOptions from "./SongOptions";
import AddToPlaylistSubmenu from "./AddToPlaylistSubmenu";
import PlayIcon from "@/iconComponents/Play";
import { useRouter } from "next/navigation";
import formatMMSS from "@/utils/formatMMSS";
type AlbumRowProps = {
  index: number;
  song: Song;
  artistName: string;
  playlist?: Song[];
  artistId : string
};

export default function AlbumRow({
  index,
  song,
  artistName,
  playlist,
  artistId
}: AlbumRowProps) {
  const router = useRouter();
  const { playSong } = usePlayback();
  const { isLiked, toggleLike } = useLikedSongs(song._id);

  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const optionsRef = useRef<HTMLDivElement | null>(null);
  const addMenuRef = useRef<HTMLDivElement | null>(null);

  const handlePlay = () => {
    playSong(song, playlist ?? undefined);
  };

  // ✅ Close menus on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;

      if (optionsRef.current && !optionsRef.current.contains(target)) {
        setIsOptionsOpen(false);
      }

      if (addMenuRef.current && !addMenuRef.current.contains(target)) {
        setIsAddMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="group relative flex h-14 gap-4 items-center rounded hover:bg-neutral-700 px-2">
      {/* PLAY / INDEX */}
      <button
        type="button"
        onClick={handlePlay}
        className="h-10 w-10 flex items-center justify-center text-neutral-400 group-hover:text-white"
      >
        <span className="group-hover:hidden">{index}</span>
        <span className=" opacity-0 group-hover:opacity-100"><PlayIcon /></span>
      </button>

      {/* TITLE */}
      <div>
        <div 
          onClick={() => router.push(`/song/${song._id}`)}
          className="font-bold hover:underline">{song.title}</div>
        <div 
          className="text-sm text-neutral-300 hover:underline"
          onClick={()=> router.push(`/artist/${artistId}`)}
          >{artistName}</div>
      </div>

      <div className="flex-1" />

      {/* ✅ LIKE / ADD */}
      <div className="relative flex items-center " ref={addMenuRef}>
        {!isLiked ? (
          /* NOT LIKED → PLUS ICON → like song */
          <svg
            onClick={() => toggleLike(song._id)}
            className="w-5 h-5 text-neutral-400 fill-white cursor-pointer hover:text-white opacity-0 group-hover:opacity-100"
            viewBox="0 0 24 24"
          >
            <path d="M11.999 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18m-11 9c0-6.075 4.925-11 11-11s11 4.925 11 11-4.925 11-11 11-11-4.925-11-11" />
            <path d="M17.999 12a1 1 0 0 1-1 1h-4v4a1 1 0 1 1-2 0v-4h-4a1 1 0 1 1 0-2h4V7a1 1 0 1 1 2 0v4h4a1 1 0 0 1 1 1" />
          </svg>
        ) : (
          <>
            {/* LIKED → GREEN TICK → open add-to-playlist submenu */}
            <svg
              onClick={() => setIsAddMenuOpen((v) => !v)}
              className="w-5 h-5 text-[#1db954] cursor-pointer fill-white"
              viewBox="0 0 16 16"
            >
              <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m11.748-1.97a.75.75 0 0 0-1.06-1.06l-4.47 4.47-1.405-1.406a.75.75 0 1 0-1.061 1.06l2.466 2.467 5.53-5.53z" />
            </svg>

            {isAddMenuOpen && (
              <div className="absolute right-0 top-7 z-50">
                <AddToPlaylistSubmenu
                  songId={song._id?.toString() || ""}
                  onDone={() => setIsAddMenuOpen(false)}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* DURATION */}
      <div className="mr-6 text-neutral-300">{formatMMSS(song.duration)}</div>

      {/* OPTIONS */}
      <div ref={optionsRef} className="relative">
        <div
          onClick={() => setIsOptionsOpen((v) => !v)}
          className="cursor-pointer px-2 text-neutral-400 hover:text-white"
        >
          •••
        </div>

        {isOptionsOpen && (
          <div className="absolute right-0 top-8 z-50">
            <SongOptions songId={song._id?.toString() || ""} onClose={() => setIsOptionsOpen(false)} />
          </div>
        )}
      </div>
    </div>
  );
}
