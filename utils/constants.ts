import { TbCamera, TbDrone, TbDeviceProjector, TbHeadset, TbSpeakerphone, TbDeviceGamepad, TbDots } from "react-icons/tb";

export const categories = [
  {
    label: "Kamera",
    icon: TbCamera,
    description: "Kamera DSLR & Mirrorless",
  },
  {
    label: "Drone",
    icon: TbDrone,
    description: "Drone profesional",
  },
  {
    label: "Proyektor",
    icon: TbDeviceProjector,
    description: "Proyektor untuk event",
  },
  {
    label: "HT",
    icon: TbHeadset,
    description: "Komunikasi event lancar",
  },
  {
    label: "Sound System",
    icon: TbSpeakerphone,
    description: "Audio jernih",
  },
  {
    label: "Console",
    icon: TbDeviceGamepad,
    description: "PS5, Xbox, Nintendo",
  },
  {
    label: "Lainnya",
    icon: TbDots,
    description: "Barang seru lainnya",
  },
];

export const LISTINGS_BATCH = 16;
export const HOMEPAGE_LISTINGS_LIMIT = 10; // Max barang di homepage

export const menuItems = [
  {
    label: "Pemesanan",
    path: "/trips",
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
