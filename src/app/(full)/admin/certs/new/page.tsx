import { redirect } from "next/navigation";

import { withAuth } from "lib/auth";
import { prisma } from "lib/prisma";

import Header from "../../Header";
import Form from "./Form";

import IconChevronLeft from "assets/icons/icon_chevron-left.svg";

export default async function NewCertPage() {
  const user = await withAuth();

  if (!user || !user.groups.find((g) => g.name === "Admin")) {
    redirect(process.env.BASE_URL);
  }

  const users = await prisma.user.findMany({});

  return (
    <main className="container mx-auto">
      <Header />
      <section className="mt-6 p-6">
        <div className="flex items-center">
          <a href="/admin/certs" className="mr-3">
            <IconChevronLeft className="w-5 h-5" />
          </a>
          <h2 className="text-2xl font-semibold">새 증명서</h2>
        </div>
        <div className="block md:hidden">
          <h2>증명서 추가는 PC에서만 가능합니다</h2>
        </div>
        <div className="hidden md:block">
          <Form users={users} />
        </div>
      </section>
    </main>
  );
}
