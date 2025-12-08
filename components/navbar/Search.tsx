"use client";
import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { differenceInDays } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { SlidersHorizontal, MapPin } from "lucide-react";

import Modal from "../modals/Modal";

const SearchModal = dynamic(() => import("@/components/modals/SearchModal"), {
  ssr: false
});

const Search = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(searchParams?.get("search") || "");

  const country = searchParams?.get("country");

  const startDate = searchParams?.get("startDate");
  const endDate = searchParams?.get("endDate");
  const guestCount = searchParams?.get("guestCount");

  const durationLabel = useMemo(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      let diff = differenceInDays(end, start);

      if (diff === 0) {
        diff = 1;
      }

      return `${diff} Hari`;
    }

    return "Kapan saja";
  }, [endDate, startDate]);

  const guestLabel = guestCount ? `${guestCount} Tamu` : "Tambah Tamu";

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const params = new URLSearchParams(searchParams?.toString());
      if (searchInput.trim()) {
        params.set("search", searchInput.trim());
      } else {
        params.delete("search");
      }
      router.push(`/?${params.toString()}`);
    }
  };

  const onNearMe = () => {
    if (!navigator?.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const params = new URLSearchParams(searchParams?.toString());
        params.set("lat", String(latitude));
        params.set("lng", String(longitude));
        router.push(`/?${params.toString()}`);
      },
      () => {
        // silently fail for now; could toast later
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="w-full md:w-auto flex items-center gap-2">
      <div className="flex items-center gap-2 border rounded-full px-3 py-2 w-full md:w-[420px] shadow-sm hover:shadow-md transition">
        <FaSearch className="text-gray-500" />
        <input
          type="text"
          className="flex-1 outline-none bg-transparent text-sm"
          placeholder="Cari barang yang ingin disewa..."
          aria-label="Search items"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>
      <Modal>
        <Modal.Trigger name="filters">
          <button type="button" className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm hover:bg-gray-50">
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </button>
        </Modal.Trigger>
        <Modal.Window name="filters">
          <SearchModal />
        </Modal.Window>
      </Modal>
      <button type="button" onClick={onNearMe} className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm hover:bg-gray-50">
        <MapPin className="h-4 w-4" />
        <span className="hidden md:inline">Dekat Saya</span>
      </button>
    </div>
  );
};

export default Search;
