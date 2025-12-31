import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/services/user";
import { revalidatePath } from "next/cache";
import { notifyNewReservation } from "@/services/notification";

// POST - Create a new reservation
export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json(
                { error: "Silakan login terlebih dahulu" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { listingId, startDate, endDate, totalPrice } = body;

        // Validation
        if (!listingId || !startDate || !endDate || !totalPrice) {
            return NextResponse.json(
                { error: "Data tidak lengkap" },
                { status: 400 }
            );
        }

        // Check if listing exists
        const listing = await db.item.findUnique({
            where: { id: listingId },
            select: { id: true, userId: true, title: true },
        });

        if (!listing) {
            return NextResponse.json(
                { error: "Barang tidak ditemukan" },
                { status: 404 }
            );
        }

        // Prevent renting own item
        if (listing.userId === currentUser.id) {
            return NextResponse.json(
                { error: "Tidak bisa menyewa barang sendiri" },
                { status: 400 }
            );
        }

        // Check for conflicting reservations (overlapping dates)
        const existingReservation = await db.reservation.findFirst({
            where: {
                itemId: listingId,
                status: { in: ["PENDING", "ACTIVE"] },
                OR: [
                    {
                        AND: [
                            { startDate: { lte: new Date(startDate) } },
                            { endDate: { gte: new Date(startDate) } },
                        ],
                    },
                    {
                        AND: [
                            { startDate: { lte: new Date(endDate) } },
                            { endDate: { gte: new Date(endDate) } },
                        ],
                    },
                    {
                        AND: [
                            { startDate: { gte: new Date(startDate) } },
                            { endDate: { lte: new Date(endDate) } },
                        ],
                    },
                ],
            },
        });

        if (existingReservation) {
            return NextResponse.json(
                { error: "Tanggal sudah dipesan oleh orang lain" },
                { status: 400 }
            );
        }

        // Create reservation with PENDING status
        const reservation = await db.reservation.create({
            data: {
                userId: currentUser.id,
                itemId: listingId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                totalPrice,
                status: "PENDING",
            },
        });

        // Send notification to lender
        if (listing.userId) {
            await notifyNewReservation(
                listing.userId,
                currentUser.name || "Penyewa",
                listing.title,
                reservation.id,
                listingId
            );
        }

        // Trigger n8n webhook if configured
        const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
        if (N8N_WEBHOOK_URL) {
            try {
                await fetch(N8N_WEBHOOK_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        type: "NEW_RESERVATION",
                        reservationId: reservation.id,
                        itemId: listingId,
                        itemTitle: listing.title,
                        renterId: currentUser.id,
                        renterName: currentUser.name,
                        startDate,
                        endDate,
                        totalPrice,
                    }),
                });
            } catch (webhookError) {
                console.error("Webhook error:", webhookError);
                // Don't fail the request if webhook fails
            }
        }

        revalidatePath(`/listings/${listingId}`);
        revalidatePath("/reservations");
        revalidatePath("/trips");

        return NextResponse.json({
            success: true,
            reservation,
            message: "Reservasi berhasil dibuat. Menunggu konfirmasi pemilik.",
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating reservation:", error);
        return NextResponse.json(
            { error: "Gagal membuat reservasi" },
            { status: 500 }
        );
    }
}
