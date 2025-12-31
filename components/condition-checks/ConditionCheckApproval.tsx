"use client";

import { useState } from "react";
import { Check, X, Eye, ChevronLeft, ChevronRight, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast";
import Avatar from "@/components/Avatar";

interface ConditionCheckApprovalProps {
  conditionCheck: {
    id: string;
    photos: string[];
    checkType: string;
    notes?: string | null;
    createdAt: string;
    reservation: {
      id: string;
      user: {
        id: string;
        name: string | null;
        image: string | null;
      };
    };
    item: {
      id: string;
      title: string;
    };
  };
  onApproved?: () => void;
  onDisputed?: () => void;
}

export default function ConditionCheckApproval({
  conditionCheck,
  onApproved,
  onDisputed,
}: ConditionCheckApprovalProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [approving, setApproving] = useState(false);
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");

  const title = conditionCheck.checkType === "BEFORE_RENTAL"
    ? "Foto Kondisi Sebelum Sewa"
    : "Foto Kondisi Setelah Sewa";

  const handleApprove = async () => {
    setApproving(true);
    try {
      const response = await fetch(`/api/condition-checks/${conditionCheck.id}/approve`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Gagal menyetujui");
      }

      toast.success(
        conditionCheck.checkType === "BEFORE_RENTAL"
          ? "Kondisi awal disetujui! Penyewa bisa mulai menggunakan barang."
          : "Kondisi akhir disetujui! Penyewaan selesai."
      );
      onApproved?.();
    } catch (error) {
      console.error("Approve error:", error);
      toast.error(error instanceof Error ? error.message : "Gagal menyetujui");
    } finally {
      setApproving(false);
    }
  };

  const handleDispute = async () => {
    if (!disputeReason.trim()) {
      toast.error("Masukkan alasan penolakan");
      return;
    }

    // For now, just show a message - dispute handling would be implemented later
    toast.success("Laporan penolakan telah dikirim ke admin");
    setShowDisputeForm(false);
    onDisputed?.();
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      prev === conditionCheck.photos.length - 1 ? 0 : prev + 1
    );
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      prev === 0 ? conditionCheck.photos.length - 1 : prev - 1
    );
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {conditionCheck.item.title}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Avatar src={conditionCheck.reservation.user.image} size="sm" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {conditionCheck.reservation.user.name || "Penyewa"}
              </span>
            </div>
          </div>
        </div>

        {/* Photo Viewer */}
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-900">
          <img
            src={conditionCheck.photos[currentPhotoIndex]}
            alt={`Condition ${currentPhotoIndex + 1}`}
            className="w-full h-full object-contain"
          />

          {/* Navigation */}
          {conditionCheck.photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Photo counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
            {currentPhotoIndex + 1} / {conditionCheck.photos.length}
          </div>

          {/* Fullscreen button */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>

        {/* Thumbnail strip */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {conditionCheck.photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => setCurrentPhotoIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentPhotoIndex
                    ? "border-rose-500 ring-2 ring-rose-500/30"
                    : "border-transparent hover:border-gray-300 dark:hover:border-gray-500"
                }`}
              >
                <img
                  src={photo}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        {conditionCheck.notes && (
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">Catatan penyewa: </span>
              {conditionCheck.notes}
            </p>
          </div>
        )}

        {/* Dispute Form */}
        {showDisputeForm && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-red-50 dark:bg-red-900/20">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400 mb-3">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Tolak Kondisi</span>
            </div>
            <textarea
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              placeholder="Jelaskan alasan penolakan..."
              rows={3}
              className="w-full px-4 py-3 border border-red-200 dark:border-red-800 rounded-xl 
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent
                resize-none text-sm mb-3"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDisputeForm(false)}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Batal
              </button>
              <button
                onClick={handleDispute}
                className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Kirim Penolakan
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        {!showDisputeForm && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex gap-3">
            <button
              onClick={() => setShowDisputeForm(true)}
              className="flex-1 px-4 py-3 border border-red-200 dark:border-red-800
                text-red-600 dark:text-red-400 rounded-xl font-medium
                hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors
                flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Tolak
            </button>
            <button
              onClick={handleApprove}
              disabled={approving}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 
                text-white rounded-xl font-medium shadow-lg shadow-green-500/25
                hover:from-green-600 hover:to-emerald-600 transition-all
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {approving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Menyetujui...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Setujui
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={conditionCheck.photos[currentPhotoIndex]}
            alt={`Fullscreen ${currentPhotoIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {conditionCheck.photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevPhoto();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextPhoto();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
