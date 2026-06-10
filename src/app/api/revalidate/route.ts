import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

// Sanity webhook → instant cache purge. Configure in sanity.io/manage:
//   API → Webhooks → URL https://<site>/api/revalidate, secret = SANITY_REVALIDATE_SECRET
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature } = await parseBody(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    );

    if (!isValidSignature) {
      return new NextResponse("Invalid signature", { status: 401 });
    }

    revalidateTag("sanity", "max");
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    console.error("Revalidate webhook error:", err);
    return new NextResponse("Error revalidating", { status: 500 });
  }
}
