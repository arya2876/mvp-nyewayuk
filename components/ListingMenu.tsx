"use client";
import React, { FC, useTransition } from "react";
import { BsThreeDots } from "react-icons/bs";
import { usePathname, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Menu from "./Menu";
import Modal from "./modals/Modal";
import ConfirmDelete from "./ConfirmDelete";
import EditListingModalContent from "./EditListingModalContent";

import { deleteProperty } from "@/services/properties";
import { deleteReservation } from "@/services/reservation";

const pathNameDict: { [x: string]: string } = {
  "/properties": "Delete property",
  "/trips": "Cancel reservation",
  "/reservations": "Cancel guest reservation",
};

interface ListingMenuProps {
  id: string;
}

const ListingMenu: FC<ListingMenuProps> = ({ id }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { mutate: deleteListing } = useMutation({
    mutationFn: deleteProperty,
  });
  const { mutate: cancelReservation } = useMutation({
    mutationFn: deleteReservation,
  });
  const [isLoading, startTransition] = useTransition();

  if (pathname === "" || pathname === "/favorites") return null;

  const onConfirm = (onModalClose?: () => void) => {
    startTransition(() => {
      try {
        if (pathname === "/properties") {
          deleteListing(id, {
            onSuccess: () => {
              onModalClose?.();
              toast.success("Listing successfully deleted!");
            },
          });
        } else if (pathname === "/trips" || pathname === "/reservations") {
          cancelReservation(id, {
            onSuccess: () => {
              onModalClose?.();
              toast.success("Reservation successfully cancelled!");
            },
          });
        }
      } catch (error) {
        toast.error("Oops! Something went wrong. Please try again later.");
        onModalClose?.()
      }
    });
  };

  return (
    <Modal>
      <Menu>
        <Menu.Toggle
          id="lisiting-menu"
          className="w-10 h-10 flex items-center z-10 justify-center"
        >
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white shadow-md group transition duration-200 z-10"
          >
            <BsThreeDots className="h-5 w-5 text-gray-700 transition duration-100 group-hover:text-gray-900" />
          </button>
        </Menu.Toggle>
        <Menu.List position="bottom-left" className="rounded-md">
          {pathname === "/properties" && (
            <Modal.Trigger name="edit-listing">
              <Menu.Button className="text-[14px] rounded-md font-semibold py-[10px] hover:bg-neutral-100 transition">
                Edit listing
              </Menu.Button>
            </Modal.Trigger>
          )}
          <Modal.Trigger name="confirm-delete">
            <Menu.Button className="text-[14px] rounded-md font-semibold py-[10px] hover:bg-neutral-100 transition text-red-600">
              {pathNameDict[pathname]}
            </Menu.Button>
          </Modal.Trigger>
        </Menu.List>
      </Menu>
      <Modal.Window name="confirm-delete">
        <ConfirmDelete
          onConfirm={onConfirm}
          title={pathNameDict[pathname]}
          isLoading={isLoading}
        />
      </Modal.Window>
      {pathname === "/properties" && (
        <Modal.Window name="edit-listing">
          <EditListingModalContent listingId={id} />
        </Modal.Window>
      )}
    </Modal>
  );
};

export default ListingMenu;
