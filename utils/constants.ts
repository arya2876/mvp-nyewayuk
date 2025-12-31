import { Camera, Plane, Projector, Radio, Speaker, Gamepad2, MoreHorizontal } from "lucide-react";

export const categories = [
  {
    label: "Kamera",
    icon: Camera,
    description: "Kamera DSLR & Mirrorless",
  },
  {
    label: "Drone",
    icon: Plane,
    description: "Drone profesional",
  },
  {
    label: "Proyektor",
    icon: Projector,
    description: "Proyektor untuk event",
  },
  {
    label: "HT",
    icon: Radio,
    description: "Komunikasi event lancar",
  },
  {
    label: "Sound System",
    icon: Speaker,
    description: "Audio jernih",
  },
  {
    label: "Console",
    icon: Gamepad2,
    description: "PS5, Xbox, Nintendo",
  },
  {
    label: "Lainnya",
    icon: MoreHorizontal,
    description: "Barang seru lainnya",
  },
];

export const LISTINGS_BATCH = 16;
export const HOMEPAGE_LISTINGS_LIMIT = 10; // Max barang di homepage

export const menuItems = [
  {
    label: "Rental Saya",
    path: "/trips",
    description: "Barang yang saya sewa",
  },
  {
    label: "Pemesanan Masuk",
    path: "/reservations",
    description: "Orang yang menyewa barang saya",
  },
  {
    label: "Barang Saya",
    path: "/properties",
  },
  {
    label: "Profil Saya",
    path: "/profile",
  },
];
