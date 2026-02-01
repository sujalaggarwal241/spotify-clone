"use client";

import Image from "next/image";
import Card from "./Card";
import { useSongs } from "@/hooks/useSongs";
import { usePlayback } from "@/context/PlaybackContext";
import { useArtists } from "@/hooks/useArtists";
import { useMemo } from "react";
import { Song } from "@/types/songs";

const toId = (v: any) => {
  if (!v) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object" && v.$oid) return String(v.$oid);
  if (typeof v === "object" && typeof v.toString === "function") return v.toString();
  return String(v);
};

export default function RightSidebar() {
  // ✅ hooks ALWAYS run
  const { currentSong } = usePlayback();
  const { data: songs = [] } = useSongs();
  const { data: artists = [] } = useArtists();

  const currentArtistId = useMemo(
    () => toId(currentSong?.artistId),
    [currentSong?.artistId]
  );

  const currentSongId = useMemo(
    () => toId(currentSong?._id ?? currentSong?.id),
    [currentSong?._id, currentSong?.id]
  );

  const artistDetails = useMemo(() => {
    if (!currentSong) return null;

    return (
      artists.find((a: any) => toId(a._id) === currentArtistId) ||
      artists.find((a: any) => a.name === currentSong.artist) ||
      null
    );
  }, [artists, currentSong, currentArtistId]);

  const recommendedTracks = useMemo(() => {
    if (!currentSong) return [];

    return songs
      .filter((s: Song) => {
        const sameArtist = toId(s.artistId) === currentArtistId;
        const notCurrent = toId(s._id ?? s.id) !== currentSongId;
        return sameArtist && notCurrent;
      })
      .slice(0, 10);
  }, [songs, currentSong, currentArtistId, currentSongId]);

  // ✅ conditional UI happens AFTER hooks
  if (!currentSong) {
    return (
      <aside className="w-82 h-full overflow-auto overscroll-contain rounded-xl">
        <div className="rounded flex flex-col bg-neutral-900 w-80 px-4 py-6 gap-8">
          <div className="text-neutral-400 text-sm">Nothing is playing</div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-82 h-full overflow-auto overscroll-contain rounded-xl">
      <div className="rounded flex flex-col bg-neutral-900 w-80 px-4 py-6 h-auto gap-8">
        {/* Now Playing */}
        <div className="flex flex-col gap-6">
          <div className="flex font-bold">Now Playing</div>

          <div className="flex flex-col gap-4">
            <Image
              src={currentSong?.coverUrl || "/coverImages/15.jpg"}
              alt={currentSong?.title || "Song" }
              width={320}
              height={320}
              className="rounded"
            />

            <div className="flex justify-between items-center">
              <div className="flex flex-col justify-center">
                <div className="text-xl font-bold">{currentSong.title}</div>
                <div className="text-sm text-neutral-300">{currentSong.artist}</div>
              </div>

              <div className="w-7 h-7 bg-neutral-900 flex justify-center rounded-full border border-neutral-600 items-center font-bold">
                +
              </div>
            </div>
          </div>
        </div>

        {/* Related songs */}
        <div className="flex flex-col gap-4">
          <div className="font-bold">Related songs</div>

          {recommendedTracks.length === 0 ? (
            <div className="text-sm text-neutral-400">No recommendations found</div>
          ) : (
            <div className="flex overflow-x-auto gap-4 whitespace-nowrap">
              {recommendedTracks.map((song: any) => (
                <Card key={toId(song._id ?? song.id)} song={song} />
              ))}
            </div>
          )}
        </div>

        {/* About artist */}
        <div className="flex flex-col rounded">
          <div
            className="w-72 h-40 rounded p-4 bg-cover bg-center"
            style={{
              backgroundImage: `url(${artistDetails?.imageUrl || "/artistImages/1.jpg"})`,
            }}
          >
            <div className="font-bold">About the artist</div>
          </div>

          <div className="bg-neutral-700 p-4 flex flex-col gap-3 rounded">
            <div className="font-bold">{artistDetails?.name || currentSong.artist}</div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-neutral-200">
                {artistDetails?.monthlyListeners ?? "—"} <br />
                monthly listeners
              </div>

              <div className="font-bold rounded-full border border-neutral-400 py-1 px-3 text-sm">
                Follow
              </div>
            </div>

            <div className="h-20 overflow-hidden text-sm text-neutral-200">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit...
            </div>
          </div>
        </div>

        {/* Credits */}
        <div className="bg-neutral-700 p-4 flex flex-col gap-3 rounded">
          <div className="flex justify-between items-end">
            <div className="font-bold">Credits</div>
            <div className="text-sm text-neutral-300">Show all</div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold">{artistDetails?.name || currentSong.artist}</div>
              <div className="text-xs text-neutral-300">Main Artist</div>
            </div>

            <div className="font-bold rounded-full border border-neutral-400 py-1 px-3 text-sm">
              Follow
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
