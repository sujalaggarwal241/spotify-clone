import { useQuery } from "@tanstack/react-query";

export function usePlaylists() {
  return useQuery({
    queryKey: ["playlists"],
    queryFn: async () => {
      const res = await fetch("/api/playlist");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });
}