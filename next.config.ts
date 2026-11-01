import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Statik eksport: server ham, ma'lumotlar bazasi ham yo'q.
 * `npm run build` -> out/ papkasi -> Cloudflare Pages.
 * Dev rejimida esa / ga kirganda to'g'ridan-to'g'ri /en ga yo'naltiradi.
 */
const nextConfig: NextConfig = {
  ...(isDev ? {} : { output: "export" }),
  images: { unoptimized: true },
  poweredByHeader: false,
  trailingSlash: false,
  ...(isDev
    ? {
        async redirects() {
          return [
            {
              source: "/",
              destination: "/en",
              permanent: false,
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;
