"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, ArrowLeft, Loader2, MessageSquare, User, Package } from "lucide-react";
import Avatar from "@/components/Avatar";

interface Review {
    id: string;
    rating: number;
    comment: string;
    reviewType: string;
    createdAt: string;
    response: string | null;
    reviewer: {
        id: string;
        name: string | null;
        image: string | null;
    };
    item: {
        id: string;
        title: string;
    } | null;
}

export default function MyReviewsPage() {
    const router = useRouter();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "as_renter" | "as_lender">("all");

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            // Fetch reviews received by current user
            const response = await fetch("/api/reviews?received=true");
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

    const getFilteredReviews = () => {
        if (filter === "all") return reviews;
        if (filter === "as_renter") {
            return reviews.filter(r => r.reviewType === "LENDER_TO_RENTER");
        }
        if (filter === "as_lender") {
            return reviews.filter(r =>
                r.reviewType === "RENTER_TO_LENDER" || r.reviewType === "RENTER_TO_ITEM"
            );
        }
        return reviews;
    };

    const getReviewTypeLabel = (type: string) => {
        switch (type) {
            case "LENDER_TO_RENTER":
                return "Review sebagai Penyewa";
            case "RENTER_TO_LENDER":
                return "Review sebagai Pemilik";
            case "RENTER_TO_ITEM":
                return "Review Barang Anda";
            default:
                return type;
        }
    };

    const getReviewTypeColor = (type: string) => {
        switch (type) {
            case "LENDER_TO_RENTER":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
            case "RENTER_TO_LENDER":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
            case "RENTER_TO_ITEM":
                return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const filteredReviews = getFilteredReviews();

    // Calculate stats
    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Review Saya
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Review yang Anda terima dari pengguna lain
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                                <Star className="w-6 h-6 text-yellow-500 fill-yellow-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgRating}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Rating Rata-rata</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#00A99D]/10 rounded-xl flex items-center justify-center">
                                <MessageSquare className="w-6 h-6 text-[#00A99D]" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{reviews.length}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Review</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${filter === "all"
                                ? "bg-[#00A99D] text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                            }`}
                    >
                        Semua ({reviews.length})
                    </button>
                    <button
                        onClick={() => setFilter("as_renter")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap flex items-center gap-2 ${filter === "as_renter"
                                ? "bg-[#00A99D] text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                            }`}
                    >
                        <User className="w-4 h-4" />
                        Sebagai Penyewa ({reviews.filter(r => r.reviewType === "LENDER_TO_RENTER").length})
                    </button>
                    <button
                        onClick={() => setFilter("as_lender")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap flex items-center gap-2 ${filter === "as_lender"
                                ? "bg-[#00A99D] text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                            }`}
                    >
                        <Package className="w-4 h-4" />
                        Sebagai Pemilik ({reviews.filter(r => r.reviewType === "RENTER_TO_LENDER" || r.reviewType === "RENTER_TO_ITEM").length})
                    </button>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-[#00A99D]" />
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredReviews.length === 0 && (
                    <div className="text-center py-16">
                        <MessageSquare className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Belum ada review
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {filter === "all"
                                ? "Anda belum menerima review dari pengguna lain"
                                : filter === "as_renter"
                                    ? "Anda belum menerima review sebagai penyewa"
                                    : "Anda belum menerima review sebagai pemilik barang"}
                        </p>
                    </div>
                )}

                {/* Reviews List */}
                {!loading && filteredReviews.length > 0 && (
                    <div className="space-y-4">
                        {filteredReviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                            >
                                <div className="flex items-start gap-4">
                                    <Avatar src={review.reviewer.image} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-2">
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {review.reviewer.name || "Pengguna RENLE"}
                                            </h3>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full ${getReviewTypeColor(review.reviewType)}`}
                                            >
                                                {getReviewTypeLabel(review.reviewType)}
                                            </span>
                                        </div>

                                        {/* Rating */}
                                        <div className="flex gap-0.5 mb-3">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-4 h-4 ${star <= review.rating
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : "text-gray-300"
                                                        }`}
                                                />
                                            ))}
                                        </div>

                                        {/* Comment */}
                                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                                            &ldquo;{review.comment}&rdquo;
                                        </p>

                                        {/* Item info if exists */}
                                        {review.item && (
                                            <p className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 inline-block px-2 py-1 rounded mb-3">
                                                📦 {review.item.title}
                                            </p>
                                        )}

                                        {/* Response if exists */}
                                        {review.response && (
                                            <div className="mt-3 pl-4 border-l-2 border-[#00A99D]">
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="font-medium text-[#00A99D]">Balasan Anda:</span> {review.response}
                                                </p>
                                            </div>
                                        )}

                                        {/* Date */}
                                        <p className="text-xs text-gray-400 mt-3">
                                            {new Date(review.createdAt).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
