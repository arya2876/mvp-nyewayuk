"use client";

import React from "react";
import Link from "next/link";
import { useTheme, ThemeToggle } from "@/components/ThemeProvider";

interface NavbarClientProps {
  children: React.ReactNode;
}

export const NavbarClient: React.FC<NavbarClientProps> = ({ children }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className={`fixed top-0 left-0 w-full z-50 shadow-md transition-all duration-300 ${
      isDark 
        ? "bg-neutral-900 border-neutral-700" 
        : "bg-[#0A2E46] border-white/10"
    } border-b`}>
      <nav className="py-3">
        <div className="flex main-container flex-row justify-between items-center gap-6">
          {children}
        </div>
      </nav>
    </header>
  );
};

export const NavLinks: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
      <Link 
        href="/cara-kerja" 
        className={`hover:text-emerald-300 transition font-medium text-sm ${
          isDark ? "text-gray-300" : "text-white"
        }`}
      >
        Cara Kerja
      </Link>
      <Link 
        href="/jaminan" 
        className={`hover:text-emerald-300 transition font-medium text-sm ${
          isDark ? "text-gray-300" : "text-white"
        }`}
      >
        Jaminan
      </Link>
      <Link 
        href="/faq" 
        className={`hover:text-emerald-300 transition font-medium text-sm ${
          isDark ? "text-gray-300" : "text-white"
        }`}
      >
        FAQ
      </Link>
    </div>
  );
};

export const ThemeToggleNav: React.FC = () => {
  return <ThemeToggle className="ml-2" />;
};
