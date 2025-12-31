import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ArrowLeft, Calendar, MapPin, User } from "lucide-react";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/services/user";
import EmptyState from "@/components/EmptyState";
import ReservationActions from "@/components/ReservationActions";

// Type for reservation with new fields
type ReservationWithDetails = {
  id: string;
  userId: string;
  itemId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  createdAt: Date;
  status: string;
  beforeCheckCompleted: boolean;
  afterCheckCompleted: boolean;
  canStartRental: boolean;
  canCompleteRental: boolean;
  item: {
    id: string;
    title: string;
    imageSrc: string;
    userId: string | null;
    district: string | null;
    city: string | null;
    user: {
      id: string;
      name: string | null;
      image: string | null;
      email: string | null;
    } | null;
  };
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

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

  const reservationRaw = await db.reservation.findUnique({
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
        },
      },
    },
  });

  if (!reservationRaw) {
    return notFound();
  }

  // Cast to proper type with new fields
  const reservation = reservationRaw as unknown as ReservationWithDetails;

  const isRenter = reservation.userId === currentUser.id;
  const isLender = reservation.item.userId === currentUser.id;

  // Only renter or lender can view this page
  if (!isRenter && !isLender) {
    return <EmptyState title="Tidak Diizinkan" subtitle="Anda tidak memiliki akses ke halaman ini" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href={isRenter ? "/trips" : "/reservations"}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isRenter ? "Pemilik Barang" : "Penyewa"}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {isRenter ? reservation.item.user?.name : reservation.user.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reservation Actions - Before/After Photos, Reviews */}
        <ReservationActions
          reservation={{
            id: reservation.id,
            startDate: reservation.startDate.toISOString(),
            endDate: reservation.endDate.toISOString(),
            status: reservation.status,
            beforeCheckCompleted: reservation.beforeCheckCompleted,
            afterCheckCompleted: reservation.afterCheckCompleted,
            canStartRental: reservation.canStartRental,
            canCompleteRental: reservation.canCompleteRental,
          }}
          item={{
            id: reservation.item.id,
            title: reservation.item.title,
            userId: reservation.item.userId || "",
          }}
          currentUserId={currentUser.id}
          isRenter={isRenter}
          isLender={isLender}
          lenderName={reservation.item.user?.name || undefined}
          renterName={reservation.user.name || undefined}
          renterId={reservation.user.id}
        />
      </div>
    </div>
  );
}
