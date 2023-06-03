import { withAuth } from "lib/auth";

import UserButton from "components/UserButton";

export default async function Home() {
  const user = await withAuth();

  if (!user) {
    return null;
  }

  return (
    <main className="container mx-auto">
      <header className="flex items-center p-6 shadow-sm">
        <h1 className="text-2xl font-bold">OUTTA 증명서 발급센터</h1>
        <div className="flex-1" />
        {user.type === "Admin" && (
          <a href="/admin" className="mx-6">
            관리자
          </a>
        )}
        {/* FIXME */}
        <UserButton />
      </header>
    </main>
  );
}
