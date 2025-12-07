"use client";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { MapPin, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import countries from "@/data/countries.json";

export type CountrySelectValue = {
  flag: string;
  label: string;
  latlng: number[];
  region: string;
  value: string;
};

const CountrySelect = ({
  value,
  onChange,
}: {
  value?: CountrySelectValue;
  onChange: (name: string, val: CountrySelectValue) => void;
}) => {
  const ref = useRef<any>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      ref.current?.focus();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation tidak didukung di browser Anda");
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Find closest country based on coordinates
        const closest = countries.reduce((prev, curr) => {
          const prevDist = Math.hypot(
            prev.latlng[0] - latitude,
            prev.latlng[1] - longitude
          );
          const currDist = Math.hypot(
            curr.latlng[0] - latitude,
            curr.latlng[1] - longitude
          );
          return currDist < prevDist ? curr : prev;
        });
        
        const locationWithCoords = {
          ...closest,
          latlng: [latitude, longitude], // Use actual user coordinates
        } as CountrySelectValue;
        
        onChange("location", locationWithCoords);
        toast.success("Lokasi Anda terdeteksi!");
        setIsDetecting(false);
      },
      (error) => {
        if (error.code === error.TIMEOUT) {
          toast.error("Timeout mendeteksi lokasi. Coba lagi atau pilih lokasi manual.");
        } else if (error.code === error.PERMISSION_DENIED) {
          toast.error("Akses lokasi ditolak. Silakan aktifkan GPS atau pilih lokasi manual.");
        } else {
          toast.error("Gagal mendeteksi lokasi. Coba lagi atau pilih lokasi manual.");
        }
        setIsDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // Remove auto-detect on mount
  // useEffect(() => { ... }, [value, onChange]);

  const handleChange = (value: CountrySelectValue) => {
    onChange("location", value);
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={detectCurrentLocation}
        disabled={isDetecting}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDetecting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Mendeteksi lokasi...
          </>
        ) : (
          <>
            <MapPin className="w-5 h-5" />
            Gunakan Lokasi Saya Saat Ini
          </>
        )}
      </button>
      
      <Select
        ref={ref}
        placeholder="Atau pilih lokasi manual..."
        isClearable
        options={countries}
        value={value}
        onChange={handleChange}
        formatOptionLabel={(option: any) => (
          <div className="flex flex-row items-center gap-3 z-[10]">
            <div>{option.flag}</div>
            <div>
              {option.label},
              <span className="text-neutral-500 ml-1">{option.region}</span>
            </div>
          </div>
        )}
        classNames={{
          control: () => "p-[6px] text-[14px] border-1",
          input: () => "text-[14px]",
          option: () => "text-[14px]",
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: "black",
            primary25: "#ffe4e6",
          },
        })}
      />
    </div>
  );
};

export default CountrySelect;
