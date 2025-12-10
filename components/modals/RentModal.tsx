"use client";
import React, { useMemo, useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import Modal from "./Modal";
import Button from "../Button";
import SpinnerMini from "../Loader";
import Heading from "../Heading";
import Input from "../inputs/Input";
import CategoryButton from "../inputs/CategoryButton";
import LocationSelect from "../inputs/LocationSelect";
import ImageUpload from "../ImageUpload";

import { categories } from "@/utils/constants";
import { createListing } from "@/services/listing";

const RentModal = ({ onCloseModal }: { onCloseModal?: () => void }) => {
  const [isLoading, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: "Kamera",
      location: null,
      images: [],
      price: "",
      title: "",
      description: "",
      brand: "",
      model: "",
      condition: "Baik",
    },
  });

  const location = watch("location");
  const country = location?.label;

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
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
    // Validate all required fields
    if (!data.category || !data.title || !data.description || !data.brand || !data.model || !data.condition || !data.images || data.images.length === 0 || !data.price || !data.location) {
      toast.error("Mohon lengkapi semua field!");
      return;
    }

    startTransition(async () => {
      try {
        const newListing = await createListing({
          ...data,
          image: data.images[0] || "", // Use first image as main image
        });
        toast.success(`${data.title} berhasil ditambahkan!`);
        queryClient.invalidateQueries({
          queryKey: ["listings"],
        });
        reset();
        onCloseModal?.();
        router.refresh();
        router.push(`/listings/${newListing.id}`);
      } catch (error: any) {
        toast.error("Gagal membuat listing!");
        console.log(error?.message);
      }
    });
  };

  const body = () => {
    return (
      <div className="space-y-8">
        {/* Category Section */}
        <div>
          <Heading title="Kategori Barang" subtitle="Pilih kategori yang sesuai" />
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

        <hr className="border-neutral-200 dark:border-neutral-700" />

        {/* Description Section */}
        <div>
          <Heading
            title="Deskripsi Barang"
            subtitle="Jelaskan barang yang akan Anda sewakan"
          />
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
              autoFocus
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

        <hr className="border-neutral-200 dark:border-neutral-700" />

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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kondisi
              </label>
              <select
                id="condition"
                {...register("condition", { required: true })}
                disabled={isLoading}
                className="w-full p-4 font-light bg-white dark:bg-neutral-700 border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed border-neutral-300 dark:border-neutral-600 focus:border-black dark:focus:border-emerald-400 text-neutral-800 dark:text-white"
              >
                <option value="Baru">Baru</option>
                <option value="Seperti Baru">Seperti Baru</option>
                <option value="Baik">Baik</option>
                <option value="Cukup Baik">Cukup Baik</option>
              </select>
            </div>
          </div>
        </div>

        <hr className="border-neutral-200 dark:border-neutral-700" />

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

        <hr className="border-neutral-200 dark:border-neutral-700" />

        {/* Price Section */}
        <div>
          <Heading title="Tentukan Harga Sewa" subtitle="Berapa harga sewa per hari?" />
          <div className="relative mt-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-700 dark:text-gray-300 font-semibold z-10">
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
              className="w-full p-4 pl-14 font-light bg-white dark:bg-neutral-700 border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed border-neutral-300 dark:border-neutral-600 focus:border-black dark:focus:border-emerald-400 text-neutral-800 dark:text-white"
            />
          </div>
          <p className="text-sm text-neutral-500 dark:text-gray-400 mt-2">
            Masukkan hanya angka. Contoh: 50000 untuk Rp 50.000/hari
          </p>
        </div>

        <hr className="border-neutral-200 dark:border-neutral-700" />

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
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col max-h-[90vh]">
      <Modal.WindowHeader title="Sewakan Barang Anda" />
      <form
        className="flex-1 overflow-y-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white dark:bg-neutral-800 outline-none focus:outline-none"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="p-6">{body()}</div>
        <div className="sticky bottom-0 bg-white dark:bg-neutral-800 px-6 pb-6 pt-3 border-t border-neutral-200 dark:border-neutral-700">
          <Button
            type="submit"
            className="w-full flex items-center gap-2 justify-center"
            disabled={isLoading}
          >
            {isLoading ? <SpinnerMini /> : "Publikasikan"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RentModal;
