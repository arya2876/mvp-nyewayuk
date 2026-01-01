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
import NotificationDropdown from "@/components/notifications/NotificationDropdown";
import { menuItems } from "@/utils/constants";
import { isAdminEmail } from "@/utils/admin";

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

        {/* Notification Bell - Only show when logged in */}
        {user && <NotificationDropdown />}

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

                {/* Admin Menu - Only for admin users */}
                {isAdminEmail(user.email) && (
                  <>
                    <hr className="dark:border-neutral-700" />
                    <div className="px-4 py-2 text-xs font-semibold text-[#00A99D] uppercase tracking-wider flex items-center gap-2">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Admin
                    </div>
                    <MenuItem
                      label="🛡️ Kelola Review"
                      onClick={() => redirect("/admin/reviews")}
                    />
                  </>
                )}

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
