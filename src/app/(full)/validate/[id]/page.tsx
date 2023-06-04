import validator from "validator";

import { prisma } from "lib/prisma";

import InvalidPage from "./Invalid";

import IconCircleCheck from "assets/icons/icon_circle-check.svg";

type Props = {
  params: {
    id: string;
  };
};

export default async function ValidatePage({ params: { id } }: Props) {
  if (!id || !validator.isUUID(id)) {
    return <InvalidPage />;
  }

  const cert = await prisma.certificateLog.findUnique({
    where: {
      id,
    },
    include: {
      certificate: true,
      user: true,
    },
  });

  if (!cert) {
    return <InvalidPage />;
  }

  const { certificate, user } = cert;

  return (
    <div>
      <header className="flex flex-col items-center p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-center break-keep md:text-left">
          OUTTA 증명서 발급센터
        </h1>
      </header>
      <main className="w-full max-w-lg mx-auto m-12 p-6">
        <div className="flex flex-col sm:flex-row items-center">
          <IconCircleCheck className="w-20 h-20 fill-green-500 shrink-0" />
          <div className="w-6 h-6" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-center sm:text-left">
              유효한 증명서입니다.
            </h2>
            <p className="mt-3 break-keep">
              <span className="font-bold">{user.name}</span>님에게
              <br />
              <span className="font-bold">
                {cert.createdAt.toLocaleString("ko-KR")}
              </span>
              에 발급된
              <br />
              <span className="font-bold">{certificate.name}</span>
              입니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
