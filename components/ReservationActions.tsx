"use client";

import { useState, useEffect, useCallback } from "react";
import { Camera, CheckCircle, Clock, AlertCircle, ChevronRight, Star, User } from "lucide-react";
import { toast } from "react-hot-toast";
import ConditionCheckUpload from "@/components/condition-checks/ConditionCheckUpload";
import ConditionCheckApproval from "@/components/condition-checks/ConditionCheckApproval";
import ReviewForm from "@/components/reviews/ReviewForm";

interface ConditionCheckData {
  id: string;
  photos: string[];
  checkType: string;
  notes?: string | null;
  createdAt: string;
  isApproved: boolean;
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
}

interface ReservationActionsProps {
  reservation: {
    id: string;
    startDate: string;
    endDate: string;
    status: string;
    beforeCheckCompleted: boolean;
    afterCheckCompleted: boolean;
    canStartRental: boolean;
    canCompleteRental: boolean;
  };
  item: {
    id: string;
    title: string;
    userId: string;
  };
  currentUserId: string;
  isRenter: boolean;
  isLender: boolean;
  lenderName?: string;
  renterName?: string;
  renterId?: string;
}

type ActionView = "main" | "before-upload" | "after-upload" | "review-lender" | "review-item" | "review-renter";

export default function ReservationActions({
  reservation,
  item,
  currentUserId,
  isRenter,
  isLender,
  lenderName,
  renterName,
  renterId,
}: ReservationActionsProps) {
  const [view, setView] = useState<ActionView>("main");
  const [conditionChecks, setConditionChecks] = useState<{
    before: ConditionCheckData | null;
    after: ConditionCheckData | null;
  }>({ before: null, after: null });
  const [loading, setLoading] = useState(true);
  const [pendingApproval, setPendingApproval] = useState<ConditionCheckData | null>(null);

  const fetchConditionChecks = useCallback(async () => {
    try {
      const response = await fetch(`/api/condition-checks?reservationId=${reservation.id}`);
      if (response.ok) {
        const data: ConditionCheckData[] = await response.json();
        const beforeCheck = data.find((c) => c.checkType === "BEFORE_RENTAL") || null;
        const afterCheck = data.find((c) => c.checkType === "AFTER_RENTAL") || null;
        setConditionChecks({
          before: beforeCheck,
          after: afterCheck,
        });

        // For lender: check if there's a pending approval
        if (isLender) {
          const pending = data.find((c) => !c.isApproved);
          setPendingApproval(pending || null);
        }
      }
    } catch (error) {
      console.error("Error fetching condition checks:", error);
    } finally {
      setLoading(false);
    }
  }, [reservation.id, isLender]);

  useEffect(() => {
    fetchConditionChecks();
  }, [fetchConditionChecks]);

  const getStatusBadge = () => {
    switch (reservation.status) {
      case "PENDING":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full text-sm font-medium flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Menunggu
          </span>
        );
      case "ACTIVE":
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm font-medium flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Aktif
          </span>
        );
      case "COMPLETED":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full text-sm font-medium flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Selesai
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  // Show upload forms
  if (view === "before-upload") {
    return (
      <ConditionCheckUpload
        reservationId={reservation.id}
        itemId={item.id}
        checkType="BEFORE_RENTAL"
        onSuccess={() => {
          fetchConditionChecks();
          setView("main");
          toast.success("Foto kondisi awal berhasil diupload!");
        }}
        onCancel={() => setView("main")}
      />
    );
  }

  if (view === "after-upload") {
    return (
      <ConditionCheckUpload
        reservationId={reservation.id}
        itemId={item.id}
        checkType="AFTER_RENTAL"
        onSuccess={() => {
          fetchConditionChecks();
          setView("main");
          toast.success("Foto kondisi akhir berhasil diupload!");
        }}
        onCancel={() => setView("main")}
      />
    );
  }

  if (view === "review-lender") {
    return (
      <ReviewForm
        reservationId={reservation.id}
        itemId={item.id}
        revieweeId={item.userId}
        revieweeName={lenderName || "Pemilik Barang"}
        reviewType="RENTER_TO_LENDER"
        onSuccess={() => {
          setView("main");
          toast.success("Review berhasil dikirim!");
        }}
        onCancel={() => setView("main")}
      />
    );
  }

  if (view === "review-item") {
    return (
      <ReviewForm
        reservationId={reservation.id}
        itemId={item.id}
        revieweeId={item.userId}
        revieweeName={lenderName || "Pemilik Barang"}
        reviewType="RENTER_TO_ITEM"
        itemTitle={item.title}
        onSuccess={() => {
          setView("main");
          toast.success("Review berhasil dikirim!");
        }}
        onCancel={() => setView("main")}
      />
    );
  }

  // Lender review renter
  if (view === "review-renter" && renterId) {
    return (
      <ReviewForm
        reservationId={reservation.id}
        itemId={item.id}
        revieweeId={renterId}
        revieweeName={renterName || "Penyewa"}
        reviewType="LENDER_TO_RENTER"
        onSuccess={() => {
          setView("main");
          toast.success("Review penyewa berhasil dikirim!");
        }}
        onCancel={() => setView("main")}
      />
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Status Penyewaan
        </h3>
        {getStatusBadge()}
      </div>

      {/* Timeline / Steps */}
      <div className="space-y-4">
        {/* Step 1: Upload Before Photos */}
        <div className={`flex items-start gap-4 p-4 rounded-xl transition-all ${conditionChecks.before?.isApproved
          ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
          : conditionChecks.before
            ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
            : "bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
          }`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${conditionChecks.before?.isApproved
            ? "bg-green-500 text-white"
            : conditionChecks.before
              ? "bg-yellow-500 text-white"
              : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
            }`}>
            {conditionChecks.before?.isApproved ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Camera className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Foto Kondisi Sebelum Sewa
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {conditionChecks.before?.isApproved
                ? "✓ Foto disetujui oleh pemilik"
                : conditionChecks.before
                  ? "Menunggu persetujuan pemilik..."
                  : "Upload foto kondisi barang sebelum digunakan"}
            </p>
            {isRenter && !conditionChecks.before && (
              <button
                onClick={() => setView("before-upload")}
                className="mt-3 px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium
                  hover:bg-rose-600 transition-colors flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Upload Foto
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Step 2: Use Item */}
        <div className={`flex items-start gap-4 p-4 rounded-xl transition-all ${reservation.canStartRental
          ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
          : "bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
          }`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${reservation.canStartRental
            ? "bg-blue-500 text-white"
            : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
            }`}>
            <span className="text-sm font-bold">2</span>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Gunakan Barang
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {reservation.canStartRental
                ? "Anda bisa mulai menggunakan barang"
                : "Menunggu foto kondisi awal disetujui"}
            </p>
          </div>
        </div>

        {/* Step 3: Upload After Photos */}
        <div className={`flex items-start gap-4 p-4 rounded-xl transition-all ${conditionChecks.after?.isApproved
          ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
          : conditionChecks.after
            ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
            : "bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
          }`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${conditionChecks.after?.isApproved
            ? "bg-green-500 text-white"
            : conditionChecks.after
              ? "bg-yellow-500 text-white"
              : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
            }`}>
            {conditionChecks.after?.isApproved ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Camera className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Foto Kondisi Setelah Sewa
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {conditionChecks.after?.isApproved
                ? "✓ Foto disetujui - Penyewaan selesai!"
                : conditionChecks.after
                  ? "Menunggu persetujuan pemilik..."
                  : reservation.canStartRental
                    ? "Upload foto kondisi barang setelah selesai digunakan"
                    : "Selesaikan langkah sebelumnya terlebih dahulu"}
            </p>
            {isRenter && reservation.canStartRental && !conditionChecks.after && (
              <button
                onClick={() => setView("after-upload")}
                className="mt-3 px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium
                  hover:bg-rose-600 transition-colors flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Upload Foto
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Step 4: Leave Review (only after completed) */}
        {reservation.status === "COMPLETED" && isRenter && (
          <div className="flex items-start gap-4 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-purple-500 text-white">
              <Star className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Berikan Review
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Bagikan pengalaman Anda untuk membantu pengguna lain
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setView("review-item")}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium
                    hover:bg-purple-600 transition-colors flex items-center gap-2"
                >
                  <Star className="w-4 h-4" />
                  Review Barang
                </button>
                <button
                  onClick={() => setView("review-lender")}
                  className="px-4 py-2 border border-purple-500 text-purple-600 dark:text-purple-400 rounded-lg text-sm font-medium
                    hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                >
                  Review Pemilik
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lender: Review Renter (after completed) */}
        {reservation.status === "COMPLETED" && isLender && renterId && (
          <div className="flex items-start gap-4 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-purple-500 text-white">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Review Penyewa
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Berikan penilaian terhadap penyewa: {renterName || "Penyewa"}
              </p>
              <button
                onClick={() => setView("review-renter")}
                className="mt-3 px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium
                  hover:bg-purple-600 transition-colors flex items-center gap-2"
              >
                <Star className="w-4 h-4" />
                Review Penyewa
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lender: Pending Approval Section */}
      {isLender && pendingApproval && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            Menunggu Persetujuan Anda
          </h4>
          <ConditionCheckApproval
            conditionCheck={pendingApproval}
            onApproved={() => {
              fetchConditionChecks();
              toast.success("Foto kondisi telah disetujui!");
            }}
            onDisputed={() => {
              fetchConditionChecks();
            }}
          />
        </div>
      )}

      {/* Info Box */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium mb-1">Mengapa perlu upload foto?</p>
            <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400">
              <li>Dokumentasi kondisi barang untuk perlindungan kedua pihak</li>
              <li>Memudahkan klaim jika terjadi kerusakan</li>
              <li>Data untuk AI RenleGuard yang akan mendeteksi kerusakan otomatis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
