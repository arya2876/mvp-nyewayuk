import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const required = [
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "NEXT_PUBLIC_SERVER_URL",
  ];

  const missing = required.filter((k) => !process.env[k]);

  try {
    // Simple DB check; will throw if DATABASE_URL invalid/unreachable
    await db.user.count();

    return NextResponse.json({
      ok: true,
      env: {
        missing,
        stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY) && Boolean(process.env.STRIPE_WEBHOOK_SECRET),
        edgeStoreConfigured: Boolean(process.env.EDGE_STORE_ACCESS_KEY) && Boolean(process.env.EDGE_STORE_SECRET_KEY),
      },
      db: "connected",
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        message: err?.message || "Unknown error",
        env: { missing },
      },
      { status: 500 }
    );
  }
}
