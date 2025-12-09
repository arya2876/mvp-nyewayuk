"use client";

import { User } from "next-auth";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera } from "lucide-react";
import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import { useEdgeStore } from "@/lib/edgestore";
import { useToast } from "@/components/ToastProvider";

interface UserDetails {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  phone: string | null;
  address: string | null;
  createdAt: Date;
}

interface EditProfileClientProps {
  user: User;
  userDetails: UserDetails | null;
}

const EditProfileClient: React.FC<EditProfileClientProps> = ({ user, userDetails }) => {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { edgestore } = useEdgeStore();
  const [formData, setFormData] = useState({
    name: userDetails?.name || user.name || "",
    email: userDetails?.email || user.email || "",
    phone: userDetails?.phone || "",
    address: userDetails?.address || "",
    image: userDetails?.image || user.image || "",
  });

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Silakan pilih file gambar", "error");
      return;
    }

    setIsUploadingImage(true);
    try {
      const res = await edgestore.publicFiles.upload({ file });
      setFormData({ ...formData, image: res.url });
      showToast("Foto profil berhasil diunggah", "success");
    } catch (error) {
      console.error("Error uploading image:", error);
      showToast("Gagal mengunggah foto profil", "error");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/user/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast("Profil berhasil diperbarui", "success");
        router.push("/profile");
        router.refresh();
      } else {
        const data = await response.json();
        showToast(data.error || "Gagal memperbarui profil", "error");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast("Terjadi kesalahan saat memperbarui profil", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[80px]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit profile</h1>
        <p className="text-gray-600 mb-8">Edit your contact details</p>

        {/* Profile Photo */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer" onClick={handleImageClick}>
              <Avatar src={formData.image} size="large" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full transition-all flex items-center justify-center">
                {isUploadingImage ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Profile Photo</h3>
              <p className="text-sm text-gray-600">Click on the photo to upload a new picture</p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter your address"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Button
              type="button"
              onClick={() => router.back()}
              outline
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileClient;
