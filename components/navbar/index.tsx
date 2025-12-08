import React, { Suspense } from "react";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import { getCurrentUser } from "@/services/user";
import { NavbarClient, NavLinks, ThemeToggleNav } from "./NavbarClient";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = async () => {
  const user = await getCurrentUser();

  return (
    <NavbarClient>
      {/* Logo Kiri */}
      <Logo />
      
      {/* Menu Tengah */}
      <NavLinks />
      
      {/* Menu Kanan - Theme Toggle + User Menu */}
      <div className="flex items-center gap-3">
        <ThemeToggleNav />
        <UserMenu user={user} />
      </div>
    </NavbarClient>
  );
};

export default Navbar;
