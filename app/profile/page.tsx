import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import ProfileClient from "./_components/ProfileClient";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your profile settings",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  return <ProfileClient user={session.user} />;
}
