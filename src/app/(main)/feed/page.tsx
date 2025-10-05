import { getRssFeed } from '@/services/feedService';
import FeedClient from './FeedClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Tin tức Cầu Lông',
    description: 'Cập nhật các tin tức mới nhất về cầu lông trong nước và quốc tế.',
};

// This is a simple service function to fetch the feed on the server
// You can place this in a new `/services/feedService.ts` file
// const getRssFeed = async () => {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/rss`, { cache: 'no-store' });
//   if (!res.ok) throw new Error('Failed to fetch feed');
//   const data = await res.json();
//   return data.items;
// };

export default async function FeedPage() {
  // --- DATA FETCHING ON THE SERVER ---
  try {
    const initialFeedItems = await getRssFeed();
    
    // Pass the server-fetched data as a prop to the Client Component
    return <FeedClient initialFeedItems={initialFeedItems} />;
  } catch (error) {
    console.error("Failed to fetch RSS feed:", error);
    // Render the client with an empty state in case of an error
    return <FeedClient initialFeedItems={[]} />;
  }
}
