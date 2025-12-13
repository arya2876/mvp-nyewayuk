import React from "react";
import { LucideIcon } from "lucide-react";

interface ListingCategoryProps {
  icon: LucideIcon;
  label: string;
  description: string;
}

const ListingCategory: React.FC<ListingCategoryProps> = ({
  icon: Icon,
  label,
  description,
}) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center gap-4">
        <Icon size={40} className="text-neutral-600 dark:text-gray-300" strokeWidth={1.5} />
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-neutral-800 dark:text-white">{label}</span>
          <p className="text-neutral-500 dark:text-gray-400 font-light">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ListingCategory;
