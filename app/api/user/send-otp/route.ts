import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// Generate 6-digit OTP code
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via WhatsApp (placeholder - integrate with actual WhatsApp API)
const sendOTPViaWhatsApp = async (phone: string, code: string) => {
  // TODO: Integrate with WhatsApp Business API or service like Twilio/Fonnte
  // For now, we'll just log it (in production, replace with actual API call)
  console.log(`📱 OTP Code for ${phone}: ${code}`);
  
  // In production, you would call something like:
  // await fetch('https://api.fonnte.com/send', {
  //   method: 'POST',
  //   headers: { 'Authorization': process.env.FONNTE_API_KEY },
  //   body: JSON.stringify({ target: phone, message: `Kode OTP NyewaYuk Anda: ${code}` })
  // });
  
  return true;
};

// Request OTP
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
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { error: "Nomor HP diperlukan" },
        { status: 400 }
      );
    }

    // Format phone number (ensure it starts with 62)
    let formattedPhone = phone.replace(/\D/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('62')) {
      formattedPhone = '62' + formattedPhone;
    }

    // Generate OTP and expiry (5 minutes)
    const otpCode = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    // Save to database
    await db.user.update({
      where: { email: session.user.email },
      data: {
        phone: formattedPhone,
        phoneVerifyCode: otpCode,
        phoneVerifyExp: otpExpiry,
        phoneVerified: false,
      },
    });

    // Send OTP
    await sendOTPViaWhatsApp(formattedPhone, otpCode);

    return NextResponse.json({ 
      success: true, 
      message: "Kode OTP telah dikirim ke WhatsApp Anda",
      // Only show this in development
      ...(process.env.NODE_ENV === 'development' && { debugCode: otpCode })
    });
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { error: "Gagal mengirim OTP", details: error.message },
      { status: 500 }
    );
  }
}
