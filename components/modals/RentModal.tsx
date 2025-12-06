"use client";
import React, { useMemo, useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { BiDollar } from "react-icons/bi";

import Modal from "./Modal";
import Button from "../Button";
import SpinnerMini from "../Loader";
import Heading from "../Heading";
import Input from "../inputs/Input";
import CategoryButton from "../inputs/CategoryButton";
import CountrySelect from "../inputs/CountrySelect";
import ImageUpload from "../ImageUpload";

import { categories } from "@/utils/constants";
import { createListing } from "@/services/listing";

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

const RentModal = ({ onCloseModal }: { onCloseModal?: () => void }) => {
  const [step, setStep] = useState(STEPS.CATEGORY);
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
    getValues,
  } = useForm<FieldValues>({
    defaultValues: {
      category: "Kamera",
      location: null,
      image: "",
      price: "",
      title: "",
      description: "",
    },
  });

  const location = watch("location");
  const country = location?.label;

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
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
        const newListing = await createListing(data);
        toast.success(`${data.title} added successfully!`);
        queryClient.invalidateQueries({
          queryKey: ["listings"],
        });
        reset();
        setStep(STEPS.CATEGORY);
        onCloseModal?.();
        router.refresh();
        router.push(`/listings/${newListing.id}`);
      } catch (error: any) {
        toast.error("Failed to create listing!");
        console.log(error?.message)
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
              title="Kirim Foto Barang"
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
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-700 font-semibold z-10">Rp</span>
              <input
                id="price"
                type="number"
                placeholder="50000"
                disabled={isLoading}
                {...register("price", { required: true, valueAsNumber: true })}
                className="w-full p-4 pl-14 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed border-neutral-300 focus:border-black"
              />
            </div>
            <p className="text-sm text-neutral-500">Masukkan hanya angka. Contoh: 50000 untuk Rp 50.000/hari</p>
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
            <Heading
              title="Which of these best describes your place?"
              subtitle="Pick a category"
            />
            <div className="flex-1 grid grid-cols-2  gap-3 max-h-[60vh] lg:max-h-[260px] overflow-y-scroll scroll-smooth">
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

  const isFieldFilled = !!getValues(steps[step.toString() as keyof typeof steps]);

  return (
    <div className="w-full h-full flex flex-col">
      <Modal.WindowHeader title="Sewakan Barang Anda" />
      <form
        className="flex-1  md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none "
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="relative p-6">{body()}</div>
        <div className="flex flex-col gap-2 px-6 pb-6 pt-3">
          <div className="flex flex-row items-center gap-4 w-full">
            {step !== STEPS.CATEGORY ? (
              <Button
                type="button"
                className="flex items-center gap-2 justify-center"
                onClick={onBack}
                outline
              >
                Back
              </Button>
            ) : null}
            <Button
              type="submit"
              className="flex items-center gap-2 justify-center"
              disabled={isLoading || !isFieldFilled}
            >
              {isLoading ? (
                <SpinnerMini />
              ) : step === STEPS.LOCATION ? (
                "Publikasikan"
              ) : (
                "Lanjut"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RentModal;
