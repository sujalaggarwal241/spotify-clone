import { useMutation, useQueryClient } from "@tanstack/react-query";

type ApiError = {
  error?: string;
};

async function removeSongFromPlaylist(
  playlistId: string,
  songId: string
) {
  const res = await fetch(`/api/playlist/${playlistId}/songs`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ songId }),
  });

  if (!res.ok) {
    let msg = "Failed to remove song";
    try {
      const data: ApiError = await res.json();
      if (data?.error) msg = data.error;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
}

export function useRemoveSongFromPlaylist(playlistId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (songId: string) =>
      removeSongFromPlaylist(playlistId, songId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] });
    },
  });
}
