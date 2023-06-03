"use client";
import { useRef } from "react";

import useDisclosure from "lib/useDisclosure";
import useOutsideClick from "lib/useOutsideClick";

import UserButton from "components/UserButton";

import IconBars from "assets/icons/icon_bars.svg";

type Props = {
  isAdmin: boolean;
};

export default function Header({ isAdmin }: Props) {
  const { isOpen, onToggle, onClose } = useDisclosure();

  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dropdownRef, onClose);

  return (
    <header className="flex flex-col md:flex-row items-center p-6 shadow-sm">
      <a href="/">
        <h1 className="text-2xl font-bold text-center break-keep md:text-left">
          OUTTA 증명서 발급센터
        </h1>
      </a>
      <div className="flex-1" />
      {isAdmin && (
        <div className="hidden md:flex md:flex-row">
          <a href="/admin" className="mx-6">
            관리자
          </a>
        </div>
      )}
      <div className="mt-6 w-full flex items-center md:w-auto md:mt-0 relative">
        <IconBars
          className={`${
            isAdmin ? "" : "hidden"
          } w-5 h-5 block md:hidden cursor-pointer`}
          onClick={onToggle}
        />
        <div className="flex-1 md:hidden" />
        <UserButton />
        <div
          ref={dropdownRef}
          className={`${
            isOpen ? "block" : "hidden"
          } absolute top-14 left-0 bg-white w-full`}
        >
          {isAdmin && (
            <a href="/admin" className="block p-6 border border-gray-100">
              관리자
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
