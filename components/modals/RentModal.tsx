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
  "1": "location",
  "2": "brand",
  "3": "image",
  "4": "nyewaGuardImageSrc",
  "5": "title",
  "6": "price",
};

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  NYEWAGUARD = 4,
  DESCRIPTION = 5,
  PRICE = 6,
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
      category: "Beach",
      location: null,
      image: "",
      nyewaGuardImageSrc: "",
      price: "",
      title: "",
      description: "",
      brand: "",
      model: "",
      condition: "",
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
    if (step !== STEPS.PRICE) return onNext();

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
      case STEPS.LOCATION:
        return (
          <div className="flex flex-col gap-6">
            <Heading
              title="Where is your place located?"
              subtitle="Help guests find you!"
            />
            <CountrySelect value={location} onChange={setCustomValue} />
            <div className="h-[240px]">
              <Map center={location?.latlng} />
            </div>
          </div>
        );

      case STEPS.INFO:
        return (
          <div className="flex flex-col gap-6">
            <Heading
              title="Informasi Barang"
              subtitle="Isi detail dasar barang sewaan Anda"
            />
            <Input
              id="brand"
              label="Merek Barang"
              placeholder="Sony, Canon..."
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              watch={watch}
              autoFocus
            />
            <hr />
            <Input
              id="model"
              label="Model"
              placeholder="A7III, Mavic Air..."
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              watch={watch}
            />
            <hr />
            <Input
              id="condition"
              label="Kondisi"
              placeholder="Baru / Bekas Baik"
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
              title="Add a photo of your place"
              subtitle="Show guests what your place looks like!"
            />
            <ImageUpload
              onChange={setCustomValue}
              initialImage={getValues("image")}
            />
          </div>
        );

      case STEPS.NYEWAGUARD:
        return (
          <div className="flex flex-col gap-6">
            <Heading
              title="NyewaGuard Verification"
              subtitle="Upload 1 foto khusus untuk verifikasi AI"
            />
            <ImageUpload
              onChange={setCustomValue}
              initialImage={getValues("nyewaGuardImageSrc")}
              id="nyewaGuardImageSrc"
            />
          </div>
        );

      case STEPS.DESCRIPTION:
        return (
          <div className="flex flex-col gap-6">
            <Heading
              title="How would you describe your place?"
              subtitle="Short and sweet works best!"
            />
            <Input
              id="title"
              label="Title"
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
              label="Description"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              watch={watch}
            />
          </div>
        );

      case STEPS.PRICE:
        return (
          <div className="flex flex-col gap-6">
            <Heading
              title="Now, set your price"
              subtitle="How much do you charge per night?"
            />
            <Input
              key="price"
              id="price"
              label="Price"
              icon={BiDollar}
              type="number"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              watch={watch}
              autoFocus
            />
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

  const isFieldFilled = !!getValues(steps[step]);

  return (
    <div className="w-full h-full flex flex-col">
      <Modal.WindowHeader title="Share your home!" />
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
              ) : step === STEPS.PRICE ? (
                "Create"
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RentModal;
