"use client";
import { PropsWithChildren } from "react";

import NextAdapterApp from "next-query-params/app";
import { QueryParamProvider } from "use-query-params";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <QueryParamProvider adapter={NextAdapterApp}>{children}</QueryParamProvider>
  );
}
