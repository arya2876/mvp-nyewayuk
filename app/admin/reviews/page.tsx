"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Star,
    Trash2,
    Eye,
    EyeOff,
    CheckCircle,
    XCircle,
    Loader2,
    ArrowLeft,
    Shield,
    Filter
} from "lucide-react";
import { toast } from "react-hot-toast";
import Avatar from "@/components/Avatar";

interface Review {
    id: string;
    rating: number;
    comment: string;
    reviewType: string;
    isFeatured: boolean;
    isVerified: boolean;
    createdAt: string;
    reviewer: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
    };
    item: {
        id: string;
        title: string;
    } | null;
}

export default function AdminReviewsPage() {
    const router = useRouter();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchReviews();
    }, [filter, page]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set("page", page.toString());
            params.set("limit", "20");
            if (filter !== "all") params.set("reviewType", filter);

            const response = await fetch(`/api/admin/reviews?${params}`);
            if (response.status === 403) {
                toast.error("Akses ditolak - Anda bukan admin");
                router.push("/");
                return;
            }
            if (!response.ok) throw new Error("Failed to fetch");

            const data = await response.json();
            setReviews(data.reviews);
            setTotalPages(data.totalPages);
        } catch (error) {
            toast.error("Gagal memuat reviews");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (reviewId: string) => {
        if (!confirm("Yakin ingin menghapus review ini?")) return;

        setDeleting(reviewId);
        try {
            const response = await fetch(`/api/admin/reviews?id=${reviewId}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete");

            setReviews(reviews.filter((r) => r.id !== reviewId));
            toast.success("Review dihapus");
        } catch (error) {
            toast.error("Gagal menghapus review");
        } finally {
            setDeleting(null);
        }
    };

    const handleToggleFeatured = async (reviewId: string, currentValue: boolean) => {
        try {
            const response = await fetch("/api/admin/reviews", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reviewId, isFeatured: !currentValue }),
            });
            if (!response.ok) throw new Error("Failed to update");

            setReviews(
                reviews.map((r) =>
                    r.id === reviewId ? { ...r, isFeatured: !currentValue } : r
                )
            );
            toast.success(currentValue ? "Tidak ditampilkan" : "Ditampilkan di homepage");
        } catch (error) {
            toast.error("Gagal mengupdate");
        }
    };

    const getReviewTypeLabel = (type: string) => {
        switch (type) {
            case "PLATFORM_REVIEW":
                return "Platform";
            case "RENTER_TO_ITEM":
                return "Barang";
            case "RENTER_TO_LENDER":
                return "Pemilik";
            case "LENDER_TO_RENTER":
                return "Penyewa";
            default:
                return type;
        }
    };

    const getReviewTypeColor = (type: string) => {
        switch (type) {
            case "PLATFORM_REVIEW":
                return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
            case "RENTER_TO_ITEM":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
            case "RENTER_TO_LENDER":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
            case "LENDER_TO_RENTER":
                return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";
            default:
                return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <Shield className="w-6 h-6 text-[#00A99D]" />
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Kelola Reviews
                                </h1>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Admin Panel - Kelola semua review platform
                            </p>
                        </div>
                    </div>

                    {/* Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <select
                            value={filter}
                            onChange={(e) => {
                                setFilter(e.target.value);
                                setPage(1);
                            }}
                            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                        >
                            <option value="all">Semua</option>
                            <option value="PLATFORM_REVIEW">Platform</option>
                            <option value="RENTER_TO_ITEM">Review Barang</option>
                            <option value="RENTER_TO_LENDER">Review Pemilik</option>
                            <option value="LENDER_TO_RENTER">Review Penyewa</option>
                        </select>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-[#00A99D]" />
                    </div>
                )}

                {/* Reviews List */}
                {!loading && reviews.length === 0 && (
                    <div className="text-center py-16 text-gray-500">
                        Tidak ada review
                    </div>
                )}

                {!loading && reviews.length > 0 && (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    {/* Left - Reviewer Info */}
                                    <div className="flex items-start gap-4 flex-1">
                                        <Avatar src={review.reviewer.image} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                                    {review.reviewer.name || "Anonymous"}
                                                </h3>
                                                <span
                                                    className={`text-xs px-2 py-0.5 rounded-full ${getReviewTypeColor(
                                                        review.reviewType
                                                    )}`}
                                                >
                                                    {getReviewTypeLabel(review.reviewType)}
                                                </span>
                                                {review.isFeatured && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#00A99D]/10 text-[#00A99D]">
                                                        ⭐ Featured
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {review.reviewer.email}
                                            </p>

                                            {/* Rating */}
                                            <div className="flex gap-0.5 my-2">
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
                                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                                {review.comment}
                                            </p>

                                            {/* Item info if exists */}
                                            {review.item && (
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Barang: {review.item.title}
                                                </p>
                                            )}

                                            {/* Date */}
                                            <p className="text-xs text-gray-400 mt-2">
                                                {new Date(review.createdAt).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() =>
                                                handleToggleFeatured(review.id, review.isFeatured)
                                            }
                                            className={`p-2 rounded-lg transition ${review.isFeatured
                                                    ? "bg-[#00A99D] text-white"
                                                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-[#00A99D]/10"
                                                }`}
                                            title={
                                                review.isFeatured
                                                    ? "Hapus dari featured"
                                                    : "Tampilkan di homepage"
                                            }
                                        >
                                            {review.isFeatured ? (
                                                <Eye className="w-4 h-4" />
                                            ) : (
                                                <EyeOff className="w-4 h-4" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(review.id)}
                                            disabled={deleting === review.id}
                                            className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition"
                                            title="Hapus review"
                                        >
                                            {deleting === review.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 bg-white dark:bg-gray-800 border rounded-lg disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <span className="px-4 py-2">
                            {page} / {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 bg-white dark:bg-gray-800 border rounded-lg disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
