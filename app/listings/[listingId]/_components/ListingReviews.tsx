"use client";

import { useEffect, useState } from "react";
import { Star, Loader2 } from "lucide-react";
import Avatar from "@/components/Avatar";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewType: string;
  reviewer: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface ListingReviewsProps {
  itemId: string;
}

const ListingReviews: React.FC<ListingReviewsProps> = ({ itemId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?itemId=${itemId}`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews || []);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchReviews();
    }
  }, [itemId]);

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold mb-8">Reviews</h2>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Star className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Belum ada review untuk barang ini</p>
          <p className="text-sm mt-1">Jadilah yang pertama memberikan review!</p>
        </div>
      </div>
    );
  }

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "0";

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Reviews ({reviews.length})
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">{averageRating}</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${star <= Math.round(Number(averageRating))
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {displayedReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
            <div className="flex items-start gap-4">
              <Avatar src={review.reviewer.image} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {review.reviewer.name || "Pengguna RENLE"}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"
                        }`}
                    />
                  ))}
                </div>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{review.comment}</p>

                {/* Review Type Badge */}
                <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${review.reviewType === "RENTER_TO_ITEM"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                  }`}>
                  {review.reviewType === "RENTER_TO_ITEM" ? "Review Barang" : "Review Pemilik"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reviews.length > 3 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-[#00A99D] hover:text-[#008F85] font-semibold text-sm underline"
          >
            {showAll ? "Tampilkan lebih sedikit" : `Lihat semua ${reviews.length} review`}
          </button>
        </div>
      )}
    </div>
  );
};

export default ListingReviews;
