"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";

import PlayIcon from "@/iconComponents/Play";
import ShuffleIcon from "@/iconComponents/Shuffle";
import AlbumRow from "@/components/AlbumRow";
import { usePlayback } from "@/context/PlaybackContext";
import { useAlbum } from "@/hooks/useAlbum";

export default function Album() {
  const params = useParams();
  // console.log("Hello from album" , params );
  // ✅ handle string | string[]
  const raw = params?.id;
  const albumId = Array.isArray(raw) ? raw[0] : raw;

  // ✅ don’t call hook with undefined id
  const { data, isLoading, error } = useAlbum(albumId ?? "");

  const { playSong } = usePlayback();

  const album = data?.album;
  const artist = data?.artist;
  const albumSongs = data?.songs ?? [];

  const albumTime = useMemo(() => {
    return albumSongs.reduce((sum: number, s: any) => sum + (s?.duration || 0), 0);
  }, [albumSongs]);

  const handlePlay = () => {
    if (!albumSongs.length) return;
    playSong(albumSongs[0], albumSongs);
  };

  const formatMMSS = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // ✅ if albumId missing (route mismatch)
  if (!albumId) return <div className="w-full p-6">Missing album id</div>;

  if (isLoading) return <div className="w-full p-6">Loading...</div>;
  if (error || !album) return <div className="w-full p-6">Album not found</div>;

  return (
    <div className="bg-neutral-900 w-full rounded-xl gap-6 flex flex-col">
      {/* TOP SECTION */}
      <div className="p-6 bg-neutral-600 rounded-top flex gap-6">
        <div className="h-54 w-54 bg-neutral-100 object-contain">
          <img
            className="h-full w-full object-cover"
            src={album.coverUrl || "/coverImages/1.jpg"}
            alt={album.title || "Album"}
          />
        </div>

        <div className="flex flex-col justify-end gap-4">
          <div>Album</div>
          <div className="text-8xl font-[1000]">{album.title}</div>

          <div className="flex gap-2 items-center">
            <div className="flex h-6 w-6 rounded-full bg-neutral-100 items-center overflow-hidden">
              <img
                className="h-full w-full rounded-full object-cover"
                src={artist?.imageUrl || "/artistImages/1.jpg"}
                alt={artist?.name || "Artist"}
              />
            </div>

            <p className="font-bold flex">{artist?.name || "Unknown Artist"}</p>

            <p>
              • {album.year ?? "—"} • {albumSongs.length} songs,{" "}
              {Math.floor(albumTime / 60)} min {albumTime % 60} secs
            </p>
          </div>
        </div>
      </div>

      {/* CONTROLS + LIST */}
      <div className="p-6 w-full">
        <div className="flex h-18 w-full gap-4 items-center">
          <div
            onClick={handlePlay}
            className="h-14 w-14 bg-green-500 rounded-full flex justify-center items-center cursor-pointer"
          >
            <PlayIcon />
          </div>

          <div className="h-14 w-14 flex justify-center items-center text-4xl hover:bg-neutral-800 rounded-full cursor-pointer">
            <ShuffleIcon />
          </div>

          {/* Add to liked */}
          <div className="cursor-pointer">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="w-10 h-10 fill-current text-neutral-400 hover:fill-white"
            >
              <path d="M11.999 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18m-11 9c0-6.075 4.925-11 11-11s11 4.925 11 11-4.925 11-11 11-11-4.925-11-11" />
              <path d="M17.999 12a1 1 0 0 1-1 1h-4v4a1 1 0 1 1-2 0v-4h-4a1 1 0 1 1 0-2h4V7a1 1 0 1 1 2 0v4h4a1 1 0 0 1 1 1" />
            </svg>
          </div>

          {/* Download */}
          <div className="cursor-pointer">
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
          <div className="mr-4">...</div>
        </div>

        {/* SONG ROWS */}
        {albumSongs.map((song: any, index: number) => (
          <AlbumRow
            key={song._id}
            index={index + 1}
            song={song}
            artistName={artist?.name || ""}
            duration={formatMMSS(song.duration || 0)}
            playlist={albumSongs}
          />
        ))}
      </div>
    </div>
  );
}
