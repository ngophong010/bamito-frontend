import { Metadata } from 'next';

import { voucherService } from '@/services/voucherService';
import VoucherListClient from './VoucherListClient'; // Import the new Client Component

export const metadata: Metadata = {
    title: 'Quản lý Voucher',
};

export const dynamic = 'force-dynamic';

interface AdminVouchersPageProps {
  searchParams: Promise<{
    page?: string;
    name?: string; // For searching by voucher ID
  }>;
}

export default async function AdminVouchersPage({ searchParams }: AdminVouchersPageProps) {
  try {
    const resolvedParams = await searchParams;
    const page = resolvedParams.page ? Number(resolvedParams.page) : 1;
    const name = resolvedParams.name || undefined;

    // Fetch the initial list of vouchers on the server
    const initialVoucherData = await voucherService.getAllVouchers({
      page,
      limit: 15,
      pagination: true,
    });

    return <VoucherListClient initialVoucherData={initialVoucherData} />;
  } catch (error) {
    console.error("Failed to fetch vouchers:", error);
    return <div>Error loading vouchers. Please try again.</div>;
  }
}
