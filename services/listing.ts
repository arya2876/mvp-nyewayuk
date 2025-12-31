"use server";
import { db } from "@/lib/db";
import { LISTINGS_BATCH, HOMEPAGE_LISTINGS_LIMIT } from "@/utils/constants";
import { getCurrentUser } from "./user";

// Fungsi Haversine untuk menghitung jarak
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius bumi dalam km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

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
      search, // Add search parameter
      lat, // Koordinat latitude user
      lng, // Koordinat longitude user
    } = query || {};

    let where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (country) {
      where.country = country;
    }

    // Search filter - search in title, description, brand, model, category
    if (search && typeof search === 'string') {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Category filter (only apply if no search or search is applied)
    if (category && !search) {
      where.category = category;
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
      take: cursor ? LISTINGS_BATCH : HOMEPAGE_LISTINGS_LIMIT, // Homepage: 10, LoadMore: 16
      orderBy: { createdAt: "desc" },
    };

    if (cursor) {
      filterQuery.cursor = { id: cursor };
      filterQuery.skip = 1;
    }

    let listings = await db.item.findMany(filterQuery);

    // Filter berdasarkan jarak maksimal 10km jika koordinat user tersedia
    if (lat && lng) {
      const userLat = parseFloat(lat as string);
      const userLng = parseFloat(lng as string);

      if (!isNaN(userLat) && !isNaN(userLng)) {
        console.log(`🔍 Filtering by location: User at [${userLat}, ${userLng}]`);

        listings = listings.filter(listing => {
          if (!listing.latlng || listing.latlng.length < 2) {
            console.log(`⚠️ Listing "${listing.title}" has no coordinates`);
            return false; // Skip listing tanpa koordinat
          }

          const listingLat = listing.latlng[0];
          const listingLng = listing.latlng[1];
          const distance = calculateDistance(userLat, userLng, listingLat, listingLng);

          console.log(`📍 Listing "${listing.title}": [${listingLat}, ${listingLng}] = ${distance.toFixed(2)}km dari user`);

          return distance <= 10; // Hanya tampilkan dalam radius 10km
        });

        console.log(`✅ Found ${listings.length} listings within 10km`);
      }
    }

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
  try {
    const listing = await db.item.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            email: true,
            phone: true,
            address: true,
            averageRatingAsLender: true,
            totalReviewsAsLender: true,
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

    // Handle case where user was deleted but item still exists
    if (listing && !listing.user) {
      return {
        ...listing,
        user: {
          name: "Pengguna Dihapus",
          image: null,
          email: null,
          phone: null,
          address: null,
        },
      };
    }

    return listing;
  } catch (error) {
    console.error("Error fetching listing by ID:", error);
    return null;
  }
};

export const createListing = async (data: { [x: string]: any }) => {
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
  } = data;

  // Extract location data
  const province = location?.province;
  const city = location?.city;
  const district = location?.district;
  const latlng = location?.latlng;
  const fullAddress = location?.label;

  // Validate required fields
  const requiredFields = {
    category,
    province,
    city,
    district,
    latlng,
    imageSrc,
    price,
    title,
    description,
    brand,
    model,
    condition,
  };

  Object.entries(requiredFields).forEach(([key, value]) => {
    if (!value) {
      throw new Error(`Missing required field: ${key}`);
    }
  });

  const user = await getCurrentUser();
  if (!user) throw new Error("Tidak diizinkan!");

  const listing = await db.item.create({
    data: {
      title,
      description,
      imageSrc,
      category,
      brand,
      model,
      condition,
      nyewaGuardImageSrc: "",
      province,
      city,
      district,
      country: fullAddress, // Store full address for backward compatibility
      region: city, // Store city as region for backward compatibility
      latlng,
      price: parseInt(price, 10),
      userId: user.id,
    },
  });

  console.log(`✅ LISTING CREATED: "${title}" at coordinates [${latlng[0]}, ${latlng[1]}] (${district}, ${city})`);

  return listing;
};

export const updateListing = async (listingId: string, data: { [x: string]: any }) => {
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
  } = data;

  // Extract location data
  const province = location?.province;
  const city = location?.city;
  const district = location?.district;
  const latlng = location?.latlng;
  const fullAddress = location?.label;

  // Validate required fields
  const requiredFields = {
    category,
    province,
    city,
    district,
    latlng,
    imageSrc,
    price,
    title,
    description,
    brand,
    model,
    condition,
  };

  Object.entries(requiredFields).forEach(([key, value]) => {
    if (!value) {
      throw new Error(`Missing required field: ${key}`);
    }
  });

  const user = await getCurrentUser();
  if (!user) throw new Error("Tidak diizinkan!");

  // Check if user owns this listing
  const existingListing = await db.item.findUnique({
    where: { id: listingId },
  });

  if (!existingListing || existingListing.userId !== user.id) {
    throw new Error("Tidak diizinkan mengupdate listing ini");
  }

  const listing = await db.item.update({
    where: { id: listingId },
    data: {
      title,
      description,
      imageSrc,
      category,
      brand,
      model,
      condition,
      province,
      city,
      district,
      country: fullAddress,
      region: city,
      latlng,
      price: parseInt(price, 10),
    },
  });

  return listing;
};

