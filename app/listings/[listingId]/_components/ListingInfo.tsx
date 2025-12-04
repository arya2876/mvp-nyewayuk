import React from "react";
import dynamic from "next/dynamic";

import Avatar from "@/components/Avatar";
import ListingCategory from "./ListingCategory";
import { Category } from "@/types";

interface ListingInfoProps {
  user: {
    image: string | null;
    name: string | null;
  };
  description: string;
  brand?: string;
  model?: string;
  condition?: string;
  category: Category | undefined;
  latlng: number[];
}

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  description,
  brand,
  model,
  condition,
  category,
  latlng,
}) => {
  return (
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="text-[16px] font-semibold flex flex-row items-center gap-2">
          <span className="mr-1">Hosted by</span> <Avatar src={user?.image} />
          <span> {user?.name}</span>
        </div>
        {(brand || model || condition) && (
          <div
            className="flex flex-row items-center gap-4 font-light text-neutral-700
          "
          >
            {brand && <span>Brand: {brand}</span>}
            {model && <span>Model: {model}</span>}
            {condition && <span>Condition: {condition}</span>}
          </div>
        )}
      </div>
      <hr />
      {category && (
        <ListingCategory
          icon={category.icon}
          label={category?.label}
          description={category?.description || ""}
        />
      )}
      <hr />
      <p className=" font-light text-neutral-500 text-[16px] ">{description}</p>
      <hr />
      <div className="h-[210px]">
        <Map center={latlng} />
      </div>
    </div>
  );
};

export default ListingInfo;
