"use client";

import Avatar from "@/components/Avatar";
import { Check, Clock, MessageCircle, MapPin, Shield } from "lucide-react";

interface ListingOwnerProps {
  user: {
    name: string | null;
    image: string | null;
    email: string | null;
  };
}

const ListingOwner: React.FC<ListingOwnerProps> = ({ user }) => {
  const rating = 5; // Placeholder - bisa ditambahkan ke database nanti

  return (
    <div className="border rounded-xl p-6 bg-gray-50">
      <h3 className="text-sm text-gray-600 mb-4 uppercase">Pemilik</h3>
      <div className="flex items-start gap-4 mb-6">
        <Avatar src={user.image} />
        <div className="flex-1">
          <h4 className="text-xl font-bold text-gray-900">{user.name || "Anonymous"}</h4>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(rating)].map((_, i) => (
              <span key={i} className="text-pink-500 text-lg">❤</span>
            ))}
            <span className="ml-2 text-gray-600 text-sm">{rating}/5</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span>Terverifikasi</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <Clock className="w-5 h-5 text-gray-600 flex-shrink-0" />
          <span>Biasanya merespon dalam 1 jam</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <MessageCircle className="w-5 h-5 text-gray-600 flex-shrink-0" />
          <span>Tingkat respon 100%</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0" />
          <span>Jakarta Area</span>
        </div>
        <div className="flex items-start gap-3 text-sm text-gray-700">
          <Shield className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
          <div>
            <span>Kerusakan ditanggung tanpa biaya tambahan. </span>
            <button className="text-purple-600 hover:underline font-medium">Baca selengkapnya</button>
          </div>
        </div>
      </div>

      <button className="w-full px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-full hover:bg-purple-50 font-semibold transition">
        Kirim Pesan
      </button>
    </div>
  );
};

export default ListingOwner;
