"use client";
import React, { useRef, useEffect } from "react";
import { FieldValues, UseFormWatch } from "react-hook-form";

import { cn } from "@/utils/helper";
import { Category } from "@/types";

interface CategoryButtonProps extends Category {
  onClick: (fieldName: string, value: string) => void;
  watch: UseFormWatch<FieldValues>;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  watch,
}) => {
  const isSelected = watch("category") === label;
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!buttonRef.current) return;
    const timer = setTimeout(() => {
      if(isSelected){
        buttonRef.current?.focus();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isSelected]);

  const handleChange = () => {
    if(isSelected) return;
    onClick("category", label);
  };

  return (
    <div className="col-span-1">
      <button
        ref={buttonRef}
        type="submit"
        onClick={handleChange}
        className={cn(
          `rounded-xl border-2 p-2 flex flex-col gap-3 hover:border-black dark:hover:border-emerald-400 cursor-pointer transition duration-200 w-full bg-white dark:bg-neutral-700`,
          isSelected ? "border-black dark:border-emerald-400" : "border-neutral-200 dark:border-neutral-600"
        )}
        onFocus={handleChange}
      >
        <Icon size={24} className="text-neutral-800 dark:text-white" />
        <span className="font-semibold text-sm select-none text-start text-neutral-800 dark:text-white">{label}</span>
      </button>
    </div>
  );
};

export default CategoryButton;
