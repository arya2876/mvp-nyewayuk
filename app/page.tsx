import React, { FC, Suspense } from "react";
import nextDynamic from "next/dynamic";
import Image from "next/image";

import ListingCard from "@/components/ListingCard";
import LoadMore from "@/components/LoadMore";
import EmptyState from "@/components/EmptyState";
import HeroSearch from "@/components/HeroSearch";

import { getListings } from "@/services/listing";
import { getFavorites } from "@/services/favorite";
import { categories } from "@/utils/constants";

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

  return (
    <>
      {/* Hero Section - Style Hygglo */}
      <section className="relative w-full h-[420px] flex items-center justify-center overflow-hidden">
        {/* Background Image dengan Overlay */}
        <div className="absolute inset-0">
          <Image 
            src="/images/hero-bg.jpg" 
            fill
            className="object-cover" 
            alt="Drone Flying Background"
            priority
          />
          {/* Dark Overlay untuk readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A2E46]/80 via-[#1e3a5f]/70 to-[#0A2E46]/80"></div>
        </div>
        
        {/* Konten Hero */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
          {/* Judul Utama */}
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg">
            Pinjam daripada membeli
          </h1>
          
          {/* Subjudul */}
          <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto drop-shadow-md">
            Dekat dan pada waktu yang sesuai untuk Anda
          </p>
          
          {/* Search Bar Component */}
          <HeroSearch />
        </div>
      </section>

      {/* Pencarian Terbaru - Quick Category Pills */}
      <section className="mx-auto max-w-6xl px-6 py-6">
        <h3 className="text-sm font-medium text-neutral-600 mb-3">Pencarian terbaru</h3>
        <div className="flex flex-wrap gap-2">
          {["Mesin Asap", "Proyektor", "Lampu Pesta"].map((label) => (
            <button
              key={label}
              className="px-4 py-2 bg-white border border-neutral-300 rounded-full text-sm text-neutral-700 hover:bg-gray-50 hover:border-neutral-400 transition shadow-sm"
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Section Item yang baru-baru ini aktif - DI BAGIAN ATAS */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-800">
            Item yang baru-baru ini aktif
          </h2>
        </div>
        
        {/* Grid Listing atau Empty State */}
        {!listings || listings.length === 0 ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Belum ada barang yang di-upload</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Saat ini belum ada barang tersedia. Jadilah yang pertama menyewakan barang Anda!
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
            </div>
            
            {/* Load More */}
            {nextCursor ? (
              <div className="mt-8">
                <Suspense fallback={<></>}>
                  <LoadMore
                    nextCursor={nextCursor}
                    fnArgs={searchParams}
                    queryFn={getListings}
                    queryKey={["listings", searchParams]}
                    favorites={favorites}
                  />
                </Suspense>
              </div>
            ) : null}
          </>
        )}
      </section>

      {/* Section Kategori Populer - Style Pills */}
      <section className="mx-auto max-w-6xl px-6 py-12 border-t border-neutral-200">
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-neutral-800">
            Atau telusuri kategori kami yang paling populer...
          </h2>
        </div>
        
        {/* Kategori Pills */}
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.label}
              className="px-5 py-2.5 bg-white border border-neutral-300 rounded-full text-sm font-medium text-neutral-700 hover:bg-gray-100 hover:border-neutral-400 transition shadow-sm"
            >
              {category.label}
            </button>
          ))}
        </div>
      </section>

      {/* Section Testimonial - 3 Kolom */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="rounded-2xl bg-gray-50 p-8 shadow-sm hover:shadow-md transition">
              <div className="mb-6 flex justify-center">
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center overflow-hidden">
                  <Trophy className="h-16 w-16 text-white" />
                </div>
              </div>
              <h3 className="mb-3 text-center text-xl font-bold text-neutral-800">
                Daftar Teratas 2024
              </h3>
              <p className="text-center text-sm text-neutral-600 leading-relaxed">
                Apakah Anda tidak yakin tentang apa yang sebenarnya dapat Anda sewakan di platform tempat Anda dapat menyewa (hampir) apa saja? Biarkan diri Anda terinspirasi oleh daftar produk yang paling banyak disewa di NyewaYuk tahun lalu.
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="rounded-2xl bg-gray-50 p-8 shadow-sm hover:shadow-md transition">
              <div className="mb-6 flex justify-center">
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 overflow-hidden">
                  <div className="h-full w-full bg-gray-300 flex items-center justify-center">
                    <span className="text-4xl">👩</span>
                  </div>
                </div>
              </div>
              <h3 className="mb-3 text-center text-xl font-bold text-neutral-800">
                Anwen: Menyewa mesin cuci bertekanan jauh lebih baik daripada membelinya
              </h3>
              <p className="text-center text-sm text-neutral-600 leading-relaxed">
                Menyewa di NyewaYuk menghemat uang saya dan mencegah pemborosan karena memiliki sesuatu yang jarang saya butuhkan. Memilih menyewa berarti mengurangi jejak karbon saya dan mencegah barang yang kurang terpakai menumpuk debu di garasi saya.
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="rounded-2xl bg-gray-50 p-8 shadow-sm hover:shadow-md transition">
              <div className="mb-6 flex justify-center">
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center overflow-hidden">
                  <MapPin className="h-16 w-16 text-white" />
                </div>
              </div>
              <h3 className="mb-3 text-center text-xl font-bold text-neutral-800">
                Lebih dari Satu Juta Sewa di Seluruh Indonesia
              </h3>
              <p className="text-center text-sm text-neutral-600 leading-relaxed">
                Kami ingin orang-orang mengurangi belanja dan berbagi. Misi NyewaYuk adalah menjadikannya terjangkau dan mudah untuk mendapatkan barang apa pun, di mana pun, tanpa perlu membelinya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Value Proposition - Grid 6 dengan Icon Ungu */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-2">
            {/* Row 1 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-28 w-28 items-center justify-center rounded-full overflow-hidden">
                <Image 
                  src="/images/value-props/together.png" 
                  alt="Semuanya terjamin"
                  width={112}
                  height={112}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-neutral-800">Semuanya terjamin</h3>
              <p className="text-sm text-neutral-600 max-w-xs">
                Perlindungan bagi penyewa dan penyewa luar
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-28 w-28 items-center justify-center rounded-full overflow-hidden">
                <Image 
                  src="/images/value-props/card-id.png" 
                  alt="Semua orang terverifikasi"
                  width={112}
                  height={112}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-neutral-800">Semua orang terverifikasi</h3>
              <p className="text-sm text-neutral-600 max-w-xs">
                NyewaYuk aman. Semua orang terverifikasi.
              </p>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-28 w-28 items-center justify-center rounded-full overflow-hidden">
                <Image 
                  src="/images/value-props/money.png" 
                  alt="Lebih murah daripada membeli"
                  width={112}
                  height={112}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-neutral-800">Lebih murah daripada membeli</h3>
              <p className="text-sm text-neutral-600 max-w-xs">
                Seringkali 60% lebih murah menyewa melalui NyewaYuk daripada menyewa melalui perusahaan.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-28 w-28 items-center justify-center rounded-full overflow-hidden">
                <Image 
                  src="/images/value-props/location.png" 
                  alt="Sewa di daerah Anda"
                  width={112}
                  height={112}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-neutral-800">Sewa di daerah Anda</h3>
              <p className="text-sm text-neutral-600 max-w-xs">
                Anda biasanya dapat menyewa sesuatu yang lebih dekat dengan Anda daripada toko terdekat.
              </p>
            </div>

            {/* Row 3 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-28 w-28 items-center justify-center rounded-full overflow-hidden">
                <Image 
                  src="/images/value-props/clock.png" 
                  alt="Jam yang sesuai untuk Anda"
                  width={112}
                  height={112}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-neutral-800">Jam yang sesuai untuk Anda</h3>
              <p className="text-sm text-neutral-600 max-w-xs">
                Sewa kapan saja yang cocok untuk Anda
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-28 w-28 items-center justify-center rounded-full overflow-hidden">
                <Image 
                  src="/images/value-props/environment.png" 
                  alt="Baik untuk Lingkungan"
                  width={112}
                  height={112}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-neutral-800">Baik untuk Lingkungan</h3>
              <p className="text-sm text-neutral-600 max-w-xs">
                Berbagi lebih baik untuk planet kita
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
