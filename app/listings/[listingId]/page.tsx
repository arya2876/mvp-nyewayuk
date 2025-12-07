import React from "react";

import EmptyState from "@/components/EmptyState";
import ListingHead from "./_components/ListingHead";
import ListingInfo from "./_components/ListingInfo";
import ListingOwner from "./_components/ListingOwner";
import ListingReservation from "./_components/ListingReservation";
import ListingReviews from "./_components/ListingReviews";
import ListingRelated from "./_components/ListingRelated";

import { getCurrentUser } from "@/services/user";
import { getListingById } from "@/services/listing";
import { categories } from "@/utils/constants";

interface IParams {
  listingId: string;
}

const ListingPage = async ({ params: { listingId } }: { params: IParams }) => {
  const listing = await getListingById(listingId);
  const currentUser = await getCurrentUser();

  if (!listing) return <EmptyState />;

  const {
    title,
    imageSrc,
    country,
    region,
    id,
    user: owner,
    price,
    description,
    brand,
    model,
    condition,
    latlng,
    reservations,
    category: categoryLabel,
    userId,
    depositAmount,
  } = listing;

  const category = categories.find((cate) => cate.label === categoryLabel);

  return (
    <section className="max-w-screen-xl mx-auto px-4 pt-24 pb-16">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <span>All categories</span>
        <span className="mx-2">›</span>
        <span>{categoryLabel}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image & Title */}
          <ListingHead
            title={title}
            image={imageSrc}
            country={country}
            region={region}
            id={id}
            currentUser={currentUser}
            isNyewaGuardVerified={listing.isNyewaGuardVerified === true}
          />

          {/* Owner Info */}
          <ListingOwner user={owner} />

          {/* Description & Info */}
          <ListingInfo
            user={owner}
            category={category}
            description={description}
            brand={brand}
            model={model}
            condition={condition}
            latlng={latlng}
          />

          {/* Cancellation Terms */}
          <div className="border-t pt-8">
            <h3 className="text-xl font-semibold mb-4">CANCELLATION TERMS</h3>
            <p className="text-gray-600">
              Free cancellation until 2 days before your rental starts. After that, you&apos;ll get half your money back until the day before.{" "}
              <button className="text-purple-600 hover:underline">Read more</button>
            </p>
          </div>

          {/* Reviews */}
          <ListingReviews />

          {/* Related Items */}
          <ListingRelated 
            currentListingId={id}
            ownerId={userId}
            ownerName={owner?.name || "Owner"}
            category={categoryLabel}
            currentUser={currentUser}
          />
        </div>

        {/* Right Column - Reservation Sidebar (Sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <ListingReservation
              listingId={id}
              price={price}
              reservations={reservations}
              currentUser={currentUser}
              locationValue={latlng}
              title={title}
              depositAmount={depositAmount || 0}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ListingPage;
