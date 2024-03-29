"use client";
import { useRef } from "react";

import useDisclosure from "lib/useDisclosure";
import useOutsideClick from "lib/useOutsideClick";

import UserButton from "components/UserButton";

import IconBars from "assets/icons/icon_bars.svg";

export default function Header() {
  const { isOpen, onToggle, onClose } = useDisclosure();

  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dropdownRef, onClose);

  return (
    <header className="flex flex-col md:flex-row items-center p-6 shadow-sm">
      <a href="/admin">
        <h1 className="text-2xl font-bold text-center break-keep md:text-left">
          OUTTA 증명서 발급센터 | 관리자
        </h1>
      </a>
      <div className="hidden md:flex md:flex-row">
        <a href="/admin/users" className="mx-6">
          사용자
        </a>
        <a href="/admin/groups" className="mx-6">
          사용자 그룹
        </a>
        <a href="/admin/certs" className="mx-6">
          증명서
        </a>
      </div>
      <div className="flex-1" />
      <a href="/" className="mx-6 hidden md:inline">
        홈
      </a>
      <div className="mt-6 w-full flex items-center md:w-auto md:mt-0 relative">
        <IconBars
          className="w-5 h-5 block md:hidden cursor-pointer"
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
          <a href="/" className="block p-6 border border-gray-100">
            홈
          </a>
          <a href="/admin/users" className="block p-6 border border-gray-100">
            사용자
          </a>
          <a href="/admin/groups" className="block p-6 border border-gray-100">
            사용자 그룹
          </a>
          <a href="/admin/certs" className="block p-6 border border-gray-100">
            증명서
          </a>
        </div>
      </div>
    </header>
  );
}
