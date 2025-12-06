'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const HeroSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [location, setLocation] = useState('21 Larch Crescent, Epsom');
  const [date, setDate] = useState('6 Desember');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Temporary state for modals
  const [tempLocation, setTempLocation] = useState(location);
  const [tempDate, setTempDate] = useState('');

  const handleLocationChange = () => {
    if (tempLocation.trim()) {
      setLocation(tempLocation);
      setShowLocationModal(false);
      
      // Update URL with location (simplified)
      const params = new URLSearchParams(searchParams?.toString());
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
    if (searchQuery.trim()) {
      const params = new URLSearchParams(searchParams?.toString());
      params.set('search', searchQuery);
      router.push(`/?${params.toString()}`);
    }
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In real app, you'd reverse geocode this
          setTempLocation(`Lokasi Anda (${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)})`);
        },
        (error) => {
          console.error('Error detecting location:', error);
          alert('Tidak dapat mendeteksi lokasi. Pastikan izin lokasi diaktifkan.');
        }
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
            className="w-full px-6 py-4 pr-32 rounded-full text-gray-800 text-base shadow-2xl outline-none focus:ring-4 focus:ring-emerald-400/50 transition"
          />
          <button 
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-full transition shadow-lg"
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
            <span className="text-emerald-400 text-xs font-medium cursor-pointer hover:text-emerald-300">(ganti)</span>
          </button>
          <button 
            onClick={() => setShowDateModal(true)}
            className="flex items-center gap-2 hover:text-white transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Periode sewa {date}</span>
            <span className="text-emerald-400 text-xs font-medium cursor-pointer hover:text-emerald-300">(perubahan)</span>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 outline-none focus:ring-2 focus:ring-emerald-400 mb-3"
            />
            <button
              onClick={handleDetectLocation}
              className="w-full mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
            >
              📍 Deteksi Lokasi Saya
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
                className="flex-1 px-4 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition font-medium"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 outline-none focus:ring-2 focus:ring-emerald-400 mb-4"
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
                className="flex-1 px-4 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition font-medium"
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
