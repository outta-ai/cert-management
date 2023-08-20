"use client";

import { PropsWithChildren, createContext, useState } from "react";

import { Group } from "@prisma/client";
import NextAdapterApp from "next-query-params/app";
import { QueryParamProvider } from "use-query-params";

import UserAddDialog from "./(dialogs)/UserAddDialog";
import UserFileAddDialog from "./(dialogs)/UserFileAddDialog";

type Props = {
  groups: Group[];
};

export const DialogContext = createContext({
  openUserAddDialog: () => {},
  openUserFileAddDialog: () => {},
});

export default function Providers({
  groups,
  children,
}: PropsWithChildren<Props>) {
  const [userAddDialogOpen, setUserAddDialogOpen] = useState(false);
  const [userFileAddDialogOpen, setUserFileAddDialogOpen] = useState(false);

  return (
    <QueryParamProvider adapter={NextAdapterApp}>
      <DialogContext.Provider
        value={{
          openUserAddDialog: () => setUserAddDialogOpen(true),
          openUserFileAddDialog: () => setUserFileAddDialogOpen(true),
        }}
      >
        {children}
        <UserAddDialog
          open={userAddDialogOpen}
          onClose={() => setUserAddDialogOpen(false)}
          groups={groups}
        />
        <UserFileAddDialog
          open={userFileAddDialogOpen}
          onClose={() => setUserFileAddDialogOpen(false)}
        />
      </DialogContext.Provider>
    </QueryParamProvider>
  );
}
