"use client";

import { useState, useCallback } from "react";
import { Star, Send, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Avatar from "@/components/Avatar";

interface ReviewFormProps {
  reservationId: string;
  itemId: string;
  revieweeId: string;
  revieweeName: string;
  revieweeImage?: string | null;
  reviewType: "LENDER_TO_RENTER" | "RENTER_TO_LENDER" | "RENTER_TO_ITEM";
  itemTitle?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({
  reservationId,
  itemId,
  revieweeId,
  revieweeName,
  revieweeImage,
  reviewType,
  itemTitle,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getReviewTypeLabel = () => {
    switch (reviewType) {
      case "LENDER_TO_RENTER":
        return "Review Penyewa";
      case "RENTER_TO_LENDER":
        return "Review Pemilik";
      case "RENTER_TO_ITEM":
        return `Review Barang: ${itemTitle}`;
      default:
        return "Review";
    }
  };

  const getPlaceholder = () => {
    switch (reviewType) {
      case "LENDER_TO_RENTER":
        return "Bagaimana pengalaman Anda dengan penyewa ini? Apakah mereka menjaga barang dengan baik?";
      case "RENTER_TO_LENDER":
        return "Bagaimana pengalaman Anda dengan pemilik barang? Apakah komunikasinya baik?";
      case "RENTER_TO_ITEM":
        return "Bagaimana kondisi dan kualitas barang ini? Apakah sesuai dengan deskripsi?";
      default:
        return "Tulis review Anda...";
    }
  };

  const handleSubmit = useCallback(async () => {
    if (rating === 0) {
      toast.error("Pilih rating terlebih dahulu");
      return;
    }
    if (comment.trim().length < 10) {
      toast.error("Komentar minimal 10 karakter");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          comment: comment.trim(),
          reviewType,
          revieweeId,
          itemId,
          reservationId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Gagal mengirim review");
      }

      toast.success("Review berhasil dikirim!");
      setRating(0);
      setComment("");
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error instanceof Error ? error.message : "Gagal mengirim review");
    } finally {
      setIsSubmitting(false);
    }
  }, [rating, comment, reviewType, revieweeId, itemId, reservationId, onSuccess]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {getReviewTypeLabel()}
      </h3>

      {reviewType !== "RENTER_TO_ITEM" && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <Avatar src={revieweeImage} />
          <span className="font-medium text-gray-900 dark:text-white">
            {revieweeName}
          </span>
        </div>
      )}

      {/* Rating Stars */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Rating
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-transform hover:scale-110 focus:outline-none"
              disabled={isSubmitting}
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoverRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                } transition-colors`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {rating === 1 && "Sangat Buruk"}
            {rating === 2 && "Buruk"}
            {rating === 3 && "Cukup"}
            {rating === 4 && "Baik"}
            {rating === 5 && "Sangat Baik"}
          </p>
        )}
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Komentar
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={getPlaceholder()}
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl 
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
            placeholder-gray-400 dark:placeholder-gray-500
            focus:ring-2 focus:ring-rose-500 focus:border-transparent
            resize-none transition-all"
          disabled={isSubmitting}
        />
        <p className="text-xs text-gray-400 mt-1">
          {comment.length}/500 karakter (minimal 10)
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 
              text-gray-700 dark:text-gray-300 rounded-xl font-medium
              hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={isSubmitting}
          >
            Batal
          </button>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-rose-500 to-pink-500 
            text-white rounded-xl font-medium shadow-lg shadow-rose-500/25
            hover:from-rose-600 hover:to-pink-600 transition-all
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
      </div>
    </div>
  );
}
