import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: "Kode OTP diperlukan" },
        { status: 400 }
      );
    }

    // Get user with OTP data
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: {
        phoneVerifyCode: true,
        phoneVerifyExp: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if OTP is expired
    if (!user.phoneVerifyExp || new Date() > user.phoneVerifyExp) {
      return NextResponse.json(
        { error: "Kode OTP sudah kadaluarsa. Silakan minta kode baru." },
        { status: 400 }
      );
    }

    // Check if OTP matches
    if (user.phoneVerifyCode !== code) {
      return NextResponse.json(
        { error: "Kode OTP tidak valid" },
        { status: 400 }
      );
    }

    // Verify phone
    await db.user.update({
      where: { email: session.user.email },
      data: {
        phoneVerified: true,
        phoneVerifyCode: null,
        phoneVerifyExp: null,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Nomor HP berhasil diverifikasi!" 
    });
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "Gagal verifikasi OTP", details: error.message },
      { status: 500 }
    );
  }
}
