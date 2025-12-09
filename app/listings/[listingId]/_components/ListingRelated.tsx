"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ListingCard from "@/components/ListingCard";

interface Listing {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  createdAt: Date | string;
  category: string;
  userId: string;
  price: number;
  country: string | null;
  latlng: number[];
  region: string | null;
  brand: string | null;
  model: string | null;
  condition: string | null;
  depositAmount: number | null;
  minRentalDuration: number | null;
  nyewaGuardImageSrc: string | null;
  isNyewaGuardVerified: boolean;
  reservations?: any[];
}

interface ListingRelatedProps {
  currentListingId: string;
  ownerId: string | null;
  ownerName: string;
  category: string;
  currentUser?: any;
}

const ListingRelated: React.FC<ListingRelatedProps> = ({
  currentListingId,
  ownerId,
  ownerName,
  category,
  currentUser,
}) => {
  const [ownerListings, setOwnerListings] = useState<Listing[]>([]);
  const [categoryListings, setCategoryListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedListings = async () => {
      try {
        setLoading(true);

        // Fetch owner's other listings (only if ownerId exists)
        if (ownerId) {
          const ownerResponse = await axios.get(`/api/listings?userId=${ownerId}`);
          const filteredOwnerListings = ownerResponse.data.filter(
            (listing: Listing) => listing.id !== currentListingId
          );
          setOwnerListings(filteredOwnerListings.slice(0, 4)); // Max 4 items
        }

        // Fetch same category listings
        const categoryResponse = await axios.get(`/api/listings?category=${category}`);
        const filteredCategoryListings = categoryResponse.data.filter(
          (listing: Listing) => listing.id !== currentListingId && listing.userId !== ownerId
        );
        setCategoryListings(filteredCategoryListings.slice(0, 4)); // Max 4 items
      } catch (error) {
        console.error("Error fetching related listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedListings();
  }, [currentListingId, ownerId, category]);

  if (loading) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-12">
      {/* Owner's Other Items */}
      {ownerListings.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">More items from {ownerName}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {ownerListings.map((listing) => (
              <ListingCard
                key={listing.id}
                data={listing as any}
                hasFavorited={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Same Category Items */}
      {categoryListings.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">More in category {category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {categoryListings.map((listing) => (
              <ListingCard
                key={listing.id}
                data={listing as any}
                hasFavorited={false}
              />
            ))}
          </div>
        </div>
      )}

      {ownerListings.length === 0 && categoryListings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No related items found</p>
        </div>
      )}
    </div>
  );
};

export default ListingRelated;
