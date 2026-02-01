"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (!session) {
    return (
      <button
        onClick={() => signIn("google")}
        className="px-4 py-2 bg-white text-black rounded"
      >
        Sign in with google
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-white">
        {session.user?.name}
      </span>
      <button
        onClick={() => signOut()}
        className="px-4 py-2 bg-neutral-800 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}
