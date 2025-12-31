import { db } from "@/lib/db";

type NotificationType =
    | "NEW_RESERVATION"
    | "RESERVATION_ACCEPTED"
    | "RESERVATION_REJECTED"
    | "REVIEW_RECEIVED"
    | "CONDITION_APPROVED"
    | "CONDITION_PENDING";

interface CreateNotificationParams {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    linkUrl?: string;
    reservationId?: string;
    itemId?: string;
}

export async function createNotification({
    userId,
    type,
    title,
    message,
    linkUrl,
    reservationId,
    itemId,
}: CreateNotificationParams) {
    try {
        const notification = await db.notification.create({
            data: {
                userId,
                type,
                title,
                message,
                linkUrl,
                reservationId,
                itemId,
            },
        });
        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
        // Don't throw - notification creation should not block main flow
        return null;
    }
}

// Helper functions for common notification types
export async function notifyNewReservation(
    lenderId: string,
    renterName: string,
    itemTitle: string,
    reservationId: string,
    itemId: string
) {
    return createNotification({
        userId: lenderId,
        type: "NEW_RESERVATION",
        title: "Pesanan Baru! 🎉",
        message: `${renterName} ingin menyewa "${itemTitle}"`,
        linkUrl: `/reservations/${reservationId}`,
        reservationId,
        itemId,
    });
}

export async function notifyReservationAccepted(
    renterId: string,
    lenderName: string,
    itemTitle: string,
    reservationId: string,
    itemId: string
) {
    return createNotification({
        userId: renterId,
        type: "RESERVATION_ACCEPTED",
        title: "Pesanan Diterima! ✅",
        message: `${lenderName} menerima pesanan "${itemTitle}". Silakan lanjut ke RenleGuard.`,
        linkUrl: `/trips/${reservationId}`,
        reservationId,
        itemId,
    });
}

export async function notifyReservationRejected(
    renterId: string,
    lenderName: string,
    itemTitle: string,
    reservationId: string,
    itemId: string
) {
    return createNotification({
        userId: renterId,
        type: "RESERVATION_REJECTED",
        title: "Pesanan Ditolak",
        message: `Maaf, ${lenderName} menolak pesanan "${itemTitle}"`,
        linkUrl: `/trips/${reservationId}`,
        reservationId,
        itemId,
    });
}

export async function notifyConditionPending(
    lenderId: string,
    renterName: string,
    itemTitle: string,
    reservationId: string,
    itemId: string
) {
    return createNotification({
        userId: lenderId,
        type: "CONDITION_PENDING",
        title: "Foto Kondisi Menunggu Persetujuan 📷",
        message: `${renterName} telah mengunggah foto kondisi "${itemTitle}"`,
        linkUrl: `/reservations/${reservationId}`,
        reservationId,
        itemId,
    });
}

export async function notifyConditionApproved(
    renterId: string,
    lenderName: string,
    itemTitle: string,
    reservationId: string,
    itemId: string
) {
    return createNotification({
        userId: renterId,
        type: "CONDITION_APPROVED",
        title: "Foto Kondisi Disetujui ✅",
        message: `${lenderName} menyetujui foto kondisi "${itemTitle}"`,
        linkUrl: `/trips/${reservationId}`,
        reservationId,
        itemId,
    });
}

export async function notifyReviewReceived(
    userId: string,
    reviewerName: string,
    rating: number,
    itemTitle?: string
) {
    return createNotification({
        userId,
        type: "REVIEW_RECEIVED",
        title: "Review Baru ⭐",
        message: `${reviewerName} memberi Anda rating ${rating} bintang${itemTitle ? ` untuk "${itemTitle}"` : ""}`,
        linkUrl: `/profile`,
    });
}
