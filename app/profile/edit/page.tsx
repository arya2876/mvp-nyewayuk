import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { getUserDetails } from "@/services/user";
import EditProfileClient from "../_components/EditProfileClient";

export const metadata: Metadata = {
  title: "Edit Profile",
  description: "Edit your profile information",
};

export default async function EditProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  const userDetails = await getUserDetails();

  return <EditProfileClient user={session.user} userDetails={userDetails} />;
}
