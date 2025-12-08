"use client";

import React, { useState, useEffect } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import { Loader2, MapPin } from "lucide-react";
import indonesiaLocations from "@/data/indonesia-locations.json";

export interface LocationValue {
  province: string;
  city: string;
  district: string;
  latlng: number[];
  label: string; // Full address string
}

interface LocationSelectProps {
  value?: LocationValue;
  onChange: (id: string, value: LocationValue) => void;
}

const LocationSelect: React.FC<LocationSelectProps> = ({ value, onChange }) => {
  const [selectedProvince, setSelectedProvince] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  const [cityOptions, setCityOptions] = useState<any[]>([]);
  const [districtOptions, setDistrictOptions] = useState<any[]>([]);

  // Province options
  const provinceOptions = indonesiaLocations.map((prov) => ({
    value: prov.province,
    label: prov.province,
    latlng: prov.latlng,
    cities: prov.cities,
  }));

  // Function to calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  // Function to find nearest location based on GPS coordinates
  const findNearestLocation = (lat: number, lng: number) => {
    let nearestProvince: any = null;
    let nearestCity: any = null;
    let nearestDistrict: any = null;
    let minDistance = Infinity;

    indonesiaLocations.forEach((province) => {
      province.cities.forEach((city) => {
        city.districts.forEach((district) => {
          const distance = calculateDistance(
            lat,
            lng,
            district.latlng[0],
            district.latlng[1]
          );

          if (distance < minDistance) {
            minDistance = distance;
            nearestProvince = province;
            nearestCity = city;
            nearestDistrict = district;
          }
        });
      });
    });

    return { nearestProvince, nearestCity, nearestDistrict, distance: minDistance };
  };

  // Handle geolocation detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Browser Anda tidak mendukung geolocation");
      return;
    }

    setIsDetecting(true);
    toast.loading("Mendeteksi lokasi Anda...", { id: "detect-location" });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Find nearest location
        const { nearestProvince, nearestCity, nearestDistrict, distance } = 
          findNearestLocation(latitude, longitude);

        if (nearestProvince && nearestCity && nearestDistrict) {
          // Set province
          const provinceOption = {
            value: nearestProvince.province,
            label: nearestProvince.province,
            latlng: nearestProvince.latlng,
            cities: nearestProvince.cities,
          };
          setSelectedProvince(provinceOption);

          // Set city options and selected city
          const cities = nearestProvince.cities.map((city: any) => ({
            value: city.name,
            label: city.name,
            latlng: city.latlng,
            districts: city.districts,
          }));
          setCityOptions(cities);

          const cityOption = {
            value: nearestCity.name,
            label: nearestCity.name,
            latlng: nearestCity.latlng,
            districts: nearestCity.districts,
          };
          setSelectedCity(cityOption);

          // Set district options and selected district
          const districts = nearestCity.districts.map((dist: any) => ({
            value: dist.name,
            label: dist.name,
            latlng: dist.latlng,
          }));
          setDistrictOptions(districts);

          const districtOption = {
            value: nearestDistrict.name,
            label: nearestDistrict.name,
            latlng: nearestDistrict.latlng,
          };
          setSelectedDistrict(districtOption);

          // Trigger onChange with the detected location
          const locationValue: LocationValue = {
            province: nearestProvince.province,
            city: nearestCity.name,
            district: nearestDistrict.name,
            latlng: nearestDistrict.latlng,
            label: `${nearestDistrict.name}, ${nearestCity.name}, ${nearestProvince.province}`,
          };
          
          console.log(`📍 UPLOAD FORM: Detected GPS [${latitude}, ${longitude}]`);
          console.log(`📍 UPLOAD FORM: Nearest district "${nearestDistrict.name}" at [${nearestDistrict.latlng[0]}, ${nearestDistrict.latlng[1]}]`);
          console.log(`📍 UPLOAD FORM: Distance ${distance.toFixed(2)}km`);
          console.log(`📍 UPLOAD FORM: Will save coordinates:`, nearestDistrict.latlng);
          
          onChange("location", locationValue);

          toast.success(
            `Lokasi terdeteksi: ${nearestDistrict.name}, ${nearestCity.name} (${distance.toFixed(1)} km)`,
            { id: "detect-location", duration: 4000 }
          );
        } else {
          toast.error("Tidak dapat menemukan lokasi terdekat", { id: "detect-location" });
        }

        setIsDetecting(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        
        let errorMessage = "Gagal mendeteksi lokasi";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = "Izin lokasi ditolak. Mohon aktifkan izin lokasi di browser";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = "Informasi lokasi tidak tersedia";
        } else if (error.code === error.TIMEOUT) {
          errorMessage = "Waktu deteksi lokasi habis";
        }

        toast.error(errorMessage, { id: "detect-location" });
        setIsDetecting(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Load existing value
  useEffect(() => {
    if (value) {
      const province = indonesiaLocations.find((p) => p.province === value.province);
      if (province) {
        setSelectedProvince({
          value: province.province,
          label: province.province,
          latlng: province.latlng,
          cities: province.cities,
        });

        const cities = province.cities.map((city) => ({
          value: city.name,
          label: city.name,
          latlng: city.latlng,
          districts: city.districts,
        }));
        setCityOptions(cities);

        const city = province.cities.find((c) => c.name === value.city);
        if (city) {
          setSelectedCity({
            value: city.name,
            label: city.name,
            latlng: city.latlng,
            districts: city.districts,
          });

          const districts = city.districts.map((dist) => ({
            value: dist.name,
            label: dist.name,
            latlng: dist.latlng,
          }));
          setDistrictOptions(districts);

          const district = city.districts.find((d) => d.name === value.district);
          if (district) {
            setSelectedDistrict({
              value: district.name,
              label: district.name,
              latlng: district.latlng,
            });
          }
        }
      }
    }
  }, [value]);

  const handleProvinceChange = (option: any) => {
    setSelectedProvince(option);
    setSelectedCity(null);
    setSelectedDistrict(null);

    if (option) {
      const cities = option.cities.map((city: any) => ({
        value: city.name,
        label: city.name,
        latlng: city.latlng,
        districts: city.districts,
      }));
      setCityOptions(cities);
      setDistrictOptions([]);
    } else {
      setCityOptions([]);
      setDistrictOptions([]);
    }
  };

  const handleCityChange = (option: any) => {
    setSelectedCity(option);
    setSelectedDistrict(null);

    if (option) {
      const districts = option.districts.map((dist: any) => ({
        value: dist.name,
        label: dist.name,
        latlng: dist.latlng,
      }));
      setDistrictOptions(districts);
    } else {
      setDistrictOptions([]);
    }
  };

  const handleDistrictChange = (option: any) => {
    setSelectedDistrict(option);

    if (option && selectedProvince && selectedCity) {
      const locationValue: LocationValue = {
        province: selectedProvince.value,
        city: selectedCity.value,
        district: option.value,
        latlng: option.latlng,
        label: `${option.value}, ${selectedCity.value}, ${selectedProvince.value}`,
      };
      onChange("location", locationValue);
    }
  };

  return (
    <div className="space-y-4">
      {/* Detect Location Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={isDetecting}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isDetecting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Mendeteksi...
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4" />
              Gunakan Lokasi Saya
            </>
          )}
        </button>
      </div>

      {/* Province Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Provinsi <span className="text-red-500">*</span>
        </label>
        <Select
          placeholder="Pilih Provinsi"
          isClearable
          options={provinceOptions}
          value={selectedProvince}
          onChange={handleProvinceChange}
          formatOptionLabel={(option: any) => (
            <div className="flex flex-row items-center gap-3">
              <div>{option.label}</div>
            </div>
          )}
          classNames={{
            control: () => "p-2 border-2",
            input: () => "text-base",
            option: () => "text-base",
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

      {/* City/Kabupaten Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kota/Kabupaten <span className="text-red-500">*</span>
        </label>
        <Select
          placeholder="Pilih Kota/Kabupaten"
          isClearable
          options={cityOptions}
          value={selectedCity}
          onChange={handleCityChange}
          isDisabled={!selectedProvince}
          formatOptionLabel={(option: any) => (
            <div className="flex flex-row items-center gap-3">
              <div>{option.label}</div>
            </div>
          )}
          classNames={{
            control: () => "p-2 border-2",
            input: () => "text-base",
            option: () => "text-base",
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

      {/* District/Kecamatan Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kecamatan <span className="text-red-500">*</span>
        </label>
        <Select
          placeholder="Pilih Kecamatan"
          isClearable
          options={districtOptions}
          value={selectedDistrict}
          onChange={handleDistrictChange}
          isDisabled={!selectedCity}
          formatOptionLabel={(option: any) => (
            <div className="flex flex-row items-center gap-3">
              <div>{option.label}</div>
            </div>
          )}
          classNames={{
            control: () => "p-2 border-2",
            input: () => "text-base",
            option: () => "text-base",
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

      {/* Display selected location */}
      {selectedProvince && selectedCity && selectedDistrict && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Lokasi dipilih:</strong>
          </p>
          <p className="text-sm text-blue-900 mt-1">
            📍 {selectedDistrict.value}, {selectedCity.value},{" "}
            {selectedProvince.value}
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationSelect;
