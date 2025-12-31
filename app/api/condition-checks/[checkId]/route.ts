import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/services/user";

interface Params {
  params: Promise<{
    checkId: string;
  }>;
}

// GET - Fetch single condition check
export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    const { checkId } = await params;

    const conditionCheck = await db.conditionCheck.findUnique({
      where: { id: checkId },
      include: {
        reservation: {
          include: {
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
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!conditionCheck) {
      return NextResponse.json(
        { error: "Condition check not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(conditionCheck);
  } catch (error) {
    console.error("Error fetching condition check:", error);
    return NextResponse.json(
      { error: "Failed to fetch condition check" },
      { status: 500 }
    );
  }
}

// PATCH - Update condition check (add notes or AI analysis)
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

    const { checkId } = await params;
    const body = await request.json();
    const { notes, aiAnalysis, damageDetected, damageDescription, conditionScore } = body;

    const conditionCheck = await db.conditionCheck.findUnique({
      where: { id: checkId },
      include: {
        reservation: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!conditionCheck) {
      return NextResponse.json(
        { error: "Condition check not found" },
        { status: 404 }
      );
    }

    // Only renter or lender can update
    const isRenter = conditionCheck.reservation.userId === currentUser.id;
    const isLender = conditionCheck.reservation.item.userId === currentUser.id;

    if (!isRenter && !isLender) {
      return NextResponse.json(
        { error: "Only renter or lender can update condition check" },
        { status: 403 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (notes !== undefined && isRenter) {
      updateData.notes = notes;
    }

    // AI analysis can be added by system or lender
    if (aiAnalysis !== undefined) {
      updateData.aiAnalysis = aiAnalysis;
    }
    if (damageDetected !== undefined) {
      updateData.damageDetected = damageDetected;
    }
    if (damageDescription !== undefined) {
      updateData.damageDescription = damageDescription;
    }
    if (conditionScore !== undefined) {
      updateData.conditionScore = conditionScore;
    }

    const updatedCheck = await db.conditionCheck.update({
      where: { id: checkId },
      data: updateData,
    });

    return NextResponse.json(updatedCheck);
  } catch (error) {
    console.error("Error updating condition check:", error);
    return NextResponse.json(
      { error: "Failed to update condition check" },
      { status: 500 }
    );
  }
}

// DELETE - Delete condition check (only before approval)
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

    const { checkId } = await params;

    const conditionCheck = await db.conditionCheck.findUnique({
      where: { id: checkId },
      include: {
        reservation: true,
      },
    });

    if (!conditionCheck) {
      return NextResponse.json(
        { error: "Condition check not found" },
        { status: 404 }
      );
    }

    // Only renter can delete and only if not approved
    if (conditionCheck.uploadedBy !== currentUser.id) {
      return NextResponse.json(
        { error: "Only the uploader can delete this condition check" },
        { status: 403 }
      );
    }

    if (conditionCheck.isApproved) {
      return NextResponse.json(
        { error: "Cannot delete approved condition check" },
        { status: 400 }
      );
    }

    await db.conditionCheck.delete({
      where: { id: checkId },
    });

    // Update reservation tracking
    await db.reservation.update({
      where: { id: conditionCheck.reservationId },
      data: {
        beforeCheckCompleted: conditionCheck.checkType === "BEFORE_RENTAL" 
          ? false 
          : conditionCheck.reservation.beforeCheckCompleted,
        afterCheckCompleted: conditionCheck.checkType === "AFTER_RENTAL" 
          ? false 
          : conditionCheck.reservation.afterCheckCompleted,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting condition check:", error);
    return NextResponse.json(
      { error: "Failed to delete condition check" },
      { status: 500 }
    );
  }
}
