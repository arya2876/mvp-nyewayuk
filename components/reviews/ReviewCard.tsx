"use client";

import { useState } from "react";
import { Star, ThumbsUp, Flag, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import Avatar from "@/components/Avatar";
import { toast } from "react-hot-toast";

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment: string;
    reviewType: string;
    createdAt: string;
    helpfulCount: number;
    response?: string | null;
    responseDate?: string | null;
    reviewer: {
      id: string;
      name: string | null;
      image: string | null;
    };
    reviewee: {
      id: string;
      name: string | null;
      image: string | null;
    };
    item?: {
      id: string;
      title: string;
      imageSrc: string;
      category: string;
    };
  };
  showItem?: boolean;
  showResponseForm?: boolean;
  currentUserId?: string;
  onUpdate?: () => void;
}

export default function ReviewCard({
  review,
  showItem = false,
  showResponseForm = false,
  currentUserId,
  onUpdate,
}: ReviewCardProps) {
  const [showResponse, setShowResponse] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  const [isMarkingHelpful, setIsMarkingHelpful] = useState(false);
  const [localHelpfulCount, setLocalHelpfulCount] = useState(review.helpfulCount);

  const getReviewTypeLabel = () => {
    switch (review.reviewType) {
      case "LENDER_TO_RENTER":
        return "Review sebagai Penyewa";
      case "RENTER_TO_LENDER":
        return "Review sebagai Pemilik";
      case "RENTER_TO_ITEM":
        return "Review Barang";
      default:
        return "Review";
    }
  };

  const getReviewTypeBadgeColor = () => {
    switch (review.reviewType) {
      case "LENDER_TO_RENTER":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "RENTER_TO_LENDER":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "RENTER_TO_ITEM":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const handleMarkHelpful = async () => {
    if (isMarkingHelpful) return;
    setIsMarkingHelpful(true);

    try {
      const response = await fetch(`/api/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markHelpful: true }),
      });

      if (!response.ok) throw new Error("Failed to mark as helpful");

      setLocalHelpfulCount((prev) => prev + 1);
      toast.success("Marked as helpful!");
    } catch {
      toast.error("Gagal menandai helpful");
    } finally {
      setIsMarkingHelpful(false);
    }
  };

  const handleReport = async () => {
    try {
      const response = await fetch(`/api/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportSpam: true }),
      });

      if (!response.ok) throw new Error("Failed to report");

      toast.success("Review dilaporkan");
    } catch {
      toast.error("Gagal melaporkan review");
    }
  };

  const handleSubmitResponse = async () => {
    if (!responseText.trim()) return;
    setIsSubmittingResponse(true);

    try {
      const response = await fetch(`/api/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: responseText.trim() }),
      });

      if (!response.ok) throw new Error("Failed to submit response");

      toast.success("Balasan berhasil dikirim!");
      setShowResponse(false);
      setResponseText("");
      onUpdate?.();
    } catch {
      toast.error("Gagal mengirim balasan");
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar src={review.reviewer.image} />
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {review.reviewer.name || "Anonymous"}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(review.createdAt), {
                addSuffix: true,
                locale: id,
              })}
            </p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getReviewTypeBadgeColor()}`}>
          {getReviewTypeLabel()}
        </span>
      </div>

      {/* Rating Stars */}
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= review.rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {review.rating}/5
        </span>
      </div>

      {/* Comment */}
      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
        {review.comment}
      </p>

      {/* Item (if shown) */}
      {showItem && review.item && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl mb-4">
          <img
            src={review.item.imageSrc}
            alt={review.item.title}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <p className="font-medium text-gray-900 dark:text-white text-sm">
              {review.item.title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {review.item.category}
            </p>
          </div>
        </div>
      )}

      {/* Response from reviewee */}
      {review.response && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4 border-l-4 border-rose-500">
          <div className="flex items-center gap-2 mb-2">
            <Avatar src={review.reviewee.image} size="sm" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {review.reviewee.name || "Owner"}
            </span>
            <span className="text-xs text-gray-500">
              {review.responseDate &&
                formatDistanceToNow(new Date(review.responseDate), {
                  addSuffix: true,
                  locale: id,
                })}
            </span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {review.response}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <button
            onClick={handleMarkHelpful}
            disabled={isMarkingHelpful}
            className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-rose-500 transition-colors"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>Helpful ({localHelpfulCount})</span>
          </button>
          <button
            onClick={handleReport}
            className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
          >
            <Flag className="w-4 h-4" />
            <span>Report</span>
          </button>
        </div>

        {/* Response button (for reviewee) */}
        {showResponseForm &&
          currentUserId === review.reviewee.id &&
          !review.response && (
            <button
              onClick={() => setShowResponse(!showResponse)}
              className="flex items-center gap-1 text-sm text-rose-500 hover:text-rose-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Balas</span>
              {showResponse ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}
      </div>

      {/* Response Form */}
      {showResponse && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Tulis balasan Anda..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
              placeholder-gray-400 dark:placeholder-gray-500
              focus:ring-2 focus:ring-rose-500 focus:border-transparent
              resize-none text-sm"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setShowResponse(false)}
              className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Batal
            </button>
            <button
              onClick={handleSubmitResponse}
              disabled={isSubmittingResponse || !responseText.trim()}
              className="px-4 py-2 bg-rose-500 text-white text-sm rounded-lg font-medium
                hover:bg-rose-600 transition-colors disabled:opacity-50"
            >
              {isSubmittingResponse ? "Mengirim..." : "Kirim Balasan"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
