"use client";

import type { Song } from "../types/songs";
import { useArtists } from "@/hooks/useArtists";
import type { Artist } from "@/types/artists";
import { usePlayback } from "@/context/PlaybackContext";
import PlayButton from "@/iconComponents/Play";
import { useRouter } from "next/navigation";
export default function Card({ song }: { song: Song }) {
  const { data: artists = [] } = useArtists();
  const { playSong } = usePlayback();
  const router = useRouter();
  const artist = artists.find(
    (artist: Artist) => song.artistId === artist._id
  );

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // important if card is clickable later
    playSong(song);
  };

  return (
    <div className="group flex flex-col shrink-0 gap-1 p-2 rounded hover:bg-neutral-600 transition">
      {/* COVER */}
      <div className="relative w-[190px] h-[106px] overflow-hidden rounded">
        <img
          src={song.coverUrl}
          alt={song.title}
          className="w-full h-full object-cover rounded"
        />

        {/* ▶ PLAY BUTTON (hover only) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={handlePlay}
            className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition"
            aria-label="Play"
          >
            <PlayButton />
          </button>
        </div>
      </div>

      {/* TEXT */}
      <div 
        onClick={() => router.push(`/song/${song._id}`)}
        className="text-lg font-bold leading-tight truncate hover:underline"
        >
        {song.title}
      </div>

      <div className="text-sm text-neutral-300 truncate">
        {artist?.name ?? "Unknown Artist"}
      </div>
    </div>
  );
}
