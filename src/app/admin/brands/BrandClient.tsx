"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';

import GridData from '@/components/GridData/GridData';
import PaginatedItems from '@/components/Pagination/Pagination';
import { deleteBrand } from '@/services/brandService';
import { PaginatedApiResponse, Brand } from '@/types';

interface BrandClientProps {
    initialBrandData: PaginatedApiResponse<Brand>;
}

const BrandClient = ({ initialBrandData }: BrandClientProps) => {
    const router = useRouter();

    const handleDelete = async (brand: Brand) => {
        if (window.confirm(`Are you sure you want to delete brand "${brand.name}"?`)) {
            try {
                await deleteBrand(brand.id);
                toast.success("Brand deleted successfully!");
                router.refresh(); // Re-fetch Server Component data
            } catch (error: any) {
                toast.error(error.message || "Failed to delete brand.");
            }
        }
    };

    // Define HOW each column should be rendered for a BRAND
    const tableColumns = [
        { label: "STT", render: (item: Brand, index: number) => <span>{(initialBrandData.currentPage - 1) * 10 + index + 1}</span> },
        { label: "MÃ THƯƠNG HIỆU", render: (item: Brand) => <span>{item.brandId}</span> },
        { label: "TÊN THƯƠNG HIỆU", render: (item: Brand) => <span>{item.name}</span> },
    ];
    
    return (
        <div>
            <Link href="/admin/brands/new" className="add-new-button">Add New Brand</Link>

            <GridData
                headerString="Quản lý Thương hiệu"
                tableData={initialBrandData.items}
                tableColumns={tableColumns}
                onEdit={(brand) => router.push(`/admin/brands/${brand.id}`)}
                onDelete={handleDelete}
            />
            
            <PaginatedItems
                currentPage={initialBrandData.currentPage}
                totalPages={initialBrandData.totalPages}
                onPageChange={(page) => router.push(`?page=${page}`)}
            />
        </div>
    );
};

export default BrandClient;
