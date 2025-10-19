import Banner from "@/components/Banner/Banner";
import Introduce from "@/components/Introduce/Introduce";
import { Metadata } from 'next';

// 1. Import all the necessary service functions
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';

// ... (your metadata object)

export default async function HomePage() {
  // --- DATA FETCHING ON THE SERVER ---
  try {
    // We need the IDs for our main categories. Fetching them dynamically is best.
    const allCategories = await categoryService.getCategories();
    const racketCategory = allCategories.find(c => c.categoryId === 'RACKETS');
    const shoeCategory = allCategories.find(c => c.categoryId === 'SHOES');
    const shirtCategory = allCategories.find(c => c.categoryId === 'APPAREL_SHIRTS');

    // Fetch the top 4 products for each category IN PARALLEL
    const [racketData, shoeData, shirtData] = await Promise.all([
      racketCategory ? productService.getProductsByCategory(racketCategory.id, { limit: 4 }) : Promise.resolve(null),
      shoeCategory ? productService.getProductsByCategory(shoeCategory.id, { limit: 4 }) : Promise.resolve(null),
      shirtCategory ? productService.getProductsByCategory(shirtCategory.id, { limit: 4 }) : Promise.resolve(null),
    ]);

    const featuredData = [
        { title: "Vợt Cầu Lông", id: racketCategory?.id, data: racketData?.items || [] },
        { title: "Giày Cầu Lông", id: shoeCategory?.id, data: shoeData?.items || [] },
        { title: "Áo Cầu Lông", id: shirtCategory?.id, data: shirtData?.items || [] },
    ].filter(section => section.data.length > 0);

    return (
      <div className="home-container">
        <Banner />
        <div className="home-content">
          {/* 2. Pass the server-fetched data as a prop */}
          <Introduce featuredData={featuredData} />
          {/* ... your other homepage sections ... */}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to load homepage data:", error);
    // Render a fallback or an empty state
    return <div>Error loading page content.</div>;
  }
}
