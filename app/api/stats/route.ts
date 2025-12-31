import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch real platform stats
export async function GET() {
  try {
    // Count total users (renters)
    const totalUsers = await db.user.count();

    // Count total items
    const totalItems = await db.item.count();

    // Count completed reservations
    const completedReservations = await db.reservation.count({
      where: {
        status: "COMPLETED",
      },
    });

    // Count total reservations
    const totalReservations = await db.reservation.count();

    // Calculate success rate
    const successRate = totalReservations > 0 
      ? Math.round((completedReservations / totalReservations) * 100) 
      : 100;

    // Calculate average rating from all reviews
    const ratingStats = await db.review.aggregate({
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    const averageRating = ratingStats._avg.rating 
      ? Number(ratingStats._avg.rating.toFixed(1)) 
      : 0;

    // Count total reviews
    const totalReviews = ratingStats._count.rating || 0;

    return NextResponse.json({
      totalUsers,
      totalItems,
      totalReservations,
      completedReservations,
      successRate,
      averageRating,
      totalReviews,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
