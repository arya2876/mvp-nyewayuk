import React from "react";
import Image from "next/image";

interface AvatarProps {
  src: string | null | undefined;
  size?: "sm" | "small" | "medium" | "lg" | "large";
}

const Avatar: React.FC<AvatarProps> = ({ src, size = "small" }) => {
  const sizeMap = {
    sm: 24,
    small: 30,
    medium: 50,
    lg: 56,
    large: 80,
  };

  const dimension = sizeMap[size];
  
  // More robust image source handling
  let imageSrc = "/images/placeholder.jpg";
  if (src) {
    const trimmedSrc = src.trim();
    if (trimmedSrc && trimmedSrc !== "" && trimmedSrc !== "null" && trimmedSrc !== "undefined") {
      imageSrc = trimmedSrc;
    }
  }

  return (
    <Image
      className="rounded-full select-none"
      height={dimension}
      width={dimension}
      alt="Avatar"
      src={imageSrc}
      unoptimized
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = "/images/placeholder.jpg";
      }}
      style={{ width: `${dimension}px`, height: `${dimension}px`, objectFit: "cover" }}
    />
  );
};

export default Avatar;
