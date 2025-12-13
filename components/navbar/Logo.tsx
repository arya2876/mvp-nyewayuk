import React from "react";
import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="relative h-[50px] w-[140px] md:w-[160px]">
      <Image
        src="/images/logo-renle-white (2).png"
        alt="RENLE Logo"
        fill
        sizes="160px"
        priority
        className="object-contain"
        unoptimized
      />
    </Link>
  );
};

export default Logo;