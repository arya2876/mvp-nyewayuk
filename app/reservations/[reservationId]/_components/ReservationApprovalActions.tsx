"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface ReservationApprovalActionsProps {
    reservationId: string;
}

export default function ReservationApprovalActions({ reservationId }: ReservationApprovalActionsProps) {
    const router = useRouter();
    const [loading, setLoading] = useState<"accept" | "reject" | null>(null);

    const handleAction = async (action: "accept" | "reject") => {
        setLoading(action);

        try {
            const status = action === "accept" ? "ACTIVE" : "CANCELLED";
            const response = await fetch(`/api/reservations/${reservationId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Gagal memproses");
            }

            const data = await response.json();
            toast.success(data.message);
            router.refresh();
        } catch (error) {
            console.error("Action error:", error);
            toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Konfirmasi Pemesanan
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                Apakah Anda ingin menerima atau menolak permintaan sewa ini?
            </p>

            <div className="flex gap-4">
                <button
                    onClick={() => handleAction("reject")}
                    disabled={loading !== null}
                    className="flex-1 px-6 py-3 border border-red-300 dark:border-red-700 
            text-red-600 dark:text-red-400 rounded-xl font-medium
            hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2"
                >
                    {loading === "reject" ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Memproses...
                        </>
                    ) : (
                        <>
                            <X className="w-5 h-5" />
                            Tolak
                        </>
                    )}
                </button>
                <button
                    onClick={() => handleAction("accept")}
                    disabled={loading !== null}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 
            text-white rounded-xl font-medium shadow-lg shadow-green-500/25
            hover:from-green-600 hover:to-emerald-600 transition-all
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2"
                >
                    {loading === "accept" ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Memproses...
                        </>
                    ) : (
                        <>
                            <Check className="w-5 h-5" />
                            Terima Pesanan
                        </>
                    )}
                </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                Setelah diterima, penyewa akan bisa memulai proses RenleGuard (foto kondisi barang)
            </p>
        </div>
    );
}
