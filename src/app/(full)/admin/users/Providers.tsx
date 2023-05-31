"use client";

import NextAdapterApp from "next-query-params/app";
import { PropsWithChildren, createContext, useState } from "react";
import { QueryParamProvider } from "use-query-params";
import UserAddDialog from "./(dialogs)/UserAddDialog";
import UserFileAddDialog from "./(dialogs)/UserFileAddDialog";

export const DialogContext = createContext({
  setUserAddDialogOpen: (value: boolean) => {},
  setUserFileAddDialogOpen: (value: boolean) => {},
});

export default function Providers({ children }: PropsWithChildren) {
  const [userAddDialogOpen, setUserAddDialogOpen] = useState(false);
  const [userFileAddDialogOpen, setUserFileAddDialogOpen] = useState(false);

  return (
    <QueryParamProvider adapter={NextAdapterApp}>
      <DialogContext.Provider
        value={{ setUserAddDialogOpen, setUserFileAddDialogOpen }}
      >
        {children}
        <UserAddDialog
          open={userAddDialogOpen}
          onClose={() => setUserAddDialogOpen(false)}
        />
        <UserFileAddDialog
          open={userFileAddDialogOpen}
          onClose={() => setUserFileAddDialogOpen(false)}
        />
      </DialogContext.Provider>
    </QueryParamProvider>
  );
}
