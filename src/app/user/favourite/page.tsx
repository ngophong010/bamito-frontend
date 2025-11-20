import { Metadata } from 'next';

// 1. Import the correct, refactored service function
import { favouriteService } from '@/services/favouriteService';
import FavouriteClient from './FavouriteClient'; // Import the new Client Component

export const metadata: Metadata = {
    title: 'Sản phẩm Yêu thích',
    robots: { 
    index: false,
    follow: false,
     }, // Personal pages should not be indexed
};

export const dynamic = 'force-dynamic';

// 2. Define the shape of the props Next.js will provide
interface FavouritePageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function FavouritePage({ searchParams }: FavouritePageProps) {
  // --- 3. DATA FETCHING ON THE SERVER ---
  try {
    const resolvedParams = await searchParams;
    const page = resolvedParams.page ? Number(resolvedParams.page) : 1;
    
    // Fetch the initial list of the user's favourite products
    const initialFavouriteData = await favouriteService.getMyFavourites({ page, limit: 12 });

    // 4. Pass the server-fetched data as a prop to the Client Component
    return <FavouriteClient initialFavouriteData={initialFavouriteData} />;
  } catch (error) {
    console.error("Failed to fetch favourites:", error);
    // Render the client with an empty state in case of an error (e.g., user not logged in)
    // The layout's ProtectUser should handle the redirect anyway.
    return <FavouriteClient initialFavouriteData={{ items: [], totalItems: 0, totalPages: 1, currentPage: 1 }} />;
  }
}
