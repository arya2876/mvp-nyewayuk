import React, { Suspense } from "react";
import Link from "next/link";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import { getCurrentUser } from "@/services/user";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = async () => {
  const user = await getCurrentUser();

  return (
    <header className="fixed top-0 left-0 w-full bg-[#0A2E46] backdrop-blur-sm z-50 shadow-md border-b border-white/10 transition-all duration-300">
      <nav className="py-3">
        <div className="flex main-container flex-row justify-between items-center gap-6">
          {/* Logo Kiri */}
          <Logo />
          
          {/* Menu Tengah */}
          <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
            <Link href="/cara-kerja" className="text-white hover:text-emerald-300 transition font-medium text-sm">
              Cara Kerja
            </Link>
            <Link href="/jaminan" className="text-white hover:text-emerald-300 transition font-medium text-sm">
              Jaminan
            </Link>
            <Link href="/faq" className="text-white hover:text-emerald-300 transition font-medium text-sm">
              FAQ
            </Link>
          </div>
          
          {/* Menu Kanan */}
          <UserMenu user={user} />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
