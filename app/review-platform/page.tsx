"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Send, ArrowLeft, Loader2, MessageSquare } from "lucide-react";
import { toast } from "react-hot-toast";

export default function PlatformReviewPage() {
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error("Pilih rating terlebih dahulu");
            return;
        }

        if (comment.length < 10) {
            toast.error("Komentar minimal 10 karakter");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/reviews/platform", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rating,
                    comment,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Gagal mengirim review");
            }

            toast.success("Terima kasih atas review Anda! 🎉");
            router.push("/");
        } catch (error: any) {
            toast.error(error.message || "Terjadi kesalahan");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-24 pb-16">
            <div className="max-w-2xl mx-auto px-4">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#00A99D] dark:hover:text-[#00A99D] mb-8 transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali
                </button>

                {/* Glass Form Card */}
                <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 dark:border-white/10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#00A99D] to-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#00A99D]/30">
                            <MessageSquare className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Review Platform RENLE
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Bagikan pengalaman Anda menggunakan platform RENLE
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                                Bagaimana pengalaman Anda?
                            </label>
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="p-1 transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-10 h-10 ${star <= (hoverRating || rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300 dark:text-gray-600"
                                                } transition-colors`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                                {rating === 1 && "Sangat Buruk"}
                                {rating === 2 && "Buruk"}
                                {rating === 3 && "Cukup"}
                                {rating === 4 && "Bagus"}
                                {rating === 5 && "Sangat Bagus!"}
                            </p>
                        </div>

                        {/* Comment */}
                        <div>
                            <label
                                htmlFor="comment"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Ceritakan pengalaman Anda
                            </label>
                            <textarea
                                id="comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={5}
                                placeholder="Tulis pengalaman Anda menggunakan RENLE..."
                                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-[#00A99D] focus:border-transparent transition resize-none backdrop-blur-sm"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {comment.length}/500 karakter (minimal 10)
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || rating === 0 || comment.length < 10}
                            className="w-full py-4 bg-gradient-to-r from-[#00A99D] to-emerald-500 text-white font-semibold rounded-xl 
                hover:from-[#008F85] hover:to-emerald-600 transition-all shadow-lg shadow-[#00A99D]/30
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Mengirim...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Kirim Review
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Info */}
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                    Review Anda akan ditampilkan di halaman utama untuk membantu pengguna lain.
                </p>
            </div>
        </div>
    );
}
