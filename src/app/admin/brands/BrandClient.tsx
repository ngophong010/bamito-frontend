"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useState } from 'react';
import ConfirmationModal from '@/components/Modal/ConfirmationModal';
import GridData from '@/components/GridData/GridData';
import PaginatedItems from '@/components/Pagination/Pagination';
import { brandService } from '@/services/brandService';
import { PaginatedApiResponse, Brand } from '@/types';

interface BrandClientProps {
    initialBrandData: PaginatedApiResponse<Brand>;
}

const BrandClient = ({ initialBrandData }: { initialBrandData: PaginatedApiResponse<Brand> }) => {
    const router = useRouter();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const openDeleteModal = (brand: Brand) => {
        setSelectedBrand(brand);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setSelectedBrand(null);
        setIsDeleteModalOpen(false);
    };

    const handleDelete = async (brand: Brand) => {
        if (window.confirm(`Are you sure you want to delete brand "${brand.name}"?`)) {
            try {
                await brandService.deleteBrand(brand.id);
                toast.success("Brand deleted successfully!");
                router.refresh(); // Re-fetch Server Component data
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Failed to delete brand.";
                toast.error(errorMessage);
            }
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedBrand) return;

        setIsLoading(true);
        try {
            await brandService.deleteBrand(selectedBrand.id);
            toast.success(`Brand "${selectedBrand.name}" has been deleted.`);
            closeDeleteModal();
            router.refresh();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to delete brand.";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
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

            {selectedBrand && (
                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={closeDeleteModal}
                    onConfirm={handleDeleteConfirm}
                    title="Xác nhận Xóa"
                    message={`Bạn có chắc chắn muốn xóa thương hiệu "${selectedBrand.name}" không? Hành động này không thể hoàn tác.`}
                    confirmText="Delete"
                    isLoading={isLoading}
                />
            )}
            
            <PaginatedItems
                currentPage={initialBrandData.currentPage}
                totalPages={initialBrandData.totalPages}
                onPageChange={(page) => router.push(`?page=${page}`)}
            />
        </div>
    );
};

export default BrandClient;
