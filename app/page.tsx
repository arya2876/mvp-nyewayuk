import React, { FC, Suspense } from "react";
import nextDynamic from "next/dynamic";
import { Camera, Drone, Speaker, Tent, IdCard, ShieldCheck, CreditCard } from "lucide-react";

import ListingCard from "@/components/ListingCard";
import LoadMore from "@/components/LoadMore";
import EmptyState from "@/components/EmptyState";

import { getListings } from "@/services/listing";
import { getFavorites } from "@/services/favorite";

export const dynamic = "force-dynamic";

interface HomeProps {
  searchParams?: { [key: string]: string | undefined };
}

const Home: FC<HomeProps> = async ({ searchParams }) => {
  const { listings, nextCursor } = await getListings(searchParams);
  const favorites = await getFavorites();
  const lat = searchParams?.lat ? Number(searchParams.lat) : undefined;
  const lng = searchParams?.lng ? Number(searchParams.lng) : undefined;
  const center = lat !== undefined && lng !== undefined ? [lat, lng] : undefined;

  const Map = nextDynamic(() => import("@/components/Map"), { ssr: false });

  if (!listings || listings.length === 0) {
    return (
      <EmptyState
        title="No Listings found"
        subtitle="Looks like you have no properties."
      />
    );
  }

  return (
    <>
      {/* Hero Section ala Hygglo */}
      <section className="relative isolate bg-emerald-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-800 via-emerald-900 to-emerald-950 opacity-70" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
          <div className="flex min-h-[50vh] items-center justify-center text-center">
            <div className="w-full max-w-3xl space-y-6">
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                Sewa barang yang Anda butuhkan, sewakan yang Anda miliki.
              </h1>

              {/* Search Bar */}
              <div className="mx-auto w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Apa yang Anda butuhkan hari ini?"
                    className="w-full rounded-full bg-white/10 px-5 py-4 pr-16 text-white placeholder-white/70 outline-none ring-1 ring-white/20 backdrop-blur-sm transition focus:bg-white/15 focus:ring-2 focus:ring-white/40"
                  />
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white px-4 py-2 text-sm font-medium text-emerald-900 shadow-sm transition hover:bg-emerald-100"
                    aria-label="Cari"
                  >
                    Cari
                  </button>
                </div>
                {center ? (
                  <div className="mt-4 h-40 rounded-xl overflow-hidden ring-1 ring-white/20">
                    <Map center={center as unknown as number[]} />
                  </div>
                ) : null}
              </div>

              {/* Kategori Cepat (Pills) */}
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                {["Kamera", "Drone", "Sound System", "Tenda"].map((label) => (
                  <button
                    key={label}
                    className="rounded-full border border-white/30 px-4 py-2 text-sm text-white transition hover:border-white/50 hover:bg-white/10"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Kategori Populer */}
      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-xl font-semibold md:text-2xl">Kategori Pilihan</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {[
            { title: "Kamera", icon: Camera },
            { title: "Drone", icon: Drone },
            { title: "Sound System", icon: Speaker },
            { title: "Tenda", icon: Tent },
          ].map(({ title, icon: Icon }) => (
            <button
              key={title}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 transition group-hover:scale-105">
                <Icon className="h-8 w-8" />
              </span>
              <span className="text-sm font-medium text-neutral-900">{title}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Section Kenapa NyewaYuk? */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-10 text-center text-2xl font-semibold md:text-3xl">Kenapa NyewaYuk?</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {/* Identitas Terverifikasi */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <IdCard className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Identitas Terverifikasi</h3>
              <p className="text-sm text-neutral-600">Semua pengguna verifikasi KTP/KTM melalui BankID/e-KYC.</p>
            </div>

            {/* NyewaGuard AI */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Aman dengan NyewaGuard AI</h3>
              <p className="text-sm text-neutral-600">Kondisi barang dipindai AI sebelum & sesudah sewa. Bebas sengketa.</p>
            </div>

            {/* Pembayaran Aman */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <CreditCard className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Pembayaran Aman</h3>
              <p className="text-sm text-neutral-600">Uang ditahan sistem sampai barang diterima dengan baik.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <section className=" main-container pt-4 md:pt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
      {listings.map((listing) => {
        const hasFavorited = favorites.includes(listing.id);
        return (
          <ListingCard
            key={listing.id}
            data={listing}
            hasFavorited={hasFavorited}
          />
        );
      })}
      {nextCursor ? (
        <Suspense fallback={<></>}>
          <LoadMore
            nextCursor={nextCursor}
            fnArgs={searchParams}
            queryFn={getListings}
            queryKey={["listings", searchParams]}
            favorites={favorites}
          />
        </Suspense>
      ) : null}
      </section>
    </>
  );
};

export default Home;
