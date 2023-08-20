"use client";

import { PropsWithChildren, createContext, useState } from "react";

import NextAdapterApp from "next-query-params/app";
import { QueryParamProvider } from "use-query-params";
import GroupAddDialog from "./(dialogs)/GroupAddDialog";

export const DialogContext = createContext({
  openGroupAddDialog: () => {},
});

export default function Providers({ children }: PropsWithChildren) {
  const [groupAddDialogOpen, setGroupAddDialogOpen] = useState(false);

  return (
    <QueryParamProvider adapter={NextAdapterApp}>
      <DialogContext.Provider
        value={{ openGroupAddDialog: () => setGroupAddDialogOpen(true) }}
      >
        {children}
        <GroupAddDialog
          open={groupAddDialogOpen}
          onClose={() => setGroupAddDialogOpen(false)}
        />
      </DialogContext.Provider>
    </QueryParamProvider>
  );
}
