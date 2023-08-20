"use client";

import { FormEvent, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { Group, User } from "@prisma/client";

import IconFile from "assets/icons/icon_file.svg";

type DialogProps = {
  open: boolean;
  onClose: () => void;
};

type UserResult = Partial<User & { groups: Group[] }> & { result: boolean };

export default function UserFileAddDialog({ open, onClose }: DialogProps) {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [users, setUsers] = useState<Partial<User & { groups: Group[] }>[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UserResult[]>([]);
  const [error, setError] = useState<string>("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!file) {
      return;
    }

    setLoading(true);

    const content = await file.text();

    const result = await fetch("/api/users/file", {
      method: "POST",
      credentials: "include",
      body: content,
    });

    setResult((await result.json()).data);
    setLoading(false);
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
        <h2 className="text-2xl font-semibold">파일에서 추가</h2>
        <p>
          CSV를 업로드할 수 있습니다.{" "}
          <a className="text-gray-400 underline" href="/examples/users.csv">
            예시 CSV
          </a>
        </p>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          accept="text/csv"
        />
        <div className="mt-3 flex relative">
          <div className="absolute rounded-l-md flex w-10 h-10 justify-center items-center bg-gray-300">
            <IconFile className="w-4 h-4" />
          </div>
          <input
            type="text"
            className="flex-1 h-10 rounded-md border-gray-300 border p-2 pl-12 focus:outline-none cursor-pointer"
            readOnly
            value={file?.name ?? "파일 선택"}
            onChange={() => {}} // do nothing
            onClick={(e) => {
              e.preventDefault();
              fileInputRef.current?.click();
            }}
          />
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {result.length === 0 && users.length > 0 && (
          <div className="mt-3 w-full max-h-[320px] overflow-auto">
            <h3 className="text-lg font-semibold">추가할 사용자</h3>
            <ul className="mt-2">
              {users.map((user, i) => (
                <li key={`${user}_${i}`}>
                  {user.name} ({user.email})
                </li>
              ))}
            </ul>
          </div>
        )}
        {result.length > 0 && (
          <div className="mt-3 w-full max-h-[320px] overflow-auto">
            <h3 className="text-lg font-semibold">추가 결과</h3>
            <ul className="mt-2">
              {result.map((user, i) => (
                <li
                  key={`${user}_${i}`}
                  className={user.result ? "text-green-600" : "text-red-600"}
                >
                  {user.name} ({user.email}) - {user.result ? "성공" : "실패"}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
            disabled={loading}
            onClick={() => {
              setFile(null);
              setUsers([]);
              setResult([]);
              onClose();
            }}
          >
            취소
          </button>
          <div className="w-3" />
          {result.length === 0 && (
            <button
              type="submit"
              disabled={loading || !file}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              추가
            </button>
          )}
          {result.length > 0 && (
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              onClick={() => {
                setFile(null);
                setUsers([]);
                setResult([]);
                router.refresh();
                onClose();
              }}
            >
              닫기
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
