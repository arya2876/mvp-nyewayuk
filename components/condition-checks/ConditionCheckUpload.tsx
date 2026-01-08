"use client";

import { useState, useCallback } from "react";
import { Camera, Upload, X, Check, Loader2, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";

interface ConditionCheckUploadProps {
  reservationId: string;
  itemId: string;
  checkType: "BEFORE_RENTAL" | "AFTER_RENTAL";
  existingPhotos?: string[];
  isApproved?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ConditionCheckUpload({
  reservationId,
  itemId,
  checkType,
  existingPhotos = [],
  isApproved = false,
  onSuccess,
  onCancel,
}: ConditionCheckUploadProps) {
  const [photos, setPhotos] = useState<string[]>(existingPhotos);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState("");

  const title = checkType === "BEFORE_RENTAL" 
    ? "Upload Foto Sebelum Sewa" 
    : "Upload Foto Setelah Sewa";

  const description = checkType === "BEFORE_RENTAL"
    ? "Dokumentasikan kondisi barang sebelum Anda gunakan. Foto ini akan menjadi bukti kondisi awal."
    : "Dokumentasikan kondisi barang setelah Anda gunakan. Foto ini akan dibandingkan dengan kondisi awal.";

  const tips = checkType === "BEFORE_RENTAL"
    ? [
        "Foto keseluruhan barang dari berbagai sudut",
        "Foto detail kondisi yang sudah ada (goresan, noda, dll)",
        "Pastikan pencahayaan cukup terang",
        "Minimal 3 foto untuk dokumentasi lengkap",
      ]
    : [
        "Foto dari sudut yang sama dengan foto sebelumnya",
        "Dokumentasikan setiap kerusakan baru (jika ada)",
        "Tunjukkan bahwa barang dalam kondisi baik",
        "Bandingkan dengan foto kondisi awal",
      ];

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > 10) {
      toast.error("Maksimal 10 foto");
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} bukan file gambar`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} terlalu besar (max 5MB)`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);
        
        const response = await fetch("/api/cloudinary/upload", {
          method: "POST",
          body: formData,
        });
        
        const res = await response.json();
        uploadedUrls.push(res.url);
      }

      setPhotos((prev) => [...prev, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} foto berhasil diupload`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Gagal mengupload foto");
    } finally {
      setUploading(false);
    }
  }, [photos.length]);

  const removePhoto = useCallback((index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (photos.length < 3) {
      toast.error("Minimal 3 foto diperlukan");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/condition-checks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          photos,
          checkType,
          reservationId,
          itemId,
          notes: notes.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Gagal menyimpan");
      }

      toast.success(
        checkType === "BEFORE_RENTAL"
          ? "Foto kondisi awal berhasil diupload! Menunggu persetujuan pemilik."
          : "Foto kondisi akhir berhasil diupload! Menunggu persetujuan pemilik."
      );
      onSuccess?.();
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan");
    } finally {
      setSubmitting(false);
    }
  }, [photos, checkType, reservationId, itemId, notes, onSuccess]);

  if (isApproved) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
        <div className="flex items-center gap-3 text-green-700 dark:text-green-400 mb-4">
          <Check className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Foto Sudah Disetujui</h3>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {existingPhotos.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Condition ${index + 1}`}
              className="w-full aspect-square object-cover rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl">
          <Camera className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 mb-2">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">Tips Pengambilan Foto</span>
        </div>
        <ul className="space-y-1 text-sm text-blue-600 dark:text-blue-300">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Photo Grid */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Foto Kondisi ({photos.length}/10)
          </label>
          {photos.length < 3 && (
            <span className="text-xs text-red-500">
              Minimal 3 foto diperlukan
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {photos.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Photo ${index + 1}`}
                className="w-full aspect-square object-cover rounded-xl"
              />
              <button
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full
                  opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-black/50 text-white text-xs rounded">
                {index + 1}
              </span>
            </div>
          ))}

          {/* Upload Button */}
          {photos.length < 10 && (
            <label className={`
              flex flex-col items-center justify-center w-full aspect-square
              border-2 border-dashed rounded-xl cursor-pointer
              ${uploading 
                ? "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700" 
                : "border-gray-300 dark:border-gray-600 hover:border-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20"
              }
              transition-colors
            `}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
              {uploading ? (
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Upload</span>
                </>
              )}
            </label>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Catatan (opsional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Tambahkan catatan tentang kondisi barang..."
          rows={3}
          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl 
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
            placeholder-gray-400 dark:placeholder-gray-500
            focus:ring-2 focus:ring-rose-500 focus:border-transparent
            resize-none text-sm"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {onCancel && (
          <button
            onClick={onCancel}
            disabled={submitting}
            className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 
              text-gray-700 dark:text-gray-300 rounded-xl font-medium
              hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
              disabled:opacity-50"
          >
            Batal
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={submitting || photos.length < 3}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-rose-500 to-pink-500 
            text-white rounded-xl font-medium shadow-lg shadow-rose-500/25
            hover:from-rose-600 hover:to-pink-600 transition-all
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              Simpan Foto
            </>
          )}
        </button>
      </div>
    </div>
  );
}
