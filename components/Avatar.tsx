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

  return (
    <Image
      className="rounded-full select-none"
      height={dimension}
      width={dimension}
      alt="Avatar"
      src={src || "/images/placeholder.jpg"}
      unoptimized
      style={{ width: `${dimension}px`, height: `${dimension}px`, objectFit: "cover" }}
    />
  );
};

export default Avatar;
