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

type FullCertificate = Certificate & { user: User };

type Props = {
  certs: FullCertificate[];
};

export default function Form({ certs: fullCerts }: Props) {
  const [{ page, search: paramSearch }, setQuery] = useQueryParams({
    page: withDefault(NumberParam, 1),
    search: withDefault(StringParam, undefined),
    user: withDefault(StringParam, undefined),
  });

  const [search, setSearch] = useState(paramSearch);
  const debouncedSearch = useDebounce(search, 100);

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

      if (cert.user.clerkId?.includes(search)) {
        return true;
      }

      if (cert.user.email.includes(search)) {
        return true;
      }

      if (cert.user.name.includes(search)) {
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
          placeholder="검색 (증명서 제목, 증명서 내용, Clerk ID, 이메일, 이름)"
          className="rounded-md border-gray-300 border p-2 w-full"
          value={search || ""}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
        <div className="mt-3"></div>
      </form>
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
