import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/services/user";

// GET - Fetch user notifications
export async function GET(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "20");
        const unreadOnly = searchParams.get("unreadOnly") === "true";

        const where: any = {
            userId: currentUser.id,
        };

        if (unreadOnly) {
            where.isRead = false;
        }

        const notifications = await db.notification.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: limit,
        });

        // Get unread count
        const unreadCount = await db.notification.count({
            where: {
                userId: currentUser.id,
                isRead: false,
            },
        });

        return NextResponse.json({
            notifications,
            unreadCount,
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { error: "Failed to fetch notifications" },
            { status: 500 }
        );
    }
}

// POST - Mark notifications as read
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
        const { notificationIds, markAll } = body;

        if (markAll) {
            // Mark all as read
            await db.notification.updateMany({
                where: {
                    userId: currentUser.id,
                    isRead: false,
                },
                data: {
                    isRead: true,
                    readAt: new Date(),
                },
            });
        } else if (notificationIds && notificationIds.length > 0) {
            // Mark specific notifications as read
            await db.notification.updateMany({
                where: {
                    id: { in: notificationIds },
                    userId: currentUser.id,
                },
                data: {
                    isRead: true,
                    readAt: new Date(),
                },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error marking notifications as read:", error);
        return NextResponse.json(
            { error: "Failed to update notifications" },
            { status: 500 }
        );
    }
}
