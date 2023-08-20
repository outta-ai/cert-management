import { Group, User } from "@prisma/client";
import { useState } from "react";

import IconLeft from "assets/icons/icon_left.svg";
import IconRight from "assets/icons/icon_right.svg";

type Props = {
  file: File | null;
  users: (User & { groups: Group[] })[];
  selectedUsers: (User & { groups: Group[] })[];
  setSelectedUsers: React.Dispatch<
    React.SetStateAction<(User & { groups: Group[] })[]>
  >;
};

const filterFunc = (search: string) => (user: User & { groups: Group[] }) => {
  if (!search || !search.trim()) {
    return true;
  }

  if (user.googleId?.includes(search)) {
    return true;
  }

  if (user.email.includes(search)) {
    return true;
  }

  if (user.name.includes(search)) {
    return true;
  }

  if (user.groups.some((group) => group.name.includes(search))) {
    return true;
  }

  return false;
};

export default function UserForm({
  file,
  users,
  selectedUsers,
  setSelectedUsers,
}: Props) {
  const [searchSelect, setSearchSelect] = useState("");
  const [searchNotSelect, setSearchNotSelect] = useState("");

  const filteredSelectedUsers = selectedUsers.filter(filterFunc(searchSelect));

  const notSelectedUsers = users.filter((user) => {
    return !selectedUsers.find((selectedUser) => selectedUser.id === user.id);
  });
  const filteredNotSelectedUsers = notSelectedUsers.filter(
    filterFunc(searchNotSelect)
  );

  return (
    <div className={`mt-6 ${file ? "block" : "hidden"}`}>
      <p className="text-xl">
        <span className="font-semibold">3.</span> 증명서를 발급할 대상을
        선택합니다
      </p>
      <div className="mt-3 flex">
        <div className="flex-1">
          <p className="font-semibold text-gray-600">발급하지 않을 사용자</p>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-2"
            value={searchNotSelect}
            onChange={(e) => setSearchNotSelect(e.currentTarget.value)}
            placeholder="검색 (Google ID, 이메일, 이름, 그룹)"
          />
          {filteredNotSelectedUsers.map((user) => (
            <div
              onClick={() => {
                setSelectedUsers([...selectedUsers, user]);
              }}
              onKeyDown={() => {
                setSelectedUsers([...selectedUsers, user]);
              }}
              className="flex flex-col md:flex-row p-3 border-b border-gray-200 last-of-type:border-b-0 cursor-pointer"
              key={user.id}
            >
              <p className="font-semibold text-gray-800 mr-3 shrink-0">
                {user.name}
              </p>
              <p className="text-gray-600 shrink-0">{user.email}</p>
              <div className="flex-1 basis-3" />
              <p className="hidden lg:block text-gray-300 overflow-hidden text-ellipsis">
                {user.googleId}
              </p>
            </div>
          ))}
        </div>
        <div className="w-12 mt-16 flex flex-col justify-center items-center">
          <IconLeft
            className="w-5 h-5 cursor-pointer"
            onClick={() => {
              setSelectedUsers(
                selectedUsers.filter(
                  (user) => !filteredSelectedUsers.includes(user)
                )
              );
            }}
          />
          <div className="w-3 h-3" />
          <IconRight
            className="w-5 h-5 cursor-pointer"
            onClick={() => {
              setSelectedUsers([...selectedUsers, ...filteredNotSelectedUsers]);
            }}
          />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-600">발급할 사용자</p>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-2"
            value={searchSelect}
            onChange={(e) => setSearchSelect(e.target.value)}
            placeholder="검색 (Google ID, 이메일, 이름, 그룹)"
          />
          {filteredSelectedUsers.map((user) => (
            <div
              onClick={() => {
                setSelectedUsers([
                  ...selectedUsers.filter((u) => u.id !== user.id),
                ]);
              }}
              onKeyDown={() => {
                setSelectedUsers([
                  ...selectedUsers.filter((u) => u.id !== user.id),
                ]);
              }}
              className="flex flex-col md:flex-row p-3 border-b border-gray-200 last-of-type:border-b-0 cursor-pointer"
              key={user.id}
            >
              <p className="font-semibold text-gray-800 mr-3 shrink-0">
                {user.name}
              </p>
              <p className="text-gray-600 shrink-0">{user.email}</p>
              <div className="flex-1 basis-3" />
              <p className="hidden lg:block text-gray-300 overflow-hidden text-ellipsis">
                {user.googleId}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
