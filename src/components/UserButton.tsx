"use client";

import { useRef } from "react";

import { SessionProvider, signOut, useSession } from "next-auth/react";

import useDisclosure from "lib/useDisclosure";
import useOutsideClick from "lib/useOutsideClick";

function UserButtonContent() {
  const { isOpen, onToggle, onClose } = useDisclosure();

  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dropdownRef, onClose);

  const session = useSession();

  return (
    <div className="relative">
      <p className="cursor-pointer" onClick={onToggle} onKeyDown={onToggle}>
        환영합니다,{" "}
        <span className="font-semibold">{session.data?.user?.name || ""}</span>
        님!
      </p>
      <div
        ref={dropdownRef}
        className={`absolute right-0 z-10 w-48 mt-2 origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <button
          type="button"
          onClick={() => signOut()}
          className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default function UserButton() {
  return (
    <SessionProvider>
      <UserButtonContent />
    </SessionProvider>
  );
}
