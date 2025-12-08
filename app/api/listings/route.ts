import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Fungsi Haversine untuk menghitung jarak
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius bumi dalam km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const search = searchParams.get("search");

    let where: any = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
      ];
    }

    let listings = await db.item.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // Filter by distance if lat/lng provided
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      if (!isNaN(userLat) && !isNaN(userLng)) {
        listings = listings.filter((listing) => {
          if (!listing.latlng || listing.latlng.length < 2) return true; // Include items without coordinates
          
          const distance = calculateDistance(
            userLat,
            userLng,
            listing.latlng[0],
            listing.latlng[1]
          );
          
          return distance <= 50; // 50km radius for category page
        });
      }
    }

    return NextResponse.json({ listings });
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json({ listings: [], error: "Failed to fetch listings" }, { status: 500 });
  }
}
