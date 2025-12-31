import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/services/user";

// POST - Create platform review
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
        const { rating, comment } = body;

        // Validation
        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: "Rating harus antara 1-5" },
                { status: 400 }
            );
        }

        if (!comment || comment.length < 10) {
            return NextResponse.json(
                { error: "Komentar minimal 10 karakter" },
                { status: 400 }
            );
        }

        // Check if user already submitted platform review
        const existingReview = await db.review.findFirst({
            where: {
                reviewerId: currentUser.id,
                reviewType: "PLATFORM_REVIEW",
            },
        });

        if (existingReview) {
            return NextResponse.json(
                { error: "Anda sudah memberikan review platform" },
                { status: 400 }
            );
        }

        // Create platform review
        // Note: Platform reviews don't need itemId or reservationId
        const review = await db.review.create({
            data: {
                rating,
                comment,
                reviewType: "PLATFORM_REVIEW",
                reviewerId: currentUser.id,
                revieweeId: currentUser.id, // Self-reference for platform reviews
                isFeatured: rating >= 4, // Auto-feature high ratings
            },
            include: {
                reviewer: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });

        return NextResponse.json(review, { status: 201 });
    } catch (error) {
        console.error("Error creating platform review:", error);
        return NextResponse.json(
            { error: "Gagal membuat review" },
            { status: 500 }
        );
    }
}
