import Banner from "@/components/Banner/Banner";
import Introduce from "@/components/Introduce/Introduce";
import { Metadata } from 'next';
import { ProductListItem } from '@/types/product';

// Import services
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';

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
  try {
    // Fetch all categories first
    const categoriesResponse = await categoryService.getCategories();
    const allCategories = categoriesResponse.items;

    // Find our main categories using business IDs
    const racketCategory = allCategories.find(c => c.categoryId === 'RACKETS');
    const shoeCategory = allCategories.find(c => c.categoryId === 'SHOES');
    const shirtCategory = allCategories.find(c => c.categoryId === 'APPAREL_SHIRTS');

    // Fetch featured products for each category in parallel
    const [racketData, shoeData, shirtData] = await Promise.all([
      racketCategory ? productService.getProductsByCategory(racketCategory.id, { 
        limit: 4,
        sort: 'createdAt:desc' 
      }) : Promise.resolve(null),
      shoeCategory ? productService.getProductsByCategory(shoeCategory.id, { 
        limit: 4,
        sort: 'createdAt:desc'
      }) : Promise.resolve(null),
      shirtCategory ? productService.getProductsByCategory(shirtCategory.id, { 
        limit: 4,
        sort: 'createdAt:desc'
      }) : Promise.resolve(null),
    ]);

    // Prepare featured sections with proper typing
    const featuredData = [
      { 
        title: "Vợt Cầu Lông", 
        id: racketCategory?.id, 
        data: racketData?.items || [] 
      },
      { 
        title: "Giày Cầu Lông", 
        id: shoeCategory?.id, 
        data: shoeData?.items || [] 
      },
      { 
        title: "Áo Cầu Lông", 
        id: shirtCategory?.id, 
        data: shirtData?.items || [] 
      },
    ].filter((section) => section.data.length > 0) as FeaturedSection[];

    return (
      <div className="home-container">
        <Banner />
        <div className="home-content">
          <Introduce featuredData={featuredData} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to load homepage data:", error);
    return (
      <div className="error-container">
        <h2>Không thể tải nội dung trang</h2>
        <p>Vui lòng thử lại sau.</p>
      </div>
    );
  }
}
