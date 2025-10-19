"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';

// 1. Import your "dumb" reusable components and correct types/services
import GridData from '@/components/GridData/GridData';
import PaginatedItems from '@/components/Pagination/Pagination';
import { sizeService } from '@/services/sizeService';
import { PaginatedApiResponse, Size } from '@/types';

interface SizeClientProps {
  initialSizeData: PaginatedApiResponse<Size>;
}

const SizeClient = ({ initialSizeData }: SizeClientProps) => {
    const router = useRouter();

    // --- ACTION HANDLER ---
    const handleDelete = async (size: Size) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa kích thước "${size.name}"?`)) {
            try {
                await sizeService.deleteSize(size.id);
                toast.success("Xóa kích thước thành công!");
                // 2. Use router.refresh() to re-fetch the server component's data
                router.refresh(); 
            } catch (error: any) {
                toast.error(error.message || "Xóa kích thước thất bại.");
            }
        }
    };

    // 3. Define HOW to render the columns for a SIZE
    const tableColumns = [
        { label: "STT", render: (item: Size, index: number) => <span>{(initialSizeData.currentPage - 1) * 15 + index + 1}</span> },
        { label: "MÃ KÍCH THƯỚC", render: (item: Size) => <span>{item.sizeId}</span> },
        { label: "TÊN KÍCH THƯỚC", render: (item: Size) => <span>{item.name}</span> },
        // Assuming your 'getAllSizes' service includes the category data
        { label: "LOẠI SẢN PHẨM", render: (item: Size) => <span>{item.category?.name || 'N/A'}</span> },
    ];
    
    return (
        <div>
            {/* The "smart" page adds the specific "Add New" button */}
            <Link href="/admin/sizes/new" className="add-new-button">
                Thêm Kích thước mới
            </Link>

            <GridData
                headerString="Quản lý Kích thước"
                tableData={initialSizeData.items}
                tableColumns={tableColumns}
                onEdit={(size) => router.push(`/admin/sizes/${size.id}`)}
                onDelete={handleDelete}
            />
            
            <PaginatedItems
                currentPage={initialSizeData.currentPage}
                totalPages={initialSizeData.totalPages}
                onPageChange={(page) => router.push(`?page=${page}`)}
            />
        </div>
    );
};

export default SizeClient;
