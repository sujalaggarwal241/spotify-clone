"use client";

import { useState } from "react";
import AddToPlaylistSubmenu from "./AddToPlaylistSubmenu";
import { useLikedSongs } from "@/hooks/useLikedSongs";
export default function SongOptions({
  songId,
  onClose,
}: {
  songId: string;
  onClose?: () => void;
}) {
  const [isSubOpen, setIsSubOpen] = useState(false);
  const {toggleLike, isLiked } = useLikedSongs(songId);

  return (
    <div
      className="relative w-56 bg-neutral-800 rounded-md shadow-lg text-sm text-white overflow-visible z-50"
      onMouseLeave={() => setIsSubOpen(false)}
    >
      {/* Add to playlist */}
      <div
        className="px-4 py-2 hover:bg-neutral-700 cursor-pointer flex items-center justify-between"
        onMouseEnter={() => setIsSubOpen(true)}
        onClick={() => setIsSubOpen((v) => !v)}
      >
        <span>Add to playlist</span>
        <span className="text-neutral-300">‹</span>
      </div>

      <div 
        className="px-4 py-2 hover:bg-neutral-700 cursor-pointer" 
        onClick={
          () => {
            toggleLike(songId);
          }
        }
      >
        {isLiked ? "Remove from liked songs" : "Add to liked songs" }
      </div>

      <div className="px-4 py-2 hover:bg-neutral-700 cursor-pointer">
        Go to artist
      </div>

      <div className="px-4 py-2 hover:bg-neutral-700 cursor-pointer">
        Go to album
      </div>

      {/* ✅ SUBMENU — OPENS TO THE LEFT */}
      {isSubOpen && (
        <div className="absolute top-0 right-full mr-2">
          <AddToPlaylistSubmenu
            songId={songId}
            onDone={() => {
              onClose?.(); // close whole menu after adding
              setIsSubOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
