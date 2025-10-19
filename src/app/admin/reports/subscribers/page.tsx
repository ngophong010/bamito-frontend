import { Metadata } from 'next';
import { subscriberService } from '@/services/subscriberService';
import SubscriberClient from './SubscriberClient';

export const metadata: Metadata = {
    title: 'Quản lý Email Marketing',
};

interface SubscribersPageProps {
  searchParams: { page?: string; };
}

export default async function SubscribersPage({ searchParams }: SubscribersPageProps) {
  // --- DATA FETCHING ON THE SERVER ---
  try {
    const page = searchParams.page ? Number(searchParams.page) : 1;
    const initialSubscriberData = await subscriberService.getSubscribers({ page, limit: 15 });

    // Pass the server-fetched data as a prop
    return <SubscriberClient initialSubscriberData={initialSubscriberData} />;
  } catch (error) {
    console.error("Failed to fetch subscribers:", error);
    return <div>Error loading subscribers. Please try again.</div>;
  }
}
