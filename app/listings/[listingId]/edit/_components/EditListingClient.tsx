"use client";
import React, { useMemo, useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Item } from "@prisma/client";

import Button from "@/components/Button";
import SpinnerMini from "@/components/Loader";
import Heading from "@/components/Heading";
import Input from "@/components/inputs/Input";
import CategoryButton from "@/components/inputs/CategoryButton";
import CountrySelect from "@/components/inputs/CountrySelect";
import ImageUpload from "@/components/ImageUpload";
import BackButton from "@/components/BackButton";

import { categories } from "@/utils/constants";
import { updateListing } from "@/services/listing";

const steps = {
  "0": "category",
  "1": "description",
  "2": "image",
  "3": "price",
  "4": "location",
};

enum STEPS {
  CATEGORY = 0,
  DESCRIPTION = 1,
  IMAGES = 2,
  PRICE = 3,
  LOCATION = 4,
}

interface EditListingClientProps {
  listing: Item;
}

const EditListingClient: React.FC<EditListingClientProps> = ({ listing }) => {
  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    getValues,
  } = useForm<FieldValues>({
    defaultValues: {
      category: listing.category,
      location: listing.country
        ? {
            label: listing.country,
            latlng: listing.latlng,
            region: listing.region,
            value: listing.country,
          }
        : null,
      image: listing.imageSrc,
      price: listing.price,
      title: listing.title,
      description: listing.description,
    },
  });

  const location = watch("location");
  const country = location?.label;

  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/Map"), {
        ssr: false,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [country]
  );

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.LOCATION) return onNext();

    startTransition(async () => {
      try {
        await updateListing(listing.id, data);
        toast.success("Listing updated successfully!");
        router.push("/properties");
        router.refresh();
      } catch (error: any) {
        toast.error("Failed to update listing!");
        console.log(error?.message);
      }
    });
  };

  const body = () => {
    switch (step) {
      case STEPS.DESCRIPTION:
        return (
          <div className="flex flex-col gap-6">
            <Heading
              title="Deskripsi Barang"
              subtitle="Jelaskan barang yang akan Anda sewakan"
            />
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
            <hr />
            <Input
              id="description"
              label="Deskripsi Detail"
              placeholder="Jelaskan kondisi, kelengkapan, dan hal penting lainnya..."
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              watch={watch}
            />
          </div>
        );

      case STEPS.IMAGES:
        return (
          <div className="flex flex-col gap-6">
            <Heading
              title="Foto Barang"
              subtitle="Upload foto barang yang akan disewakan"
            />
            <ImageUpload
              onChange={setCustomValue}
              initialImage={getValues("image")}
            />
          </div>
        );

      case STEPS.PRICE:
        return (
          <div className="flex flex-col gap-6">
            <Heading
              title="Tentukan Harga Sewa"
              subtitle="Berapa harga sewa per hari?"
            />
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-700 font-semibold z-10">
                Rp
              </span>
              <input
                id="price"
                type="number"
                placeholder="50000"
                disabled={isLoading}
                {...register("price", { required: true, valueAsNumber: true })}
                className="w-full p-4 pl-14 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed border-neutral-300 focus:border-black"
              />
            </div>
            <p className="text-sm text-neutral-500">
              Masukkan hanya angka. Contoh: 50000 untuk Rp 50.000/hari
            </p>
          </div>
        );

      case STEPS.LOCATION:
        return (
          <div className="flex flex-col gap-6">
            <Heading
              title="Lokasi Penjemputan"
              subtitle="Di mana barang dapat diserahkan/dijemput?"
            />
            <CountrySelect value={location} onChange={setCustomValue} />
            <div className="h-[240px]">
              <Map center={location?.latlng} />
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col gap-2">
            <Heading title="Kategori Barang" subtitle="Pilih kategori yang sesuai" />
            <div className="flex-1 grid grid-cols-2 gap-3 max-h-[60vh] lg:max-h-[260px] overflow-y-scroll scroll-smooth">
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
        );
    }
  };

  const isFieldFilled = !!getValues(
    steps[step.toString() as keyof typeof steps]
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <BackButton />
      </div>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2">Edit Listing</h1>
        <p className="text-gray-600 mb-8">Update informasi barang Anda</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-8">{body()}</div>

          <div className="flex flex-row items-center gap-4 w-full">
            {step !== STEPS.CATEGORY && (
              <Button
                type="button"
                className="flex items-center gap-2 justify-center"
                onClick={onBack}
                outline
              >
                Back
              </Button>
            )}
            <Button
              type="submit"
              className="flex items-center gap-2 justify-center"
              disabled={isLoading || !isFieldFilled}
            >
              {isLoading ? (
                <SpinnerMini />
              ) : step === STEPS.LOCATION ? (
                "Update Listing"
              ) : (
                "Lanjut"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListingClient;
