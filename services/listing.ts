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
  const {
    category,
    location: { region, label: country, latlng },
    image: imageSrc,
    price,
    title,
    description,
  } = data;

  // Validate required fields only
  const requiredFields = {
    category,
    region,
    country,
    latlng,
    imageSrc,
    price,
    title,
    description,
  };

  Object.entries(requiredFields).forEach(([key, value]) => {
    if (!value) {
      throw new Error(`Missing required field: ${key}`);
    }
  });

  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized!");

  const listing = await db.item.create({
    data: {
      title,
      description,
      imageSrc,
      category,
      brand: "-",
      model: "-",
      condition: "-",
      nyewaGuardImageSrc: "",
      country,
      region,
      latlng,
      price: parseInt(price, 10),
      userId: user.id,
    },
  });

  return listing;
};

export const updateListing = async (listingId: string, data: { [x: string]: any }) => {
  const {
    category,
    location: { region, label: country, latlng },
    image: imageSrc,
    price,
    title,
    description,
  } = data;

  // Validate required fields
  const requiredFields = {
    category,
    region,
    country,
    latlng,
    imageSrc,
    price,
    title,
    description,
  };

  Object.entries(requiredFields).forEach(([key, value]) => {
    if (!value) {
      throw new Error(`Missing required field: ${key}`);
    }
  });

  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized!");

  // Check if user owns this listing
  const existingListing = await db.item.findUnique({
    where: { id: listingId },
  });

  if (!existingListing || existingListing.userId !== user.id) {
    throw new Error("Unauthorized to update this listing");
  }

  const listing = await db.item.update({
    where: { id: listingId },
    data: {
      title,
      description,
      imageSrc,
      category,
      country,
      region,
      locationValue: latlng,
      price: parseInt(price, 10),
    },
  });

  return listing;
};

