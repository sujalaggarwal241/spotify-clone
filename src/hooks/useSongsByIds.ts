import { useQuery } from "@tanstack/react-query";
import type { Song } from "@/types/songs";

async function fetchSongsByIds(ids: string[]): Promise<Song[]> {
  const res = await fetch("/api/songs/by-ids", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  if (!res.ok) {
    throw new Error("Failed to load songs");
  }

  return res.json();
}

export function useSongsByIds(ids?: string[]) {
  return useQuery({
    queryKey: ["songsByIds", ids],
    queryFn: () => fetchSongsByIds(ids!),
    enabled: Boolean(ids && ids.length > 0),
    staleTime: 60*1000,

  });
}
