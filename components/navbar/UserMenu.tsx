"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { User } from "next-auth";
import { Menu as MenuIcon } from "lucide-react";

import Avatar from "../Avatar";
import MenuItem from "./MenuItem";
import Menu from "@/components/Menu";
import RentModal from "../modals/RentModal";
import Modal from "../modals/Modal";
import AuthModal from "../modals/AuthModal";
import { menuItems } from "@/utils/constants";

interface UserMenuProps {
  user?: User;
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const router = useRouter();

  const redirect = (url: string) => {
    router.push(url);
  };

  // Get user initials
  const getInitials = (name?: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative flex items-center gap-3">
      <Modal>
        {/* Tombol Sewakan Barang - Hijau Cerah */}
        <Modal.Trigger name={user ? "share" : "Login"}>
          <button
            type="button"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-full transition shadow-md text-sm"
          >
            Sewakan Barang
          </button>
        </Modal.Trigger>
        
        {/* Avatar/Menu User */}
        <Menu>
          <Menu.Toggle id="user-menu">
            <button
              type="button"
              className="flex items-center gap-2 p-2 rounded-full hover:bg-white/10 transition"
            >
              {user ? (
                <div className="flex items-center gap-2">
                  {user.image ? (
                    <Avatar src={user.image} />
                  ) : (
                    <div className="h-[30px] w-[30px] rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <MenuIcon className="h-4 w-4 text-white" />
                </div>
              ) : (
                <MenuIcon className="h-5 w-5 text-white" />
              )}
            </button>
          </Menu.Toggle>
          <Menu.List className="shadow-[0_0_36px_4px_rgba(0,0,0,0.075)] dark:shadow-[0_0_36px_4px_rgba(0,0,0,0.3)] rounded-xl bg-white dark:bg-neutral-800 text-sm">
            {user ? (
              <>
                {menuItems.map((item) => (
                  <MenuItem
                    label={item.label}
                    onClick={() => redirect(item.path)}
                    key={item.label}
                  />
                ))}
                <hr className="dark:border-neutral-700" />
                <MenuItem label="Keluar" onClick={signOut} />
              </>
            ) : (
              <>
                <Modal.Trigger name="Login">
                  <MenuItem label="Masuk" />
                </Modal.Trigger>

                <Modal.Trigger name="Sign up">
                  <MenuItem label="Daftar" />
                </Modal.Trigger>
              </>
            )}
          </Menu.List>
        </Menu>
        <Modal.Window name="Login">
          <AuthModal name="Login" />
        </Modal.Window>
        <Modal.Window name="Sign up">
          <AuthModal name="Sign up" />
        </Modal.Window>
        <Modal.Window name="share">
          <RentModal />
        </Modal.Window>
      </Modal>
    </div>
  );
};

export default UserMenu;
