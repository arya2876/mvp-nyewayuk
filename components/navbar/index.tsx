import React, { Suspense } from "react";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import { getCurrentUser } from "@/services/user";
import { NavbarClient, NavLinks } from "./NavbarClient";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = async () => {
  const user = await getCurrentUser();

  return (
    <NavbarClient>
      {/* Logo Kiri */}
      <Logo />
      
      {/* Menu Tengah */}
      <NavLinks />
      
      {/* Menu Kanan - User Menu */}
      <div className="flex items-center gap-3">
        <UserMenu user={user} />
      </div>
    </NavbarClient>
  );
};

export default Navbar;
