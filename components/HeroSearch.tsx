'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// Database landmark terkenal di Indonesia dengan koordinat
export const landmarks = [
  { name: "Kampus Udinus Semarang", lat: -6.9825, lng: 110.4093, radius: 2 },
  { name: "Simpang Lima Semarang", lat: -6.9932, lng: 110.4203, radius: 2 },
  { name: "Undip Tembalang", lat: -7.0512, lng: 110.4377, radius: 3 },
  { name: "Lawang Sewu Semarang", lat: -6.9838, lng: 110.4106, radius: 1.5 },
  { name: "Masjid Agung Jawa Tengah", lat: -6.9765, lng: 110.4467, radius: 2 },
  { name: "Kampus Unnes Sekaran", lat: -7.0551, lng: 110.4031, radius: 3 },
  { name: "Mall Paragon Semarang", lat: -6.9826, lng: 110.4089, radius: 1 },
  { name: "Stasiun Tawang Semarang", lat: -6.9673, lng: 110.4246, radius: 1 },
  // Tambahkan landmark lainnya sesuai kebutuhan
  { name: "Monas Jakarta", lat: -6.1751, lng: 106.8270, radius: 2 },
  { name: "Malioboro Yogyakarta", lat: -7.7926, lng: 110.3657, radius: 2 },
  { name: "Alun-Alun Bandung", lat: -6.9217, lng: 107.6071, radius: 2 },
];

// Fungsi untuk mendapatkan koordinat dari nama landmark
export const getLandmarkCoords = (landmarkName: string): { lat: number; lng: number } | null => {
  const landmark = landmarks.find(l => l.name === landmarkName);
  return landmark ? { lat: landmark.lat, lng: landmark.lng } : null;
};

// Fungsi untuk menghitung jarak (Haversine formula)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius bumi dalam km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Fungsi untuk mencari landmark terdekat
const findNearestLandmark = (lat: number, lng: number): string => {
  let nearest = null;
  let minDistance = Infinity;

  for (const landmark of landmarks) {
    const distance = calculateDistance(lat, lng, landmark.lat, landmark.lng);
    if (distance <= landmark.radius && distance < minDistance) {
      minDistance = distance;
      nearest = landmark.name;
    }
  }

  return nearest || "Kampus Udinus Semarang"; // Default jika tidak ada landmark terdekat
};

const HeroSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [location, setLocation] = useState('Kampus Udinus Semarang');
  const [date, setDate] = useState('6 Desember');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  
  // Store actual GPS coordinates separately from display location
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null);
  
  // Temporary state for modals
  const [tempLocation, setTempLocation] = useState(location);
  const [tempDate, setTempDate] = useState('');

  // Auto-detect location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const nearestLandmark = findNearestLandmark(latitude, longitude);
          setLocation(nearestLandmark);
          setTempLocation(nearestLandmark);
          // Store actual GPS coordinates
          setUserCoords({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.log('Geolocation not available, using default location');
          // Keep default location
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 }
      );
    }
  }, []);

  const handleLocationChange = () => {
    if (tempLocation.trim()) {
      setLocation(tempLocation);
      setShowLocationModal(false);
      
      // Use actual GPS coordinates if available, otherwise fallback to landmark coords
      const params = new URLSearchParams(searchParams?.toString());
      if (userCoords) {
        params.set('lat', userCoords.lat.toString());
        params.set('lng', userCoords.lng.toString());
      } else {
        const coords = getLandmarkCoords(tempLocation);
        if (coords) {
          params.set('lat', coords.lat.toString());
          params.set('lng', coords.lng.toString());
        }
      }
      params.set('location', tempLocation);
      router.push(`/?${params.toString()}`);
    }
  };

  const handleDateChange = () => {
    if (tempDate) {
      try {
        const formatted = format(new Date(tempDate), 'd MMMM', { locale: id });
        setDate(formatted);
        setShowDateModal(false);
        
        // Update URL with date
        const params = new URLSearchParams(searchParams?.toString());
        params.set('date', tempDate);
        router.push(`/?${params.toString()}`);
      } catch (error) {
        console.error('Invalid date format');
      }
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams?.toString());
    if (searchQuery.trim()) {
      params.set('search', searchQuery);
    }
    // Use actual GPS coordinates if available, otherwise fallback to landmark coords
    if (userCoords) {
      params.set('lat', userCoords.lat.toString());
      params.set('lng', userCoords.lng.toString());
    } else {
      const coords = getLandmarkCoords(location);
      if (coords) {
        params.set('lat', coords.lat.toString());
        params.set('lng', coords.lng.toString());
      }
    }
    router.push(`/?${params.toString()}`);
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      setIsDetecting(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Detected coordinates:', latitude, longitude);
          const nearestLandmark = findNearestLandmark(latitude, longitude);
          console.log('Nearest landmark:', nearestLandmark);
          setTempLocation(nearestLandmark);
          // Store actual GPS coordinates
          setUserCoords({ lat: latitude, lng: longitude });
          setIsDetecting(false);
          // Show success notification
          const notification = document.createElement('div');
          notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
          notification.textContent = `Lokasi terdeteksi: ${nearestLandmark}`;
          document.body.appendChild(notification);
          setTimeout(() => notification.remove(), 3000);
        },
        (error) => {
          console.error('Error detecting location:', error);
          setIsDetecting(false);
          alert('Tidak dapat mendeteksi lokasi. Pastikan izin lokasi diaktifkan di browser Anda.');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      alert('Browser Anda tidak mendukung geolocation.');
    }
  };

  return (
    <>
      <div className="mt-6 max-w-3xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari produk yang ingin Anda sewa"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full px-6 py-4 pr-32 rounded-[50px] text-gray-800 text-base shadow-2xl outline-none focus:ring-4 focus:ring-[#00A99D]/50 transition"
          />
          <button 
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#F15A24] hover:bg-[#d94d1a] text-white font-semibold px-6 py-2.5 rounded-[50px] transition shadow-lg"
          >
            Cari
          </button>
        </div>
        
        {/* Baris Info Lokasi & Tanggal */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mt-3 text-white/80 text-sm">
          <button 
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-2 hover:text-white transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Dekat {location}</span>
            <span className="text-[#00A99D] text-xs font-medium cursor-pointer hover:text-[#00A99D]/80">(ganti)</span>
          </button>
          <button 
            onClick={() => setShowDateModal(true)}
            className="flex items-center gap-2 hover:text-white transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Periode sewa {date}</span>
            <span className="text-[#00A99D] text-xs font-medium cursor-pointer hover:text-[#00A99D]/80">(perubahan)</span>
          </button>
        </div>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Ubah Lokasi</h3>
            <input
              type="text"
              value={tempLocation}
              onChange={(e) => setTempLocation(e.target.value)}
              placeholder="Masukkan lokasi Anda"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 outline-none focus:ring-2 focus:ring-[#00A99D] mb-3"
            />
            <button
              onClick={handleDetectLocation}
              disabled={isDetecting}
              className={`w-full mb-4 px-4 py-2 rounded-lg transition text-sm font-medium ${
                isDetecting 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {isDetecting ? '🔄 Mendeteksi...' : '📍 Deteksi Lokasi Saya'}
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLocationModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleLocationChange}
                className="flex-1 px-4 py-2.5 bg-[#00A99D] text-white rounded-lg hover:bg-[#008F85] transition font-medium"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Date Modal */}
      {showDateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Ubah Tanggal Sewa</h3>
            <input
              type="date"
              value={tempDate}
              onChange={(e) => setTempDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 outline-none focus:ring-2 focus:ring-[#00A99D] mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowDateModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleDateChange}
                className="flex-1 px-4 py-2.5 bg-[#00A99D] text-white rounded-lg hover:bg-[#008F85] transition font-medium"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeroSearch;
