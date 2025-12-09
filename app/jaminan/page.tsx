import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, UserCheck, FileCheck, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Jaminan Keamanan - NyewaYuk",
  description: "Sistem jaminan dan perlindungan NyewaYuk untuk transaksi aman",
};

export default function JaminanPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-[80px]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#00A99D]/20 rounded-full mb-6">
            <ShieldCheck className="w-10 h-10 text-[#00A99D]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Jaminan Keamanan NyewaYuk
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Kami melindungi setiap transaksi dengan sistem verifikasi dan jaminan berlapis untuk keamanan maksimal
          </p>
        </div>

        {/* Sistem Jaminan */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Sistem Jaminan Kami
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Untuk Penyewa */}
            <div className="bg-white rounded-xl p-8 shadow-sm border-2 border-purple-100">
              <h3 className="text-2xl font-bold text-purple-600 mb-6 flex items-center gap-2">
                <UserCheck className="w-6 h-6" />
                Untuk Penyewa
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileCheck className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Verifikasi KTP Wajib</h4>
                    <p className="text-gray-600 text-sm">
                      Setiap penyewa wajib memverifikasi KTP untuk memastikan identitas asli dan mencegah penipuan
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Deposit Keamanan</h4>
                    <p className="text-gray-600 text-sm">
                      <strong>Self Pickup:</strong> Deposit KTP asli kepada pemilik<br />
                      <strong>Nyewa Express:</strong> Deposit Rp 200.000 (dikembalikan setelah barang kembali utuh)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Barang Terverifikasi</h4>
                    <p className="text-gray-600 text-sm">
                      Barang dengan badge &quot;Terverifikasi&quot; telah dikonfirmasi kondisinya oleh NyewaGuard AI
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Untuk Pemilik */}
            <div className="bg-white rounded-xl p-8 shadow-sm border-2 border-[#00A99D]/20">
              <h3 className="text-2xl font-bold text-[#00A99D] mb-6 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6" />
                Untuk Pemilik Barang
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#00A99D]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileCheck className="w-5 h-5 text-[#00A99D]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Verifikasi Penyewa</h4>
                    <p className="text-gray-600 text-sm">
                      Semua penyewa terverifikasi KTP oleh admin sebelum proses sewa dilanjutkan
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#00A99D]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-[#00A99D]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Jaminan KTP/Deposit</h4>
                    <p className="text-gray-600 text-sm">
                      Anda berhak menahan KTP asli penyewa (self pickup) atau deposit uang Rp 200.000 sebagai jaminan
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#00A99D]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 text-[#00A99D]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Koordinasi via WhatsApp</h4>
                    <p className="text-gray-600 text-sm">
                      Komunikasi langsung dengan penyewa melalui WhatsApp untuk transparansi dan bukti chat
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NyewaGuard AI */}
        <div className="bg-gradient-to-br from-[#00A99D]/10 to-[#0054A6]/10 rounded-2xl p-8 md:p-12 mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00A99D] rounded-full mb-4">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              NyewaGuard AI Verification
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Teknologi AI kami memverifikasi kondisi barang melalui analisis foto untuk memastikan kualitas sesuai deskripsi
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="font-semibold mb-2">Analisis Foto</h3>
              <p className="text-sm text-gray-600">AI menganalisis kondisi barang dari foto yang diupload</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">✅</div>
              <h3 className="font-semibold mb-2">Verifikasi Otomatis</h3>
              <p className="text-sm text-gray-600">Badge &quot;Terverifikasi&quot; diberikan untuk barang yang lolos verifikasi</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="font-semibold mb-2">Perlindungan Ekstra</h3>
              <p className="text-sm text-gray-600">Mengurangi risiko ketidaksesuaian kondisi barang</p>
            </div>
          </div>
        </div>

        {/* Kebijakan Keamanan */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Penting untuk Diketahui</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Transaksi pembayaran dilakukan setelah konfirmasi admin via WhatsApp</li>
                <li>✓ Deposit dikembalikan 100% jika barang dikembalikan dalam kondisi baik</li>
                <li>✓ Kerusakan barang menjadi tanggung jawab penyewa sesuai kesepakatan</li>
                <li>✓ Admin NyewaYuk memfasilitasi komunikasi tapi tidak bertanggung jawab atas sengketa pribadi</li>
                <li>✓ Laporkan masalah ke admin untuk mediasi dan penyelesaian</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#00A99D] text-white px-8 py-4 rounded-[50px] font-semibold hover:bg-[#008F85] transition"
          >
            Mulai Sewa Aman Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
