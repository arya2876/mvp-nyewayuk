import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/services/user";
import { notifyConditionApproved } from "@/services/notification";

interface Params {
  params: Promise<{
    checkId: string;
  }>;
}

// POST - Approve condition check (Lender approves renter's photos)
export async function POST(
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

    // Find the condition check
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

    // Verify current user is the lender (item owner)
    if (conditionCheck.reservation.item.userId !== currentUser.id) {
      return NextResponse.json(
        { error: "Only the lender can approve condition photos" },
        { status: 403 }
      );
    }

    // Check if already approved
    if (conditionCheck.isApproved) {
      return NextResponse.json(
        { error: "Condition check is already approved" },
        { status: 400 }
      );
    }

    // Approve the condition check
    const updatedCheck = await db.conditionCheck.update({
      where: { id: checkId },
      data: {
        isApproved: true,
        approvedAt: new Date(),
        approvedBy: currentUser.id,
      },
    });

    // Update reservation status based on check type
    const updateData: Record<string, boolean | string> = {};

    if (conditionCheck.checkType === "BEFORE_RENTAL") {
      updateData.canStartRental = true;
      updateData.status = "ACTIVE";
    } else if (conditionCheck.checkType === "AFTER_RENTAL") {
      updateData.canCompleteRental = true;
      updateData.status = "COMPLETED";
    }

    await db.reservation.update({
      where: { id: conditionCheck.reservationId },
      data: updateData,
    });

    // Send notification to renter
    await notifyConditionApproved(
      conditionCheck.reservation.userId,
      currentUser.name || "Pemilik",
      conditionCheck.reservation.item.title,
      conditionCheck.reservationId,
      conditionCheck.itemId
    );

    return NextResponse.json({
      success: true,
      conditionCheck: updatedCheck,
      message: conditionCheck.checkType === "BEFORE_RENTAL"
        ? "Rental can now begin"
        : "Rental completed successfully",
    });
  } catch (error) {
    console.error("Error approving condition check:", error);
    return NextResponse.json(
      { error: "Failed to approve condition check" },
      { status: 500 }
    );
  }
}
