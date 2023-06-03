import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Login from "./Login";

type Props = {
  searchParams?: {
    error?: string;
  };
};

export default async function UnregisteredPage({ searchParams }: Props) {
  const session = await getServerSession();

  if (session) {
    redirect("/");
  }

  if (searchParams?.error === "AccessDenied") {
    redirect("/unregistered");
  }

  return (
    <main className="w-full max-w-sm m-3 shadow-lg p-6">
      <header className="flex flex-row justify-center">
        <div className="block sm:flex">
          <p className="font-bold text-xl text-center sm:text-2xl sm:text-left">
            OUTTA
          </p>
          <p className="hidden sm:block">&nbsp;</p>
          <p className="font-bold text-xl text-center sm:text-2xl sm:text-left">
            증명서 발급센터
          </p>
        </div>
      </header>
      <Login className="mt-3" />
    </main>
  );
}
