"use client";

import { useState } from "react";
import { X, Package, Calendar, Truck, CreditCard, CheckCircle, MessageCircle } from "lucide-react";
import { formatRupiah } from "@/utils/priceCalculation";

interface WhatsAppCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  startDate: Date;
  endDate: Date;
  dayCount: number;
  logisticsOption: "self-pickup" | "nyewa-express";
  basePrice: number;
  logisticsFee: number;
  depositAmount: number;
  totalPrice: number;
  ownerPhone?: string;
  ownerName?: string;
}

const WhatsAppCheckoutModal: React.FC<WhatsAppCheckoutModalProps> = ({
  isOpen,
  onClose,
  itemName,
  startDate,
  endDate,
  dayCount,
  logisticsOption,
  basePrice,
  logisticsFee,
  depositAmount,
  totalPrice,
  ownerPhone = "6282137541389", // Default phone number - replace with actual owner's phone
  ownerName = "Admin",
}) => {
  const [isAgreed, setIsAgreed] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  if (!isOpen) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const logisticsLabel = logisticsOption === "self-pickup" ? "Ambil Sendiri" : "Nyewa Express (Diantar)";
  const depositLabel = logisticsOption === "self-pickup" ? "KTP/Identitas Asli" : `Rp ${formatRupiah(depositAmount)}`;

  // Generate WhatsApp message
  const generateWhatsAppMessage = () => {
    const message = `Halo ${ownerName}, saya ingin sewa:
📦 *${itemName}*
📅 Tanggal: ${formatDate(startDate)} s/d ${formatDate(endDate)} (${dayCount} Hari)
🚚 Pengambilan: ${logisticsLabel}
💰 Estimasi Total: Rp ${formatRupiah(totalPrice)}

Apakah barang tersedia?`;

    return encodeURIComponent(message);
  };

  const handleWhatsAppRedirect = () => {
    const message = generateWhatsAppMessage();
    // Clean phone number: remove all non-digit characters
    const cleanPhone = ownerPhone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(whatsappUrl, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[#1E293B] px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-800 dark:text-white">Konfirmasi Pesanan</h2>
          <button 
            onClick={onClose}
            title="Tutup"
            aria-label="Tutup modal"
            className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Item Name */}
          <div className="flex items-start gap-3 p-4 bg-[#00A99D]/10 dark:bg-[#00A99D]/20 rounded-xl">
            <Package className="w-6 h-6 text-[#00A99D] flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm text-[#00A99D] font-medium">Barang yang disewa</div>
              <div className="text-lg font-bold text-[#0054A6] dark:text-white">{itemName}</div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            {/* Dates */}
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">Tanggal Sewa</div>
                <div className="font-semibold text-neutral-800 dark:text-white">
                  {formatDate(startDate)} - {formatDate(endDate)}
                </div>
                <div className="text-sm text-[#00A99D] font-medium">{dayCount} Hari</div>
              </div>
            </div>

            {/* Logistics */}
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">Metode Pengambilan</div>
                <div className="font-semibold text-neutral-800 dark:text-white">{logisticsLabel}</div>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="border border-gray-200 dark:border-neutral-700 rounded-xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Biaya Sewa ({dayCount} hari)</span>
              <span className="font-medium text-neutral-800 dark:text-white">Rp {formatRupiah(basePrice)}</span>
            </div>
            {logisticsFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Nyewa Express</span>
                <span className="font-medium text-neutral-800 dark:text-white">Rp {formatRupiah(logisticsFee)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Deposit Jaminan
              </span>
              <span className="font-medium text-neutral-800 dark:text-white">
                {depositLabel}
              </span>
            </div>
            <div className="pt-3 border-t border-gray-200 dark:border-neutral-600 flex justify-between">
              <span className="font-bold text-neutral-800 dark:text-white">Total Estimasi</span>
              <span className="font-bold text-xl text-[#00A99D]">Rp {formatRupiah(totalPrice)}</span>
            </div>
          </div>

          {/* Warning for Self Pickup */}
          {logisticsOption === "self-pickup" && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-xl">
              <div className="flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <div className="text-sm text-yellow-700 dark:text-yellow-300">
                  <strong>Penting:</strong> Anda WAJIB menyerahkan <strong>KTP/Identitas Asli</strong> kepada pemilik saat pengambilan barang sebagai jaminan.
                </div>
              </div>
            </div>
          )}

          {/* Agreement Checkbox */}
          <label className="flex items-start gap-3 p-4 border border-gray-200 dark:border-white/10 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1E293B]/50 transition">
            <input
              type="checkbox"
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)}
              className="w-5 h-5 mt-0.5 text-[#00A99D] rounded border-gray-300 focus:ring-[#00A99D]"
            />
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Saya setuju dengan <button type="button" onClick={(e) => { e.preventDefault(); setIsTermsOpen(true); }} className="text-[#00A99D] underline font-medium hover:text-[#008F85]">Syarat & Ketentuan</button> NyewaYuk termasuk kewajiban menyerahkan <strong>KTP Asli/Deposit</strong> sebagai jaminan keamanan.
            </div>
          </label>

          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsAppRedirect}
            disabled={!isAgreed}
            className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-[50px] font-bold text-lg transition ${
              isAgreed
                ? "bg-[#25D366] hover:bg-[#1DA851] text-white shadow-lg hover:shadow-xl"
                : "bg-gray-300 dark:bg-neutral-600 text-gray-500 dark:text-neutral-400 cursor-not-allowed"
            }`}
          >
            <MessageCircle className="w-6 h-6" />
            <span>Lanjut ke WhatsApp</span>
          </button>

          {/* Info */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            Admin akan mengkonfirmasi ketersediaan barang melalui WhatsApp
          </div>
        </div>
      </div>

      {/* Terms & Conditions Popup */}
      {isTermsOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsTermsOpen(false)}
          />
          <div className="relative bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-[#1E293B] px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-neutral-800 dark:text-white">Syarat & Ketentuan NyewaYuk</h2>
              <button 
                onClick={() => setIsTermsOpen(false)}
                title="Tutup"
                aria-label="Tutup"
                className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-full transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm text-gray-700 dark:text-gray-300">
              <section>
                <h3 className="font-bold text-lg mb-2 text-neutral-800 dark:text-white">1. Tentang NyewaYuk</h3>
                <p>NyewaYuk adalah platform peer-to-peer rental yang menghubungkan pemilik barang (Lender) dengan penyewa (Borrower). Platform ini memfasilitasi transaksi sewa-menyewa yang aman dan terpercaya.</p>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-2 text-neutral-800 dark:text-white">2. Kewajiban Jaminan Keamanan</h3>
                <div className="space-y-2">
                  <p className="font-semibold">Opsi Ambil Sendiri (Self Pickup):</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Penyewa WAJIB menyerahkan <strong>KTP/Identitas Asli</strong> kepada pemilik barang saat pengambilan</li>
                    <li>Identitas akan dikembalikan setelah barang dikembalikan dalam kondisi baik</li>
                    <li>Tidak ada biaya deposit uang</li>
                  </ul>
                  <p className="font-semibold mt-3">Opsi Nyewa Express (Delivery):</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Penyewa membayar deposit keamanan sebesar <strong>Rp 200.000</strong></li>
                    <li>Deposit akan dikembalikan 100% setelah barang dikembalikan dalam kondisi baik</li>
                    <li>Biaya pengiriman: Rp 25.000</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-2 text-neutral-800 dark:text-white">3. Tanggung Jawab Penyewa</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Menjaga barang dalam kondisi baik selama masa sewa</li>
                  <li>Mengembalikan barang tepat waktu sesuai tanggal yang disepakati</li>
                  <li>Bertanggung jawab atas kerusakan atau kehilangan barang</li>
                  <li>Tidak menyewakan kembali barang kepada pihak ketiga</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-2 text-neutral-800 dark:text-white">4. Pembayaran</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Pembayaran dilakukan setelah konfirmasi dari pemilik melalui WhatsApp</li>
                  <li>Metode pembayaran akan diinformasikan oleh admin</li>
                  <li>Transaksi dilindungi oleh sistem jaminan NyewaYuk</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-2 text-neutral-800 dark:text-white">5. Pembatalan & Pengembalian</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Pembatalan oleh penyewa: Silakan hubungi pemilik melalui WhatsApp</li>
                  <li>Pembatalan oleh pemilik: Dana akan dikembalikan 100%</li>
                  <li>Pengembalian dana deposit (jika ada) dilakukan maksimal 3 hari kerja</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-2 text-neutral-800 dark:text-white">6. Ketentuan Lainnya</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Penyewa harus berusia minimal 17 tahun</li>
                  <li>Data pribadi dilindungi sesuai kebijakan privasi NyewaYuk</li>
                  <li>NyewaYuk berhak memblokir akun yang melanggar ketentuan</li>
                </ul>
              </section>

              <div className="mt-6 p-4 bg-[#00A99D]/10 dark:bg-[#00A99D]/20 rounded-lg">
                <p className="text-[#00A99D] font-medium">
                  Dengan melanjutkan, Anda menyetujui semua syarat dan ketentuan di atas.
                </p>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white dark:bg-[#1E293B] px-6 py-4 border-t border-gray-200 dark:border-white/10">
              <button
                onClick={() => setIsTermsOpen(false)}
                className="w-full bg-[#00A99D] hover:bg-[#008F85] text-white font-semibold py-3 px-6 rounded-[50px] transition"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppCheckoutModal;
