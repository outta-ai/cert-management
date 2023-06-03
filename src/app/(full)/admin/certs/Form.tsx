"use client";

import { Certificate, User } from "@prisma/client";
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
  certs: Certificate[];
};

export default function Form({ certs: fullCerts, users }: Props) {
  const [{ page, search: paramSearch }, setQuery] = useQueryParams({
    page: withDefault(NumberParam, 1),
    search: withDefault(StringParam, undefined),
    cert: withDefault(StringParam, undefined),
  });

  const [search, setSearch] = useState(paramSearch);
  const debouncedSearch = useDebounce(search, 100);

  const filteredUserIds = users
    .filter((user) => {
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
    })
    .map((user) => user.id);

  const certs = fullCerts
    .filter((cert) => {
      if (!search || !search.trim()) {
        return true;
      }

      if (cert.name.includes(search)) {
        return true;
      }

      if (cert.content.includes(search)) {
        return true;
      }

      if (cert.userIds.some((id) => filteredUserIds.includes(id))) {
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
          placeholder="검색 (증명서 제목, 증명서 내용, Google ID, 이메일, 이름)"
          className="rounded-md border-gray-300 border p-2 w-full"
          value={search || ""}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
      </form>
      <div className="mt-3">
        {certs.map((cert) => (
          <div
            onClick={() => {
              setQuery({ cert: cert.id });
            }}
            onKeyDown={() => {
              setQuery({ cert: cert.id });
            }}
            className="flex flex-col md:flex-row p-3 border-b border-gray-200 hover:bg-gray-100 last-of-type:border-b-0 cursor-pointer"
            key={cert.id}
          >
            <p className="font-semibold text-gray-800 mr-3">{cert.name}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <Pagination
          page={page}
          setPage={(page) => setQuery({ page })}
          total={certs.length}
        />
      </div>
    </>
  );
}
