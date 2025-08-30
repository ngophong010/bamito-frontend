

export default function manifest() {
  return {
    name: "BAMITO Badminton Shop",
    short_name: "BAMITO Shop",
    description:
      "Cửa hàng cầu lông chính hãng BMT. Mua sắm vợt, giày, quần áo và phụ kiện cầu lông chất lượng cao với giá tốt nhất.",
    icons: [
      {
        src: "../../../public/images/corlor-logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "../../../public/images/corlor-logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    theme_color: "#1A94FF",
    background_color: "#FFFFFF",
    start_url: "/",
    display: "standalone",
    orientation: "any",
    related_applications: [
    ],
    scope: "/",
  };
}
