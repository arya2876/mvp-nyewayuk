"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { eachDayOfInterval } from "date-fns";
import { Range } from "react-date-range";
import axios from "axios";
import { toast } from "react-hot-toast";
import dynamic from "next/dynamic";
import Calender from "@/components/Calender";
import WhatsAppCheckoutModal from "./WhatsAppCheckoutModal";
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
  ownerPhone?: string;
  ownerName?: string;
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
  ownerPhone,
  ownerName,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  // Use timestamps for stable dependency comparison
  const startDateTimestamp = dateRange?.startDate?.getTime() ?? 0;
  const endDateTimestamp = dateRange?.endDate?.getTime() ?? 0;
  
  // Logika Jaminan NyewaYuk:
  // - Delivery (nyewa-express): Deposit uang Rp 200.000
  // - Pickup (self-pickup): Deposit KTP/Identitas (Rp 0)
  const SECURITY_DEPOSIT = 200000;
  const actualDepositAmount = logisticsOption === 'nyewa-express' ? SECURITY_DEPOSIT : 0;
  
  const priceBreakdown = useMemo(() => {
    return calculateRentalPrice({
      pricePerDay: price,
      startDate: dateRange?.startDate ?? null,
      endDate: dateRange?.endDate ?? null,
      logisticsOption,
      depositAmount: actualDepositAmount,
    });
  }, [price, dateRange?.startDate, dateRange?.endDate, logisticsOption, actualDepositAmount]);

  const onCreateReservation = useCallback(() => {
    if (!currentUser) {
      toast.error("Silakan login untuk membuat reservasi");
      router.push("/");
      return;
    }

    if (!dateRange.startDate || !dateRange.endDate) {
      toast.error("Silakan pilih tanggal sewa");
      return;
    }

    if (priceBreakdown.dayCount < 1) {
      toast.error("Periode sewa minimal 1 hari");
      return;
    }

    // Open WhatsApp checkout modal instead of directly creating reservation
    setIsModalOpen(true);
  }, [dateRange, router, currentUser, priceBreakdown.dayCount]);

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 overflow-hidden shadow-sm">
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-6 text-neutral-800 dark:text-white">Pilih Tanggal Sewa</h3>
        
        {/* Calendar */}
        <div className="mb-6">
          <Calender
            value={dateRange || initialDateRange}
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
            <div className="text-sm font-semibold mb-2 text-neutral-800 dark:text-white">Pickup</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {dateRange?.startDate?.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
              }) || "Select date"}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold mb-2 text-neutral-800 dark:text-white">Drop off</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {dateRange?.endDate?.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
              }) || "Select date"}
            </div>
          </div>
        </div>

        {/* Logistics Option */}
        <div className="mb-6">
          <div className="text-sm font-semibold mb-3 text-neutral-800 dark:text-white">Opsi Pengambilan</div>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-neutral-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700 transition">
              <input
                type="radio"
                name="logistics"
                value="self-pickup"
                checked={logisticsOption === "self-pickup"}
                onChange={(e) => setLogisticsOption(e.target.value as LogisticsOption)}
                className="w-4 h-4 text-emerald-600"
              />
              <div className="flex-1">
                <div className="font-medium text-neutral-800 dark:text-white">Ambil Sendiri</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Deposit: KTP/Identitas Asli</div>
              </div>
              <div className="text-sm font-semibold text-green-600">GRATIS</div>
            </label>
            <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-neutral-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700 transition">
              <input
                type="radio"
                name="logistics"
                value="nyewa-express"
                checked={logisticsOption === "nyewa-express"}
                onChange={(e) => setLogisticsOption(e.target.value as LogisticsOption)}
                className="w-4 h-4 text-emerald-600"
              />
              <div className="flex-1">
                <div className="font-medium text-neutral-800 dark:text-white">Nyewa Express</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Deposit: Rp 200.000 (Refundable)</div>
              </div>
              <div className="text-sm font-semibold text-neutral-800 dark:text-white">Rp 25,000</div>
            </label>
          </div>
        </div>

        {/* Warning untuk Self Pickup */}
        {logisticsOption === "self-pickup" && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <div className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">PENTING: Deposit Identitas</div>
                <div className="text-sm text-yellow-700 dark:text-yellow-300">
                  Anda memilih <strong>Ambil Sendiri</strong>. Anda WAJIB meninggalkan <strong>KTP/Identitas Asli</strong> kepada pemilik barang saat pengambilan sebagai jaminan keamanan.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Price Breakdown */}
        {priceBreakdown.dayCount > 0 && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">
                Rp {formatRupiah(price)} × {priceBreakdown.dayCount} {priceBreakdown.dayCount === 1 ? "hari" : "hari"}
              </span>
              <span className="font-medium text-neutral-800 dark:text-white">Rp {formatRupiah(priceBreakdown.basePrice)}</span>
            </div>
            {/* Service fee disabled untuk MVP launch */}
            {/* <div className="flex justify-between">
              <span className="text-gray-600">Service fee (5%)</span>
              <span className="font-medium">Rp {formatRupiah(priceBreakdown.serviceFee)}</span>
            </div> */}
            {priceBreakdown.logisticsFee > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Nyewa Express</span>
                <span className="font-medium text-neutral-800 dark:text-white">Rp {formatRupiah(priceBreakdown.logisticsFee)}</span>
              </div>
            )}
            {/* Deposit - Always show based on logistics option */}
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">
                Deposit Keamanan {logisticsOption === 'self-pickup' ? '(KTP/Identitas)' : '(Refundable)'}
              </span>
              <span className="font-medium text-neutral-800 dark:text-white">
                {logisticsOption === 'self-pickup' ? 'Rp 0' : `Rp ${formatRupiah(priceBreakdown.depositAmount)}`}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-300 dark:border-neutral-600 flex justify-between">
              <span className="font-bold text-neutral-800 dark:text-white">Total</span>
              <span className="font-bold text-lg text-emerald-600">
                Rp {formatRupiah(priceBreakdown.totalPrice)}
              </span>
            </div>
          </div>
        )}

        {/* Send Request Button */}
        <button
          disabled={isLoading}
          onClick={onCreateReservation}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 px-6 rounded-full transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "Memproses..." : "Ajukan Sewa"}
        </button>

        {/* Info Text */}
        <div className="mt-4 flex items-start gap-2 text-sm text-blue-600 dark:text-blue-400">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>
            Klik untuk lanjut ke WhatsApp. Pembayaran & Verifikasi KTP dilakukan setelah Admin mengonfirmasi pesanan
          </span>
        </div>
      </div>

      {/* Map */}
      <div className="h-[300px] relative">
        <Map center={locationValue} />
      </div>

      {/* WhatsApp Checkout Modal */}
      {dateRange.startDate && dateRange.endDate && (
        <WhatsAppCheckoutModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          itemName={title}
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          dayCount={priceBreakdown.dayCount}
          logisticsOption={logisticsOption}
          basePrice={priceBreakdown.basePrice}
          logisticsFee={priceBreakdown.logisticsFee}
          depositAmount={actualDepositAmount}
          totalPrice={priceBreakdown.totalPrice}
          ownerPhone={ownerPhone}
          ownerName={ownerName}
        />
      )}
    </div>
  );
};

export default ListingReservation;
