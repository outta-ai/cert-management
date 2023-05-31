import { currentUser } from "@clerk/nextjs";
import { prisma } from "lib/prisma";
import { redirect } from "next/navigation";
import Header from "../Header";
import CertAdd from "./CertAdd";
import Form from "./Form";
import Providers from "./Providers";

export default async function AdminCertPage() {
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

  const certs = await prisma.certificate.findMany({
    include: { logs: true, user: true },
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
          <CertAdd />
        </section>
        <section className="mt-6 p-6">
          <Form certs={certs} />
        </section>
      </main>
    </Providers>
  );
}
