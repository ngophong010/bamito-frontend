"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import GridData from '@/components/GridData/GridData';
import PaginatedItems from '@/components/Pagination/Pagination';
import { deleteVoucher } from '@/services/voucherService';
import { PaginatedApiResponse, Voucher } from '@/types';

interface VoucherListClientProps {
  initialVoucherData: PaginatedApiResponse<Voucher>;
}

const currencyFormatter = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

const VoucherListClient = ({ initialVoucherData }: VoucherListClientProps) => {
    const router = useRouter();

    const handleDelete = async (voucher: Voucher) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa voucher "${voucher.voucherId}"?`)) {
            try {
                await deleteVoucher(voucher.id);
                toast.success("Xóa voucher thành công!");
                router.refresh(); // Re-fetch Server Component data
            } catch (error: any) {
                toast.error(error.message || "Xóa voucher thất bại.");
            }
        }
    };

    const tableColumns = [
        { label: "STT", render: (item: Voucher, index: number) => <span>{(initialVoucherData.currentPage - 1) * 15 + index + 1}</span> },
        { label: "MÃ VOUCHER", render: (item: Voucher) => <span>{item.voucherId}</span> },
        { label: "NGÀY BẮT ĐẦU", render: (item: Voucher) => <span>{dayjs(item.timeStart).format('DD/MM/YYYY')}</span> },
        { label: "NGÀY KẾT THÚC", render: (item: Voucher) => <span>{dayjs(item.timeEnd).format('DD/MM/YYYY')}</span> },
        { label: "MỨC GIẢM", render: (item: Voucher) => <span>{currencyFormatter.format(item.voucherPrice)}</span> },
        { label: "SỐ LƯỢNG", render: (item: Voucher) => <span>{item.quantity}</span> },
    ];
    
    return (
        <div>
            <Link href="/admin/vouchers/new" className="add-new-button">Thêm Voucher mới</Link>

            <GridData
                headerString="Quản lý Voucher"
                tableData={initialVoucherData.items}
                tableColumns={tableColumns}
                onEdit={(voucher) => router.push(`/admin/vouchers/${voucher.id}`)}
                onDelete={handleDelete}
            />
            
            <PaginatedItems
                currentPage={initialVoucherData.currentPage}
                totalPages={initialVoucherData.totalPages}
                onPageChange={(page) => router.push(`?page=${page}`)}
            />
        </div>
    );
};

export default VoucherListClient;
