import { redirect } from "next/navigation";

import { withAuth } from "lib/auth";
import { prisma } from "lib/prisma";

import Header from "app/(full)/Header";
import IssueButton from "./IssueButton";

import IconChevronLeft from "assets/icons/icon_chevron-left.svg";

type Props = {
  params: {
    id: string;
  };
};

export default async function Cert({ params: { id } }: Props) {
  const user = await withAuth();

  if (!user) {
    redirect(`${process.env.BASE_URL}/login`);
  }

  const cert = await prisma.certificate.findUnique({
    where: { id },
  });

  if (!cert) {
    redirect(process.env.BASE_URL);
  }

  if (!cert.userIds.includes(user.id)) {
    redirect(process.env.BASE_URL);
  }

  return (
    <main className="container mx-auto">
      <Header isAdmin={user.type === "Admin"} />
      <div className="mt-3 p-6 flex items-center">
        <a href="/" className="mr-2">
          <IconChevronLeft className="w-5 h-5" />
        </a>
        <h2 className="text-2xl font-semibold">{cert.name} 발급하기</h2>
        <div className="flex-1" />
        <IssueButton certId={id} />
      </div>
      <div className="mt-3 px-6">
        <p>
          <b>증명서 발급일자:</b> {cert.issuedAt.toLocaleDateString("ko-KR")}
        </p>
      </div>
    </main>
  );
}
