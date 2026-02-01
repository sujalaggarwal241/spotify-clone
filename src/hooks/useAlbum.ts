"use client";

import { useQuery } from "@tanstack/react-query";

export function useAlbum(id: string) {
  return useQuery({
    queryKey: ["album", id],
    queryFn: async () => {
      const res = await fetch(`/api/albums/${id}`);
      if (!res.ok) throw new Error("Failed to fetch album");
      return res.json();
    },
    staleTime: 60*1000,
    enabled: !!id,
  });
}
