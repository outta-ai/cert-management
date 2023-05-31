"use client";

import { FormEvent, useState } from "react";

import { useRouter } from "next/navigation";

import { User } from "@prisma/client";

import validator from "validator";

type DialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function UserAddDialog({ open, onClose }: DialogProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [clerkId, setClerkId] = useState("");
  const [type, setType] = useState<User["type"]>("User");

  const [loading, setLoading] = useState(false);

  const clear = () => {
    setName("");
    setEmail("");
    setClerkId("");
    setType("User");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !validator.isEmail(email) ||
      !["User", "Member", "Admin"].includes(type)
    ) {
      return;
    }

    setLoading(true);

    await fetch("/api/users", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        name,
        email,
        clerkId: clerkId.trim() ? clerkId : null,
        type,
      }),
    });

    setLoading(false);
    clear();
    onClose();

    router.refresh();
  };

  if (!open) {
    return null;
  }

  return (
    <div className="z-10 fixed flex justify-center items-center top-0 left-0 w-full h-screen bg-black bg-opacity-50">
      <form
        className="w-full max-w-sm m-3 bg-white rounded-lg shadow-lg p-6"
        onSubmit={onSubmit}
      >
        <h2 className="text-2xl font-semibold">사용자 추가</h2>
        <div className="mt-3">
          <p className="font-semibold">
            이름<span className="text-red-500">*</span>
          </p>
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border-gray-300 border p-2 w-full"
          />
        </div>
        <div className="mt-3">
          <p className="font-semibold">
            이메일<span className="text-red-500">*</span>
          </p>
          <input
            type="text"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border-gray-300 border p-2 w-full"
          />
        </div>
        <div className="mt-3">
          <p className="font-semibold">Clerk ID</p>
          <input
            type="text"
            placeholder="Clerk ID"
            value={clerkId}
            onChange={(e) => setClerkId(e.target.value)}
            className="rounded-md border-gray-300 border p-2 w-full"
          />
        </div>
        <div className="mt-3">
          <p className="font-semibold">
            유저 타입<span className="text-red-500">*</span>
          </p>
          <select
            className="p-3 border border-gray-300 rounded-md"
            value={type}
            onChange={(e) => setType(e.currentTarget.value as User["type"])}
          >
            <option value="User">부트캠프 참가자</option>
            <option value="Member">부원</option>
            <option value="Admin">관리자</option>
          </select>
        </div>
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
            onClick={() => {
              clear();
              onClose();
            }}
            disabled={loading}
          >
            취소
          </button>
          <div className="w-3" />
          <button
            type="submit"
            disabled={!name || !validator.isEmail(email) || !type || loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            추가
          </button>
        </div>
      </form>
    </div>
  );
}
