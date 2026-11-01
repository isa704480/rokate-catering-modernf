/**
 * media-src/ ichidagi rasmlardan public/media/ uchun WebP variantlar yasaydi.
 * Har bir rasm uchun: __w480, __w960, __w1500 va manifest yozuvi (o'lcham + blur).
 *
 * Ishga tushirish: npm run media
 * Decap orqali yuklangan yangi rasmlar variantsiz bo'ladi — Img ularni asl holida ko'rsatadi.
 */
import { readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "media-src";
const OUT = "public/media";
const WIDTHS = [480, 960, 1500];

const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
await mkdir(OUT, { recursive: true });

const manifest = {};

for (const file of files) {
  const base = file.replace(/\.[^.]+$/, "");
  const input = path.join(SRC, file);
  const img = sharp(input, { failOn: "none" });
  const meta = await img.metadata();
  const isLogo = base.startsWith("logo-");

  if (isLogo) {
    // Logotip — shaffoflik saqlanishi kerak, bitta o'lcham yetarli
    await img.clone().resize({ width: 560, withoutEnlargement: true }).webp({ quality: 92 }).toFile(path.join(OUT, `${base}.webp`));
    manifest[base] = { w: meta.width, h: meta.height, widths: [], ext: "webp" };
    continue;
  }

  const widths = WIDTHS.filter((w) => w <= (meta.width ?? 0) * 1.2);
  for (const w of widths) {
    await img
      .clone()
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: w >= 1500 ? 76 : 80 })
      .toFile(path.join(OUT, `${base}__w${w}.webp`));
  }

  // Yuklanmaguncha turadigan juda kichik blur — layout sakramasligi uchun
  const blurBuf = await img.clone().resize({ width: 14 }).webp({ quality: 35 }).toBuffer();

  manifest[base] = {
    w: meta.width,
    h: meta.height,
    widths,
    blur: `data:image/webp;base64,${blurBuf.toString("base64")}`,
  };
  process.stdout.write(`${base} `);
}

await writeFile(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 0));
console.log(`\n${Object.keys(manifest).length} ta rasm tayyor.`);
