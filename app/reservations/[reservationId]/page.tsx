import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ArrowLeft, Calendar, MapPin, User, Clock, CheckCircle, XCircle, Star } from "lucide-react";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/services/user";
import EmptyState from "@/components/EmptyState";
import ReservationApprovalActions from "./_components/ReservationApprovalActions";

interface ReservationDetailPageProps {
    params: Promise<{
        reservationId: string;
    }>;
}

export default async function ReservationDetailPage({ params }: ReservationDetailPageProps) {
    const { reservationId } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return <EmptyState title="Unauthorized" subtitle="Please login" />;
    }

    const reservation = await db.reservation.findUnique({
        where: { id: reservationId },
        include: {
            item: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                            email: true,
                        },
                    },
                },
            },
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    email: true,
                    phone: true,
                    createdAt: true,
                },
            },
        },
    });

    if (!reservation) {
        return notFound();
    }

    const isLender = reservation.item.userId === currentUser.id;
    const isRenter = reservation.userId === currentUser.id;

    // Only lender or renter can view this page
    if (!isLender && !isRenter) {
        return <EmptyState title="Tidak Diizinkan" subtitle="Anda tidak memiliki akses ke halaman ini" />;
    }

    // Get renter statistics (for lender view)
    let renterStats = null;
    if (isLender) {
        const [renterReviews, completedRentals] = await Promise.all([
            // Get reviews where this user is the renter (LENDER_TO_RENTER reviews)
            db.review.aggregate({
                where: {
                    revieweeId: reservation.userId,
                    reviewType: "LENDER_TO_RENTER",
                },
                _avg: { rating: true },
                _count: { rating: true },
            }),
            // Get count of completed reservations
            db.reservation.count({
                where: {
                    userId: reservation.userId,
                    status: "COMPLETED",
                },
            }),
        ]);

        renterStats = {
            averageRating: renterReviews._avg.rating || 0,
            totalReviews: renterReviews._count.rating,
            completedRentals,
        };
    }

    const getStatusBadge = () => {
        switch (reservation.status) {
            case "PENDING":
                return (
                    <span className="px-4 py-2 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full text-sm font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Menunggu Konfirmasi
                    </span>
                );
            case "ACTIVE":
                return (
                    <span className="px-4 py-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full text-sm font-medium flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Diterima
                    </span>
                );
            case "CANCELLED":
                return (
                    <span className="px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-full text-sm font-medium flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Ditolak
                    </span>
                );
            case "COMPLETED":
                return (
                    <span className="px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm font-medium flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Selesai
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Back Button */}
                <Link
                    href="/reservations"
                    className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Kembali ke Pemesanan</span>
                </Link>

                {/* Header Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 mb-6">
                    {/* Item Image */}
                    <div className="relative h-48 md:h-64">
                        <Image
                            src={reservation.item.imageSrc}
                            alt={reservation.item.title}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                {reservation.item.title}
                            </h1>
                            <div className="flex items-center gap-4 text-white/90 text-sm">
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {reservation.item.district}, {reservation.item.city}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Reservation Info */}
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Detail Pemesanan
                            </h2>
                            {getStatusBadge()}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Tanggal Mulai</p>
                                <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-rose-500" />
                                    {format(new Date(reservation.startDate), "dd MMM yyyy", { locale: id })}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Tanggal Selesai</p>
                                <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-rose-500" />
                                    {format(new Date(reservation.endDate), "dd MMM yyyy", { locale: id })}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Harga</p>
                                <p className="font-bold text-lg text-rose-500">
                                    Rp {reservation.totalPrice.toLocaleString("id-ID")}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Dibuat</p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {format(new Date(reservation.createdAt), "dd MMM yyyy HH:mm", { locale: id })}
                                </p>
                            </div>
                        </div>

                        {/* Renter Info (for Lender view) */}
                        {isLender && (
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                                    Informasi Penyewa
                                </h3>
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden flex-shrink-0">
                                        {reservation.user.image ? (
                                            <Image
                                                src={reservation.user.image}
                                                alt={reservation.user.name || "Penyewa"}
                                                width={56}
                                                height={56}
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                <User className="w-7 h-7" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 dark:text-white text-lg">
                                            {reservation.user.name || "Penyewa"}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {reservation.user.email}
                                        </p>
                                        {reservation.user.phone && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                📞 {reservation.user.phone}
                                            </p>
                                        )}

                                        {/* Renter Statistics */}
                                        {renterStats && (
                                            <div className="mt-4 grid grid-cols-3 gap-3">
                                                {/* Rating */}
                                                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-100 dark:border-gray-600">
                                                    <div className="flex items-center justify-center gap-1 mb-1">
                                                        <Star className={`w-4 h-4 ${renterStats.averageRating > 0 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                                        <span className="font-bold text-gray-900 dark:text-white">
                                                            {renterStats.averageRating > 0 ? renterStats.averageRating.toFixed(1) : '-'}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Rating ({renterStats.totalReviews})
                                                    </p>
                                                </div>

                                                {/* Completed Rentals */}
                                                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-100 dark:border-gray-600">
                                                    <p className="font-bold text-gray-900 dark:text-white">
                                                        {renterStats.completedRentals}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Rental Selesai
                                                    </p>
                                                </div>

                                                {/* Trust Badge */}
                                                <div className={`rounded-lg p-3 text-center border ${renterStats.averageRating >= 4
                                                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                                        : renterStats.averageRating >= 3
                                                            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                                                            : renterStats.totalReviews === 0
                                                                ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600'
                                                                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                                    }`}>
                                                    <p className={`font-bold text-sm ${renterStats.averageRating >= 4
                                                            ? 'text-green-600 dark:text-green-400'
                                                            : renterStats.averageRating >= 3
                                                                ? 'text-yellow-600 dark:text-yellow-400'
                                                                : renterStats.totalReviews === 0
                                                                    ? 'text-gray-500 dark:text-gray-400'
                                                                    : 'text-red-600 dark:text-red-400'
                                                        }`}>
                                                        {renterStats.averageRating >= 4
                                                            ? '✓ Terpercaya'
                                                            : renterStats.averageRating >= 3
                                                                ? '⚠ Cukup'
                                                                : renterStats.totalReviews === 0
                                                                    ? 'Baru'
                                                                    : '⚠ Perlu Waspada'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        Status
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Approval Actions (for Lender only, when PENDING) */}
                {isLender && reservation.status === "PENDING" && (
                    <ReservationApprovalActions reservationId={reservation.id} />
                )}

                {/* Status Message for Renter */}
                {isRenter && reservation.status === "PENDING" && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-start gap-3">
                            <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                                    Menunggu Konfirmasi Pemilik
                                </h3>
                                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                    Permintaan sewa Anda sedang menunggu persetujuan dari pemilik barang.
                                    Anda akan diberitahu setelah pemilik mengkonfirmasi.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Link to full trip detail if approved */}
                {reservation.status === "ACTIVE" && (
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-green-800 dark:text-green-300 mb-1">
                                        Reservasi Aktif
                                    </h3>
                                    <p className="text-sm text-green-700 dark:text-green-400">
                                        Penyewaan sudah dikonfirmasi. Silakan lanjutkan ke proses RenleGuard.
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={`/trips/${reservation.id}`}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                            >
                                Lihat Detail
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
