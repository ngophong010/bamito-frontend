"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { Grid, Box } from '@mui/material';
import Image from 'next/image';
// 1. Import the correct service functions and types
import { cancelMyOrder } from '@/services/profileOrderService';
import { OrderDetails } from '@/types';
import './page.scss';
const currencyFormatter = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });
const formatterDate = (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm");
// Helper to get status text. This can be moved to a utils file.
const getStatusText = (status: number) => {
    switch (status) {
        case 0: return 'Đã hủy';
        case 1: return 'Chờ xác nhận';
        case 2: return 'Đang giao';
        case 3: return 'Hoàn tất';
        default: return 'Không xác định';
    }
}
interface OrderDetailClientProps {
    order: OrderDetails;
}
const OrderDetailClient = ({ order }: OrderDetailClientProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // --- ACTION HANDLER ---
    const handleCancel = async () => {
        if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
            setIsLoading(true);
            try {
                await cancelMyOrder(order.id);
                toast.success("Hủy đơn hàng thành công!");
                // 2. Use router.refresh() to re-fetch the server component's data
                // This will update the status displayed on the page.
                router.refresh();
            } catch (error: any) {
                toast.error(error.message || "Hủy đơn hàng thất bại.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="order-detail-page">
            <div className="order-details-header">
                <h1>Chi tiết Đơn hàng #{order.orderId}</h1>
                <Link href="/user/orders">← Quay lại danh sách</Link>
            </div>

            <div className="order-detail-grid">
                {/* Information Section */}
                <div className="information">
                    <h3>Thông tin đơn hàng</h3>
                    <p><strong>Mã đơn hàng:</strong> {order.orderId}</p>
                    <p><strong>Ngày đặt hàng:</strong> {formatterDate(order.createdAt)}</p>
                    <p><strong>Tình trạng:</strong> {getStatusText(order.status)}</p>
                </div>
                {/* ... other info sections for recipient and payment ... */}
            </div>

            {/* Product List */}
            <Grid container spacing={5} className="products">
                {order.items.map((item) => (
                    <Grid item sm={12} md={6} key={item.id}>
                        {/* ... your JSX for rendering a single order item ... */}
                    </Grid>
                ))}
            </Grid>

            {/* Payment and Actions Section */}
            <div className="pay-contact-container">
                <div className="pay-contact">
                    {/* ... your JSX for price calculation ... */}

                    {/* Clean, conditional rendering for the cancel button */}
                    <div className="btn_contact">
                        {order.status === 1 && ( // Only show button if order is 'Pending'
                            <button onClick={handleCancel} disabled={isLoading} className="cancel-btn">
                                {isLoading ? 'Đang xử lý...' : 'Hủy đơn hàng'}
                            </button>
                        )}
                        <a href="https://your-facebook-link" target="_blank" rel="noopener noreferrer" className="contact-btn">
                            Liên hệ Shop
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailClient;
