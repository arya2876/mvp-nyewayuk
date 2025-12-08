'use client'
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";

import { Category } from "@/types";

interface CategoryBoxProps extends Category {
  selected?: boolean;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
  icon: Icon,
  label,
  selected,
}) => {
  const router = useRouter();
  const params = useSearchParams();

  const handleClick = () => {
    let currentQuery = {};
    if (params) {
      currentQuery = queryString.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      category: label,
    };

    if (params?.get("category") === label) {
      delete updatedQuery.category;
    }

    const url = queryString.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );
    router.push(url);
  }
  
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex flex-col max-w-fit items-center justify-center gap-1.5 px-3 py-2 border-b-2 hover:text-neutral-800 transition cursor-pointer ${
        selected
          ? "border-b-[#0A2E46] text-[#0A2E46]"
          : "border-transparent text-neutral-500"
      }`}
    >
      {Icon && <Icon className="w-6 h-6 md:w-7 md:h-7" />}
      <small className="font-medium text-[11px] md:text-[12px] select-none">{label}</small>
    </button>
  );
};

export default CategoryBox;