"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';

// 1. Import your "dumb" reusable components and correct types/services
import GridData from '@/components/GridData/GridData';
import PaginatedItems from '@/components/Pagination/Pagination';
import { deleteInventoryEntry } from '@/services/inventoryService';
import { PaginatedApiResponse, Inventory, ProductDetails } from '@/types';

interface InventoryClientProps {
  product: ProductDetails;
  initialInventoryData: PaginatedApiResponse<Inventory>;
}

const InventoryClient = ({ product, initialInventoryData }: InventoryClientProps) => {
    const router = useRouter();

    const handleDelete = async (inventoryItem: Inventory) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa tồn kho cho size "${inventoryItem.size.name}"?`)) {
            try {
                await deleteInventoryEntry(inventoryItem.id);
                toast.success("Xóa tồn kho thành công!");
                // 2. Use router.refresh() to re-fetch the server component's data
                router.refresh(); 
            } catch (error: any) {
                toast.error(error.message || "Xóa tồn kho thất bại.");
            }
        }
    };

    // 3. Define how to render the columns for INVENTORY
    const tableColumns = [
        { label: "STT", render: (item: Inventory, index: number) => <span>{(initialInventoryData.currentPage - 1) * 10 + index + 1}</span> },
        { label: "KÍCH CỠ", render: (item: Inventory) => <span>{item.size.name}</span> },
        { label: "SỐ LƯỢNG TỒN", render: (item: Inventory) => <span>{item.quantity}</span> },
        { label: "ĐÃ BÁN", render: (item: Inventory) => <span>{item.sold}</span> },
    ];
    
    return (
        <div>
            <h1>Quản lý Tồn kho cho: <strong>{product.name}</strong></h1>
            
            {/* The "Add New" button now has a correct, RESTful link */}
            <Link href={`/admin/products/${product.id}/inventory/new`} className="add-new-button">
                Thêm Tồn kho mới
            </Link>

            <GridData
                headerString={`Danh sách tồn kho (${initialInventoryData.totalItems})`}
                tableData={initialInventoryData.items}
                tableColumns={tableColumns}
                onEdit={(item) => router.push(`/admin/products/${product.id}/inventory/${item.id}`)}
                onDelete={handleDelete}
            />
            
            <PaginatedItems
                currentPage={initialInventoryData.currentPage}
                totalPages={initialInventoryData.totalPages}
                onPageChange={(page) => router.push(`?page=${page}`)}
            />
        </div>
    );
};

export default InventoryClient;
