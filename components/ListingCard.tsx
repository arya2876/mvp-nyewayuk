"use client";
import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Item } from "@prisma/client";
import Skeleton from "react-loading-skeleton";
import { ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";

import HeartButton from "./HeartButton";
import Image from "./Image";
import { formatPrice } from "@/utils/helper";
import ListingMenu from "./ListingMenu";

interface ListingCardProps {
  data: Item;
  reservation?: {
    id: string;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
  };
  hasFavorited: boolean;
  userLocation?: { lat: number; lng: number }; // Koordinat user untuk hitung jarak
}

// Fungsi Haversine untuk menghitung jarak
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius bumi dalam km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  hasFavorited,
  userLocation,
}) => {
  const pathname = usePathname();
  const showMenu = pathname === "/properties" || pathname === "/reservations" || pathname === "/trips";
  
  const price = reservation ? reservation.totalPrice : data?.price;

  let reservationDate;
  if (reservation) {
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);
    reservationDate = `${format(start, "PP")} - ${format(end, "PP")}`;
  }

  // Format location consistently - prioritize new format
  const locationDisplay = data.district && data.city 
    ? `${data.district}, ${data.city}` 
    : (data.region && data.country 
        ? `${data.region}, ${data.country}` 
        : data.country || "Indonesia"
      );

  // Hitung jarak jika koordinat user dan listing tersedia
  let distanceText = '';
  if (userLocation && data.latlng && data.latlng.length >= 2) {
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      data.latlng[0],
      data.latlng[1]
    );
    distanceText = distance < 1 
      ? `${Math.round(distance * 1000)}m dari Anda`
      : `${distance.toFixed(1)}km dari Anda`;
  }

  return (
    <div className="relative group">
      <div className="absolute top-0 left-0 p-3 flex items-center justify-between w-full z-10">
        {showMenu && (
          <div className="z-10">
            <ListingMenu id={reservation?.id || data.id} />
          </div>
        )}

        <div className={`w-[28px] h-[28px] flex items-center justify-center ${!showMenu ? 'ml-auto' : ''}`}>
          <HeartButton
            listingId={data.id}
            key={data.id}
            hasFavorited={hasFavorited}
          />
        </div>
      </div>
      <Link href={`/listings/${data.id}`} className="col-span-1 cursor-pointer block">
        <div className="flex flex-col gap-1 w-full bg-neutral-800 border border-neutral-700/50 rounded-xl overflow-hidden h-full transition-all duration-300 hover:border-[#00A99D]/30 hover:shadow-lg hover:shadow-[#00A99D]/10 hover:-translate-y-1">
          <div className="overflow-hidden relative">
            <div className="aspect-[1/0.95] relative bg-neutral-700">
              <Image
                imageSrc={data.imageSrc}
                fill
                alt={data.title}
                effect="zoom"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="100vw"
              />
            </div>
            {/* NyewaGuard AI Badge */}
            {data.nyewaGuardImageSrc && (
              <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-[#00A99D] text-white text-xs font-semibold px-2 py-1 rounded-[50px] shadow-md">
                <ShieldCheck className="h-3 w-3" />
                <span>Terverifikasi</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 p-3">
            <span className="font-semibold text-[16px] mt-[4px] truncate text-white group-hover:text-[#00A99D] transition-colors duration-300">
              {data.title}
            </span>
            {/* Brand & Model */}
            {(data.brand || data.model) && (
              <span className="text-xs text-gray-300 truncate">
                {data.brand} {data.model}
              </span>
            )}
            <span className="font-light text-gray-300 text-sm truncate">
              {reservationDate || locationDisplay}
            </span>
            {/* Distance from user */}
            {distanceText && !reservation && (
              <span className="text-xs text-[#00A99D] font-medium">
                📍 {distanceText}
              </span>
            )}

            <div className="flex flex-row items-baseline gap-1">
              <span className="font-bold text-[#00A99D] text-[14px]">
                Rp {formatPrice(price)}
              </span>
              {!reservation && <span className="font-light text-gray-300">/ hari</span>}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingCard;

export const ListingSkeleton = () => {
  return (
    <div className="col-span-1 ">
      <div className="flex flex-col gap-1 w-full">
        <Skeleton
          width={"100%"}
          height={"100%"}
          borderRadius={"12px"}
          className="aspect-square"
        />

        <div className="flex flex-row gap-3">
          <Skeleton height={"18px"} width={"84px"} />
          <Skeleton height={"18px"} width={"84px"} />
        </div>
        <Skeleton height={"16px"} width={"102px"} />
        <Skeleton height={"18px"} width={"132px"} />
      </div>
    </div>
  );
};
