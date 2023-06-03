"use client";

import { signIn } from "next-auth/react";

type Props = {
  className?: string;
};

export default function Login({ className }: Props) {
  return (
    <div className={className}>
      <button
        type="button"
        className="w-full rounded-md border-gray-300 border p-2"
        onClick={() => signIn("google")}
      >
        구글로 로그인
      </button>
    </div>
  );
}
