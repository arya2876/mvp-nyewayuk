import { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions",
};

export default function FAQPage() {
  const faqs = [
    {
      question: "Bagaimana cara menyewa barang?",
      answer: "Pilih barang yang ingin Anda sewa, pilih tanggal, dan klik 'Pesan Sekarang'. Ikuti instruksi pembayaran untuk menyelesaikan transaksi.",
    },
    {
      question: "Bagaimana cara menyewakan barang saya?",
      answer: "Klik tombol 'Sewakan Barang' di halaman utama, isi detail barang, unggah foto, tentukan harga sewa per hari, dan klik 'Simpan'.",
    },
    {
      question: "Apa yang terjadi jika barang rusak?",
      answer: "Penyewa bertanggung jawab atas kerusakan barang selama masa sewa. Kami menyarankan untuk menggunakan asuransi atau deposit untuk perlindungan tambahan.",
    },
    {
      question: "Bagaimana sistem pembayaran?",
      answer: "Pembayaran dilakukan secara online melalui berbagai metode yang tersedia. Dana akan ditransfer ke pemilik barang setelah periode sewa selesai dan barang dikembalikan dengan baik.",
    },
    {
      question: "Bagaimana cara membatalkan pesanan?",
      answer: "Anda dapat membatalkan pesanan dari halaman 'Booking' sebelum batas waktu pembatalan. Kebijakan pembatalan tergantung pada pengaturan pemilik barang.",
    },
  ];

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
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 mb-8">
          Here you will find information about most things about NyewaYuk and our services.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {faq.question}
              </h3>
              <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            Tidak menemukan jawaban Anda?
          </h3>
          <p className="text-gray-600 mb-4">
            Hubungi tim support kami untuk bantuan lebih lanjut.
          </p>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg transition">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
