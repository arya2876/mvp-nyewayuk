import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/services/user";
import { isAdminEmail } from "@/utils/admin";
// GET - Fetch all reviews for admin
export async function GET(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.email || !isAdminEmail(currentUser.email)) {
            return NextResponse.json(
                { error: "Unauthorized - Admin access required" },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const reviewType = searchParams.get("reviewType");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        const where: Record<string, unknown> = {};
        if (reviewType) where.reviewType = reviewType;

        const reviews = await db.review.findMany({
            where,
            include: {
                reviewer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
                item: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        });

        const total = await db.review.count({ where });

        return NextResponse.json({
            reviews,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error("Error fetching reviews for admin:", error);
        return NextResponse.json(
            { error: "Failed to fetch reviews" },
            { status: 500 }
        );
    }
}

// DELETE - Delete a review
export async function DELETE(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.email || !isAdminEmail(currentUser.email)) {
            return NextResponse.json(
                { error: "Unauthorized - Admin access required" },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const reviewId = searchParams.get("id");

        if (!reviewId) {
            return NextResponse.json(
                { error: "Review ID required" },
                { status: 400 }
            );
        }

        await db.review.delete({
            where: { id: reviewId },
        });

        return NextResponse.json({ success: true, message: "Review deleted" });
    } catch (error) {
        console.error("Error deleting review:", error);
        return NextResponse.json(
            { error: "Failed to delete review" },
            { status: 500 }
        );
    }
}

// PATCH - Update review (toggle featured, verify, etc)
export async function PATCH(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.email || !isAdminEmail(currentUser.email)) {
            return NextResponse.json(
                { error: "Unauthorized - Admin access required" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { reviewId, isFeatured, isVerified } = body;

        if (!reviewId) {
            return NextResponse.json(
                { error: "Review ID required" },
                { status: 400 }
            );
        }

        const updateData: Record<string, boolean> = {};
        if (typeof isFeatured === "boolean") updateData.isFeatured = isFeatured;
        if (typeof isVerified === "boolean") updateData.isVerified = isVerified;

        const review = await db.review.update({
            where: { id: reviewId },
            data: updateData,
        });

        return NextResponse.json({ success: true, review });
    } catch (error) {
        console.error("Error updating review:", error);
        return NextResponse.json(
            { error: "Failed to update review" },
            { status: 500 }
        );
    }
}
