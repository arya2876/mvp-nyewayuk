"use client";

import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, List, MapIcon, Loader2, MapPin, Star } from "lucide-react";
import { Item } from "@prisma/client";

import { categories } from "@/utils/constants";
import { formatPrice } from "@/utils/helper";
import ListingCard from "@/components/ListingCard";
import { useTheme } from "@/components/ThemeProvider";

const CategoryPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const slug = params?.slug as string;
  
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [listings, setListings] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

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
          <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
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
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsDetecting(false);
        },
        () => {
          // Default to Semarang if detection fails
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
      } catch (error) {
        console.error("Error fetching listings:", error);
        setListings([]);
      }
      setIsLoading(false);
    };

    if (categoryName) {
      fetchListings();
    }
  }, [categoryName, userLocation]);

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      setIsDetecting(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
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

  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen ${isDark ? "bg-neutral-900" : "bg-gray-50"}`}>
      {/* Header */}
      <div className={`sticky top-0 z-40 ${isDark ? "bg-neutral-800 border-neutral-700" : "bg-white border-gray-200"} border-b`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-3">
            <Link href="/" className={`hover:underline ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Beranda
            </Link>
            <span className={isDark ? "text-gray-600" : "text-gray-400"}>&gt;</span>
            <span className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
              {categoryName}
            </span>
          </div>

          {/* Category Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className={`p-2 rounded-full ${isDark ? "hover:bg-neutral-700" : "hover:bg-gray-100"}`}>
                <ArrowLeft className={`w-5 h-5 ${isDark ? "text-white" : "text-gray-700"}`} />
              </Link>
              <div className="flex items-center gap-3">
                {CategoryIcon && (
                  <div className={`p-3 rounded-xl ${isDark ? "bg-[#00A99D]/20" : "bg-[#00A99D]/10"}`}>
                    <CategoryIcon className="w-6 h-6 text-[#00A99D]" />
                  </div>
                )}
                <div>
                  <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                    {categoryName}
                  </h1>
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {listings.length} barang tersedia
                  </p>
                </div>
              </div>
            </div>

            {/* View Toggle */}
            <div className={`flex items-center gap-1 p-1 rounded-full ${isDark ? "bg-[#1E293B]" : "bg-gray-100"}`}>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                  viewMode === "list"
                    ? "bg-[#00A99D] text-white"
                    : isDark ? "text-gray-300 hover:bg-neutral-600" : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <List className="w-4 h-4" />
                List
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                  viewMode === "map"
                    ? "bg-[#00A99D] text-white"
                    : isDark ? "text-gray-300 hover:bg-neutral-600" : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <MapIcon className="w-4 h-4" />
                Map
              </button>
            </div>
          </div>

          {/* Location Bar */}
          <div className={`mt-4 flex items-center gap-4 p-3 rounded-xl ${isDark ? "bg-[#1E293B]/50" : "bg-gray-50"}`}>
            <MapPin className="w-5 h-5 text-[#00A99D]" />
            <div className="flex-1">
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Lokasi Anda</p>
              <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                {userLocation 
                  ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
                  : "Mendeteksi..."}
              </p>
            </div>
            <button
              onClick={handleDetectLocation}
              disabled={isDetecting}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                isDetecting
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-emerald-500 text-white hover:bg-emerald-600"
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

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {viewMode === "list" ? (
          /* List View */
          <div className="px-4 py-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              </div>
            ) : listings.length === 0 ? (
              <div className={`text-center py-20 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isDark ? "bg-neutral-800" : "bg-gray-100"}`}>
                  {CategoryIcon && <CategoryIcon className="w-10 h-10 text-gray-400" />}
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Belum ada barang di kategori ini
                </h3>
                <p>Jadilah yang pertama menyewakan barang {categoryName}!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {listings.map((listing) => (
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
              listings={listings}
              userLocation={userLocation}
              onMarkerClick={(id) => {
                // Navigate dalam tab yang sama, bukan buka tab baru
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
