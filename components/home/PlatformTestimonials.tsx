"use client";

import { useEffect, useState } from "react";
import { Star, MessageSquare, Loader2 } from "lucide-react";
import Avatar from "@/components/Avatar";

interface PlatformReview {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    reviewer: {
        id: string;
        name: string | null;
        image: string | null;
    };
}

export default function PlatformTestimonials() {
    const [reviews, setReviews] = useState<PlatformReview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlatformReviews();
    }, []);

    const fetchPlatformReviews = async () => {
        try {
            const response = await fetch("/api/reviews?reviewType=PLATFORM_REVIEW&limit=6");
            if (response.ok) {
                const data = await response.json();
                setReviews(data.reviews || []);
            }
        } catch (error) {
            console.error("Error fetching platform reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    // If no platform reviews yet, show value propositions as fallback
    if (!loading && reviews.length === 0) {
        return (
            <section className="bg-white dark:bg-[#1E293B] py-16">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full mb-4">
                            <MessageSquare className="w-4 h-4 text-purple-500" />
                            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                                Testimoni Platform
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Kenapa Pilih RENLE?
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Jadilah yang pertama memberikan testimoni tentang platform kami!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {/* Value Prop 1 */}
                        <div className="rounded-2xl bg-gray-50 dark:bg-[#121212] border border-transparent dark:border-white/10 p-8 shadow-sm hover:shadow-md dark:shadow-neutral-950/50 transition text-center">
                            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#00A99D] to-emerald-400 rounded-2xl flex items-center justify-center">
                                <span className="text-3xl">💰</span>
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-neutral-800 dark:text-white">
                                Sewa Lebih Hemat
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-gray-300 leading-relaxed">
                                Akses ribuan alat hobi dan elektronik berkualitas. Bayar saat butuh, hemat puluhan juta!
                            </p>
                        </div>

                        {/* Value Prop 2 */}
                        <div className="rounded-2xl bg-gray-50 dark:bg-[#121212] border border-transparent dark:border-white/10 p-8 shadow-sm hover:shadow-md dark:shadow-neutral-950/50 transition text-center">
                            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                                <span className="text-3xl">📈</span>
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-neutral-800 dark:text-white">
                                Passive Income
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-gray-300 leading-relaxed">
                                Barang nganggur jadi sumber pemasukan. Ubah aset tidur menjadi uang!
                            </p>
                        </div>

                        {/* Value Prop 3 */}
                        <div className="rounded-2xl bg-gray-50 dark:bg-[#121212] border border-transparent dark:border-white/10 p-8 shadow-sm hover:shadow-md dark:shadow-neutral-950/50 transition text-center">
                            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                                <span className="text-3xl">🛡️</span>
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-neutral-800 dark:text-white">
                                Aman & Terpercaya
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-gray-300 leading-relaxed">
                                RenleGuard melindungi setiap transaksi dengan foto kondisi sebelum & sesudah sewa.
                            </p>
                        </div>
                    </div>

                    {/* CTA untuk review platform */}
                    <div className="text-center mt-10">
                        <a
                            href="/review-platform"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
                        >
                            <MessageSquare className="w-5 h-5" />
                            Beri Review Platform
                        </a>
                    </div>
                </div>
            </section>
        );
    }

    if (loading) {
        return (
            <section className="bg-white dark:bg-[#1E293B] py-16">
                <div className="mx-auto max-w-6xl px-6 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#00A99D]" />
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white dark:bg-[#1E293B] py-16">
            <div className="mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full mb-4">
                        <MessageSquare className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                            Testimoni Platform
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Apa Kata Pengguna RENLE?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Review asli dari pengguna yang sudah merasakan manfaat RENLE
                    </p>
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {reviews.slice(0, 3).map((review) => (
                        <div
                            key={review.id}
                            className="rounded-2xl bg-gray-50 dark:bg-[#121212] border border-transparent dark:border-white/10 p-8 shadow-sm hover:shadow-md dark:shadow-neutral-950/50 transition"
                        >
                            <div className="mb-6 flex justify-center">
                                <div className="h-24 w-24 rounded-full overflow-hidden">
                                    <Avatar src={review.reviewer.image} size="lg" />
                                </div>
                            </div>

                            {/* Stars */}
                            <div className="flex justify-center gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-5 h-5 ${star <= review.rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300 dark:text-gray-600"
                                            }`}
                                    />
                                ))}
                            </div>

                            <h3 className="mb-3 text-center text-lg font-bold text-neutral-800 dark:text-white">
                                {review.reviewer.name || "Pengguna RENLE"}
                            </h3>

                            <p className="text-center text-sm text-neutral-600 dark:text-gray-300 leading-relaxed line-clamp-4">
                                &ldquo;{review.comment}&rdquo;
                            </p>

                            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
                                {new Date(review.createdAt).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
