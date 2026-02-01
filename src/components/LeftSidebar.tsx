"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import LeftSidebarCard from "./LeftSidebarCard";
import { useArtists } from "@/hooks/useArtists";
import { useAlbums } from "@/hooks/useAlbums";
import { usePlaylists } from "@/hooks/usePlaylists";
import { Artist } from "@/types/artists";
import { Album } from "@/types/albums";
import NewPlaylistButton from "./NewPlaylistButton";

export default function LeftSidebar() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<
    "" | "album" | "artist" | "playlist"
  >("");

  const { data: artistsData, isLoading: artistsLoading } = useArtists();
  const { data: albumsData, isLoading: albumsLoading } = useAlbums();
  const { data: playlistsData, isLoading: playlistsLoading } = usePlaylists();

  const artists = (artistsData ?? []) as Artist[];
  const albums = (albumsData ?? []) as Album[];
  const playlists = (playlistsData?.playlists ?? []) as {
    _id: string;
    name: string;
    coverUrl?: string;
  }[];

  const toggle = (value: "album" | "artist" | "playlist") => {
    setSelectedOption((prev) => (prev === value ? "" : value));
  };

  const Albums = useMemo(
    () =>
      albums.map((album) => (
        <LeftSidebarCard
          key={`album-${album._id}`}
          onClick={() => router.push(`/album/${album._id}`)}
          title={album.title}
          subtitle="Album"
          image={album.coverUrl}
          type="album"
        />
      )),
    [albums, router]
  );

  const Artists = useMemo(
    () =>
      artists.map((artist) => (
        <LeftSidebarCard
          key={`artist-${artist._id}`}
          onClick={() => router.push(`/artist/${artist._id}`)}
          title={artist.name}
          subtitle="Artist"
          image={artist.imageUrl}
          type="artist"
        />
      )),
    [artists, router]
  );

  const Playlists = useMemo(
    () =>
      playlists.map((playlist) => (
        <LeftSidebarCard
          key={`playlist-${playlist._id}`}
          onClick={() => router.push(`/playlist/${playlist._id}`)}
          title={playlist.name}
          subtitle="Playlist"
          image={playlist.coverUrl ?? "/coverImages/14.jpg"}
          type="playlist"
        />
      )),
    [playlists, router]
  );

  const isLoading = artistsLoading || albumsLoading || playlistsLoading;

  return (
    <aside className="w-70 h-full overflow-auto overscroll-contain bg-neutral-900 rounded-xl pb-4 px-4">
      {/* HEADER */}
      <div className="sticky top-0 flex flex-col gap-3 bg-neutral-900 z-10 pt-6 pb-2">
        <div className="flex gap-2 items-center">
          <div className="font-bold">Your Library</div>
          <div className="flex-1" />
          <NewPlaylistButton />
        </div>

        {/* FILTERS */}
        <div className="text-sm flex gap-2">
          {selectedOption === "" && (
            <>
              <button
                onClick={() => toggle("playlist")}
                className="px-3 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700"
              >
                Playlists
              </button>
              <button
                onClick={() => toggle("artist")}
                className="px-3 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700"
              >
                Artists
              </button>
              <button
                onClick={() => toggle("album")}
                className="px-3 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700"
              >
                Albums
              </button>
            </>
          )}

          {selectedOption !== "" && (
            <button
              onClick={() => toggle(selectedOption)}
              className="px-3 py-1 rounded-full bg-white text-black hover:bg-neutral-200"
            >
              {selectedOption[0].toUpperCase() + selectedOption.slice(1)}s
            </button>
          )}
        </div>
      </div>

      {/* LIST */}
      <div className="flex flex-col gap-2 py-4">
        {/* Liked Songs */}
        {(selectedOption === "" || selectedOption === "playlist") && (
          <LeftSidebarCard
            onClick={() => router.push("/likedsongs")}
            title="Liked Songs"
            subtitle="Playlist"
            image="/coverImages/14.jpg"
            type="playlist"
          />
        )}

        {isLoading ? (
          <div className="text-sm text-neutral-400 px-2 py-2">
            Loading…
          </div>
        ) : selectedOption === "" ? (
          <>
            {Playlists}
            {Albums}
            {Artists}
          </>
        ) : selectedOption === "playlist" ? (
          Playlists
        ) : selectedOption === "album" ? (
          Albums
        ) : selectedOption === "artist" ? (
          Artists
        ) : null}
      </div>
    </aside>
  );
}
