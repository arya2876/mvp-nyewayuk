import { initEdgeStore } from "@edgestore/server";
import { createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/app";
import type { NextRequest } from "next/server";

const hasEdgeKeys =
  !!process.env.EDGE_STORE_ACCESS_KEY && !!process.env.EDGE_STORE_SECRET_KEY;

const disabled = async () =>
  new Response(
    JSON.stringify({
      message:
        "EdgeStore disabled: missing EDGE_STORE_ACCESS_KEY/EDGE_STORE_SECRET_KEY",
      code: "SERVICE_UNAVAILABLE",
    }),
    { status: 503, headers: { "content-type": "application/json" } }
  );

let GET: (req: NextRequest) => Promise<Response> = disabled;
let POST: (req: NextRequest) => Promise<Response> = disabled;
let edgeStoreRouter: any;

if (hasEdgeKeys) {
  const es = initEdgeStore.create();
  edgeStoreRouter = es.router({
    publicFiles: es.fileBucket(),
  });
  const handler = (createEdgeStoreNextHandler as any)({
    router: edgeStoreRouter,
    createContext: () => ({}),
  });
  // Some versions return a single handler function; use it for both verbs
  GET = handler as (req: NextRequest) => Promise<Response>;
  POST = handler as (req: NextRequest) => Promise<Response>;
}

export { GET, POST };

export type EdgeStoreRouter = typeof edgeStoreRouter;

