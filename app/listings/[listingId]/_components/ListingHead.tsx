import React from "react";
import Image from "@/components/Image";

import Heading from "@/components/Heading";
import { ShieldCheck } from "lucide-react";
import HeartButton from "@/components/HeartButton";
import { getFavorites } from "@/services/favorite";

interface ListingHeadProps {
  title: string;
  country: string | null;
  region: string | null;
  image: string;
  id: string;
  isNyewaGuardVerified?: boolean;
}

const ListingHead: React.FC<ListingHeadProps> = async ({
  title,
  country = "",
  region = "",
  image,
  id,
  isNyewaGuardVerified = false,
}) => {
  const favorites = await getFavorites();
  const hasFavorited = favorites.includes(id);

  return (
    <>
      <Heading title={title} subtitle={`${region}, ${country}`} backBtn/>
      {isNyewaGuardVerified ? (
        <div className="mt-2 inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2">
          <ShieldCheck className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            Terlindungi NyewaGuard AI. Kondisi terverifikasi aman.
          </span>
        </div>
      ) : null}
      <div
        className={`w-full md:h-[420px] sm:h-[280px] bg-gray-100 h-[260px] overflow-hidden  rounded-xl relative transition duration-300`}
      >
        <Image imageSrc={image} fill className={`object-cover`} alt={title} sizes="100vw" />
        <div className="absolute top-5 right-5">
          <HeartButton listingId={id} hasFavorited={hasFavorited} />
        </div>
      </div>
    </>
  );
};

export default ListingHead;
