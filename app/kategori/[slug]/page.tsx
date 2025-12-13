"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, List, MapIcon, Loader2, MapPin, Search, X } from "lucide-react";
import { Item } from "@prisma/client";

import { categories } from "@/utils/constants";
import ListingCard from "@/components/ListingCard";
import indonesiaLocations from "@/data/indonesia-locations.json";

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
function findNearestDistrict(lat: number, lng: number): { district: string; city: string } | null {
  let nearestDistrict: { district: string; city: string; distance: number } | null = null;

  for (const provinceData of indonesiaLocations) {
    for (const cityData of provinceData.cities) {
      for (const districtData of cityData.districts) {
        const distance = calculateDistance(lat, lng, districtData.latlng[0], districtData.latlng[1]);
        if (!nearestDistrict || distance < nearestDistrict.distance) {
          nearestDistrict = {
            district: districtData.name,
            city: cityData.name,
            distance: distance
          };
        }
      }
    }
  }

  return nearestDistrict ? {
    district: nearestDistrict.district,
    city: nearestDistrict.city
  } : null;
}

const CategoryPage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [listings, setListings] = useState<Item[]>([]);
  const [filteredListings, setFilteredListings] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [cityName, setCityName] = useState("");

  // Find category info
  const categoryInfo = categories.find(
    (cat) => cat.label.toLowerCase().replace(/\s+/g, "-") === slug?.toLowerCase()
  );
  const categoryName = categoryInfo?.label || decodeURIComponent(slug || "");
  const CategoryIcon = categoryInfo?.icon;

  // Dynamic Map import
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/CategoryMap"), {
        ssr: false,
        loading: () => (
          <div className="w-full h-full flex items-center justify-center bg-neutral-800">
            <Loader2 className="w-8 h-8 animate-spin text-[#00A99D]" />
          </div>
        ),
      }),
    []
  );

  // Auto-detect location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      setIsDetecting(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { lat, lng } = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation({ lat, lng });
          
          // Find nearest district
          const nearest = findNearestDistrict(lat, lng);
          if (nearest) {
            setDistrictName(nearest.district);
            setCityName(nearest.city);
          }
          setIsDetecting(false);
        },
        () => {
          setUserLocation({ lat: -6.9825, lng: 110.4093 });
          setIsDetecting(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  // Fetch listings
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("category", categoryName);
        if (userLocation) {
          params.set("lat", userLocation.lat.toString());
          params.set("lng", userLocation.lng.toString());
        }
        
        const response = await fetch(`/api/listings?${params.toString()}`);
        const data = await response.json();
        setListings(data.listings || []);
        setFilteredListings(data.listings || []);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setListings([]);
        setFilteredListings([]);
      }
      setIsLoading(false);
    };

    if (categoryName) {
      fetchListings();
    }
  }, [categoryName, userLocation]);

  // Filter listings by search query (title, brand, model)
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const filtered = listings.filter((listing) =>
        listing.title.toLowerCase().includes(query) ||
        listing.description?.toLowerCase().includes(query) ||
        listing.brand?.toLowerCase().includes(query) ||
        listing.model?.toLowerCase().includes(query)
      );
      setFilteredListings(filtered);
    } else {
      setFilteredListings(listings);
    }
  }, [searchQuery, listings]);

  // Handle clear search - reset and refresh
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setFilteredListings(listings);
    searchInputRef.current?.focus();
  }, [listings]);

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      setIsDetecting(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { lat, lng } = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation({ lat, lng });
          
          const nearest = findNearestDistrict(lat, lng);
          if (nearest) {
            setDistrictName(nearest.district);
            setCityName(nearest.city);
          }
          setIsDetecting(false);
        },
        () => {
          setIsDetecting(false);
          alert("Tidak dapat mendeteksi lokasi. Pastikan izin lokasi diaktifkan.");
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-3">
            <Link href="/" className="text-neutral-400 hover:text-[#00A99D] transition-colors">
              Beranda
            </Link>
            <span className="text-neutral-600">&gt;</span>
            <span className="font-medium text-white">
              {categoryName}
            </span>
          </div>

          {/* Category Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 rounded-full hover:bg-neutral-800 transition-colors">
                <ArrowLeft className="w-5 h-5 text-white" />
              </Link>
              <div className="flex items-center gap-3">
                {CategoryIcon && (
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#00A99D]/20 to-[#00A99D]/5 border border-[#00A99D]/30">
                    <CategoryIcon className="w-6 h-6 text-[#00A99D]" />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {categoryName}
                  </h1>
                  <p className="text-sm text-neutral-400">
                    {filteredListings.length} barang tersedia
                  </p>
                </div>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-neutral-800">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  viewMode === "list"
                    ? "bg-[#00A99D] text-white"
                    : "text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                <List className="w-4 h-4" />
                List
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  viewMode === "map"
                    ? "bg-[#00A99D] text-white"
                    : "text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                <MapIcon className="w-4 h-4" />
                Map
              </button>
            </div>
          </div>

          {/* Search and Location Bar */}
          <div className="mt-4 flex flex-col sm:flex-row gap-4 animate-slideUp" style={{ animationDelay: "0.1s" }}>
            {/* Search Input with Clear Button */}
            <div className="flex-1 flex items-center gap-3 p-3.5 rounded-xl bg-neutral-800 border border-neutral-700 focus-within:border-[#00A99D] focus-within:ring-2 focus-within:ring-[#00A99D]/20 transition-all duration-300">
              <Search className="w-5 h-5 text-[#00A99D]" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={`Cari ${categoryName.toLowerCase()} berdasarkan nama...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder:text-neutral-500 outline-none text-sm"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="p-1.5 rounded-lg bg-neutral-700 hover:bg-red-500/20 hover:text-red-400 text-neutral-400 transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-neutral-800 border border-neutral-700 min-w-[280px]">
              <div className="p-2 rounded-lg bg-[#00A99D]/10">
                <MapPin className="w-5 h-5 text-[#00A99D]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-neutral-500">Lokasi Anda</p>
                <p className="font-medium text-white text-sm truncate">
                  {isDetecting ? "Mendeteksi..." : districtName ? `Kec. ${districtName}` : "Tidak terdeteksi"}
                </p>
              </div>
              <button
                onClick={handleDetectLocation}
                disabled={isDetecting}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isDetecting
                    ? "bg-neutral-700 text-neutral-500 cursor-not-allowed"
                    : "bg-[#00A99D] text-white hover:bg-[#00c4b4] hover:scale-105 active:scale-95"
                }`}
              >
                {isDetecting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Deteksi Ulang"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {viewMode === "list" ? (
          /* List View */
          <div className="px-4 py-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#00A99D]" />
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="text-center py-20 text-neutral-400">
                <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-neutral-800">
                  {CategoryIcon && <CategoryIcon className="w-10 h-10 text-neutral-500" />}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : "Belum ada barang di kategori ini"}
                </h3>
                <p>{searchQuery ? "Coba kata kunci lain" : `Jadilah yang pertama menyewakan barang ${categoryName}!`}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 stagger-children">
                {filteredListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    data={listing}
                    hasFavorited={false}
                    userLocation={userLocation || undefined}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Map View */
          <div className="h-[calc(100vh-220px)]">
            <Map
              listings={filteredListings}
              userLocation={userLocation}
              onMarkerClick={(id) => {
                window.location.href = `/listings/${id}`;
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
