import { redirect } from "next/navigation";

import { withAuth } from "lib/auth";
import { prisma } from "lib/prisma";

import Header from "../Header";
import Form from "./Form";
import Providers from "./Providers";
import UserAdd from "./UserAdd";
import UserInfo from "./UserInfo";

export const metadata = {
  title: "관리자 | OUTTA 증명서 발급센터",
  description: "관리자 | OUTTA 증명서 발급센터",
};

export default async function AdminUserPage() {
  const user = await withAuth();

  if (!user || user.type !== "Admin") {
    redirect(process.env.BASE_URL);
  }

  const users = await prisma.user.findMany();
  const registeredUsers = users.filter((user) => user.googleId);

  return (
    <Providers>
      <main className="container mx-auto">
        <Header />
        <section className="mt-6 p-6">
          <a className="flex items-center" href="/admin/users">
            <h2 className="text-2xl font-semibold">사용자</h2>
          </a>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-x-6">
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
