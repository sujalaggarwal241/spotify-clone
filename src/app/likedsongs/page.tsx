"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PlayIcon from "@/iconComponents/Play";
import ShuffleIcon from "@/iconComponents/Shuffle";
import AlbumRow from "@/components/AlbumRow";
import { useSongs } from "@/hooks/useSongs";
import { useArtists } from "@/hooks/useArtists";
import { usePlayback } from "@/context/PlaybackContext";

const STORAGE_KEY = "likedSongs";

// normalize Mongo id (ObjectId / {$oid} / etc) -> string
const toId = (v: any) => {
  if (!v) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (typeof v === "object" && v.$oid) return String(v.$oid);
  if (typeof v === "object" && typeof v.toString === "function") return v.toString();
  return String(v);
};

export default function LikedSongs() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/login");
  }, [status, session, router]);

  if (status === "loading") return null;
  if (!session) return null;

  const { data: songs = [] } = useSongs();
  const { data: artists = [] } = useArtists();
  const { playSong } = usePlayback();

  const [likedIds, setLikedIds] = useState<string[]>([]);

  // Load ids from localStorage + keep synced
  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        const ids = Array.isArray(parsed) ? parsed.map(toId).filter(Boolean) : [];
        setLikedIds(ids);
      } catch {
        setLikedIds([]);
      }
    };

    load();

    const onCustom = () => load();
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) load();
    };

    window.addEventListener("likedSongsChanged", onCustom);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("likedSongsChanged", onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Filter liked songs from fetched songs
  const likedSongs = useMemo(() => {
    if (!likedIds.length) return [];
    const set = new Set(likedIds);
    return songs.filter((s: any) => set.has(toId(s._id)));
  }, [songs, likedIds]);

  const totalTime = useMemo(() => {
    return likedSongs.reduce((sum: number, s: any) => sum + (s?.duration || 0), 0);
  }, [likedSongs]);

  const formatMMSS = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handlePlay = () => {
    if (!likedSongs.length) return;
    playSong(likedSongs[0], likedSongs);
  };

  const handleShufflePlay = () => {
    if (!likedSongs.length) return;
    const shuffled = [...likedSongs].sort(() => Math.random() - 0.5);
    playSong(shuffled[0], shuffled);
  };

  return (
    <div className="bg-neutral-900 w-full rounded-xl gap-6 flex flex-col">
      {/* TOP */}
      <div className="p-6 bg-neutral-600 rounded-top flex gap-6">
        <div className="h-54 w-54 bg-neutral-100 object-contain">
          <img className="h-full w-full object-cover" src="/coverImages/14.jpg" alt="Liked Songs" />
        </div>

        <div className="flex flex-col justify-end gap-4">
          <div>Playlist</div>
          <div className="text-8xl font-[1000]">Liked Songs</div>

          <div className="flex gap-2 items-center">
            <div className="flex h-6 w-6 rounded-full bg-neutral-100 items-center overflow-hidden">
              <img className="h-full w-full rounded-full object-cover" src="/artistImages/1.jpg" alt="User" />
            </div>

            <p className="font-bold">Sujal Aggarwal</p>

            <p>
              • {likedSongs.length} songs • {Math.floor(totalTime / 60)} min {totalTime % 60} secs
            </p>
          </div>
        </div>
      </div>

      {/* CONTROLS + LIST */}
      <div className="p-6 w-full">
        <div className="flex h-18 w-full gap-4 items-center">
          <button
            onClick={handlePlay}
            className="h-14 w-14 bg-green-500 rounded-full flex justify-center items-center"
            aria-label="Play liked songs"
          >
            <PlayIcon />
          </button>

          <button
            onClick={handleShufflePlay}
            className="h-14 w-14 flex justify-center items-center text-4xl hover:bg-neutral-800 rounded-full"
            aria-label="Shuffle play liked songs"
          >
            <ShuffleIcon />
          </button>

          {/* download icon (UI only) */}
          <div>
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="w-10 h-10 fill-current text-neutral-400 hover:fill-white"
            >
              <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12" />
              <path d="M12 6.05a1 1 0 0 1 1 1v7.486l1.793-1.793a1 1 0 1 1 1.414 1.414L12 18.364l-4.207-4.207a1 1 0 1 1 1.414-1.414L11 14.536V7.05a1 1 0 0 1 1-1" />
            </svg>
          </div>
        </div>

        {/* TABLE HEADER */}
        <div className="flex h-14 gap-4 items-center border-b mb-4 sticky top-0 bg-neutral-900">
          <div className="h-10 w-10 items-center flex justify-center">#</div>
          <div className="font-bold">Title</div>
          <div className="flex-1" />
          <div className="mr-8">Clock</div>
        </div>

        {/* ROWS */}
        {likedSongs.map((song: any, index: number) => {
          const artistName =
            artists.find((a: any) => toId(a._id) === toId(song.artistId))?.name ??
            song.artist ??
            "Unknown";

          return (
            <AlbumRow
              key={toId(song._id)}
              index={index + 1}
              song={song}
              artistName={artistName}
              duration={formatMMSS(song.duration || 0)}
              playlist={likedSongs}
            />
          );
        })}
      </div>
    </div>
  );
}
