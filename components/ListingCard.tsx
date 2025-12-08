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
}

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  hasFavorited,
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

  return (
    <div className="relative">
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
      <Link href={`/listings/${data.id}`} className="col-span-1 cursor-pointer">
        <div className="flex flex-col gap-1 w-full">
          <div className=" overflow-hidden md:rounded-xl rounded-md relative">
            <div className="aspect-[1/0.95] relative bg-gray-100">
              <Image
                imageSrc={data.imageSrc}
                fill
                alt={data.title}
                effect="zoom"
                className="object-cover"
                sizes="100vw"
              />
            </div>
            {/* NyewaGuard AI Badge */}
            {data.nyewaGuardImageSrc && (
              <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-emerald-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                <ShieldCheck className="h-3 w-3" />
                <span>Terverifikasi</span>
              </div>
            )}
          </div>
          <span className="font-semibold text-[16px] mt-[4px] truncate">
            {data.title}
          </span>
          <span className="font-light text-neutral-500 text-sm">
            {reservationDate || `${data.region}, ${data.country}`}
          </span>

          <div className="flex flex-row items-baseline gap-1">
            <span className="font-bold text-[#444] text-[14px]">
              Rp {formatPrice(price)}
            </span>
            {!reservation && <span className="font-light">/ hari</span>}
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
