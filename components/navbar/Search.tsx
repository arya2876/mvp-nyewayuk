"use client";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { differenceInDays } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { SlidersHorizontal, MapPin, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import Modal from "../modals/Modal";
import indonesiaLocations from "@/data/indonesia-locations.json";

const SearchModal = dynamic(() => import("@/components/modals/SearchModal"), {
  ssr: false
});

// Calculate distance using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find nearest district based on coordinates
function findNearestDistrict(lat: number, lng: number): { district: string; city: string; province: string } | null {
  let nearestDistrict: { district: string; city: string; province: string; distance: number } | null = null;

  for (const provinceData of indonesiaLocations) {
    for (const cityData of provinceData.cities) {
      for (const districtData of cityData.districts) {
        const distance = calculateDistance(lat, lng, districtData.latlng[0], districtData.latlng[1]);
        if (!nearestDistrict || distance < nearestDistrict.distance) {
          nearestDistrict = {
            district: districtData.name,
            city: cityData.name,
            province: provinceData.province,
            distance: distance
          };
        }
      }
    }
  }

  return nearestDistrict ? {
    district: nearestDistrict.district,
    city: nearestDistrict.city,
    province: nearestDistrict.province
  } : null;
}

const Search = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(searchParams?.get("search") || "");
  const [isDetecting, setIsDetecting] = useState(false);
  const [districtName, setDistrictName] = useState("");
  const [cityName, setCityName] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [tempDistrict, setTempDistrict] = useState("");
  const [tempCity, setTempCity] = useState("");
  const [tempLat, setTempLat] = useState<number | null>(null);
  const [tempLng, setTempLng] = useState<number | null>(null);

  const country = searchParams?.get("country");
  const startDate = searchParams?.get("startDate");
  const endDate = searchParams?.get("endDate");
  const guestCount = searchParams?.get("guestCount");

  // Auto detect location on mount
  useEffect(() => {
    if ('geolocation' in navigator && !districtName) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const nearestLocation = findNearestDistrict(latitude, longitude);
          if (nearestLocation) {
            setDistrictName(nearestLocation.district);
            setCityName(nearestLocation.city);
          }
        },
        () => {
          // Silently fail
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
      );
    }
  }, [districtName]);

  const durationLabel = useMemo(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      let diff = differenceInDays(end, start);
      if (diff === 0) diff = 1;
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

  const handleDetectLocation = useCallback(() => {
    setIsDetecting(true);
    setShowLocationModal(true);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const nearestLocation = findNearestDistrict(latitude, longitude);
          
          if (nearestLocation) {
            setTempDistrict(nearestLocation.district);
            setTempCity(nearestLocation.city);
            setTempLat(latitude);
            setTempLng(longitude);
          } else {
            toast.error('Tidak dapat menemukan lokasi terdekat');
          }
          setIsDetecting(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Tidak dapat mendeteksi lokasi. Pastikan GPS diaktifkan.');
          setIsDetecting(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      toast.error('Browser tidak mendukung geolocation');
      setIsDetecting(false);
    }
  }, []);

  const handleUseLocation = useCallback(() => {
    if (tempDistrict && tempLat !== null && tempLng !== null) {
      setDistrictName(tempDistrict);
      setCityName(tempCity);
      setShowLocationModal(false);

      const params = new URLSearchParams(searchParams?.toString() || "");
      params.set('lat', tempLat.toString());
      params.set('lng', tempLng.toString());
      params.set('district', tempDistrict);
      params.set('city', tempCity);
      router.push(`/?${params.toString()}`);
      
      toast.success(`Menampilkan barang di sekitar ${tempDistrict}`);
    }
  }, [tempDistrict, tempCity, tempLat, tempLng, router, searchParams]);

  return (
    <>
      <div className="w-full md:w-auto flex items-center gap-2">
        <div className="flex items-center gap-2 border dark:border-neutral-700 rounded-full px-3 py-2 w-full md:w-[420px] shadow-sm hover:shadow-md transition bg-white dark:bg-neutral-800">
          <FaSearch className="text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            className="flex-1 outline-none bg-transparent text-sm text-neutral-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
            placeholder="Cari barang yang ingin disewa..."
            aria-label="Search items"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
        <Modal>
          <Modal.Trigger name="filters">
            <button type="button" className="inline-flex items-center gap-2 rounded-full border dark:border-neutral-700 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-neutral-800 dark:text-white">
              <SlidersHorizontal className="h-4 w-4" />
              Filter
            </button>
          </Modal.Trigger>
          <Modal.Window name="filters">
            <SearchModal />
          </Modal.Window>
        </Modal>
        <button 
          type="button" 
          onClick={handleDetectLocation} 
          disabled={isDetecting}
          className="inline-flex items-center gap-2 rounded-full border dark:border-neutral-700 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-neutral-800 dark:text-white disabled:opacity-50"
        >
          {isDetecting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
          <span className="hidden md:inline">
            {districtName ? `Di Sekitar Saya (${cityName})` : 'Di Sekitar Saya'}
          </span>
        </button>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Ubah Lokasi
            </h3>
            
            {isDetecting ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A99D] mx-auto mb-4"></div>
                <p className="text-neutral-600 dark:text-neutral-400">Mendeteksi lokasi Anda...</p>
              </div>
            ) : tempDistrict ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                    Lokasi terdeteksi:
                  </p>
                  <p className="text-lg font-medium text-neutral-900 dark:text-white">
                    Sekitar Kecamatan {tempDistrict}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    {tempCity}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLocationModal(false)}
                    className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition text-neutral-900 dark:text-white"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleUseLocation}
                    className="flex-1 px-4 py-2 bg-[#00A99D] hover:bg-[#008c82] text-white rounded-lg font-semibold transition"
                  >
                    Gunakan Lokasi Ini
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-neutral-600 dark:text-neutral-400">
                  Lokasi tidak dapat dideteksi
                </p>
                <button
                  onClick={() => setShowLocationModal(false)}
                  className="mt-4 px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition text-neutral-900 dark:text-white"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Search;
