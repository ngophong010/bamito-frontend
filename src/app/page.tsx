// This is a Server Component, no "use client" needed.
import React from "react";
import Image from "next/image";
import { Metadata } from 'next';

// Import the specific components for the homepage
import Banner from "@/components/Banner/Banner";
import Introduce from "@/components/Introduce/Introduce";
import "./page.scss";

// ===============================================================
// --- METADATA (The SEO Foundation) ---
// ===============================================================

// Create the structured data object
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "BMT Badminton Shop",
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  logo: `${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.png`, // Use your actual logo URL
  image: `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.png`, // Your main OG image
  description: "Cửa hàng cầu lông chính hãng. Chúng tôi cung cấp vợt, giày, quần áo và phụ kiện chất lượng cao.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "123 ABC Street",
    addressLocality: "Ho Chi Minh City",
    postalCode: "700000",
    addressCountry: "VN"
  },
  telephone: "+84123456789"
};

// Define the metadata for this specific page
export const metadata: Metadata = {
  title: "Trang Chủ - Cửa Hàng Đồ Cầu Lông Chính Hãng", // No need for 'default' here, this IS the default page
  description: "Chào mừng đến với cửa hàng đồ cầu lông chính hãng BMT. Chúng tôi cung cấp vợt, giày, quần áo và phụ kiện chất lượng cao với giá tốt nhất.",
  alternates: {
    canonical: "/", // The canonical URL for the homepage is the root
  },
  // Attach the JSON-LD data
  other: {
    'application/ld+json': JSON.stringify(jsonLd),
  }
};

// ===============================================================
// --- THE HOMEPAGE COMPONENT ---
// ===============================================================
export default function HomePage() {
  return (
    // The component is now clean and only contains its own content.
    // The <UserLayout> is automatically applied by the parent layout.tsx.
    <div className="home-container">
      <Banner />
      <div className="home-content">
        <Introduce featuredData={[]} />
        <div className="home-benefit">
          <div className="benefit-grid-container">
            <div className="benefit-item">
              <Image src="/images/policy_image_2 1.png" width={60} height={60} alt="Vận chuyển toàn quốc" />
              <div className="benefit-item-text">Vận chuyển toàn quốc, thanh toán khi nhận hàng</div>
            </div>
            <div className="benefit-item">
              <Image src="/images/thanh_toan 1.png" height={60} width={60} alt="Thanh toán đa dạng" />
              <div className="benefit-item-text">Tiến hành thanh toán với nhiều phương thức</div>
            </div>
            <div className="benefit-item">
              <Image src="/images/policy_image_1 1.png" alt="Sản phẩm chất lượng" height={60} width={60} />
              <div className="benefit-item-text">Sản phẩm đảm bảo chất lượng</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
