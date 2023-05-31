import { UserButton, currentUser } from "@clerk/nextjs";
import { prisma } from "lib/prisma";
import { redirect } from "next/navigation";
import SignOutButton from "./SignOut";

export default async function UnregisteredPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
  });

  if (user) {
    redirect("/");
  }

  return (
    <main className="w-full max-w-sm m-3 shadow-lg p-6">
      <header className="flex flex-row items-center">
        <div className="block sm:flex">
          <p className="font-bold text-xl text-center sm:text-2xl sm:text-left">
            OUTTA
          </p>
          <p className="hidden sm:block">&nbsp;</p>
          <p className="font-bold text-xl text-center sm:text-2xl sm:text-left">
            증명서 발급센터
          </p>
        </div>
        <div className="flex-1" />
        <UserButton />
      </header>
      <p className="mt-6 font-semibold text-center break-keep">
        OUTTA에 등록되어 있지 않은 회원입니다.
      </p>
      <p className="mt-6 text-center break-keep">
        OUTTA 소속이거나 OUTTA의 부트캠프를 수강하셨는데도 불구하고 이 메시지가
        보인다면,{" "}
        <a href="mailto:users@outta.ai" className="text-blue-500 underline">
          OUTTA 관리자
        </a>
        에게 문의해주세요.
      </p>
      <SignOutButton />
    </main>
  );
}
