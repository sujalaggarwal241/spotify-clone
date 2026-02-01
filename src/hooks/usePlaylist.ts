import { useQuery } from "@tanstack/react-query";
import { Playlist } from "@/types/playlist";

type ApiError = {
  error: string;
};

async function fetchPlaylist(playlistId: string): Promise<Playlist> {
  const res = await fetch(`/api/playlist/${playlistId}`);

  if (!res.ok) {
    let message = "Failed to fetch playlist";

    try {
      const data: ApiError = await res.json();
      message = data.error || message;
    } catch {}

    const error = new Error(message) as Error & { status?: number };
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export function usePlaylist(playlistId?: string) {
  return useQuery({
    queryKey: ["playlist", playlistId],
    queryFn: () => fetchPlaylist(playlistId!),
    enabled: Boolean(playlistId), // avoid running without id
    retry: false, // don’t retry on 401/403
  });
}
