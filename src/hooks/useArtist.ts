"use client";

import { useQuery } from "@tanstack/react-query";

export function useArtist(id: string) {
  return useQuery({
    queryKey: ["artist", id],
    queryFn: async () => {
      const res = await fetch(`/api/artists/${id}`);
      if (!res.ok) throw new Error("Failed to fetch artist");
      return res.json();
    },
    enabled: !!id,
  });
}
