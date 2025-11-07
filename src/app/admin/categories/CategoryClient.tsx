"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import GridData from '@/components/GridData/GridData'; // Your "dumb" data table component

import { categoryService } from '@/services/categoryService';
import { PaginatedApiResponse, Category } from '@/types';

interface CategoryClientProps {
    initialCategoryData: PaginatedApiResponse<Category>;
}

const CategoryClient = ({ initialCategoryData }: CategoryClientProps) => {
    const router = useRouter();

    const handleDelete = async (category: Category) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.name}" không?`)) {
            try {
                await categoryService.deleteCategory(category.id);
                toast.success("Xóa danh mục thành công!");
                router.refresh(); // Re-fetch Server Component data
            } catch (error: any) {
                toast.error(error.message || "Xóa danh mục thất bại.");
            }
        }
    };

    // Define how to render the columns for a CATEGORY
    const tableColumns = [
        { label: "STT", render: (item: Category, index: number) => <span>{(initialCategoryData.currentPage - 1) * 10 + index + 1}</span> },
        { label: "MÃ DANH MỤC", render: (item: Category) => <span>{item.categoryId}</span> },
        { label: "TÊN DANH MỤC", render: (item: Category) => <span>{item.name}</span> },
    ];
    
    return (
        <div>
            {/* The "smart" page adds the specific "Add New" button */}
            <Link href="/admin/categories/new" className="add-new-button">Thêm Danh mục mới</Link>

            <GridData
                headerString="Quản lý Danh mục sản phẩm"
                tableData={initialCategoryData.items}
                tableColumns={tableColumns}
                onEdit={(category) => router.push(`/admin/categories/${category.id}`)}
                onDelete={handleDelete}
            />
            
            {/* Pagination is now also handled by the smart page */}
            {/* <PaginatedItems ... /> */}
        </div>
    );
};

export default CategoryClient;
