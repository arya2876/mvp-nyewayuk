import React from "react";
import Image from "next/image";

interface AvatarProps {
  src: string | null | undefined;
  size?: "small" | "medium" | "large";
}

const Avatar: React.FC<AvatarProps> = ({ src, size = "small" }) => {
  const sizeMap = {
    small: 30,
    medium: 50,
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
