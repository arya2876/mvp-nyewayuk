import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ArrowLeft, Ticket } from "lucide-react";
import Link from "next/link";

import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Vouchers",
  description: "Your vouchers and account balance",
};

export default async function VouchersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[80px]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/profile"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Profile</span>
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">Vouchers</h1>
        <p className="text-gray-600 mb-8">Vouchers and account balance</p>

        {/* Account Balance */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white mb-6">
          <p className="text-sm opacity-90 mb-2">Account Balance</p>
          <p className="text-4xl font-bold">Rp 0</p>
        </div>

        {/* Vouchers List */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Vouchers</h2>
          
          <div className="flex flex-col items-center justify-center py-12">
            <Ticket className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-center">
              You don&apos;t have any vouchers yet
            </p>
            <p className="text-sm text-gray-400 text-center mt-2">
              Check back later for exclusive offers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
