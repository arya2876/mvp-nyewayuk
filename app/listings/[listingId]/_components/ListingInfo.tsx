import React from "react";
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
    <div className="space-y-8">
      {/* Description Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-white">Tentang Barang Ini</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{description}</p>
      </div>

      {/* Specifications */}
      {(brand || model || condition) && (
        <div className="bg-gray-50 dark:bg-neutral-800 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 text-neutral-800 dark:text-white">Spesifikasi</h3>
          <div className="grid grid-cols-2 gap-4">
            {brand && (
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Merek</div>
                <div className="font-semibold text-neutral-800 dark:text-white">{brand}</div>
              </div>
            )}
            {model && (
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Model</div>
                <div className="font-semibold text-neutral-800 dark:text-white">{model}</div>
              </div>
            )}
            {condition && (
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Kondisi</div>
                <div className="font-semibold capitalize text-neutral-800 dark:text-white">{condition}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Category */}
      {category && (
        <div>
          <h3 className="text-xl font-bold mb-4 text-neutral-800 dark:text-white">Kategori</h3>
          <ListingCategory
            icon={category.icon}
            label={category?.label}
            description={category?.description || ""}
          />
        </div>
      )}
    </div>
  );
};

export default ListingInfo;
