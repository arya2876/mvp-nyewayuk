"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import Avatar from "@/components/Avatar";

interface Review {
  id: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ListingReviewsProps {
  reviews?: Review[];
}

const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    userName: "Sarah Johnson",
    rating: 5,
    comment: "Pengalaman luar biasa! Barang sesuai deskripsi dan pemiliknya sangat responsif. Pasti akan sewa lagi!",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    userName: "Michael Chen",
    rating: 5,
    comment: "Kualitas bagus dan harga adil. Pengambilan dan pengembalian lancar. Sangat direkomendasikan!",
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    userName: "Emma Williams",
    rating: 4,
    comment: "Pengalaman keseluruhan bagus. Kondisi barang sesuai deskripsi. Pemiliknya ramah dan membantu.",
    createdAt: "2024-01-05",
  },
  {
    id: "4",
    userName: "David Martinez",
    rating: 5,
    comment: "Pengalaman sewa yang sempurna! Semuanya berjalan lancar dari booking hingga pengembalian. Akan pakai lagi.",
    createdAt: "2023-12-28",
  },
  {
    id: "5",
    userName: "Lisa Anderson",
    rating: 5,
    comment: "Pelayanan luar biasa! Pemilik sangat akomodatif dengan jadwal dan barangnya melebihi ekspektasi.",
    createdAt: "2023-12-20",
  },
];

const ListingReviews: React.FC<ListingReviewsProps> = ({ reviews = MOCK_REVIEWS }) => {
  const [showAll, setShowAll] = useState(false);

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "0";

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Reviews ({reviews.length})</h2>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold">{averageRating}</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(Number(averageRating))
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {displayedReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
            <div className="flex items-start gap-4">
              <Avatar src={review.userImage} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{review.userName}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reviews.length > 3 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-purple-600 hover:text-purple-700 font-semibold text-sm underline"
          >
            {showAll ? "Show less" : `Show all ${reviews.length} reviews`}
          </button>
        </div>
      )}
    </div>
  );
};

export default ListingReviews;
