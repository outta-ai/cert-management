import { withAuth } from "lib/auth";

import { prisma } from "lib/prisma";
import Header from "./Header";

export default async function Home() {
  const user = await withAuth();

  if (!user) {
    return null;
  }

  const certs = await prisma.certificate.findMany({
    where: { userIds: { has: user.id } },
  });

  return (
    <main className="container mx-auto">
      <Header isAdmin={!!user.groups.find((g) => g.name === "Admin")} />
      <section className="mt-6 p-6">
        <h2 className="text-2xl font-semibold">발급 가능한 증명서</h2>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6">
          {certs.map((cert) => (
            <a
              href={`/certs/${cert.id}`}
              className="block p-6 rounded-lg shadow-lg"
              key={cert.id}
            >
              <h3 className="text-xl font-semibold">{cert.name}</h3>
              <p className="text-right mt-3">
                {cert.issuedAt.toLocaleString("ko-KR")}
              </p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
