"use client";

import { useCreatePlaylist } from "@/hooks/useCreatePlaylist";
import { useRouter } from "next/navigation";

export default function NewPlaylistButton() {
  const router = useRouter();
  const { mutate, isPending, error } = useCreatePlaylist();

  return (
    <div>
      <button
        disabled={isPending}
        onClick={() =>
          mutate(undefined, {
            onSuccess: ({ playlistId }) => {
              // go to the new playlist page
              router.push(`/playlist/${playlistId.toString()}`);
            },
          })
        }
        className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-60"
      >
        {isPending ? "Creating..." : "New playlist"}
      </button>

      {error ? <p className="text-red-400 mt-2">{error.message}</p> : null}
    </div>
  );
}
