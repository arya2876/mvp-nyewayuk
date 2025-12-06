import React, { ChangeEvent, FC, useState, useTransition } from "react";
import Image from "next/image";
import { TbPhotoPlus } from "react-icons/tb";
import toast from "react-hot-toast";

import SpinnerMini from "./Loader";
import { useEdgeStore } from "@/lib/edgestore";
import { cn } from "@/utils/helper";

interface ImageUploadProps {
  onChange: (fieldName: string, imgSrc: string) => void;
  initialImage?: string;
  fieldName?: string;
}

const ImageUpload: FC<ImageUploadProps> = ({ onChange, initialImage = "", fieldName = "image" }) => {
  const [image, setImage] = useState(initialImage);
  const [isLoading, startTransition] = useTransition();
  const [isDragging, setIsDragging] = useState(false);
  const { edgestore } = useEdgeStore();

  const uploadImage = (e: any, file: File) => {
    if(!file || !file.type.startsWith("image")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setImage(URL.createObjectURL(file));
    startTransition(async () => {
      try {
        if (!edgestore) {
          toast.error("Image upload service is not configured. Please contact support.");
          setImage(initialImage);
          return;
        }

        const res = await edgestore.publicFiles.upload({
          file,
          options: {
            replaceTargetUrl: initialImage,
          },
        });

        onChange(fieldName, res.url);
        toast.success("Image uploaded successfully!");
        setTimeout(() => {
          e.target.form?.requestSubmit();
        }, 1000);
      } catch (error: any) {
        console.error("Image upload error:", error);
        setImage(initialImage);
        
        // Handle specific error cases
        if (error?.message?.includes("SERVICE_UNAVAILABLE")) {
          toast.error("Image upload service is currently unavailable. Please try again later.");
        } else if (error?.message?.includes("net::ERR_CONNECTION_REFUSED")) {
          toast.error("Cannot connect to image upload service. Please check your internet connection.");
        } else {
          toast.error(error?.message || "Failed to upload image. Please try again.");
        }
      }
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    uploadImage(e, file);
  };

  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDragging(false)
    uploadImage(e, e.dataTransfer.files[0])
  }

  return (
    <label
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      htmlFor="hotel"
      className={cn(
        " relative cursor-pointer hover:opacity-70 transition border-dashed  border-2 p-20 border-neutral-300 w-full h-[240px] flex flex-col justify-center items-center   text-neutral-600 ",
        isLoading && "opacity-70",
        isDragging && "border-red-500"
      )}
    >
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-20">
          {" "}
          <SpinnerMini className="w-[32px] h-[32px] text-red-600" />
        </div>
      )}
      {image ? (
        <div className="absolute inset-0 w-full h-full">
          <Image
            fill
            style={{ objectFit: "cover" }}
            src={image}
            alt="hotel"
            sizes="100vw"
            className="z-10"
            unoptimized
          />
        </div>
      ) : (
        <>
          <TbPhotoPlus className="!w-[64px] !h-[64px] mb-4" />
          <span className="font-semibold text-lg">Upload image</span>
        </>
      )}
      <input
        type="file"
        accept="image/*"
        id="hotel"
        className="w-0 h-0 opacity-0"
        onChange={handleChange}
        autoFocus
      />
    </label>
  );
};

export default ImageUpload;
