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
            src="/images/Gemini_Generated_Image_etircvetircvetir.png" 
            fill
            className="object-cover" 
            alt="Drone Flying Background"
            priority
          />
          {/* Dark Overlay untuk readability */}
            <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        {/* Konten Hero */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
          {/* Judul Utama */}
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg">
            Unlock Your Assets with RENLE
          </h1>
          
          {/* Subjudul */}
          <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto drop-shadow-md">
            Ubah barang nganggur jadi cuan, atau sewa alat impian tanpa beli mahal
          </p>
          
          {/* Search Bar Component */}
          <HeroSearch />
        </div>
      </section>

      {/* Popular Categories - Clean Modern Design */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <h3 className="text-sm font-medium text-neutral-400 mb-5 animate-fadeIn">
          Telusuri kategori populer
        </h3>
        <div className="flex flex-wrap gap-3 stagger-children">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = searchParams?.category === category.label;
            const categorySlug = category.label.toLowerCase().replace(/\s+/g, "-");
            
            return (
              <a
                key={category.label}
                href={`/kategori/${categorySlug}`}
                className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 category-icon ${
                  isSelected
                    ? 'bg-[#00A99D] text-white shadow-lg shadow-[#00A99D]/20'
                    : 'bg-neutral-800 text-neutral-300 border border-neutral-700 hover:border-[#00A99D]/40 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 transition-all duration-300 ${
                  isSelected ? 'text-white' : 'text-[#00A99D] group-hover:scale-110'
                }`} strokeWidth={2} />
                <span className="transition-colors duration-300">{category.label}</span>
              </a>
            );
          })}
        </div>
      </section>

      {/* Section Item yang baru-baru ini aktif */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Item yang baru-baru ini aktif
          </h2>
          {/* Info banner jika filter lokasi aktif */}
          {lat && lng && (
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-[#00A99D]/10 dark:bg-[#00A99D]/20 border border-[#00A99D]/30 rounded-lg">
              <svg className="w-5 h-5 text-[#00A99D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm text-[#00A99D] dark:text-[#00A99D]">
                Menampilkan <strong>{listings.length}</strong> barang dalam radius <strong>10km</strong> dari lokasi Anda
              </span>
            </div>
          )}
        </div>
        
        {/* Grid Listing atau Empty State */}
        {!listings || listings.length === 0 ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Belum ada barang yang di-upload</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
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
        <hr className="border-t-2 border-gray-200 dark:border-neutral-700" />
      </div>

      {/* Section Testimonial - 3 Kolom */}
      <section className="bg-white dark:bg-[#1E293B] py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="rounded-2xl bg-gray-50 dark:bg-[#121212] border border-transparent dark:border-white/10 p-8 shadow-sm hover:shadow-md dark:shadow-neutral-950/50 transition">
              <div className="mb-6 flex justify-center">
                <div className="h-32 w-32 rounded-full overflow-hidden flex items-center justify-center">
                  <Image 
                    src="/images/portrait-young-person-celebrating-world-photography-day-with-camera-device.jpg" 
                    alt="Daftar Teratas 2024"
                    width={128}
                    height={128}
                    className="object-contain w-auto h-auto"
                    unoptimized
                  />
                </div>
              </div>
              <h3 className="mb-3 text-center text-xl font-bold text-neutral-800 dark:text-white">
                Sewa Lebih Hemat, Gaya Tetap Dapat
              </h3>
              <p className="text-center text-sm text-neutral-600 dark:text-gray-300 leading-relaxed">
                Kenapa harus beli kamera 15 juta kalau cuma dipakai weekend? Di RENLE, akses ribuan alat hobi dan elektronik berkualitas di sekitarmu. Cukup bayar saat butuh, sisa uangnya bisa untuk tabungan.
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="rounded-2xl bg-gray-50 dark:bg-[#121212] border border-transparent dark:border-white/10 p-8 shadow-sm hover:shadow-md dark:shadow-neutral-950/50 transition">
              <div className="mb-6 flex justify-center">
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 overflow-hidden">
                  <Image 
                    src="/images/excited-asian-guy-using-laptop-celebrating-success-shaking-fists.jpg" 
                    alt="Agung - Panitia Event Kampus"
                    className="h-full w-full object-cover"
                    width={128}
                    height={128}
                  />
                </div>
              </div>
              <h3 className="mb-3 text-center text-xl font-bold text-neutral-800 dark:text-white">
                Agung : Kamera Nganggur Jadi "passive income" 
              </h3>
              <p className="text-center text-sm text-neutral-600 dark:text-gray-300 leading-relaxed">
                Dulu kamera saya cuma diam di lemari dan harganya terus turun. Sekarang? Justru jadi sumber pemasukan. Lewat RENLE, aset tidur saya berubah jadi passive income aman yang bisa membiayai uang kuliah dan upgrade alat baru, tanpa rasa was-was.
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="rounded-2xl bg-gray-50 dark:bg-[#121212] border border-transparent dark:border-white/10 p-8 shadow-sm hover:shadow-md dark:shadow-neutral-950/50 transition">
              <div className="mb-6 flex justify-center">
                <div className="h-32 w-32 rounded-full overflow-hidden flex items-center justify-center">
                  <Image 
                    src="/images//man-holding-book-clothes-donate-box-donation-concept.jpg" 
                    alt="Mahasiswa Cerdas Berbagi"
                    width={128}
                    height={128}
                    className="object-contain w-auto h-auto"
                    unoptimized
                  />
                </div>
              </div>
                    <h3 className="mb-3 text-center text-xl font-bold text-neutral-800 dark:text-white">
                    Mahasiswa Cerdas Berbagi, Bukan Membeli
                    </h3>
              <p className="text-center text-sm text-neutral-600 dark:text-gray-300 leading-relaxed">
                Kami percaya mahasiswa tidak perlu membeli segalanya. Misi RENLE adalah menghubungkan barang nganggur di kost temanmu menjadi solusi hemat untuk kebutuhanmu, kapan saja, di mana saja.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Value Proposition - Grid 6 dengan Icon Ungu */}
      <section className="bg-gradient-to-b from-gray-50 to-white dark:from-[#1E293B] dark:to-[#121212] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-2">
            {/* Row 1 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-28 w-28 items-center justify-center rounded-full p-2">
                <Image 
                  src="/images/shield.png" 
                  alt="Semuanya terjamin"
                  width={112}
                  height={112}
                  className="object-contain w-auto h-auto"
                />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 dark:text-white">Semuanya Terjamin</h3>
              <p className="text-sm text-neutral-600 dark:text-gray-300 max-w-xs">
                Perlindungan Bagi Penyewa Dan Pemilik Barang
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-28 w-28 items-center justify-center rounded-full p-2">
                <Image 
                  src="/images/authentication (1).png" 
                  alt="Semua orang terverifikasi"
                  width={112}
                  height={112}
                  className="object-contain w-auto h-auto"
                />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 dark:text-white">Semua Orang Terverifikasi</h3>
              <p className="text-sm text-neutral-600 dark:text-gray-300 max-w-xs">
                RENLE aman. Semua orang terverifikasi.
              </p>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-28 w-28 items-center justify-center rounded-full overflow-hidden">
                <Image 
                  src="/images/profit.png" 
                  alt="Lebih murah daripada membeli"
                  width={112}
                  height={112}
                  className="object-contain w-auto h-auto"
                />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 dark:text-white">Lebih Murah Daripada Membeli</h3>
              <p className="text-sm text-neutral-600 dark:text-gray-300 max-w-xs">
                Seringkali 60% lebih murah menyewa melalui RENLE di banding beli baru.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-28 w-28 items-center justify-center rounded-full overflow-hidden">
                <Image 
                  src="/images/google-maps.png" 
                  alt="Sewa di daerah Anda"
                  width={112}
                  height={112}
                  className="object-contain w-auto h-auto"
                />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 dark:text-white">Sewa Di Daerah Anda</h3>
              <p className="text-sm text-neutral-600 dark:text-gray-300 max-w-xs">
                Anda biasanya dapat menyewa sesuatu yang lebih dekat dengan Anda daripada toko terdekat.
              </p>
            </div>

            {/* Row 3 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-28 w-28 items-center justify-center rounded-full p-2">
                <Image 
                  src="/images/schedule.png" 
                  alt="Jam yang sesuai untuk Anda"
                  width={112}
                  height={112}
                  className="object-contain w-auto h-auto"
                />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 dark:text-white">Waktu Yang Sesuai Untuk Anda</h3>
              <p className="text-sm text-neutral-600 dark:text-gray-300 max-w-xs">
                Sewa kapan saja yang cocok untuk Anda
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-28 w-28 items-center justify-center rounded-full p-2">
                <Image 
                  src="/images/ecologism.png" 
                  alt="Baik untuk Lingkungan"
                  width={112}
                  height={112}
                  className="object-contain w-auto h-auto"
                />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 dark:text-white">Baik Untuk Lingkungan</h3>
              <p className="text-sm text-neutral-600 dark:text-gray-300 max-w-xs">
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
