"use client";

import { useClerk } from "@clerk/nextjs";

export default function SignOutButton() {
  const { signOut } = useClerk();

  return (
    <button
      type="button"
      className="w-full bg-blue-500 rounded-md hover:bg-blue-600 text-white font-bold py-2 px-4 mt-6"
      onClick={() => signOut()}
      onKeyDown={() => signOut()}
    >
      로그아웃
    </button>
  );
}
