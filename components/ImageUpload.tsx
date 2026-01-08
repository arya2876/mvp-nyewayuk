import React, { ChangeEvent, FC, useState, useTransition } from "react";
import Image from "next/image";
import { TbPhotoPlus, TbX } from "react-icons/tb";

import SpinnerMini from "./Loader";
import { cn } from "@/utils/helper";

interface ImageUploadProps {
  onChange: (fieldName: string, imgSrc: string | string[]) => void;
  initialImage?: string;
  initialImages?: string[];
  fieldName?: string;
  multiple?: boolean;
  maxImages?: number;
}

const ImageUpload: FC<ImageUploadProps> = ({ 
  onChange, 
  initialImage = "", 
  initialImages = [],
  fieldName = "image",
  multiple = false,
  maxImages = 7
}) => {
  const [image, setImage] = useState(initialImage);
  const [images, setImages] = useState<string[]>(initialImages);
  const [isLoading, startTransition] = useTransition();
  const [isDragging, setIsDragging] = useState(false);

  const uploadImage = (e: any, file: File) => {
    if(!file.type.startsWith("image")) return;
    
    if (multiple) {
      if (images.length >= maxImages) {
        return;
      }
      const tempUrl = URL.createObjectURL(file);
      setImages(prev => [...prev, tempUrl]);
      
      startTransition(async () => {
        const formData = new FormData();
        formData.append("file", file);
        
        const response = await fetch("/api/cloudinary/upload", {
          method: "POST",
          body: formData,
        });
        
        const res = await response.json();
        
        setImages(prev => {
          const newImages = prev.map(img => img === tempUrl ? res.url : img);
          onChange(fieldName === "image" ? "images" : fieldName, newImages);
          return newImages;
        });
      });
    } else {
      const tempUrl = URL.createObjectURL(file);
      setImage(tempUrl);
      startTransition(async () => {
        const formData = new FormData();
        formData.append("file", file);
        
        const response = await fetch("/api/cloudinary/upload", {
          method: "POST",
          body: formData,
        });
        
        const res = await response.json();

        setImage(res.url);
        onChange(fieldName, res.url);
        setTimeout(() => {
          e.target.form?.requestSubmit();
        }, 1000);
      });
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    if (multiple) {
      const files = Array.from(e.target.files).slice(0, maxImages - images.length);
      files.forEach(file => uploadImage(e, file));
    } else {
      const file = e.target.files[0];
      uploadImage(e, file);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      onChange(fieldName === "image" ? "images" : fieldName, newImages);
      return newImages;
    });
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
    
    if (multiple) {
      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image")).slice(0, maxImages - images.length);
      files.forEach(file => uploadImage(e, file));
    } else {
      uploadImage(e, e.dataTransfer.files[0])
    }
  }

  if (multiple) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-neutral-200">
              <Image
                fill
                style={{ objectFit: "cover" }}
                src={img}
                alt={`Upload ${index + 1}`}
                sizes="200px"
                unoptimized
              />
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-[#00A99D] text-white text-xs px-2 py-1 rounded-full font-semibold">
                  Foto Utama
                </div>
              )}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition"
              >
                <TbX className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          {images.length < maxImages && (
            <label
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              htmlFor="images"
              className={cn(
                "relative cursor-pointer hover:opacity-70 transition border-dashed border-2 border-neutral-300 aspect-square flex flex-col justify-center items-center text-neutral-600 rounded-lg",
                isLoading && "opacity-70",
                isDragging && "border-[#00A99D] bg-[#00A99D]/10"
              )}
            >
              {isLoading ? (
                <SpinnerMini className="w-8 h-8 text-[#00A99D]" />
              ) : (
                <>
                  <TbPhotoPlus className="w-12 h-12 mb-2" />
                  <span className="font-semibold text-sm text-center">
                    {images.length === 0 ? "Upload foto" : "Tambah foto"}
                  </span>
                  <span className="text-xs text-neutral-500 mt-1">
                    {images.length}/{maxImages}
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                id="images"
                className="hidden"
                onChange={handleChange}
                multiple
                disabled={isLoading || images.length >= maxImages}
              />
            </label>
          )}
        </div>
        {images.length > 0 && (
          <p className="text-sm text-neutral-500">
            Foto pertama akan menjadi foto utama yang ditampilkan
          </p>
        )}
      </div>
    );
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
