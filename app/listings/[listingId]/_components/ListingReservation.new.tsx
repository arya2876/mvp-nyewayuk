"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { eachDayOfInterval } from "date-fns";
import { Range } from "react-date-range";
import axios from "axios";
import { toast } from "react-hot-toast";
import dynamic from "next/dynamic";
import Calender from "@/components/Calender";
import {
  calculateRentalPrice,
  formatRupiah,
  LogisticsOption,
} from "@/utils/priceCalculation";

interface ListingReservationProps {
  listingId: string;
  price: number;
  reservations: any[];
  currentUser?: any;
  locationValue: number[];
  title: string;
  depositAmount?: number;
}

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

const ListingReservation: React.FC<ListingReservationProps> = ({
  listingId,
  price,
  reservations = [],
  currentUser,
  locationValue,
  title,
  depositAmount = 0,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const [logisticsOption, setLogisticsOption] = useState<LogisticsOption>("self-pickup");

  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/Map"), {
        ssr: false,
      }),
    []
  );

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    reservations.forEach((reservation: any) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      });

      dates = [...dates, ...range];
    });

    return dates;
  }, [reservations]);

  // Kalkulasi harga dinamis dengan useMemo
  const priceBreakdown = useMemo(() => {
    return calculateRentalPrice({
      pricePerDay: price,
      startDate: dateRange.startDate || null,
      endDate: dateRange.endDate || null,
      logisticsOption,
      depositAmount,
    });
  }, [price, dateRange.startDate, dateRange.endDate, logisticsOption, depositAmount]);

  const onCreateReservation = useCallback(() => {
    if (!currentUser) {
      toast.error("Please login to make a reservation");
      router.push("/");
      return;
    }

    if (!dateRange.startDate || !dateRange.endDate) {
      toast.error("Please select rental dates");
      return;
    }

    if (priceBreakdown.dayCount < 1) {
      toast.error("Rental period must be at least 1 day");
      return;
    }

    setIsLoading(true);

    axios
      .post("/api/reservations", {
        totalPrice: priceBreakdown.totalPrice,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        listingId: listingId,
      })
      .then(() => {
        toast.success("Listing reserved!");
        setDateRange(initialDateRange);
        router.push("/trips");
        router.refresh();
      })
      .catch(() => {
        toast.error("Something went wrong.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [priceBreakdown.totalPrice, dateRange, listingId, router, currentUser, priceBreakdown.dayCount]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-6">Pilih Tanggal Sewa</h3>
        
        {/* Calendar */}
        <div className="mb-6">
          <Calender
            value={dateRange}
            disabledDates={disabledDates}
            onChange={(fieldName, value) => {
              console.log('Calendar onChange:', value);
              setDateRange(value);
            }}
          />
        </div>

        {/* Pickup/Drop off */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-sm font-semibold mb-2">Pickup</div>
            <div className="text-sm text-gray-600">
              {dateRange.startDate?.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
              }) || "Pilih tanggal"}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold mb-2">Drop off</div>
            <div className="text-sm text-gray-600">
              {dateRange.endDate?.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
              }) || "Pilih tanggal"}
            </div>
          </div>
        </div>

        {/* Logistics Option */}
        <div className="mb-6">
          <div className="text-sm font-semibold mb-3">Logistics Option</div>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="radio"
                name="logistics"
                value="self-pickup"
                checked={logisticsOption === "self-pickup"}
                onChange={(e) => setLogisticsOption(e.target.value as LogisticsOption)}
                className="w-4 h-4 text-purple-600"
              />
              <div className="flex-1">
                <div className="font-medium">Self Pickup</div>
                <div className="text-xs text-gray-500">Pick up and return yourself</div>
              </div>
              <div className="text-sm font-semibold text-green-600">FREE</div>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="radio"
                name="logistics"
                value="nyewa-express"
                checked={logisticsOption === "nyewa-express"}
                onChange={(e) => setLogisticsOption(e.target.value as LogisticsOption)}
                className="w-4 h-4 text-purple-600"
              />
              <div className="flex-1">
                <div className="font-medium">Nyewa Express</div>
                <div className="text-xs text-gray-500">We deliver to your location</div>
              </div>
              <div className="text-sm font-semibold">Rp 25,000</div>
            </label>
          </div>
        </div>

        {/* Price Breakdown */}
        {priceBreakdown.dayCount > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">
                Rp {formatRupiah(price)} × {priceBreakdown.dayCount} {priceBreakdown.dayCount === 1 ? "day" : "days"}
              </span>
              <span className="font-medium">Rp {formatRupiah(priceBreakdown.basePrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service fee (5%)</span>
              <span className="font-medium">Rp {formatRupiah(priceBreakdown.serviceFee)}</span>
            </div>
            {priceBreakdown.logisticsFee > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Nyewa Express</span>
                <span className="font-medium">Rp {formatRupiah(priceBreakdown.logisticsFee)}</span>
              </div>
            )}
            {priceBreakdown.depositAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Deposit (refundable)</span>
                <span className="font-medium">Rp {formatRupiah(priceBreakdown.depositAmount)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-300 flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold text-lg text-purple-600">
                Rp {formatRupiah(priceBreakdown.totalPrice)}
              </span>
            </div>
          </div>
        )}

        {/* Send Request Button */}
        <button
          disabled={isLoading}
          onClick={onCreateReservation}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-full transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "Processing..." : "Send a request"}
        </button>

        {/* Info Text */}
        <div className="mt-4 flex items-start gap-2 text-sm text-blue-600">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>
           Klik untuk lanjut ke WhatsApp. Pembayaran & Verifikasi KTP dilakukan setelah Admin mengonfirmasi pesanan.
          </span>
        </div>
      </div>

      {/* Map */}
      <div className="h-[300px] relative">
        <Map center={locationValue} />
      </div>
    </div>
  );
};

export default ListingReservation;
