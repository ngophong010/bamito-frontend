import React from "react";
import Banner from "@/components/Banner/Banner";
import Introduce from "@/components/Introduce/Introduce";
import Image from "next/image";
import UserLayout from "@/layout/userLayout/UserLayout";
import "./page.scss";

export async function generateMetadata() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "BAMITO Badminton Shop",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    image: "https://example.com/photos/yonex-racket.jpg",
    description: "Cửa hàng cầu lông chính hãng. Chúng tôi cung cấp vợt, giày, quần áo và phụ kiện chất lượng cao.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Đường ABC",
      addressLocality: "Thành phố Hồ Chí Minh",
      postalCode: "700000",
      addressCountry: "VN"
    },
    telephone: "+84123456789"
  };

  return {
    title: "Trang Chủ - Cửa Hàng Đồ Cầu Lông Chính Hãng",
    description: "Chào mừng đến với cửa hàng đồ cầu lông chính hãng BMT. Chúng tôi cung cấp vợt, giày, quần áo và phụ kiện chất lượng cao với giá tốt nhất.",
    alternates: {
      canonical: "/", // The canonical URL for the homepage is the root
    },
    other: {
      "application/ld+json": JSON.stringify(jsonLd),
    }
  };
}

function Home() {
  return (
    <UserLayout>
      <div className="home-container">
        <Banner></Banner>
        <div className="home-content">
          <Introduce></Introduce>
          <div className="home-benefit">
            <div className="benefit-grid-container">
              {/* Item 1 */}
              <div className="benefit-item">
                <Image
                  src="/images/policy_image_2 1.png"
                  width={60}
                  height={60}
                  alt="Vận chuyển toàn quốc"
                  className="benefit-item-img"
                />
                <div className="benefit-item-text">
                  Vận chuyển toàn quốc, thanh toán khi nhận hàng
                </div>
              </div>
              {/* Item 2 */}
              <div className="benefit-item">
                <Image
                  src="/images/thanh_toan 1.png"
                  height={60}
                  width={60}
                  alt="Thanh toán đa dạng"
                  className="benefit-item-img"
                />
                <div className="benefit-item-text">
                  Tiến hành thanh toán với nhiều phương thức
                </div>
              </div>
              {/* Item 3 */}
              <div className="benefit-item">
                <Image
                  src="/images/policy_image_1 1.png"
                  alt="Sản phẩm chất lượng"
                  height={60}
                  width={60}
                  className="benefit-item-img"
                />
                <div className="benefit-item-text">
                  Sản phẩm đảm bảo chất lượng
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default Home;
