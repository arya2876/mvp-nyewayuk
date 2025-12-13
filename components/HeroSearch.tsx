"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { Search, MapPin, Calendar, Loader2 } from 'lucide-react';
import indonesiaLocations from '@/data/indonesia-locations.json';

// Category placeholders for typing animation
const categoryPlaceholders = [
  "Cari Kamera DSLR untuk event...",
  "Cari Drone profesional...",
  "Cari Proyektor untuk meeting...",
  "Cari HT untuk koordinasi...",
  "Cari Sound System untuk acara...",
  "Cari Console PS5, Xbox...",
  "Cari barang yang ingin disewa..."
];

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

export default function HeroSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchInput, setSearchInput] = useState('');
  const [districtName, setDistrictName] = useState('');
  const [cityName, setCityName] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [tempDistrict, setTempDistrict] = useState('');
  const [tempCity, setTempCity] = useState('');
  const [tempLat, setTempLat] = useState<number | null>(null);
  const [tempLng, setTempLng] = useState<number | null>(null);
  
  // Typing animation states
  const [placeholder, setPlaceholder] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Typing animation effect
  useEffect(() => {
    if (searchInput) return; // Don't animate if user is typing

    const currentPlaceholder = categoryPlaceholders[currentIndex];
    
    if (isTyping) {
      if (charIndex < currentPlaceholder.length) {
        const timeout = setTimeout(() => {
          setPlaceholder(currentPlaceholder.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (charIndex > 0) {
        const timeout = setTimeout(() => {
          setPlaceholder(currentPlaceholder.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, 30);
        return () => clearTimeout(timeout);
      } else {
        setCurrentIndex((currentIndex + 1) % categoryPlaceholders.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, currentIndex, searchInput]);

  // Auto detect location on mount
  useEffect(() => {
    if ('geolocation' in navigator && !districtName) {
      setIsDetecting(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const nearestLocation = findNearestDistrict(latitude, longitude);
          if (nearestLocation) {
            setDistrictName(nearestLocation.district);
            setCityName(nearestLocation.city);
            setTempLat(latitude);
            setTempLng(longitude);
          }
          setIsDetecting(false);
        },
        () => {
          setIsDetecting(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
      );
    }
  }, []);

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
      toast.success(`Lokasi diubah ke ${tempDistrict}, ${tempCity}`);
    }
  }, [tempDistrict, tempCity, tempLat, tempLng]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchInput.trim()) {
      params.set('search', searchInput.trim());
    }
    
    if (tempLat !== null && tempLng !== null) {
      params.set('lat', tempLat.toString());
      params.set('lng', tempLng.toString());
    }
    
    if (districtName) {
      params.set('district', districtName);
    }
    
    if (cityName) {
      params.set('city', cityName);
    }

    router.push(`/?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const locationDisplay = isDetecting 
    ? 'Mendeteksi lokasi...' 
    : districtName 
      ? `Sekitar Kecamatan ${districtName}, ${cityName}` 
      : 'Di Sekitar Saya';

  return (
    <>
      <div className="w-full max-w-3xl mx-auto mt-8 animate-fadeIn">
        {/* Search Bar */}
        <div className="flex items-center bg-neutral-900/80 backdrop-blur-sm rounded-full border border-neutral-700 overflow-hidden shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transition-all duration-300">
          <div className="flex items-center flex-1 px-5 py-4">
            <Search className="h-5 w-5 text-[#00A99D] mr-3" />
            <input
              ref={inputRef}
              type="text"
              placeholder={searchInput ? '' : placeholder}
              className="flex-1 bg-transparent text-white placeholder:text-neutral-500 outline-none text-base"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {!searchInput && <span className="text-[#00A99D] animate-pulse">|</span>}
          </div>
          <button
            onClick={handleSearch}
            className="px-8 py-4 bg-[#00A99D] hover:bg-[#00c4b4] text-white font-semibold transition-all duration-300 rounded-full m-1 hover:scale-105 active:scale-95"
          >
            Search
          </button>
        </div>

        {/* Location and Date Row */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm animate-slideUp" style={{ animationDelay: '0.2s' }}>
          {/* Location */}
          <div className="flex items-center gap-2 text-white">
            {isDetecting ? (
              <Loader2 className="h-4 w-4 animate-spin text-[#00A99D]" />
            ) : (
              <MapPin className="h-4 w-4 text-[#00A99D]" />
            )}
            <span className="text-white/90">{locationDisplay}</span>
            <button 
              onClick={handleDetectLocation}
              className="text-[#00A99D] hover:text-[#00c4b4] transition-colors font-medium hover:underline"
            >
              (ubah)
            </button>
          </div>

          {/* Divider */}
          <span className="text-neutral-600">|</span>

          {/* Select Dates */}
          <button className="flex items-center gap-2 text-white/90 hover:text-white transition-colors group">
            <Calendar className="h-4 w-4 text-neutral-400 group-hover:text-[#00A99D] transition-colors" />
            <span>Pilih tanggal</span>
          </button>
        </div>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scaleIn">
            <h3 className="text-lg font-semibold text-white mb-4">
              Ubah Lokasi
            </h3>
            
            {isDetecting ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A99D] mx-auto mb-4"></div>
                <p className="text-neutral-400">Mendeteksi lokasi Anda...</p>
              </div>
            ) : tempDistrict ? (
              <div className="space-y-4">
                <div className="p-4 bg-neutral-800 rounded-xl">
                  <p className="text-sm text-neutral-400 mb-2">
                    Lokasi terdeteksi:
                  </p>
                  <p className="text-lg font-medium text-white">
                    Sekitar Kecamatan {tempDistrict}
                  </p>
                  <p className="text-sm text-neutral-300">
                    {tempCity}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLocationModal(false)}
                    className="flex-1 px-4 py-3 border border-neutral-600 rounded-xl hover:bg-neutral-800 transition-all duration-300 text-white"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleUseLocation}
                    className="flex-1 px-4 py-3 bg-[#00A99D] hover:bg-[#00c4b4] text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    Gunakan Lokasi Ini
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-neutral-400">
                  Lokasi tidak dapat dideteksi
                </p>
                <button
                  onClick={() => setShowLocationModal(false)}
                  className="mt-4 px-4 py-2 border border-neutral-600 rounded-xl hover:bg-neutral-800 transition-all duration-300 text-white"
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
}
