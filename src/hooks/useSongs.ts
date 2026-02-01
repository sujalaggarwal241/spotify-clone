import { useQuery } from "@tanstack/react-query";

export function useSongs() {
  return useQuery({
    queryKey: ["songs"],
    queryFn: async () => {
      const res = await fetch("/api/songs");
      if (!res.ok) throw new Error("Failed to fetch songs");
      return res.json();
    },
    staleTime: Infinity,
  });
}
