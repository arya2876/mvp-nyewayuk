import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/services/user";
import { notifyReviewReceived } from "@/services/notification";

// GET - Fetch reviews
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");
    const userId = searchParams.get("userId");
    const featured = searchParams.get("featured");
    const reviewType = searchParams.get("reviewType");
    const received = searchParams.get("received"); // Get reviews received by current user
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");

    const where: Record<string, unknown> = {};

    // If received=true, get reviews where current user is the reviewee
    if (received === "true") {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
      where.revieweeId = currentUser.id;
    }

    if (itemId) where.itemId = itemId;
    if (userId) where.revieweeId = userId;
    if (featured === "true") where.isFeatured = true;
    if (reviewType) where.reviewType = reviewType;

    const reviews = await db.review.findMany({
      where,
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
      orderBy: {
        createdAt: "desc",
      },
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
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST - Create a new review
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      rating,
      comment,
      reviewType,
      revieweeId,
      itemId,
      reservationId,
    } = body;

    // Validation
    if (!rating || !comment || !reviewType || !revieweeId || !itemId || !reservationId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Validate review type
    const validTypes = ["LENDER_TO_RENTER", "RENTER_TO_LENDER", "RENTER_TO_ITEM"];
    if (!validTypes.includes(reviewType)) {
      return NextResponse.json(
        { error: "Invalid review type" },
        { status: 400 }
      );
    }

    // Verify reservation exists and user is part of it
    const reservation = await db.reservation.findUnique({
      where: { id: reservationId },
      include: {
        item: {
          select: { userId: true },
        },
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    // Check if user is authorized to leave this type of review
    const isLender = reservation.item.userId === currentUser.id;
    const isRenter = reservation.userId === currentUser.id;

    if (reviewType === "LENDER_TO_RENTER" && !isLender) {
      return NextResponse.json(
        { error: "Only lender can review renter" },
        { status: 403 }
      );
    }

    if ((reviewType === "RENTER_TO_LENDER" || reviewType === "RENTER_TO_ITEM") && !isRenter) {
      return NextResponse.json(
        { error: "Only renter can leave this review type" },
        { status: 403 }
      );
    }

    // Check if review already exists for this type and reservation
    const existingReview = await db.review.findFirst({
      where: {
        reviewerId: currentUser.id,
        reservationId,
        reviewType,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already submitted this type of review for this reservation" },
        { status: 400 }
      );
    }

    // Create the review
    const review = await db.review.create({
      data: {
        rating,
        comment,
        reviewType,
        reviewerId: currentUser.id,
        revieweeId,
        itemId,
        reservationId,
      },
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
      },
    });

    // Update cached ratings
    if (reviewType === "LENDER_TO_RENTER") {
      // Update renter's average rating
      const renterReviews = await db.review.aggregate({
        where: {
          revieweeId,
          reviewType: "LENDER_TO_RENTER",
        },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await db.user.update({
        where: { id: revieweeId },
        data: {
          averageRatingAsRenter: renterReviews._avg.rating || 0,
          totalReviewsAsRenter: renterReviews._count.rating,
        },
      });
    } else if (reviewType === "RENTER_TO_LENDER") {
      // Update lender's average rating
      const lenderReviews = await db.review.aggregate({
        where: {
          revieweeId,
          reviewType: "RENTER_TO_LENDER",
        },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await db.user.update({
        where: { id: revieweeId },
        data: {
          averageRatingAsLender: lenderReviews._avg.rating || 0,
          totalReviewsAsLender: lenderReviews._count.rating,
        },
      });
    } else if (reviewType === "RENTER_TO_ITEM") {
      // Update item's average rating
      const itemReviews = await db.review.aggregate({
        where: {
          itemId,
          reviewType: "RENTER_TO_ITEM",
        },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await db.item.update({
        where: { id: itemId },
        data: {
          averageRating: itemReviews._avg.rating || 0,
          totalReviews: itemReviews._count.rating,
        },
      });
    }

    // Send notification to reviewee
    const item = await db.item.findUnique({
      where: { id: itemId },
      select: { title: true },
    });

    await notifyReviewReceived(
      revieweeId,
      currentUser.name || "Pengguna",
      rating,
      item?.title
    );

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
