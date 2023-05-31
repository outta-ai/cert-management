"use client";

import { useState } from "react";

import { User } from "@prisma/client";

import { StringParam, useQueryParam } from "use-query-params";

import IconClose from "assets/icons/icon_close.svg";

type ContentProps = {
  user: User;
  onlyAdmin: boolean;
  onClose: () => void;
};

function UserInfoContent({ user, onlyAdmin, onClose }: ContentProps) {
  const [memo, setMemo] = useState(user.memo);
  const [type, setType] = useState<User["type"]>(user.type);

  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    setLoading(true);

    await fetch(`/api/users/${user.id}`, {
      method: "DELETE",
      credentials: "include",
    });

    setLoading(false);
    onClose();
  };

  const onSubmit = async () => {
    setLoading(true);

    await fetch(`/api/users/${user.id}`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        memo,
        type,
      }),
    });

    setLoading(false);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center">
        <IconClose className="w-6 h-6 cursor-pointer mr-3" onClick={onClose} />
        <p className="text-2xl font-bold">{user.name}</p>
      </div>
      <div className="mt-3">
        <p className="font-semibold">Clerk ID</p>
        <p className="text-gray-800 overflow-hidden text-ellipsis">
          {user.clerkId}
        </p>
      </div>
      <div className="mt-3">
        <p className="font-semibold">이메일</p>
        <p className="text-gray-800">{user.email}</p>
      </div>
      <div className="mt-3">
        <p className="font-semibold">유저 타입</p>
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
      <div className="mt-3">
        <p className="font-semibold">메모</p>
        <textarea
          className="w-full max-w-full min-w-full min-h-[300px] p-3 border border-gray-300 rounded-md focus:outline-none active:outline-none"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
      </div>
      <div className="flex-1" />
      <div className="w-full flex justify-end">
        <button
          type="button"
          className="px-4 py-2 bg-red-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={(user.type === "Admin" && onlyAdmin) || loading}
          onClick={onDelete}
        >
          삭제
        </button>
        <div className="w-6" />
        <button
          type="button"
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={(memo === user.memo && type === user.type) || loading}
          onClick={onSubmit}
        >
          수정
        </button>
      </div>
    </div>
  );
}

type Props = {
  users: User[];
};

export default function UserInfo({ users }: Props) {
  const [userId, setUserId] = useQueryParam("user", StringParam);

  if (!userId || !userId.trim()) {
    return null;
  }

  const user = users.find((user) => user.id === userId);
  if (!user) {
    return null;
  }

  const onlyAdmin = users.filter((user) => user.type === "Admin").length === 1;

  return (
    <div
      className="z-10 bg-black bg-opacity-50 fixed top-0 left-0 w-full h-screen"
      onClick={() => setUserId(undefined)}
      onKeyDown={() => setUserId(undefined)}
    >
      <div
        className="absolute right-0 w-full md:w-1/2 xl:w-1/3 h-screen overflow-y-auto bg-white z-20 p-6"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <UserInfoContent
          user={user}
          onlyAdmin={onlyAdmin}
          onClose={() => setUserId(undefined)}
        />
      </div>
    </div>
  );
}
