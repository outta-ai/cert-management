"use client";

import { useRef } from "react";

import IconFile from "assets/icons/icon_file.svg";

type Props = {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
};

export default function FileForm({ file, setFile }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mt-3">
      <p className="text-xl">
        <span className="font-semibold">1.</span> 증명서 배경을 선택해 주세요
      </p>
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        accept="image/*"
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
    </div>
  );
}
