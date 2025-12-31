import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/services/user";
import { notifyReservationAccepted, notifyReservationRejected } from "@/services/notification";

interface Params {
    params: Promise<{
        reservationId: string;
    }>;
}

// PATCH - Update reservation status (Lender accepts/rejects)
export async function PATCH(
    request: Request,
    { params }: Params
) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { reservationId } = await params;
        const body = await request.json();
        const { status } = body;

        // Validate status
        const validStatuses = ["ACTIVE", "CANCELLED"];
        if (!status || !validStatuses.includes(status)) {
            return NextResponse.json(
                { error: "Invalid status. Must be ACTIVE or CANCELLED" },
                { status: 400 }
            );
        }

        // Find the reservation
        const reservation = await db.reservation.findUnique({
            where: { id: reservationId },
            include: {
                item: {
                    select: { id: true, userId: true, title: true },
                },
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        if (!reservation) {
            return NextResponse.json(
                { error: "Reservation not found" },
                { status: 404 }
            );
        }

        // Verify current user is the lender (item owner)
        if (reservation.item.userId !== currentUser.id) {
            return NextResponse.json(
                { error: "Only the item owner can update reservation status" },
                { status: 403 }
            );
        }

        // Check if reservation is still pending
        if (reservation.status !== "PENDING") {
            return NextResponse.json(
                { error: `Reservation is already ${reservation.status}` },
                { status: 400 }
            );
        }

        // Update the reservation status
        const updatedReservation = await db.reservation.update({
            where: { id: reservationId },
            data: { status },
        });

        // Send notification to renter
        if (status === "ACTIVE") {
            await notifyReservationAccepted(
                reservation.userId,
                currentUser.name || "Pemilik",
                reservation.item.title,
                reservationId,
                reservation.item.id
            );
        } else {
            await notifyReservationRejected(
                reservation.userId,
                currentUser.name || "Pemilik",
                reservation.item.title,
                reservationId,
                reservation.item.id
            );
        }

        // Return success message
        const message = status === "ACTIVE"
            ? "Reservasi diterima! Penyewa akan diberitahu."
            : "Reservasi ditolak.";

        return NextResponse.json({
            success: true,
            reservation: updatedReservation,
            message,
        });
    } catch (error) {
        console.error("Error updating reservation status:", error);
        return NextResponse.json(
            { error: "Failed to update reservation status" },
            { status: 500 }
        );
    }
}
