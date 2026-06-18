import { NextResponse } from "next/server";
import { getBrand } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET() {
  const { faviconUrl } = await getBrand();

  if (!faviconUrl) {
    return new NextResponse(null, { status: 404 });
  }

  const res = await fetch(faviconUrl, { next: { revalidate: 3600 } });
  const buffer = await res.arrayBuffer();
  const contentType = res.headers.get("content-type") || "image/png";

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
