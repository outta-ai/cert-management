"use client";

import IconFilePlus from "assets/icons/icon_file-plus.svg";
import IconPlus from "assets/icons/icon_plus.svg";
import { useContext } from "react";
import { DialogContext } from "./Providers";

export default function UserAdd() {
  const { openUserAddDialog, openUserFileAddDialog } =
    useContext(DialogContext);

  return (
    <>
      <button
        type="button"
        className="bg-gray-200 hover:bg-gray-300 rounded-md p-3"
        onClick={openUserAddDialog}
      >
        <IconPlus className="w-5 h-5" />
      </button>
      <div className="w-3" />
      <button
        type="button"
        className="bg-gray-200 hover:bg-gray-300 rounded-md p-3"
        onClick={openUserFileAddDialog}
      >
        <IconFilePlus className="w-5 h-5" />
      </button>
    </>
  );
}
