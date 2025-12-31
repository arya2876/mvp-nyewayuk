import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/services/user";
import { notifyConditionPending } from "@/services/notification";

// GET - Fetch condition checks
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reservationId = searchParams.get("reservationId");
    const itemId = searchParams.get("itemId");
    const checkType = searchParams.get("checkType");

    const where: Record<string, unknown> = {};

    if (reservationId) where.reservationId = reservationId;
    if (itemId) where.itemId = itemId;
    if (checkType) where.checkType = checkType;

    const conditionChecks = await db.conditionCheck.findMany({
      where,
      include: {
        reservation: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        item: {
          select: {
            id: true,
            title: true,
            imageSrc: true,
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(conditionChecks);
  } catch (error) {
    console.error("Error fetching condition checks:", error);
    return NextResponse.json(
      { error: "Failed to fetch condition checks" },
      { status: 500 }
    );
  }
}

// POST - Create condition check (upload before/after photos)
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
      photos,
      checkType,
      reservationId,
      itemId,
      notes,
    } = body;

    // Validation
    if (!photos || !Array.isArray(photos) || photos.length === 0) {
      return NextResponse.json(
        { error: "At least one photo is required" },
        { status: 400 }
      );
    }

    if (!checkType || !["BEFORE_RENTAL", "AFTER_RENTAL"].includes(checkType)) {
      return NextResponse.json(
        { error: "Invalid check type. Must be BEFORE_RENTAL or AFTER_RENTAL" },
        { status: 400 }
      );
    }

    if (!reservationId || !itemId) {
      return NextResponse.json(
        { error: "Reservation ID and Item ID are required" },
        { status: 400 }
      );
    }

    // Verify reservation exists
    const reservation = await db.reservation.findUnique({
      where: { id: reservationId },
      include: {
        item: true,
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    // Check if user is the renter
    if (reservation.userId !== currentUser.id) {
      return NextResponse.json(
        { error: "Only the renter can upload condition photos" },
        { status: 403 }
      );
    }

    // Check if check type already exists for this reservation
    const existingCheck = await db.conditionCheck.findFirst({
      where: {
        reservationId,
        checkType,
      },
    });

    if (existingCheck) {
      return NextResponse.json(
        { error: `${checkType === "BEFORE_RENTAL" ? "Before" : "After"} rental photos already uploaded` },
        { status: 400 }
      );
    }

    // Validate workflow: BEFORE must be done before AFTER
    if (checkType === "AFTER_RENTAL") {
      const beforeCheck = await db.conditionCheck.findFirst({
        where: {
          reservationId,
          checkType: "BEFORE_RENTAL",
          isApproved: true,
        },
      });

      if (!beforeCheck) {
        return NextResponse.json(
          { error: "Before rental photos must be uploaded and approved first" },
          { status: 400 }
        );
      }
    }

    // Create condition check
    const conditionCheck = await db.conditionCheck.create({
      data: {
        photos,
        checkType,
        reservationId,
        itemId,
        uploadedBy: currentUser.id,
        notes,
      },
      include: {
        reservation: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
          },
        },
        item: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Update reservation tracking
    await db.reservation.update({
      where: { id: reservationId },
      data: {
        beforeCheckCompleted: checkType === "BEFORE_RENTAL" ? true : reservation.beforeCheckCompleted,
        afterCheckCompleted: checkType === "AFTER_RENTAL" ? true : reservation.afterCheckCompleted,
      },
    });

    // Send notification to lender
    if (reservation.item.userId) {
      await notifyConditionPending(
        reservation.item.userId,
        currentUser.name || "Penyewa",
        reservation.item.title,
        reservationId,
        itemId
      );
    }

    return NextResponse.json(conditionCheck, { status: 201 });
  } catch (error) {
    console.error("Error creating condition check:", error);
    return NextResponse.json(
      { error: "Failed to create condition check" },
      { status: 500 }
    );
  }
}
