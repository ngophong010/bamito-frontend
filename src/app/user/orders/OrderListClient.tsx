"use client";
import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import dayjs from 'dayjs';

import PaginatedItems from '@/components/Pagination/Pagination';
import { PaginatedApiResponse, OrderSummary } from '@/types';
import './page.scss';

const currencyFormatter = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });
const formatterDate = (date: string) => dayjs(date).format("DD/MM/YYYY");

// This can be a constant, no need for state
const STATUSES = [
    { key: 1, value: "Chờ xác nhận" },
    { key: 2, value: "Đang giao" },
    { key: 3, value: "Hoàn tất" },
    { key: 0, value: "Đã hủy" },
];

interface OrderListClientProps {
  initialOrderData: PaginatedApiResponse<OrderSummary>;
}

const OrderListClient = ({ initialOrderData }: OrderListClientProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // The current status is derived directly from the URL
    const currentStatus = Number(searchParams.get('status')) || 1;

    // --- EVENT HANDLERS ---
    const handleNavigate = (key: string, value: string | number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(key, String(value));
        if (key !== 'page') {
            params.set('page', '1'); // Reset page when filter changes
        }
        router.push(`${pathname}?${params.toString()}`);
    };
    
    return (
        <div className="pageOrdersHistory">
            <h1>Lịch sử Mua hàng</h1>
            
            {/* Filter Tabs - They just change the URL */}
            <div className="btn-order-status-container">
                {STATUSES.map((status) => (
                    <button
                        key={status.key}
                        onClick={() => handleNavigate('status', status.key)}
                        className={`btn_orderStatus ${currentStatus === status.key ? "active" : ""}`}
                    >
                        {status.value}
                    </button>
                ))}
            </div>

            <div style={{ minHeight: "60rem" }}>
                <table className="orders">
                    <tbody>
                        {initialOrderData.items.length > 0 ? (
                            initialOrderData.items.map((order, index) => (
                                <tr className="order-row" key={order.id}>
                                    <td>{(initialOrderData.currentPage - 1) * 10 + index + 1}</td>
                                    <td>Mã đơn hàng: {order.orderId}</td>
                                    <td>Ngày đặt: {formatterDate(order.createdAt)}</td>
                                    <td>Tổng tiền: {currencyFormatter.format(order.totalPrice)}</td>
                                    <td>
                                        <Link href={`/user/orders/${order.id}`} className="link">
                                            Xem chi tiết
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="no-orders-message">
                                    Bạn chưa có đơn hàng nào trong mục này.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <PaginatedItems
                currentPage={initialOrderData.currentPage}
                totalPages={initialOrderData.totalPages}
                onPageChange={(page) => handleNavigate('page', page)}
            />
        </div>
    );
};

export default OrderListClient;
