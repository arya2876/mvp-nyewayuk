import React from "react";
import { redirect } from "next/navigation";

import EditListingClient from "./_components/EditListingClient";
import { getCurrentUser } from "@/services/user";
import { db } from "@/lib/db";

interface IParams {
  listingId?: string;
}

const EditListingPage = async ({ params }: { params: IParams }) => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const listing = await db.item.findUnique({
    where: {
      id: params.listingId,
    },
  });

  if (!listing) {
    redirect("/properties");
  }

  // Check if user owns this listing
  if (listing.userId !== user.id) {
    redirect("/properties");
  }

  return (
    <main className="main-container py-8">
      <EditListingClient listing={listing} />
    </main>
  );
};

export default EditListingPage;
