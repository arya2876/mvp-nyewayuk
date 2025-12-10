"use client";
import React, { useMemo, useState, useTransition, useEffect } from "react";
import dynamic from "next/dynamic";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";

import Button from "./Button";
import SpinnerMini from "./Loader";
import Heading from "./Heading";
import Input from "./inputs/Input";
import CategoryButton from "./inputs/CategoryButton";
import LocationSelect from "./inputs/LocationSelect";
import ImageUpload from "./ImageUpload";
import Modal from "./modals/Modal";

import { categories } from "@/utils/constants";
import { updateListing } from "@/services/listing";

interface EditListingModalContentProps {
  listingId: string;
}

const EditListingModalContent: React.FC<EditListingModalContentProps> = ({ listingId }) => {
  const [isLoading, startTransition] = useTransition();
  const [listing, setListing] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`/api/listings/${listingId}`);
        setListing(response.data);
      } catch (error) {
        toast.error("Failed to load listing");
      } finally {
        setLoadingData(false);
      }
    };
    fetchListing();
  }, [listingId]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      category: listing?.category || "Kamera",
      location: listing?.province && listing?.city && listing?.district
        ? {
            province: listing.province,
            city: listing.city,
            district: listing.district,
            latlng: listing.latlng,
            label: `${listing.district}, ${listing.city}, ${listing.province}`,
          }
        : null,
      images: listing?.imageSrc ? [listing.imageSrc] : [],
      price: listing?.price || "",
      title: listing?.title || "",
      description: listing?.description || "",
      brand: listing?.brand || "",
      model: listing?.model || "",
      condition: listing?.condition || "Baik",
    },
  });

  useEffect(() => {
    if (listing) {
      setValue("category", listing.category);
      setValue("title", listing.title);
      setValue("description", listing.description);
      setValue("brand", listing.brand || "");
      setValue("model", listing.model || "");
      setValue("condition", listing.condition || "Baik");
      setValue("images", listing.imageSrc ? [listing.imageSrc] : []);
      setValue("price", listing.price);
      if (listing.province && listing.city && listing.district) {
        setValue("location", {
          province: listing.province,
          city: listing.city,
          district: listing.district,
          latlng: listing.latlng,
          label: `${listing.district}, ${listing.city}, ${listing.province}`,
        });
      }
    }
  }, [listing, setValue]);

  const location = watch("location");
  const locationLabel = location?.label;

  const Map = useMemo(
    () =>
      dynamic(() => import("./Map"), {
        ssr: false,
      }),
    []
  );

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    startTransition(async () => {
      try {
        await updateListing(listingId, {
          ...data,
          image: data.images[0] || "", // Use first image as main image
        });
        toast.success("Listing berhasil diperbarui!");
        router.refresh();
      } catch (error: any) {
        toast.error("Gagal memperbarui listing!");
      }
    });
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center p-8">
        <SpinnerMini />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col max-h-[90vh]">
      <Modal.WindowHeader title="Edit Listing" />
      <form
        className="flex-1 overflow-y-auto p-6 space-y-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Category Section */}
        <div>
          <Heading title="Kategori" subtitle="Pilih kategori barang" />
          <div className="grid grid-cols-2 gap-3 mt-4">
            {categories.map((item) => (
              <CategoryButton
                onClick={setCustomValue}
                watch={watch}
                label={item.label}
                icon={item.icon}
                key={item.label}
              />
            ))}
          </div>
        </div>

        <hr />

        {/* Description Section */}
        <div>
          <Heading title="Informasi Barang" subtitle="Detail barang Anda" />
          <div className="space-y-4 mt-4">
            <Input
              id="title"
              label="Judul"
              placeholder="Contoh: Kamera Sony A7III Lengkap dengan Lensa"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              watch={watch}
            />
            <div className="w-full relative">
              <textarea
                id="description"
                placeholder="Jelaskan kondisi, kelengkapan, dan hal penting lainnya..."
                disabled={isLoading}
                {...register("description", { required: true })}
                rows={6}
                className="text-[15px] peer w-full px-4 pt-6 pb-3 font-light bg-white dark:bg-[#1E293B] border-[1px] rounded outline-none transition disabled:opacity-70 disabled:cursor-not-allowed text-neutral-800 dark:text-white resize-y min-h-[120px] border-neutral-300 dark:border-white/10 focus:border-black dark:focus:border-[#00A99D]"
              />
              <label
                className="absolute text-[14px] duration-150 transform top-[28px] scale-80 -translate-y-4 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-80 peer-focus:-translate-y-[40px] peer-focus:bg-white dark:peer-focus:bg-neutral-700 z-[20] px-1 left-4 text-zinc-400 dark:text-gray-400"
                htmlFor="description"
              >
                Deskripsi Detail
              </label>
            </div>
          </div>
        </div>

        <hr />

        {/* Specifications Section */}
        <div>
          <Heading
            title="Spesifikasi Barang"
            subtitle="Informasi detail tentang barang"
          />
          <div className="space-y-4 mt-4">
            <Input
              id="brand"
              label="Brand / Merek"
              placeholder="Contoh: Sony, Canon, Nikon"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              watch={watch}
            />
            <Input
              id="model"
              label="Model / Tipe"
              placeholder="Contoh: A7III, EOS R5, Z6 II"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              watch={watch}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kondisi
              </label>
              <select
                id="condition"
                {...register("condition", { required: true })}
                disabled={isLoading}
                className="w-full p-4 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed border-neutral-300 focus:border-black"
              >
                <option value="Baru">Baru</option>
                <option value="Seperti Baru">Seperti Baru</option>
                <option value="Baik">Baik</option>
                <option value="Cukup Baik">Cukup Baik</option>
              </select>
            </div>
          </div>
        </div>

        <hr />

        {/* Images Section */}
        <div>
          <Heading
            title="Foto Barang"
            subtitle="Upload hingga 7 foto (foto pertama akan menjadi foto utama)"
          />
          <div className="mt-4">
            <ImageUpload
              onChange={setCustomValue}
              initialImages={watch("images")}
              maxImages={7}
              multiple
            />
          </div>
        </div>

        <hr />

        {/* Price Section */}
        <div>
          <Heading title="Harga Sewa" subtitle="Tentukan harga sewa per hari" />
          <div className="relative mt-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-700 font-semibold z-10">
              Rp
            </span>
            <input
              id="price"
              type="number"
              placeholder="50000"
              disabled={isLoading}
              {...register("price", { 
                required: true,
                setValueAs: (value) => value === "" ? "" : parseInt(value, 10)
              })}
              className="w-full p-4 pl-14 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed border-neutral-300 focus:border-black"
            />
          </div>
          <p className="text-sm text-neutral-500 mt-2">
            Masukkan hanya angka. Contoh: 50000 untuk Rp 50.000/hari
          </p>
        </div>

        <hr />

        {/* Location Section */}
        <div>
          <Heading
            title="Lokasi Penjemputan"
            subtitle="Di mana barang dapat diserahkan/dijemput?"
          />
          <div className="mt-4 space-y-4">
            <LocationSelect value={location} onChange={setCustomValue} />
            <div className="h-[300px] rounded-lg overflow-hidden">
              <Map center={location?.latlng} />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t">
          <Button
            type="submit"
            className="w-full flex items-center gap-2 justify-center"
            disabled={isLoading}
          >
            {isLoading ? <SpinnerMini /> : "Perbarui Listing"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditListingModalContent;
