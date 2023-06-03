import { PropsWithChildren } from "react";

import "styles/globals.css";

export const metadata = {
  title: "OUTTA 증명서 발급센터",
  description: "OUTTA 증명서 발급센터",
};

export default function CenterLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ko" className="w-full h-full">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.6/dist/web/variable/pretendardvariable-dynamic-subset.css"
        />
      </head>
      <body className="w-full h-full flex justify-center items-center">
        {children}
      </body>
    </html>
  );
}
