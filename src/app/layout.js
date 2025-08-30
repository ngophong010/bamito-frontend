import { Inter } from "next/font/google";
import Providers from "@/Providers";
import ZaloChat from "@/components/ZaloChat/ZaloChat";
import Script from "next/script";
import "./global.scss";

const inter = Inter({
  subsets: ["latin"],
});

// export async function metadata({ params, searchParams }, parent) {
//   const headersList = headers();
//   const header_url = headersList.get("x-url") || "";
//   const domain = headersList.get("host") || "";

//   return {
//     title: "Trang Chủ - Cửa Hàng Đồ Cầu Lông Chính Hãng",
//     description:
//       "Chào mừng đến với cửa hàng đồ cầu lông chính hãng. Chúng tôi cung cấp vợt cầu lông, giày cầu lông, quần áo và phụ kiện chất lượng cao với giá tốt nhất.",
//     alternates: {
//       canonical: "./",
//     },
//     // metadataBase: new URL(process.env.VERCEL_URL ?? 'http://localhost:3000'),
//     metadataBase: "https://e-commerce-xi-sepia.vercel.app",
//     openGraph: {
//       title: "Trang Chủ - Cửa Hàng Đồ Cầu Lông Chính Hãng",
//       description: "The React Framework for the Web",
//       url: header_url,
//       siteName: domain,
//       images: [
//         {
//           url: "https://res.cloudinary.com/daphxc3ye/image/upload/v1719301372/Badminton/home_page_vpq2yc.png",
//         },
//       ],
//     },
//   };
// }
export const metadata = {
  title: {
    template: "%s | BMT Cửa Hàng Cầu Lông",
    default: "BMT Cửa Hàng Cầu Lông Chính Hãng",
  },
  description:
    "Mua sắm vợt, giày, quần áo và phụ kiện cầu lông chính hãng từ các thương hiệu hàng đầu. Chất lượng cao, giá tốt nhất.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default function RootLayout({ children }) {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-TB2BPBVJ";

  return (
    <html lang="vi">
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}
      </Script>
      <body className={inter.className}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        
        <Providers>{children}</Providers>
        <ZaloChat />
      </body>
    </html>
  );
}
