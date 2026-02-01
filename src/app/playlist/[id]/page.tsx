"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PlayIcon from "@/iconComponents/Play";
import ShuffleIcon from "@/iconComponents/Shuffle";
import AlbumRow from "@/components/AlbumRow";
import EditPlaylistDetails from "@/components/EditPlaylistDetails";
import { usePlaylist } from "@/hooks/usePlaylist";
import { useSongsByIds } from "@/hooks/useSongsByIds";
import { useUpdatePlaylistDetails } from "@/hooks/useUpdatePlaylistDetails";
import { useDeletePlaylist } from "@/hooks/useDeletePlaylist";
import type { Song } from "@/types/songs";

/* ---------- helper ---------- */
function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function Playlist() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/login");
  }, [status, session, router]);

  if (status === "loading") return <div className="p-6 text-white">Loading…</div>;
  if (!session) return null;

  const { data: playlist, isLoading, error } = usePlaylist(id);
  const updateMutation = useUpdatePlaylistDetails();
  const deleteMutation = useDeletePlaylist();

  const songIds = playlist?.songs ?? [];
  const { data: songs, isLoading: songsLoading } = useSongsByIds(songIds);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // confirmation modal for delete
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  /* ---------- modal behavior (esc + body scroll lock) ---------- */
  useEffect(() => {
    const anyModalOpen = isEditOpen || isDeleteOpen;
    if (!anyModalOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsEditOpen(false);
        setIsDeleteOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isEditOpen, isDeleteOpen]);

  /* ---------- states ---------- */
  if (!id) return <div className="p-6 text-white">Invalid playlist id</div>;
  if (isLoading) return <div className="p-6 text-white">Loading playlist…</div>;
  if (error) return <div className="p-6 text-white">Failed to load playlist</div>;

  const canDelete = confirmText.trim().toLowerCase() === "delete";

  /* ---------- UI ---------- */
  return (
    <div className="bg-neutral-900 w-full rounded-xl flex flex-col gap-6">
      {/* ================= EDIT MODAL ================= */}
      {isEditOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setIsEditOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <EditPlaylistDetails
              initialName={playlist?.name ?? ""}
              initialDescription={playlist?.description ?? ""}
              isSaving={updateMutation.isPending}
              saveError={
                updateMutation.error
                  ? (updateMutation.error as Error).message
                  : null
              }
              onClose={() => setIsEditOpen(false)}
              onSave={(payload) =>
                updateMutation.mutate(
                  { id, ...payload },
                  { onSuccess: () => setIsEditOpen(false) }
                )
              }
            />
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRM MODAL ================= */}
      {isDeleteOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setIsDeleteOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[520px] max-w-[90vw] rounded-xl bg-neutral-800 text-white p-5 shadow-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">Delete playlist?</h2>
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                className="h-8 w-8 rounded-full bg-neutral-700 hover:bg-neutral-600 flex items-center justify-center"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-neutral-300 mb-4">
              This will permanently delete <span className="font-semibold text-white">{playlist?.name}</span>.
              <br />
              Type <span className="font-semibold text-white">delete</span> to confirm.
            </p>

            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder='Type "delete"'
              className="w-full rounded bg-neutral-700 px-3 py-2 outline-none placeholder:text-neutral-400"
            />

            {deleteMutation.error ? (
              <p className="text-sm text-red-400 mt-3">
                {(deleteMutation.error as Error).message}
              </p>
            ) : null}

            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 rounded-full bg-neutral-700 hover:bg-neutral-600 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!canDelete || deleteMutation.isPending}
                onClick={() => {
                  deleteMutation.mutate(id, {
                    onSuccess: () => {
                      setIsDeleteOpen(false);
                      router.push("/"); // change to /library if you have it
                    },
                  });
                }}
                className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-400 text-black font-semibold disabled:opacity-60"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= HEADER ================= */}
      <div className="p-6 bg-neutral-800 flex gap-6 rounded-t-xl">
        <div className="h-40 w-40 bg-neutral-700 rounded" />

        <div className="flex flex-col justify-end gap-4 flex-1">
          <div className="text-sm text-neutral-300">
            {playlist?.isPublic ? "Public playlist" : "Private playlist"}
          </div>

          <h1 className="text-6xl font-black truncate text-white">
            {playlist?.name}
          </h1>

          <div className="text-sm text-neutral-300">
            • {playlist?.songs.length} songs
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsEditOpen(true)}
              className="w-fit px-4 py-2 bg-neutral-700 rounded-full hover:bg-neutral-600"
            >
              Edit details
            </button>

            <button
              onClick={() => {
                setConfirmText("");
                setIsDeleteOpen(true);
              }}
              className="w-fit px-4 py-2 bg-red-500 text-black rounded-full hover:bg-red-400"
            >
              Delete playlist
            </button>
          </div>
        </div>
      </div>

      {/* ================= CONTROLS ================= */}
      <div className="p-6">
        <div className="flex gap-4 items-center">
          <button className="h-14 w-14 bg-green-500 rounded-full flex items-center justify-center">
            <PlayIcon />
          </button>
          <button className="h-14 w-14 rounded-full hover:bg-neutral-800 flex items-center justify-center text-white">
            <ShuffleIcon />
          </button>
        </div>

        {/* TABLE HEADER */}
        <div className="flex h-14 gap-4 items-center border-b border-neutral-700 mt-6 text-neutral-400">
          <div className="w-10 text-center">#</div>
          <div className="font-bold">Title</div>
          <div className="flex-1" />
          <div className="mr-8">Time</div>
        </div>

        {/* SONG LIST */}
        {songsLoading ? (
          <div className="py-6 text-neutral-400">Loading songs…</div>
        ) : songs && songs.length > 0 ? (
          songs.map((song: Song, index: number) => (
            <AlbumRow
              key={song._id?.toString()}
              index={index + 1}
              song={song}
              artistName={(song as any).artist ?? "Unknown"}
              duration={formatDuration(song.duration)}
              playlist={songs}
            />
          ))
        ) : (
          <div className="py-6 text-neutral-400">No songs in this playlist</div>
        )}
      </div>
    </div>
  );
}
