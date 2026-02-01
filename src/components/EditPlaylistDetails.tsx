"use client";

import { useEffect, useState } from "react";

type Props = {
  onClose: () => void;
  initialName?: string;
  initialDescription?: string;

  onSave: (payload: { name: string; description: string }) => void;

  isSaving?: boolean;
  saveError?: string | null;
};

export default function EditPlaylistDetails({
  onClose,
  initialName = "",
  initialDescription = "",
  onSave,
  isSaving = false,
  saveError = null,
}: Props) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => setName(initialName), [initialName]);
  useEffect(() => setDescription(initialDescription), [initialDescription]);

  const canSave = name.trim().length > 0 && !isSaving;

  return (
    <div className="w-[520px] max-w-[90vw] rounded-xl bg-neutral-800 p-4 text-white shadow-xl">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Edit details</h1>

        <button
          type="button"
          onClick={onClose}
          className="h-8 w-8 rounded-full bg-neutral-700 hover:bg-neutral-600 flex items-center justify-center"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* content */}
      <div className="flex gap-4">
        {/* cover */}
        <div className="h-40 w-40 shrink-0 rounded bg-neutral-700 flex items-center justify-center text-neutral-400">
          cover
        </div>

        {/* form */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="bg-neutral-700 rounded p-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My playlist"
              className="w-full bg-transparent outline-none text-white placeholder:text-neutral-300"
            />
          </div>

          <div className="bg-neutral-700 rounded p-2">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add an optional description"
              className="w-full min-h-[120px] resize-none bg-transparent outline-none text-white placeholder:text-neutral-300"
            />
          </div>

          {saveError ? (
            <p className="text-sm text-red-400">{saveError}</p>
          ) : null}

          <div className="flex justify-end gap-2 mt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-full bg-neutral-700 hover:bg-neutral-600 disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!canSave}
              onClick={() => onSave({ name: name.trim(), description: description.trim() })}
              className="px-4 py-2 rounded-full bg-green-500 hover:bg-green-400 text-black font-semibold disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>

          <p className="text-xs text-neutral-400">
            Tip: Press <span className="text-neutral-200">Esc</span> to close.
          </p>
        </div>
      </div>
    </div>
  );
}
