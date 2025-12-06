"use server";
import { db } from "@/lib/db";
import { LISTINGS_BATCH } from "@/utils/constants";
import { getCurrentUser } from "./user";

export const getListings = async (query?: {
  [key: string]: string | string[] | undefined | null;
}) => {
  try {
    const {
      userId,
      country,
      startDate,
      endDate,
      category,
      cursor,
    } = query || {};

    let where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (category) {
      where.category = category;
    }

    if (country) {
      where.country = country;
    }

    if (startDate && endDate) {
      where.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: startDate },
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate },
              },
            ],
          },
        },
      };
    }

    const filterQuery: any = {
      where,
      take: LISTINGS_BATCH,
      orderBy: { createdAt: "desc" },
    };

    if (cursor) {
      filterQuery.cursor = { id: cursor };
      filterQuery.skip = 1;
    }

    const listings = await db.item.findMany(filterQuery);

    const nextCursor =
      listings.length === LISTINGS_BATCH
        ? listings[LISTINGS_BATCH - 1].id
        : null;

    return {
      listings,
      nextCursor,
    };
  } catch (error) {
    return {
      listings: [],
      nextCursor: null,
    };
  }
};

export const getListingById = async (id: string) => {
  const listing = await db.item.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      reservations: {
        select: {
          startDate: true,
          endDate: true,
        },
      },
    },
  });

  return listing;
};

export const createListing = async (data: { [x: string]: any }) => {
  try {
    // Validate required fields
    if (!data.category || !data.location || !data.image || !data.price || 
        !data.title || !data.description || !data.brand || !data.model || 
        !data.condition) {
      throw new Error("Please fill in all required fields");
    }

    const {
      category,
      location,
      image: imageSrc,
      price,
      title,
      description,
      brand,
      model,
      condition,
      nyewaGuardImageSrc,
    } = data;

    // Validate location object
    if (!location || !location.region || !location.label || !location.latlng) {
      throw new Error("Please select a valid location");
    }

    const { region, label: country, latlng } = location;

    // Validate image URLs
    if (!imageSrc || typeof imageSrc !== "string" || !imageSrc.startsWith("http")) {
      throw new Error("Please upload a valid image");
    }

    // Validate price
    const priceNum = parseInt(price, 10);
    if (isNaN(priceNum) || priceNum <= 0) {
      throw new Error("Please enter a valid price");
    }

    const user = await getCurrentUser();
    if (!user) throw new Error("You must be logged in to create a listing");

    const listing = await db.item.create({
      data: {
        title,
        description,
        imageSrc,
        category,
        brand,
        model,
        condition,
        nyewaGuardImageSrc: nyewaGuardImageSrc || null,
        country,
        region,
        latlng,
        price: priceNum,
        userId: user.id,
      },
    });

    return listing;
  } catch (error: any) {
    console.error("Create listing error:", error);
    throw error;
  }
};
