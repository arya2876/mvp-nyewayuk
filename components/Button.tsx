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
        `disabled:opacity-70 disabled:cursor-not-allowed rounded-[50px] hover:opacity-80 transition w-full bg-[#00A99D] border-[#00A99D] text-white py-[8px]`,
        size === "small"
          ? " text-[16px] font-medium border-[1px]"
          : " text-[18px] font-semibold border-2",
        outline
          ? "bg-neutral-700 border-[1px] border-white/20 text-white"
          : "bg-[#00A99D] border-[#00A99D] text-white",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
