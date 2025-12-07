"use client";
import React, { ReactNode } from "react";
import { User } from "next-auth";

import ListingReservation from "./ListingReservation";

interface ListingClientProps {
  reservations?: {
    startDate: Date;
    endDate: Date;
  }[];
  children: ReactNode;
  id: string;
  title: string;
  price: number;
  user:
    | (User & {
        id: string;
      })
    | undefined;
  locationValue?: number[];
  depositAmount?: number;
}

const ListingClient: React.FC<ListingClientProps> = ({
  price,
  reservations = [],
  children,
  user,
  id,
  title,
  locationValue = [0, 0],
  depositAmount = 0,
}) => {

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
      {children}

      <div className="order-first mb-10 md:order-last md:col-span-3">
        <ListingReservation
          listingId={id}
          price={price}
          reservations={reservations}
          currentUser={user}
          locationValue={locationValue}
          title={title}
          depositAmount={depositAmount}
        />
      </div>
    </div>
  );
};

export default ListingClient;
