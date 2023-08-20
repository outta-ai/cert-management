"use client";

import { Group } from "@prisma/client";
import { StringParam, useQueryParams, withDefault } from "use-query-params";

type Props = {
  groups: Group[];
};

export default function Table({ groups }: Props) {
  const [_, setQuery] = useQueryParams({
    group: withDefault(StringParam, undefined),
  });

  return (
    <div className="mt-3 w-full">
      {groups.map((group) => (
        <div
          key={group.id}
          onClick={() => setQuery({ group: group.id })}
          onKeyDown={() => setQuery({ group: group.id })}
          className="flex flex-col md:flex-row p-3 border-b border-gray-200 last-of-type:border-b-0 cursor-pointer"
        >
          <p className="font-semibold text-gray-800">{group.name}</p>
          <div className="ml-3 flex-1" />
          <p className="text-gray-300 overflow-hidden text-ellipsis">
            {group.id}
          </p>
        </div>
      ))}
    </div>
  );
}
