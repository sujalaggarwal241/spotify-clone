// hooks/useDeletePlaylist.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ApiError = { error?: string };

async function deletePlaylist(id: string) {
  const res = await fetch(`/api/playlist/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    let msg = "Failed to delete playlist";
    try {
      const data: ApiError = await res.json();
      if (data?.error) msg = data.error;
    } catch {}

    const err = new Error(msg) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }

  return res.json();
}

export function useDeletePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePlaylist,
    onSuccess: (_data, playlistId) => {
      // refresh playlists list
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      // remove deleted playlist from cache (optional but nice)
      queryClient.removeQueries({ queryKey: ["playlist", playlistId] });
    },
  });
}
