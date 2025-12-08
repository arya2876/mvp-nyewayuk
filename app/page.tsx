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

  // Debug logging
  if (lat && lng) {
    console.log(`🔍 PAGE: Searching with user location [${lat}, ${lng}]`);
    console.log(`📊 PAGE: Found ${listings.length} listings`);
    if (listings.length > 0) {
      listings.forEach(listing => {
        if (listing.latlng && listing.latlng.length >= 2) {
          console.log(`  - "${listing.title}": [${listing.latlng[0]}, ${listing.latlng[1]}]`);
        }
      });
    }
  }

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

      {/* Popular Categories dengan Icon */}
      <section className="mx-auto max-w-6xl px-6 py-6">
        <h3 className="text-sm font-medium text-neutral-600 mb-3">Atau telusuri kategori kami yang paling populer...</h3>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = searchParams?.category === category.label;
            // Preserve location coordinates when filtering by category
            const categoryParams = new URLSearchParams();
            categoryParams.set('category', category.label);
            if (searchParams?.lat) categoryParams.set('lat', searchParams.lat);
            if (searchParams?.lng) categoryParams.set('lng', searchParams.lng);
            
            return (
              <a
                key={category.label}
                href={`/?${categoryParams.toString()}`}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition shadow-sm ${
                  isSelected
                    ? 'bg-[#0A2E46] text-white border-2 border-[#0A2E46]'
                    : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-gray-50 hover:border-neutral-400'
                }`}
              >
                <Icon className="w-5 h-5" />
                {category.label}
              </a>
            );
          })}
        </div>
      </section>

      {/* Section Item yang baru-baru ini aktif - DI BAGIAN ATAS */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-800">
            Item yang baru-baru ini aktif
          </h2>
          {/* Info banner jika filter lokasi aktif */}
          {lat && lng && (
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm text-emerald-800">
                Menampilkan <strong>{listings.length}</strong> barang dalam radius <strong>10km</strong> dari lokasi Anda
              </span>
            </div>
          )}
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
                const userLocation = lat && lng ? { lat, lng } : undefined;
                return (
                  <ListingCard
                    key={listing.id}
                    data={listing}
                    hasFavorited={hasFavorited}
                    userLocation={userLocation}
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
                    userLocation={lat && lng ? { lat, lng } : undefined}
                  />
                </Suspense>
              </div>
            ) : null}
          </>
        )}
      </section>

      {/* Separator / Divider */}
      <div className="mx-auto max-w-6xl px-6">
        <hr className="border-t-2 border-gray-200" />
      </div>

      {/* Section Testimonial - 3 Kolom */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="rounded-2xl bg-gray-50 p-8 shadow-sm hover:shadow-md transition">
              <div className="mb-6 flex justify-center">
                <div className="h-32 w-32 rounded-full overflow-hidden flex items-center justify-center">
                  <Image 
                    src="/images/Allura - Trophy.png" 
                    alt="Daftar Teratas 2024"
                    width={128}
                    height={128}
                    className="object-contain w-auto h-auto"
                    unoptimized
                  />
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
                  <Image 
                    src="/images/Agung.jpg" 
                    alt="Agung - Panitia Event Kampus"
                    className="h-full w-full object-cover"
                    width={128}
                    height={128}
                  />
                </div>
              </div>
              <h3 className="mb-3 text-center text-xl font-bold text-neutral-800">
                Agung : Panitia Event Kampus
              </h3>
              <p className="text-center text-sm text-neutral-600 leading-relaxed">
                Nyari proyektor dadakan H-1 acara susah banget, untung nemu di NyewaYuk. Respon admin cepet, barang bisa langsung COD di kampus.
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="rounded-2xl bg-gray-50 p-8 shadow-sm hover:shadow-md transition">
              <div className="mb-6 flex justify-center">
                <div className="h-32 w-32 rounded-full overflow-hidden flex items-center justify-center">
                  <Image 
                    src="/images/Croods - Lightbulb.png" 
                    alt="Mahasiswa Cerdas Berbagi"
                    width={128}
                    height={128}
                    className="object-contain w-auto h-auto"
                    unoptimized
                  />
                </div>
              </div>
                    <h3 className="mb-3 text-center text-xl font-bold text-neutral-800">
                    Mahasiswa Cerdas Berbagi, Bukan Membeli
                    </h3>
              <p className="text-center text-sm text-neutral-600 leading-relaxed">
                Kami percaya mahasiswa tidak perlu membeli segalanya. Misi NyewaYuk adalah menghubungkan barang nganggur di kost temanmu menjadi solusi hemat untuk kebutuhanmu, kapan saja, di mana saja.
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
                  src="/images/Cool Kids - Together.png" 
                  alt="Semuanya terjamin"
                  width={112}
                  height={112}
                  className="object-contain w-auto h-auto"
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
                  src="/images/Lifesavers - Card ID.png" 
                  alt="Semua orang terverifikasi"
                  width={112}
                  height={112}
                  className="object-contain w-auto h-auto"
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
                  src="/images/Moneyverse - Money.png" 
                  alt="Lebih murah daripada membeli"
                  width={112}
                  height={112}
                  className="object-contain w-auto h-auto"
                />
              </div>
              <h3 className="text-xl font-bold text-neutral-800">Lebih murah daripada membeli</h3>
              <p className="text-sm text-neutral-600 max-w-xs">
                Seringkali 60% lebih murah menyewa melalui NyewaYuk di banding beli baru.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-28 w-28 items-center justify-center rounded-full overflow-hidden">
                <Image 
                  src="/images/Pebble People - Location Pin.png" 
                  alt="Sewa di daerah Anda"
                  width={112}
                  height={112}
                  className="object-contain w-auto h-auto"
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
                  src="/images/Cool Kids - Clock.png" 
                  alt="Jam yang sesuai untuk Anda"
                  width={112}
                  height={112}
                  className="object-contain w-auto h-auto"
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
                  src="/images/People of Brooklyn - The Borough.png" 
                  alt="Baik untuk Lingkungan"
                  width={112}
                  height={112}
                  className="object-contain w-auto h-auto"
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
