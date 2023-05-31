"use client";
import { PropsWithChildren, createContext, useState } from "react";

import NextAdapterApp from "next-query-params/app";
import { QueryParamProvider } from "use-query-params";

import CertAddDialog from "./(dialogs)/CertAddDialog";

export const DialogContext = createContext({
  openUserAddDialog: () => {},
});

export default function Providers({ children }: PropsWithChildren) {
  const [certAddDialogOpen, setCertAddDialogOpen] = useState(false);

  return (
    <QueryParamProvider adapter={NextAdapterApp}>
      <DialogContext.Provider
        value={{ openUserAddDialog: () => setCertAddDialogOpen(true) }}
      >
        {children}
        <CertAddDialog
          open={certAddDialogOpen}
          onClose={() => setCertAddDialogOpen(false)}
        />
      </DialogContext.Provider>
    </QueryParamProvider>
  );
}
