"use client";

import { useEffect, useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles, Users, Package, TrendingUp, CheckCircle } from "lucide-react";
import Avatar from "@/components/Avatar";

interface FeaturedReview {
  id: string;
  rating: number;
  comment: string;
  reviewType: string;
  createdAt: string;
  reviewer: {
    id: string;
    name: string | null;
    image: string | null;
  };
  item: {
    id: string;
    title: string;
    imageSrc: string;
    category: string;
  };
}

interface PlatformStats {
  totalUsers: number;
  totalItems: number;
  totalReservations: number;
  completedReservations: number;
  successRate: number;
  averageRating: number;
  totalReviews: number;
}

export default function FeaturedReviews() {
  const [reviews, setReviews] = useState<FeaturedReview[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    fetchFeaturedReviews();
    fetchStats();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || reviews.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, reviews.length]);

  const fetchFeaturedReviews = async () => {
    try {
      const response = await fetch("/api/reviews?featured=true&limit=10");
      if (response.ok) {
        const data = await response.json();
        if (data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews);
        }
      }
    } catch (error) {
      console.error("Error fetching featured reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
    setIsAutoPlaying(false);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    setIsAutoPlaying(false);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K+";
    }
    return num.toString();
  };

  // Show stats section even if no reviews
  const hasReviews = reviews.length > 0;

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto mb-12"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl max-w-3xl mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  const currentReview = hasReviews ? reviews[currentIndex] : null;

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#00A99D]/10 dark:bg-[#00A99D]/20 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-[#00A99D]" />
            <span className="text-sm font-medium text-[#00A99D] dark:text-[#00A99D]">
              {hasReviews ? "Testimoni Pengguna" : "Platform Stats"}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {hasReviews ? "Apa Kata Mereka?" : "Bergabung dengan RENLE"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {hasReviews
              ? "Pengguna RENLE berbagi pengalaman mereka"
              : "Jadilah bagian dari komunitas sewa-menyewa terpercaya di Indonesia"}
          </p>
        </div>

        {/* Review Carousel - Only show if there are reviews */}
        {hasReviews && currentReview && (
          <div className="relative max-w-4xl mx-auto mb-16">
            {/* Navigation Buttons */}
            {reviews.length > 1 && (
              <>
                <button
                  onClick={prevReview}
                  title="Review sebelumnya"
                  aria-label="Review sebelumnya"
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10
                    w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg
                    flex items-center justify-center text-gray-600 dark:text-gray-300
                    hover:bg-gray-50 dark:hover:bg-gray-700 transition-all
                    hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextReview}
                  title="Review berikutnya"
                  aria-label="Review berikutnya"
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10
                    w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg
                    flex items-center justify-center text-gray-600 dark:text-gray-300
                    hover:bg-gray-50 dark:hover:bg-gray-700 transition-all
                    hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Review Card - Glass Morphism */}
            <div
              className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-3xl p-8 md:p-12 shadow-2xl
                border border-white/20 dark:border-white/10 relative"
            >
              {/* Quote Icon */}
              <div className="absolute -top-6 left-8">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00A99D] to-emerald-400 rounded-2xl
                  flex items-center justify-center shadow-lg shadow-[#00A99D]/30">
                  <Quote className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-6 pt-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${star <= currentReview.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                      }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                &ldquo;{currentReview.comment}&rdquo;
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Reviewer */}
                <div className="flex items-center gap-4">
                  <Avatar src={currentReview.reviewer.image} size="lg" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {currentReview.reviewer.name || "Pengguna RENLE"}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Verified Renter
                    </p>
                  </div>
                </div>

                {/* Item */}
                {currentReview.item && (
                  <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00A99D] to-emerald-400 flex items-center justify-center">
                      <span className="text-white text-lg font-bold">
                        {currentReview.item.title.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                        {currentReview.item.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {currentReview.item.category}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Dots Indicator */}
            {reviews.length > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                      setIsAutoPlaying(false);
                    }}
                    title={`Lihat review ${index + 1}`}
                    aria-label={`Lihat review ${index + 1}`}
                    className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                      ? "w-8 bg-[#00A99D]"
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                      }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Platform Reviews Section - Mengganti Stats */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Review Platform
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Bagikan pengalaman Anda menggunakan RENLE
            </p>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <a
              href="/review-platform"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#00A99D] to-emerald-500 text-white font-semibold rounded-full hover:from-[#008F85] hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl text-lg"
            >
              <Sparkles className="w-5 h-5" />
              Beri Review Platform
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
