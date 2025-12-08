import React from "react";

import EmptyState from "@/components/EmptyState";
import ListingCard from "@/components/ListingCard";
import Heading from "@/components/Heading";

import { getCurrentUser } from "@/services/user";
import { getFavoriteListings } from "@/services/favorite";

const FavoritesPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return <EmptyState title="Tidak Diizinkan" subtitle="Silakan masuk" />;
  }

  const favorites = await getFavoriteListings();

  if (favorites.length === 0) {
    return (
      <EmptyState
        title="Tidak Ada Favorit"
        subtitle="Anda belum menandai barang apapun sebagai favorit."
      />
    );
  }

  return (
    <section className="main-container">
      <Heading title="Favorit" subtitle="Daftar barang yang Anda sukai!" />
      <div className=" mt-8 md:mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
        {favorites.map((item) => {
          return <ListingCard key={item.id} data={item} hasFavorited/>;
        })}
      </div>
    </section>
  );
};

export default FavoritesPage;
