"use client";
import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';

// 1. Import your "dumb" reusable components and types
import GridData from '@/components/GridData/GridData';
import PaginatedItems from '@/components/Pagination/Pagination';
import { PaginatedApiResponse, OrderSummary } from '@/types';
import './page.scss'; // Assuming you have a stylesheet

interface OrderListClientProps {
  initialOrderData: PaginatedApiResponse<OrderSummary>;
}

const OrderListClient = ({ initialOrderData }: OrderListClientProps) => {
    const router = useRouter();
    const pathname = usePathname(); // Will be '/admin/orders'
    const searchParams = useSearchParams();

    // --- EVENT HANDLERS ---
    
    // 2. This function builds the new URL when a filter or page changes
    const navigate = (key: string, value: string | number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(key, String(value));
        // When filters change, always go back to the first page
        if (key !== 'page') {
            params.set('page', '1');
        }
        router.push(`${pathname}?${params.toString()}`);
    };
    
    // Define how to render the columns for an ORDER
    const tableColumns = [
        { label: "STT", render: (item: OrderSummary, index: number) => <span>{(initialOrderData.currentPage - 1) * 15 + index + 1}</span> },
        { label: "MÃ ĐƠN HÀNG", render: (item: OrderSummary) => <span>{item.orderId}</span> },
        { label: "KHÁCH HÀNG", render: (item: OrderSummary) => <span>{item.user.userName}</span> },
        { label: "TỔNG TIỀN", render: (item: OrderSummary) => <span>{/* format currency here */}</span> },
        { label: "THANH TOÁN", render: (item: OrderSummary) => <span>{item.payment}</span> },
        { label: "TRẠNG THÁI", render: (item: OrderSummary) => <span>{/* get status text here */}</span> },
        { label: "NGÀY ĐẶT", render: (item: OrderSummary) => <span>{/* format date here */}</span> },
        { 
            label: "CHI TIẾT", 
            render: (item: OrderSummary) => <Link href={`/admin/orders/${item.id}`}>Xem chi tiết</Link>
        },
    ];
    
    return (
        <div className="admin-order-list-page">
            <h1>Quản lý Đơn hàng</h1>

            {/* 3. Filter Tabs - These just change the URL */}
            <div className="status-filter-tabs">
                <button onClick={() => navigate('status', 1)}>Chờ xác nhận</button>
                <button onClick={() => navigate('status', 2)}>Đang giao</button>
                <button onClick={() => navigate('status', 3)}>Hoàn tất</button>
                <button onClick={() => navigate('status', 0)}>Đã hủy</button>
            </div>

            {/* 4. The "Dumb" GridData component receives the data */}
            <GridData
                headerString="Danh sách Đơn hàng"
                tableData={initialOrderData.items}
                tableColumns={tableColumns}
                // No edit/delete actions directly on the list view
            />
            
            {/* 5. The "Dumb" Pagination component handles page navigation */}
            <PaginatedItems
                currentPage={initialOrderData.currentPage}
                totalPages={initialOrderData.totalPages}
                onPageChange={(page) => navigate('page', page)}
            />
        </div>
    );
};

export default OrderListClient;
