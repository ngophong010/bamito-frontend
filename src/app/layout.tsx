import { Inter } from "next/font/google";
import Providers from "../Providers";
import ZaloChat from "@/components/ZaloChat/ZaloChat";
import Script from "next/script";
import "./global.scss";

// Import the necessary types from Next.js and React
import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter', // Optional but good practice for CSS
});

// ===============================================================
// --- METADATA (The SEO Foundation) ---
// ===============================================================

// ENHANCEMENT: Explicitly type the metadata object with `Metadata` from 'next'
export const metadata: Metadata = {
  title: {
    template: "%s | BMT Badminton Shop",
    default: "BMT Badminton Shop - Cửa Hàng Cầu Lông Chính Hãng",
  },
  description:
    "Mua sắm vợt, giày, quần áo và phụ kiện cầu lông chính hãng từ các thương hiệu hàng đầu như Yonex, Lining, Victor. Chất lượng cao, giá tốt nhất.",
  
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),

  openGraph: {
    title: "BMT Badminton Shop - Cửa Hàng Cầu Lông Chính Hãng",
    description: "Mua sắm vợt, giày, quần áo và phụ kiện cầu lông chính hãng.",
    url: '/',
    siteName: 'BMT Badminton Shop',
    images: [
      {
        url: '/og-image.png', // A default social sharing image in `/public`
        width: 1200,
        height: 630,
        alt: 'BMT Badminton Shop Logo', // Add alt text for accessibility
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  
  twitter: { // ENHANCEMENT: Add Twitter-specific card metadata
    card: 'summary_large_image',
    title: "BMT Badminton Shop - Cửa Hàng Cầu Lông Chính Hãng",
    description: "Mua sắm vợt, giày, quần áo và phụ kiện cầu lông chính hãng.",
    images: ['/og-image.png'], // Must be an absolute URL, but metadataBase handles this
  },

  // ENHANCEMENT: Add other useful metadata
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.webmanifest',
};

// ===============================================================
// --- THE ROOT LAYOUT COMPONENT ---
// ===============================================================

// ENHANCEMENT: Type the 'children' prop using React's PropsWithChildren
export default function RootLayout({ children }: PropsWithChildren) {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="vi" className={inter.variable}> {/* Use font variable */}
      {/* GTM Script */}
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

      <body>
        {/* GTM Noscript Fallback */}
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
        
        {/* Wrap children with all necessary application providers */}
        <Providers>{children}</Providers>
        
        {/* Global components like a chat widget can go here */}
        <ZaloChat />
      </body>
    </html>
  );
}
