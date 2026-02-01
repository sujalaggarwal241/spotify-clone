"use client";

import { useQuery } from "@tanstack/react-query";

export function useArtists() {
  return useQuery({
    queryKey: ["artists"],
    queryFn: async () => {
      const res = await fetch("/api/artists");
      if (!res.ok) throw new Error("Failed to fetch artists");
      return res.json();
    },
    staleTime: 60*1000,
  });
}
