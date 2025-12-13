import { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ - RENLE",
  description: "Pertanyaan yang sering ditanyakan tentang RENLE",
};

export default function FAQPage() {
  const faqs = [
    {
      question: "Bagaimana cara menyewa barang?",
      answer: "Pilih barang yang ingin Anda sewa, pilih tanggal, dan klik 'Ajukan Sewa'. Anda akan diarahkan ke WhatsApp untuk koordinasi dengan pemilik dan admin.",
    },
    {
      question: "Bagaimana cara menyewakan barang saya?",
      answer: "Klik tombol 'Sewakan Barang' di halaman utama, isi detail barang lengkap (brand, model, kondisi), unggah foto, tentukan harga sewa per hari, dan klik 'Simpan'.",
    },
    {
      question: "Apa yang terjadi jika barang rusak?",
      answer: "Penyewa bertanggung jawab atas kerusakan barang selama masa sewa. Untuk self pickup, KTP ditahan sebagai jaminan. Untuk RenleExpress, deposit Rp 200.000 dijaminkan.",
    },
    {
      question: "Bagaimana sistem pembayaran?",
      answer: "Pembayaran dilakukan setelah admin mengonfirmasi pesanan via WhatsApp. Transfer ke rekening yang diberikan admin. Bukti transfer dikirim untuk verifikasi.",
    },
    {
      question: "Bagaimana cara verifikasi KTP?",
      answer: "Admin akan meminta foto KTP Anda via WhatsApp setelah Anda mengajukan sewa. Verifikasi ini wajib untuk keamanan semua pihak.",
    },
    {
      question: "Berapa lama proses persetujuan sewa?",
      answer: "Biasanya 1-24 jam setelah verifikasi KTP dan pembayaran. Admin akan mengonfirmasi via WhatsApp ketika pesanan disetujui.",
    },
  ];

  // WhatsApp number - ganti dengan nomor admin yang sebenarnya
  const waNumber = "6282137541389"; // Ganti dengan nomor WA admin
  const waMessage = encodeURIComponent("Halo, saya ingin bertanya lebih lanjut tentang RENLE");

  return (
    <div className="min-h-screen bg-neutral-900 pt-[80px]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Frequently Asked Questions (FAQ)
        </h1>
        <p className="text-neutral-300 mb-3">
          Temukan informasi tentang RENLE dan layanan kami. Berikut adalah pertanyaan yang sering ditanyakan beserta jawabannya.
        </p>
        <p className="text-neutral-200 mb-8">
          Jika ada pertanyaan lebih lanjut yang belum terjawab di bawah ini, silakan{" "}
          <a
            href={`https://wa.me/${waNumber}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00A99D] font-semibold hover:text-[#008F85] underline decoration-2 underline-offset-2"
          >
            hubungi admin
          </a>{" "}
          kami via WhatsApp untuk bantuan langsung.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-neutral-800 rounded-xl shadow-sm p-6 border border-neutral-700 hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <span className="text-[#00A99D]">Q{index + 1}.</span>
                {faq.question}
              </h3>
              <p className="text-neutral-300 leading-relaxed pl-8">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-gradient-to-br from-[#00A99D]/20 to-blue-900/30 border-2 border-[#00A99D]/30 rounded-xl p-8 text-center">
          <MessageCircle className="w-12 h-12 text-[#00A99D] mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">
            Masih Ada Pertanyaan?
          </h3>
          <p className="text-neutral-200 mb-6 max-w-2xl mx-auto">
            Tim support RENLE siap membantu Anda! Hubungi kami via WhatsApp untuk mendapatkan jawaban cepat dan akurat.
          </p>
          <a
            href={`https://wa.me/${waNumber}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1DA851] text-white px-8 py-4 rounded-[50px] transition font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <MessageCircle className="w-6 h-6" />
            Chat dengan Admin di WhatsApp
          </a>
          <p className="text-sm text-neutral-300 mt-4">
            Respon cepat • Senin - Minggu • 08:00 - 22:00 WIB
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-neutral-400 hover:text-white underline"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
