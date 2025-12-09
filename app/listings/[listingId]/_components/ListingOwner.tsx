"use client";

import Avatar from "@/components/Avatar";
import { Check, Clock, MessageCircle, MapPin, Shield, Star } from "lucide-react";

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
    <div className="border rounded-xl p-6 bg-gray-50 dark:bg-[#1E293B] dark:border-white/10">
      <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-4 uppercase">Pemilik</h3>
      <div className="flex items-start gap-4 mb-6">
        <Avatar src={user.image} />
        <div className="flex-1">
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">{user.name || "Anonymous"}</h4>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            ))}
            <span className="ml-2 text-gray-600 dark:text-gray-400 text-sm">{rating}/5</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
          <Check className="w-5 h-5 text-[#00A99D] flex-shrink-0" />
          <span>Terverifikasi</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
          <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
          <span>Biasanya merespon dalam 1 jam</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
          <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
          <span>Tingkat respon 100%</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
          <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
          <span>Jakarta Area</span>
        </div>
      </div>

      <button className="w-full px-6 py-3 border-2 border-[#00A99D] text-[#00A99D] rounded-[50px] hover:bg-[#00A99D]/10 font-semibold transition">
        Kirim Pesan
      </button>
    </div>
  );
};

export default ListingOwner;
