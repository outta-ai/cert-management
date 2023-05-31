import { PropsWithChildren } from "react";

import { ClerkProvider } from "@clerk/nextjs";

import "styles/globals.css";

export const metadata = {
  title: "OUTTA 증명서 발급센터",
  description: "OUTTA 증명서 발급센터",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <ClerkProvider>
      <html lang="ko">
        <head>
          <link
            rel="stylesheet"
            as="style"
            crossOrigin="anonymous"
            href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.6/dist/web/variable/pretendardvariable-dynamic-subset.css"
          />
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
