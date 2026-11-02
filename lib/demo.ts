/**
 * DEMO rejim — backend ulanmagan (masalan Vercel'da).
 * Ma'lumot lib/demo-data.json dan, rasmlar public/demo-media dan olinadi.
 * Agar backend bo'lmasa doim demo-data'dan oladi.
 */
export const DEMO = process.env.NEXT_PUBLIC_DEMO_MODE !== "0";
