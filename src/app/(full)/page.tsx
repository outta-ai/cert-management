import { UserButton, currentUser } from "@clerk/nextjs";
import { prisma } from "lib/prisma";
import { redirect } from "next/navigation";

export default async function Home() {
  const clerkUser = await currentUser();

  // If the user is not signed in, redirect to /sign-in
  // However, this will be already handled by the middleware
  if (!clerkUser) {
    redirect(`${process.env.BASE_URL}/sign-in`);
  }

  const user = await prisma.user.findUnique({
    where: {
      // Since Clerk is enforcing login by Google, we can assume that the first one is the Google Address
      email: clerkUser.emailAddresses[0].emailAddress,
    },
  });

  if (!user) {
    redirect("/unregistered");
  }

  if (!user.clerkId) {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        clerkId: clerkUser.id,
      },
    });
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
        <UserButton afterSignOutUrl="/" />
      </header>
    </main>
  );
}
