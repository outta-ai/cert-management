"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { User } from "@prisma/client";

import IconFile from "assets/icons/icon_file.svg";

type DialogProps = {
  open: boolean;
  onClose: () => void;
};

const handleCSV = async (file: File) => {
  const headerMap = {
    이름: "name",
    이메일: "email",
    "Clerk ID": "clerkId",
    유형: "type",
    타입: "type",
    메모: "memo",
  };

  const content = await file.text();

  const lines = content.replaceAll("\r\n", "\n").split("\n");

  const headers = lines[0].split(",");
  const hasHeader = headers.some((header) => header in headerMap);

  if (
    hasHeader &&
    !["이름", "이메일", "타입"].every((must) => headers.includes(must))
  ) {
    throw new Error("올바른 CSV 파일이 아닙니다.");
  } else if (!hasHeader && headers.length < 3) {
    throw new Error("올바른 CSV 파일이 아닙니다.");
  }

  const users = lines.slice(hasHeader ? 1 : 0).map((line) => {
    const values = line.split(",");

    const user: Partial<User> = {};

    headers.forEach((header, i) => {
      const mappedHeader = headerMap[header as keyof typeof headerMap];

      if (mappedHeader === "type") {
        if (!["User", "Member", "Admin"].includes(values[i].trim())) {
          throw new Error("올바른 CSV 파일이 아닙니다.");
        } else {
          user[mappedHeader] = values[i].trim() as User["type"];
        }
      } else if (mappedHeader === "clerkId") {
        user[mappedHeader] = values[i].trim() ? values[i] : null;
      } else {
        user[mappedHeader as keyof Omit<User, "type">] = values[i].trim();
      }
    });

    return user as User;
  });

  return users;
};

type UserResult = User & { result: boolean };

export default function UserFileAddDialog({ open, onClose }: DialogProps) {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UserResult[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!file) {
      return;
    }

    setLoading(true);
    try {
      handleCSV(file).then((users) => {
        setUsers(users);

        console.log(users);
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("파일 처리 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }, [file]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!users.length) {
      return;
    }

    setLoading(true);

    const result = await Promise.allSettled(
      users.map((user) => {
        fetch("/api/users", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(user),
        });
      })
    );

    setResult(
      result.map((r, i) => ({
        ...users[i],
        result: r.status === "fulfilled",
      }))
    );
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
              disabled={loading || !users.length}
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
