"use client";
import React, { FC } from "react";
import Menu from "../Menu";

interface MenuItemProps {
  onClick?: () => void;
  label: string;
}

export const MenuItemStyle =
  " hover:bg-neutral-100 dark:hover:bg-neutral-700 transition font-semibold select-none text-neutral-800 dark:text-white";

const MenuItem: FC<MenuItemProps> = ({ label, onClick }) => {
  return (
    <Menu.Button className={MenuItemStyle} onClick={onClick}>
      {label}
    </Menu.Button>
  );
};

export default MenuItem;
