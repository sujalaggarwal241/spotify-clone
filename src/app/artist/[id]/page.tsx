"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";

import ArtistSongRow from "@/components/ArtistSongRow";
import PlayIcon from "@/iconComponents/Play";
import ShuffleIcon from "@/iconComponents/Shuffle";
import { usePlayback } from "@/context/PlaybackContext";
import { useArtist } from "@/hooks/useArtist";

export default function Artist() {
  const params = useParams<{ id: string }>();
  const artistId = params.id;
  console.log(params);
  const { data, isLoading, error } = useArtist(artistId);
  const { playSong } = usePlayback();

  const artist = data?.artist;
  const songs = data?.songs ?? [];

  // ✅ sort without mutating original array
  const popularSongs = useMemo(() => {
    return [...songs].sort((a: any, b: any) => (b.streams || 0) - (a.streams || 0));
  }, [songs]);

  const handlePlay = () => {
    if (!popularSongs.length) return;
    playSong(popularSongs[0], popularSongs);
  };

  const formatMMSS = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error || !artist) return <div className="p-6">Artist not found</div>;

  const backgroundImage = artist.imageUrl || "/artistImages/1.jpg";

  return (
    <div className="flex flex-col min-h-screen rounded-xl">
      <main className="flex-1 flex flex-col overflow-auto">
        {/* Artist banner */}
        <div
          className="h-96 w-full flex items-end justify-start bg-cover bg-center p-6 relative"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="flex flex-col gap-4 text-white drop-shadow-lg">
            <div className="text-6xl font-black">{artist.name}</div>
            <div className="">{artist.monthlyListeners} monthly listeners</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex h-18 w-full gap-4 items-center px-4">
          <div
            onClick={handlePlay}
            className="h-14 w-14 bg-green-500 rounded-full flex justify-center items-center cursor-pointer"
          >
            <PlayIcon />
          </div>

          <div className="h-14 w-14 flex justify-center items-center text-4xl hover:bg-neutral-800 rounded-full cursor-pointer">
            <ShuffleIcon />
          </div>

          {/* add to liked */}
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

          {/* download */}
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

        {/* Popular */}
        <div className="flex-1 p-4">
          <div className="text-2xl font-bold py-4">Popular</div>

          {popularSongs.map((song: any, index: number) => (
            <ArtistSongRow
              key={song._id}
              id={song._id} // if your row expects number, change prop name/type
              index={index + 1}
              songTitle={song.title}
              streams={song.streams}
              duration={formatMMSS(song.duration || 0)}
              _id={song._id}
            />
          ))}
        </div>

        <div className="flex-1 p-4">
          <p>To be handled</p>
        </div>
      </main>
    </div>
  );
}
