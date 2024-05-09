import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

/* Here we check if we need to redirect user to the dashboard if it exists
OR we leave him on this page and show store model */

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // if user has any stores created
  const store = await prismadb.store.findFirst({
    where: {
      userId,
    },
  });

  if (store) {
    redirect(`/${store.id}`);
    /* Here we will hit layout.tsx of (dashboard) first */
  }

  return <>{children}</>;
}
