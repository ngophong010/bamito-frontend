import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BAMITO Badminton Shop",
    short_name: "BAMITO Shop",
    description:
      "Cửa hàng cầu lông chính hãng BMT. Mua sắm vợt, giày, quần áo và phụ kiện cầu lông chất lượng cao với giá tốt nhất.",
    icons: [
      {
        // FIX: Paths must be absolute from the root. The public folder is served at '/'.
        src: "/images/logo-192.png", // Assumes you have this file in /public/images/
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/images/logo-512.png", // You should have a separate, larger icon file
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    theme_color: "#1A94FF",
    background_color: "#FFFFFF",
    start_url: "/",
    display: "standalone",
    orientation: "portrait", // 'portrait' is often a better default for mobile-first apps
    scope: "/",
  };
}
