import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/services/user";

interface Params {
  params: Promise<{
    reviewId: string;
  }>;
}

// GET - Fetch single review
export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    const { reviewId } = await params;

    const review = await db.review.findUnique({
      where: { id: reviewId },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        reviewee: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        item: {
          select: {
            id: true,
            title: true,
            imageSrc: true,
            category: true,
          },
        },
      },
    });

    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json(
      { error: "Failed to fetch review" },
      { status: 500 }
    );
  }
}

// PATCH - Update review (add response or mark as helpful)
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

    const { reviewId } = await params;
    const body = await request.json();
    const { response, markHelpful, reportSpam } = body;

    const review = await db.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    // Handle response from reviewee
    if (response !== undefined) {
      if (review.revieweeId !== currentUser.id) {
        return NextResponse.json(
          { error: "Only the reviewee can respond to this review" },
          { status: 403 }
        );
      }

      const updatedReview = await db.review.update({
        where: { id: reviewId },
        data: {
          response,
          responseDate: new Date(),
        },
      });

      return NextResponse.json(updatedReview);
    }

    // Handle mark as helpful
    if (markHelpful) {
      const updatedReview = await db.review.update({
        where: { id: reviewId },
        data: {
          helpfulCount: {
            increment: 1,
          },
        },
      });

      return NextResponse.json(updatedReview);
    }

    // Handle report
    if (reportSpam) {
      const updatedReview = await db.review.update({
        where: { id: reviewId },
        data: {
          reportCount: {
            increment: 1,
          },
        },
      });

      return NextResponse.json(updatedReview);
    }

    return NextResponse.json(
      { error: "No valid update action provided" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

// DELETE - Delete review (only by reviewer or admin)
export async function DELETE(
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

    const { reviewId } = await params;

    const review = await db.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    // Only reviewer can delete their review
    if (review.reviewerId !== currentUser.id) {
      return NextResponse.json(
        { error: "You can only delete your own reviews" },
        { status: 403 }
      );
    }

    await db.review.delete({
      where: { id: reviewId },
    });

    // Update cached ratings - only if itemId exists
    if (review.reviewType === "RENTER_TO_ITEM" && review.itemId) {
      const itemReviews = await db.review.aggregate({
        where: {
          itemId: review.itemId,
          reviewType: "RENTER_TO_ITEM",
        },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await db.item.update({
        where: { id: review.itemId },
        data: {
          averageRating: itemReviews._avg.rating || 0,
          totalReviews: itemReviews._count.rating,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
