import { redirect } from "next/navigation";

import { withAuth } from "lib/auth";
import { prisma } from "lib/prisma";

import Header from "../Header";
import CertInfo from "./CertInfo";
import Form from "./Form";
import Providers from "./Providers";

import IconPlus from "assets/icons/icon_plus.svg";

export default async function AdminCertPage() {
  const user = await withAuth();

  if (!user || !user.groups.find((g) => g.name === "Admin")) {
    redirect(process.env.BASE_URL);
  }

  const users = await prisma.user.findMany();

  const certs = await prisma.certificate.findMany({
    include: { logs: true },
  });
  const logs = await prisma.certificateLog.findMany();
  const issuedCerts = certs.filter((cert) => cert.logs.length > 0);

  return (
    <Providers>
      <main className="container mx-auto">
        <Header />
        <section className="mt-6 p-6">
          <h2 className="text-2xl font-semibold">증명서</h2>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-x-6">
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
        <section className="mt-6 px-6 flex justify-end">
          <a
            href="/admin/certs/new"
            className="bg-gray-200 hover:bg-gray-300 rounded-md p-3"
          >
            <IconPlus className="w-5 h-5" />
          </a>
        </section>
        <section className="mt-6 p-6">
          <Form users={users} certs={certs} />
        </section>
      </main>
      <CertInfo users={users} certs={certs} />
    </Providers>
  );
}
