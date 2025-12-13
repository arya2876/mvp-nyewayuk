import { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "RENLE terms and conditions",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-[80px]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/profile"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Profile</span>
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Terms and Conditions
        </h1>
        <p className="text-gray-600 mb-8">Last updated: December 2024</p>

        <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              1. Ketentuan Umum
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Dengan menggunakan platform RENLE, Anda setuju untuk terikat dengan syarat dan ketentuan ini. Platform ini memfasilitasi penyewaan barang antara pemilik dan penyewa.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              2. Tanggung Jawab Penyewa
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Penyewa bertanggung jawab untuk menjaga kondisi barang selama masa sewa. Kerusakan atau kehilangan barang menjadi tanggung jawab penyewa dan wajib diganti sesuai nilai barang.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              3. Tanggung Jawab Pemilik
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Pemilik wajib memastikan barang yang disewakan dalam kondisi baik dan berfungsi dengan baik. Deskripsi barang harus akurat dan sesuai dengan kondisi sebenarnya.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              4. Pembayaran
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Pembayaran dilakukan melalui platform dengan metode yang tersedia. RENLE akan menahan dana hingga transaksi selesai dan barang dikembalikan dengan baik.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              5. Pembatalan dan Pengembalian Dana
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Kebijakan pembatalan mengikuti aturan yang ditetapkan oleh pemilik barang. Pengembalian dana akan diproses sesuai dengan kebijakan pembatalan yang berlaku.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              6. Penyelesaian Sengketa
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Jika terjadi perselisihan, RENLE akan bertindak sebagai mediator. Keputusan akhir akan mempertimbangkan bukti dari kedua belah pihak.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              7. Privasi dan Keamanan Data
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Kami melindungi data pribadi Anda sesuai dengan kebijakan privasi kami. Data tidak akan dibagikan kepada pihak ketiga tanpa persetujuan Anda.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              8. Perubahan Ketentuan
            </h2>
            <p className="text-gray-600 leading-relaxed">
              RENLE berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diberitahukan kepada pengguna melalui email atau notifikasi di platform.
            </p>
          </section>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <p className="text-gray-600">
            Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, silakan hubungi tim support kami.
          </p>
        </div>
      </div>
    </div>
  );
}
