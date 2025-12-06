"use client";

import { User } from "next-auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { signOut } from "next-auth/react";
import Button from "@/components/Button";

interface DeleteAccountClientProps {
  user: User;
}

const DeleteAccountClient: React.FC<DeleteAccountClientProps> = ({ user }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = async () => {
    if (confirmText !== "DELETE") {
      alert("Please type DELETE to confirm");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        await signOut({ callbackUrl: "/" });
      } else {
        alert("Failed to delete account. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[80px]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">Delete Account</h1>
        <p className="text-gray-600 mb-8">
          Permanently delete your NyewaYuk account
        </p>

        {/* Warning Box */}
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-red-900 mb-2">
                This action cannot be undone
              </h3>
              <ul className="space-y-2 text-red-800 text-sm">
                <li>• Your profile will be permanently deleted</li>
                <li>• All your listings will be removed</li>
                <li>• Your booking history will be lost</li>
                <li>• You won&apos;t be able to recover your account</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Confirmation Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Confirm Account Deletion
          </h3>
          
          <p className="text-gray-600 mb-4">
            Type <span className="font-mono font-bold">DELETE</span> to confirm:
          </p>

          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-6"
          />

          <div className="flex gap-4">
            <Button
              type="button"
              onClick={() => router.back()}
              outline
            >
              Cancel
            </Button>
            <button
              onClick={handleDelete}
              disabled={isLoading || confirmText !== "DELETE"}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Deleting..." : "Delete My Account"}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Need help? Contact our support team before deleting your account.
        </p>
      </div>
    </div>
  );
};

export default DeleteAccountClient;
