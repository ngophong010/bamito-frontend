import { Metadata } from 'next';

import { getAllVouchers } from '@/services/voucherService';
import VoucherListClient from './VoucherListClient'; // Import the new Client Component

export const metadata: Metadata = {
    title: 'Quản lý Voucher',
};

interface AdminVouchersPageProps {
  searchParams: {
    page?: string;
    name?: string; // For searching by voucher ID
  };
}

export default async function AdminVouchersPage({ searchParams }: AdminVouchersPageProps) {
  try {
    const page = searchParams.page ? Number(searchParams.page) : 1;
    const name = searchParams.name || undefined;

    // Fetch the initial list of vouchers on the server
    const initialVoucherData = await getAllVouchers({
      page,
      name,
      limit: 15,
      pagination: true,
    });

    return <VoucherListClient initialVoucherData={initialVoucherData} />;
  } catch (error) {
    console.error("Failed to fetch vouchers:", error);
    return <div>Error loading vouchers. Please try again.</div>;
  }
}
