import { useMutation, useQueryClient } from "@tanstack/react-query";

type CreatePlaylistResponse = {
  playlistId: string;
};

type ApiError = {
  error?: string;
};

async function createPlaylist(): Promise<CreatePlaylistResponse> {
  const res = await fetch("/api/playlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  // handle non-2xx
  if (!res.ok) {
    let msg = "Failed to create playlist";
    try {
      const data: ApiError = await res.json();
      if (data?.error) msg = data.error;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
}

export function useCreatePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlaylist,
    onSuccess: () => {
      // If you have a playlists list query, refresh it:
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
  });
}
