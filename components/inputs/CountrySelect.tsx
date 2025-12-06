"use client";
import React, { useEffect, useRef } from "react";
import Select from "react-select";
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

  useEffect(() => {
    const timer = setTimeout(() => {
      ref.current?.focus();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Auto-detect user location
  useEffect(() => {
    if (!value && navigator.geolocation) {
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
          onChange("location", closest as CountrySelectValue);
        },
        (error) => {
          console.log("Location access denied or unavailable");
        },
        { enableHighAccuracy: false, timeout: 5000 }
      );
    }
  }, [value, onChange]);

  const handleChange = (value: CountrySelectValue) => {
    onChange("location", value);
  };

  return (
    <Select
      ref={ref}
      placeholder="Pilih lokasi atau deteksi otomatis..."
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
  );
};

export default CountrySelect;
