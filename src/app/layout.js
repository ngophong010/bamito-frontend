import { Inter } from "next/font/google";
import Providers from "@/Providers";
import ZaloChat from "@/components/ZaloChat/ZaloChat";
import Script from "next/script";
import "./global.scss";

const inter = Inter({
  subsets: ["latin"],
});

// ===============================================================
// --- METADATA (The SEO Foundation) ---
// ===============================================================

// This is the default metadata for the entire site.
// Child pages can override these properties.
export const metadata = {
  title: {
    template: "%s | BMT Badminton Shop",
    default: "BMT Badminton Shop - Cửa Hàng Cầu Lông Chính Hãng", // Default title for the homepage
  },
  description:
    "Mua sắm vợt, giày, quần áo và phụ kiện cầu lông chính hãng từ các thương hiệu hàng đầu như Yonex, Lining, Victor. Chất lượng cao, giá tốt nhất.",
  
  // Set the base URL for all relative URLs in the metadata
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),

  // ENHANCEMENT 1: Add Open Graph (OG) metadata for social sharing
  openGraph: {
    title: "BMT Badminton Shop - Cửa Hàng Cầu Lông Chính Hãng",
    description: "Mua sắm vợt, giày, quần áo và phụ kiện cầu lông chính hãng.",
    url: '/', // The canonical URL for the homepage
    siteName: 'BMT Badminton Shop',
    images: [
      {
        url: '/og-image.png', // Place a default social sharing image in your `/public` folder
        width: 1200,
        height: 630,
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },

  // Add site-wide JSON-LD Structured Data
  // This tells Google you are an Organization or Store.
  other: {
    'application/ld+json': JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Store",
      name: "BMT Badminton Shop",
      url: process.env.NEXT_PUBLIC_SITE_URL,
      logo: `${process.env.NEXT_PUBLIC_SITE_URL}/images/logo1.png`,
      // Add other properties like address, telephone, etc. if applicable
    }),
  }
};

// ===============================================================
// --- THE ROOT LAYOUT COMPONENT ---
// ===============================================================
export default function RootLayout({ children }) {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-TB2BPBVJ";

  return (
    <html lang="vi">
    {GTM_ID && (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
      )}

      <body className={inter.className}>
        {/* The GTM noscript tag for users with JavaScript disabled */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
        )}
        
        <Providers>{children}</Providers>
        <ZaloChat />
      </body>
    </html>
  );
}
