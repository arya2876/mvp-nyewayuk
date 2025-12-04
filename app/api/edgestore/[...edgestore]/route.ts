import { initEdgeStore } from "@edgestore/server";
import { createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/app";

const hasEdgeKeys =
  !!process.env.EDGE_STORE_ACCESS_KEY && !!process.env.EDGE_STORE_SECRET_KEY;

let handler: any;
let edgeStoreRouter: any;

if (hasEdgeKeys) {
  const es = initEdgeStore.create();
  edgeStoreRouter = es.router({
    publicFiles: es.fileBucket(),
  });
  handler = createEdgeStoreNextHandler({
    router: edgeStoreRouter,
  });
} else {
  const disabled = async () =>
    new Response(
      JSON.stringify({
        message:
          "EdgeStore disabled: missing EDGE_STORE_ACCESS_KEY/EDGE_STORE_SECRET_KEY",
        code: "SERVICE_UNAVAILABLE",
      }),
      { status: 503, headers: { "content-type": "application/json" } }
    );
  handler = { GET: disabled, POST: disabled } as any;
}

export const GET = hasEdgeKeys ? handler.GET ?? handler : handler.GET;
export const POST = hasEdgeKeys ? handler.POST ?? handler : handler.POST;

export type EdgeStoreRouter = typeof edgeStoreRouter;
