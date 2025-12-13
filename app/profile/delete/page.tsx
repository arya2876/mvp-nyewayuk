import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import DeleteAccountClient from "../_components/DeleteAccountClient";

export const metadata: Metadata = {
  title: "Delete Account",
  description: "Delete your RENLE account",
};

export default async function DeleteAccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  return <DeleteAccountClient user={session.user} />;
}
