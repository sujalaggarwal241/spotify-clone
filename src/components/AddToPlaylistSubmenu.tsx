"use client";

import { useMemo } from "react";
import { usePlaylists } from "@/hooks/usePlaylists";
import { useAddSongToPlaylist } from "@/hooks/useAddSongToPlaylist";

export default function AddToPlaylistSubmenu({
  songId,
  onDone,
  className = "",
}: {
  songId: string;
  onDone?: () => void;
  className?: string;
}) {
  const { data, isLoading, error } = usePlaylists();
  const addMutation = useAddSongToPlaylist();

  const playlists = useMemo(() => {
    const items = data?.playlists ?? [];
    return Array.isArray(items) ? items : [];
  }, [data]);

  return (
    <div className={`w-64 bg-neutral-800 rounded-md shadow-lg ${className}`}>
      <div className="px-4 py-2 text-xs text-neutral-300 border-b border-neutral-700">
        Add to playlist
      </div>

      {isLoading && (
        <div className="px-4 py-3 text-neutral-300">Loading...</div>
      )}

      {error && (
        <div className="px-4 py-3 text-red-400">{(error as Error).message}</div>
      )}

      {!isLoading && !error && playlists.length === 0 && (
        <div className="px-4 py-3 text-neutral-300">No playlists yet</div>
      )}

      {!isLoading &&
        !error &&
        playlists.map((p) => (
          <button
            key={p._id}
            type="button"
            disabled={addMutation.isPending}
            onClick={() => {
              addMutation.mutate(
                { playlistId: p._id, songId },
                { onSuccess: () => onDone?.() }
              );
            }}
            className="w-full text-left px-4 py-2 hover:bg-neutral-700 disabled:opacity-60"
          >
            {p.name}
          </button>
        ))}
    </div>
  );
}
