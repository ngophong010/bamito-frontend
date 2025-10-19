"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { Grid, Box } from '@mui/material';

import { orderService } from '@services/orderService';
import { OrderDtails } from '@/types';
import '../page.scss';

const currecncyFormatter = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });
const formatterDate = (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm");

interface OrderDetailClientProps {
    order: OrderDtails;
}

const OrderDetailClient = ({order}: OrderDetailClientProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleUpdateStatus = async (newStatus: number, successMessage: string) => {
        setIsLoading(true);
        try {
            await orderService.updateOrderStatus(order.id, newStatus);
            toast.success(successMessage);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Cập nhật trạng thái thất bại.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleDelete = async () => {
        if (window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
            setIsLoading(true);
            try {
                await orderService.deleteOrder(order.id);
                toast.success("Xóa đơn hàng thành công.");
                router.push("/admin/orders");
            } catch (error: any) {
                toast.error(error.message || "Xóa đơn hàng thất bại.");
            } finally {
                setIsLoading(false);
            }
        }
    }

    const getStatusText = (status: number) => {
        switch (status) {
            case 0: return 'Đã hủy';
            case 1: return 'Chờ xác nhận';
            case 2: return 'Đang giao';
            case 3: return 'Hoàn tất';
            default: return 'Không xác định';
        }
    }

    return (
        <div className="order-detail-page">
            <div className="order-post-detail">
                {/* Information Section */}
                <div className="information">
                    <h4>Mã đơn hàng: {order.orderId}</h4>
                    <h4>Ngày đặt hàng: {formatterDate(order.createdAt)}</h4>
                    <h4>Tình trạng đơn hàng: {getStatusText(order.status)}</h4>
                </div>
                {/* ... other info sections */}
            </div>

            {/* Product List */}
            <Grid container spacing={5} className="products">
                {order.items.map((item) => (
                    <Grid item sm={10} md={5} key={item.id}>
                        {/* ... your JSX for rendering an order item ... */}
                    </Grid>
                ))}
            </Grid>

            {/* Payment and Actions Section */}
            <div className="pay-contact-container">
                <div className="pay-contact">
                    {/* ... your JSX for price calculation ... */}
                    
                    {/* 5. Clean, conditional rendering for action buttons */}
                    <div className="btn_contact">
                        {order.status === 1 && (
                            <button onClick={() => handleUpdateStatus(2, "Đã xác nhận đơn hàng.")} disabled={isLoading}>
                                {isLoading ? 'Đang xử lý...' : 'Xác nhận & Giao hàng'}
                            </button>
                        )}
                        {order.status === 2 && (
                            <button onClick={() => handleUpdateStatus(3, "Đơn hàng đã hoàn tất.")} disabled={isLoading}>
                                {isLoading ? 'Đang xử lý...' : 'Xác nhận Giao thành công'}
                            </button>
                        )}
                        {order.status === 0 && (
                            <button onClick={handleDelete} disabled={isLoading} className="delete-btn">
                                {isLoading ? 'Đang xóa...' : 'Xóa đơn hàng'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div> 
    );
};

export default OrderDetailClient;
