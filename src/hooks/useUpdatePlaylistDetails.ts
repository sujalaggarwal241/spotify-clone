import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Playlist } from "@/types/Playlist";
type UpdateInput = {
  id: string;
  name: string;
  description: string;
};

type ApiError = { error?: string };

async function patchPlaylistDetails(input: UpdateInput): Promise<Playlist> {
  const res = await fetch(`/api/playlist/${input.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: input.name,
      description: input.description,
    }),
  });

  if (!res.ok) {
    let msg = "Failed to update playlist";
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

export function useUpdatePlaylistDetails() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchPlaylistDetails,

    // ✅ Optional: optimistic update for instant UI
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ["playlist", input.id] });

      const prev = queryClient.getQueryData<Playlist>(["playlist", input.id]);

      if (prev) {
        queryClient.setQueryData<Playlist>(["playlist", input.id], {
          ...prev,
          name: input.name,
          description: input.description,
          updatedAt: new Date().toISOString(),
        });
      }

      return { prev };
    },

    onError: (_err, input, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(["playlist", input.id], ctx.prev);
      }
    },

    onSuccess: (updated, input) => {
      // ensure cache matches server response
      queryClient.setQueryData(["playlist", input.id], updated);
      // if you also have a list query:
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
  });
}
