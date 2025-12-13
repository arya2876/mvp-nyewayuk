import { differenceInDays } from "date-fns";

// Konstanta biaya NyewaYuk
export const NYEWAYUK_SERVICE_FEE_PERCENTAGE = 0.05; // 5% biaya layanan
export const NYEWA_EXPRESS_FEE = 25000; // Biaya logistik tetap

export type LogisticsOption = "self-pickup" | "nyewa-express";

export interface PriceCalculationInput {
  pricePerDay: number;
  startDate: Date | null;
  endDate: Date | null;
  logisticsOption: LogisticsOption;
  depositAmount: number;
}

export interface PriceCalculationResult {
  dayCount: number;
  basePrice: number;
  serviceFee: number;
  logisticsFee: number;
  depositAmount: number;
  totalPrice: number;
}

/**
 * Menghitung total harga rental dengan semua biaya tambahan
 * 
 * @param input - Input parameter untuk kalkulasi harga
 * @returns Objek dengan breakdown harga detail
 */
export function calculateRentalPrice(
  input: PriceCalculationInput
): PriceCalculationResult {
  const { pricePerDay, startDate, endDate, logisticsOption, depositAmount } = input;

  // Default values jika tanggal tidak valid
  if (!startDate || !endDate) {
    return {
      dayCount: 0,
      basePrice: 0,
      serviceFee: 0,
      logisticsFee: 0,
      depositAmount: depositAmount || 0,
      totalPrice: depositAmount || 0,
    };
  }

  // 1. Hitung dayCount (minimal 1 hari)
  const dayCount = Math.max(differenceInDays(endDate, startDate), 1);

  // 2. Hitung basePrice
  const basePrice = pricePerDay * dayCount;

  // 3. Hitung serviceFee (DISABLED untuk MVP launch - gratis 1 bulan pertama)
  const serviceFee = 0; // Math.round(basePrice * NYEWAYUK_SERVICE_FEE_PERCENTAGE);

  // 4. Tentukan logisticsFee
  const logisticsFee = logisticsOption === "nyewa-express" ? NYEWA_EXPRESS_FEE : 0;

  // 5. Hitung totalPrice
  const totalPrice = basePrice + serviceFee + logisticsFee + depositAmount;

  return {
    dayCount,
    basePrice,
    serviceFee,
    logisticsFee,
    depositAmount,
    totalPrice,
  };
}

/**
 * Format angka ke format Rupiah (tanpa prefix "Rp")
 */
export function formatRupiah(amount: number): string {
  return amount.toLocaleString("id-ID");
}

/**
 * Format angka ke format Rupiah lengkap dengan prefix
 */
export function formatRupiahFull(amount: number): string {
  return `Rp ${formatRupiah(amount)}`;
}

/**
 * Menghitung deposit dinamis berdasarkan metode logistik dan total sewa
 * 
 * Aturan Bisnis RENLE:
 * 1. Jika metode logistik == 'pickup', deposit = 0 (Jaminan Fisik KTP)
 * 2. Jika metode logistik == 'delivery':
 *    - Total sewa < Rp 100.000 → Deposit Rp 50.000
 *    - Total sewa Rp 100.000 - Rp 500.000 → Deposit Rp 150.000
 *    - Total sewa > Rp 500.000 → Deposit 30% dari total sewa
 * 
 * @param logisticsMethod - Metode pengambilan barang ('pickup' atau 'delivery')
 * @param totalRental - Total biaya sewa (basePrice saja, tanpa biaya tambahan)
 * @returns Object dengan depositAmount dan currency
 */
export function calculateDynamicDeposit(
  logisticsMethod: 'pickup' | 'delivery',
  totalRental: number
): { depositAmount: number; currency: 'IDR' } {
  // 1. Jika pickup, deposit = 0 (menggunakan KTP fisik sebagai jaminan)
  if (logisticsMethod === 'pickup') {
    return {
      depositAmount: 0,
      currency: 'IDR'
    };
  }

  // 2. Jika delivery, hitung berdasarkan total sewa
  let depositAmount: number;

  if (totalRental < 100000) {
    // Total sewa di bawah 100rb → deposit 50rb
    depositAmount = 50000;
  } else if (totalRental <= 500000) {
    // Total sewa 100rb - 500rb → deposit 150rb
    depositAmount = 150000;
  } else {
    // Total sewa di atas 500rb → deposit 30%
    depositAmount = Math.round(totalRental * 0.3);
  }

  return {
    depositAmount,
    currency: 'IDR'
  };
}
