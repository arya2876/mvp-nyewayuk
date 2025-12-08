import React, { ReactNode } from "react";
import { cn } from "@/utils/helper";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "small" | "large";
  className?: string;
  children?: ReactNode;
  outline?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  size = "small",
  outline = false,
  ...props
}) => {
  return (
    <button
      className={cn(
        `disabled:opacity-70 disabled:cursor-not-allowed rounded hover:opacity-80 transition w-full bg-emerald-500 border-emerald-500 text-white py-[8px]`,
        size === "small"
          ? " text-[16px] font-medium border-[1px]"
          : " text-[18px] font-semibold border-2",
        outline
          ? "bg-white dark:bg-neutral-700 border-[1px] border-gray-500 dark:border-neutral-600 text-[#4e4e4e] dark:text-white"
          : "bg-emerald-500 border-emerald-500 text-white",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
