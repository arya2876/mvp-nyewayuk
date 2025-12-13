import React from "react";
import Image from "@/components/Image";
import Heading from "@/components/Heading";
import { ShieldCheck } from "lucide-react";
import HeartButton from "@/components/HeartButton";
import { getFavorites } from "@/services/favorite";

interface ListingHeadProps {
  title: string;
  locationText: string; // Changed from country/region to single locationText
  image: string;
  id: string;
  isNyewaGuardVerified?: boolean;
  currentUser?: any;
}

const ListingHead: React.FC<ListingHeadProps> = async ({
  title,
  locationText,
  image,
  id,
  isNyewaGuardVerified = false,
  currentUser,
}) => {
  const favorites = await getFavorites();
  const hasFavorited = favorites.includes(id);

  return (
    <div>
      <Heading title={title} subtitle={locationText} />
      {isNyewaGuardVerified && (
        <div className="mt-3 mb-4 inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2">
          <ShieldCheck className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            Terlindungi RenleGuard AI. Kondisi terverifikasi aman.
          </span>
        </div>
      )}
      <div className="w-full h-[60vh] overflow-hidden rounded-xl relative">
        <Image imageSrc={image} fill className="object-cover" alt={title} sizes="100vw" />
        <div className="absolute top-5 right-5">
          <HeartButton listingId={id} hasFavorited={hasFavorited} />
        </div>
      </div>
    </div>
  );
};

export default ListingHead;
