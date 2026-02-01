import { useMutation, useQueryClient } from "@tanstack/react-query";

type ApiError = { error?: string };

type Input = {
  playlistId: string;
  songId: string;
};

async function addSongToPlaylist({ playlistId, songId }: Input) {
  const res = await fetch(`/api/playlist/${playlistId}/songs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ songId }),
  });

  if (!res.ok) {
    let msg = "Failed to add song";
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

export function useAddSongToPlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addSongToPlaylist,
    onSuccess: (_data, input) => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      queryClient.invalidateQueries({ queryKey: ["playlist", input.playlistId] });
    },
  });
}
