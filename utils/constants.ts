import { TbCamera, TbDrone, TbDeviceProjector, TbAntenna, TbSpeakerphone, TbConfetti } from "react-icons/tb";

export const categories = [
  {
    label: "Kamera",
    icon: TbCamera,
    description: "Semua kebutuhan kamera untuk memotret dan merekam.",
  },
  {
    label: "Drone",
    icon: TbDrone,
    description: "Ambil gambar udara dengan mudah dan stabil.",
  },
  {
    label: "Proyektor",
    icon: TbDeviceProjector,
    description: "Presentasi atau nonton bareng jadi maksimal.",
  },
  {
    label: "HT",
    icon: TbAntenna,
    description: "Komunikasi tim yang andal untuk event.",
  },
  {
    label: "Audio",
    icon: TbSpeakerphone,
    description: "Sound system untuk acara dan pesta.",
  },
  {
    label: "Alat Pesta",
    icon: TbConfetti,
    description: "Perlengkapan pesta agar acara lebih meriah.",
  },
];

export const LISTINGS_BATCH = 16;

export const menuItems = [
  {
    label: "My trips",
    path: "/trips",
  },
  {
    label: "My favorites",
    path: "/favorites",
  },
  {
    label: "My reservations",
    path: "/reservations",
  },
  {
    label: "My properties",
    path: "/properties",
  },
];
