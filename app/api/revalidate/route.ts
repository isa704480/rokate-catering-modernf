import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

/** Django admin'da kontent saqlanganda chaqiriladi: sayt keshini darhol yangilaydi. */
export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || req.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  revalidateTag("cms");
  return NextResponse.json({ ok: true, revalidated: ["cms"], at: Date.now() });
}
