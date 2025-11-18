import Banner from "@/components/Banner/Banner";
import Introduce from "@/components/Introduce/Introduce";
import UserLayout from "@/layout/userLayout/UserLayout";
import Image from "next/image";
import { categoryService } from '@/services/categoryService';
import { productService } from '@/services/productService';
import { Metadata } from 'next';
import { ProductListItem } from '@/types/product';
import "./page.scss";

// Define metadata for better SEO
export const metadata: Metadata = {
  title: 'BAMITO Shop - Cửa Hàng Cầu Lông Chuyên Nghiệp',
  description: 'Cung cấp các sản phẩm cầu lông chất lượng cao, vợt cầu lông, giày và trang phục từ các thương hiệu uy tín.',
  openGraph: {
    title: 'BAMITO Shop - Cửa Hàng Cầu Lông Chuyên Nghiệp',
    description: 'Cung cấp các sản phẩm cầu lông chất lượng cao, vợt cầu lông, giày và trang phục từ các thương hiệu uy tín.',
    type: 'website',
  },
};

interface FeaturedSection {
  readonly title: string;
  readonly id?: number;
  readonly data: ProductListItem[];
}

export default async function HomePage() {
  // Always provide empty arrays as fallback to prevent layout issues
  const categories: any[] = [];
  const featuredData: FeaturedSection[] = [];
  
  return (
    <UserLayout categories={categories}>
      <div className="home-container">
        <Banner />
        <div className="home-content">
          <Introduce featuredData={featuredData} />
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
    </UserLayout>
  );
}
