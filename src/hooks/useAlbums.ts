"use client";

import { useQuery } from "@tanstack/react-query";

export function useAlbums() {
  return useQuery({
    queryKey: ["albums"],
    queryFn: async () => {
      const res = await fetch("/api/albums");
      if (!res.ok) throw new Error("Failed to fetch albums");
      return res.json();
    },
    staleTime: 60*1000
  });
}
