import { useEffect, useRef, useState } from "react";

import IconFile from "assets/icons/icon_file.svg";

type DialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function UserFileAddDialog({ open, onClose }: DialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) {
      return;
    }
  }, [file]);

  if (!open) {
    return null;
  }

  return (
    <div className="z-10 fixed flex justify-center items-center top-0 left-0 w-full h-screen bg-black bg-opacity-50">
      <form className="w-full max-w-sm m-3 bg-white rounded-lg shadow-lg p-6">
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
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
            onClick={() => {
              onClose();
            }}
          >
            취소
          </button>
          <div className="w-3" />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            추가
          </button>
        </div>
      </form>
    </div>
  );
}
