import { redirect } from "next/navigation";

import { UserButton, currentUser } from "@clerk/nextjs";

import { prisma } from "lib/prisma";

import Form from "./Form";
import Providers from "./Providers";
import UserAdd from "./UserAdd";
import UserInfo from "./UserInfo";

export const metadata = {
  title: "관리자 | OUTTA 증명서 발급센터",
  description: "관리자 | OUTTA 증명서 발급센터",
};

export default async function AdminUserPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect(process.env.BASE_URL);
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
  });

  if (!user || user.type !== "Admin") {
    redirect(process.env.BASE_URL);
  }

  const users = await prisma.user.findMany();
  const registeredUsers = users.filter((user) => user.clerkId);

  return (
    <Providers>
      <main className="container mx-auto">
        <header className="flex items-center p-6 shadow-sm">
          <h1 className="text-2xl font-bold">OUTTA 증명서 발급센터 | 관리자</h1>
          <a href="/admin/users" className="mx-6">
            사용자
          </a>
          <a href="/admin/certs" className="mx-6">
            증명서
          </a>
          <div className="flex-1" />
          <UserButton afterSignOutUrl="/" />
        </header>
        <section className="mt-6 p-6">
          <a className="flex items-center" href="/admin/users">
            <h2 className="text-2xl font-semibold">사용자</h2>
          </a>
          <div className="mt-3 grid grid-cols-3 gap-x-6">
            <div className="p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">등록된 사용자</h3>
              <p className="mt-3 text-4xl">{users.length}명</p>
            </div>
            <div className="p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">가입된 사용자</h3>
              <p className="mt-3 text-4xl">{registeredUsers.length}명</p>
            </div>
            <div className="p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">가입률</h3>
              <p className="mt-3 text-4xl">
                {Math.round((registeredUsers.length / users.length) * 100)}%
              </p>
            </div>
          </div>
        </section>
        <section className="mt-6 px-6 flex justify-end">
          <UserAdd />
        </section>
        <section className="mt-6 p-6">
          <Form users={users} />
        </section>
      </main>
      <UserInfo users={users} />
    </Providers>
  );
}
