"use client";

import { useContext } from "react";

import { DialogContext } from "./Providers";

import IconPlus from "assets/icons/icon_plus.svg";

export default function GroupAdd() {
  const { openGroupAddDialog } = useContext(DialogContext);

  return (
    <button
      type="button"
      className="bg-gray-200 hover:bg-gray-300 rounded-md p-3"
      onClick={openGroupAddDialog}
    >
      <IconPlus className="w-5 h-5" />
    </button>
  );
}
