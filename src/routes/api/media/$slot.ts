import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { IMAGE_SLOTS } from "@/lib/site-content";

export const Route = createFileRoute("/api/media/$slot")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const slot = params.slot;
        if (!IMAGE_SLOTS.some((item) => item.id === slot)) {
          return new Response("Not found", { status: 404 });
        }
        try {
          const sql = await getSql();
          const rows = await sql<{ mime: string; data: string }>`
            select mime, data from site_images where slot = ${slot} limit 1
          `;
          const row = rows[0];
          if (!row) return new Response("Not found", { status: 404 });
          return new Response(Buffer.from(row.data, "base64"), {
            headers: {
              "content-type": row.mime || "image/jpeg",
              "cache-control": "public, max-age=31536000, immutable",
            },
          });
        } catch {
          return new Response("Not found", { status: 404 });
        }
      },
    },
  },
});
