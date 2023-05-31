"use client";

import { User } from "@prisma/client";
import Pagination from "components/Pagination";
import { useDebounce } from "lib/debounce";
import { useEffect, useState } from "react";
import {
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from "use-query-params";

type Props = {
  users: User[];
};

export default function Form({ users: fullUsers }: Props) {
  const [{ page, search: paramSearch }, setQuery] = useQueryParams({
    page: withDefault(NumberParam, 1),
    search: withDefault(StringParam, undefined),
    user: withDefault(StringParam, undefined),
  });

  const [search, setSearch] = useState(paramSearch);
  const debouncedSearch = useDebounce(search, 100);

  const users = fullUsers
    .filter((user) => {
      if (!search || !search.trim()) {
        return true;
      }

      if (user.clerkId?.includes(search)) {
        return true;
      }

      if (user.email.includes(search)) {
        return true;
      }

      if (user.name.includes(search)) {
        return true;
      }

      return false;
    })
    .slice((page - 1) * 10, page * 10);

  useEffect(() => {
    setQuery({ search: debouncedSearch });
  }, [debouncedSearch]);

  return (
    <>
      <form className="w-full" onSubmit={(e) => e.preventDefault()}>
        <input
          placeholder="검색 (Clerk ID, 이메일, 이름)"
          className="rounded-md border-gray-300 border p-2 w-full"
          value={search || ""}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
        <div className="mt-3">
          {users.map((user) => (
            <div
              onClick={() => {
                setQuery({ user: user.id });
              }}
              onKeyDown={() => {
                setQuery({ user: user.id });
              }}
              className="flex p-3 border-b border-gray-200 last-of-type:border-b-0 cursor-pointer"
              key={user.id}
            >
              <p className="font-semibold text-gray-800">{user.name}</p>
              <p className="ml-3 text-gray-600">{user.email}</p>
              <div className="flex-1" />
              <p className="text-gray-300">{user.clerkId}</p>
            </div>
          ))}
        </div>
      </form>
      <div className="flex justify-center">
        <Pagination
          page={page}
          setPage={(page) => setQuery({ page })}
          total={users.length}
        />
      </div>
    </>
  );
}
