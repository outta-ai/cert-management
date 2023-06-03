import { withAuth } from "lib/auth";
import { prisma } from "lib/prisma";
import { redirect } from "next/navigation";
import Header from "./Header";

export const metadata = {
  title: "관리자 | OUTTA 증명서 발급센터",
  description: "관리자 | OUTTA 증명서 발급센터",
};

export default async function AdminPage() {
  const user = await withAuth();

  if (!user || user.type !== "Admin") {
    redirect(process.env.BASE_URL);
  }

  const users = await prisma.user.findMany();
  const registeredUsers = users.filter((user) => user.googleId);

  const certs = await prisma.certificate.findMany({ include: { logs: true } });
  const logs = await prisma.certificateLog.findMany();
  const issuedCerts = certs.filter((cert) => cert.logs.length > 0);

  return (
    <main className="container mx-auto">
      <Header />
      <section className="mt-6 p-6">
        <div className="flex items-ceter">
          <a className="flex items-center" href="/admin/users">
            <h2 className="text-2xl font-semibold">사용자</h2>
          </a>
          <div className="flex-1" />
          <a className="flex items-center" href="/admin/users">
            <h2 className="hover:underline">사용자 관리</h2>
          </a>
        </div>
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
      <section className="mt-6 p-6">
        <div className="flex items-ceter">
          <a className="flex items-center" href="/admin/certs">
            <h2 className="text-2xl font-semibold">증명서</h2>
          </a>
          <div className="flex-1" />
          <a className="flex items-center" href="/admin/certs">
            <h2 className="hover:underline">증명서 관리</h2>
          </a>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-x-6">
          <div className="p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">등록된 증명서</h3>
            <p className="mt-3 text-4xl">{certs.length}개</p>
          </div>
          <div className="p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">발급된 증명서</h3>
            <p className="mt-3 text-4xl">{logs.length}개</p>
          </div>
          <div className="p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">발급률</h3>
            <p className="mt-3 text-4xl">
              {Math.round((issuedCerts.length / certs.length) * 100)}%
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
