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
    province,
    city,
    district,
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

  // Format location display - prioritize new format (district, city, province)
  const locationText = district && city && province 
    ? `${district}, ${city}, ${province}`
    : (region && country ? `${region}, ${country}` : country || "Lokasi tidak tersedia");
  
  const locationShort = district && city 
    ? `${district}, ${city}`
    : (region && country ? `${region}, ${country}` : country || "Indonesia");

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
            locationText={locationText}
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

          {/* Cancellation Terms - Disabled for MVP */}
          {/* <div className="border-t pt-8">
            <h3 className="text-xl font-semibold mb-4">KETENTUAN PEMBATALAN</h3>
            <p className="text-gray-600">
              Pembatalan gratis hingga 2 hari sebelum masa sewa dimulai. Setelah itu, Anda akan mendapatkan setengah uang kembali hingga hari sebelumnya.{" "} 
              <button className="text-purple-600 hover:underline">Baca selengkapnya</button>
            </p>
          </div> */}

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
              ownerName={owner?.name || "Admin"}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ListingPage;
