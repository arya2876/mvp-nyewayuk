import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

if (!process.env.DATABASE_URL) {
  // Surface a clear message in server logs instead of opaque 500
  throw new Error(
    "Missing DATABASE_URL. Set it in Vercel > Project Settings > Environment Variables."
  );
}

export const db = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
