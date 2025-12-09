import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Search, MessageSquare, Package, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Cara Kerja - NyewaYuk",
  description: "Pelajari cara kerja platform NyewaYuk untuk menyewa dan menyewakan barang",
};

export default function CaraKerjaPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-[80px]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Cara Kerja NyewaYuk
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Platform peer-to-peer rental yang memudahkan Anda menyewa atau menyewakan barang dengan aman
          </p>
        </div>

        {/* Untuk Penyewa */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Untuk Penyewa
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Cari Barang</h3>
              <p className="text-gray-600">
                Gunakan search bar atau pilih kategori untuk menemukan barang yang ingin disewa
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Ajukan Sewa</h3>
              <p className="text-gray-600">
                Pilih tanggal sewa dan klik &quot;Ajukan Sewa&quot;. Anda akan diarahkan ke WhatsApp untuk koordinasi dengan pemilik
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Verifikasi KTP</h3>
              <p className="text-gray-600">
                Admin akan meminta verifikasi KTP dan konfirmasi pembayaran untuk keamanan transaksi
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">4. Ambil Barang</h3>
              <p className="text-gray-600">
                Pilih Self Pickup (deposit KTP) atau Nyewa Express (deposit Rp 200k) untuk pengiriman
              </p>
            </div>
          </div>
        </div>

        {/* Untuk Pemilik Barang */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Untuk Pemilik Barang
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-[#00A99D]/20 rounded-full flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-[#00A99D]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Upload Barang</h3>
              <p className="text-gray-600">
                Klik &quot;Sewakan Barang&quot;, isi detail lengkap (brand, model, kondisi), upload foto, dan tentukan harga sewa per hari
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-[#00A99D]/20 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-[#00A99D]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Terima Pesanan</h3>
              <p className="text-gray-600">
                Dapatkan notifikasi WhatsApp saat ada yang ingin menyewa. Koordinasikan detail dengan penyewa
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-[#00A99D]/20 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-[#00A99D]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Serahkan Barang</h3>
              <p className="text-gray-600">
                Setelah verifikasi selesai, serahkan barang dengan aman. KTP/deposit dijamin untuk keamanan Anda
              </p>
            </div>
          </div>
        </div>

        {/* Keuntungan */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Keuntungan NyewaYuk
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Hemat Biaya</h3>
              <p className="text-gray-600">
                Sewa lebih murah 60% dibanding beli baru
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Aman & Terpercaya</h3>
              <p className="text-gray-600">
                Verifikasi KTP dan deposit untuk keamanan semua pihak
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-semibold mb-2">Dekat & Cepat</h3>
              <p className="text-gray-600">
                Sewa barang dari tetangga terdekat Anda
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-purple-700 transition"
          >
            Mulai Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
