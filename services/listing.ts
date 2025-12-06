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
    // Validate that data object exists
    if (!data || typeof data !== "object") {
      throw new Error("Invalid listing data");
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

    // Consolidated validation checks
    const validationErrors: string[] = [];

    if (!category) validationErrors.push("category");
    if (!location || !location.region || !location.label || !location.latlng) {
      validationErrors.push("location");
    }
    if (!imageSrc || typeof imageSrc !== "string" || !imageSrc.startsWith("http")) {
      validationErrors.push("image");
    }
    if (!title?.trim()) validationErrors.push("title");
    if (!description?.trim()) validationErrors.push("description");
    if (!brand?.trim()) validationErrors.push("brand");
    if (!model?.trim()) validationErrors.push("model");
    if (!condition?.trim()) validationErrors.push("condition");
    
    const priceNum = parseInt(price, 10);
    if (isNaN(priceNum) || priceNum <= 0) {
      validationErrors.push("price");
    }

    if (validationErrors.length > 0) {
      throw new Error(`Please provide valid: ${validationErrors.join(", ")}`);
    }

    const { region, label: country, latlng } = location;

    const user = await getCurrentUser();
    if (!user) throw new Error("You must be logged in to create a listing");

    const listing = await db.item.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        imageSrc,
        category,
        brand: brand.trim(),
        model: model.trim(),
        condition: condition.trim(),
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
