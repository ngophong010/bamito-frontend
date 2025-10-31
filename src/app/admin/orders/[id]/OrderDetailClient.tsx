"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { Grid, Box } from '@mui/material';
import Image from 'next/image';

import { orderService } from '@/services/orderService';
import { Order, OrderItem, OrderStatus } from '@/types/order';
import '../page.scss';
import { UpdateOrderStatusDTO } from "@/types/dtos/order.dto";

const currecncyFormatter = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });
const formatterDate = (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm");

interface OrderDetailClientProps {
    order: Order;
}

const OrderDetailClient: React.FC<OrderDetailClientProps> = ({ order }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleUpdateStatus = async (newStatus: OrderStatus, successMessage: string) => {
        setIsLoading(true);
        try {
            const payload: UpdateOrderStatusDTO = {status: newStatus};
            
            await orderService.updateOrderStatus(order.id, payload);
            
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
            case 1:
                return 'Đang chờ xử lý'; // PENDING
            case 2:
                return 'Đang xử lý'; // PROCESSING
            case 3:
                return 'Đã gửi hàng'; // SHIPPED
            case 4:
                return 'Đã giao hàng'; // DELIVERED
            case 5:
                return 'Đã hủy'; // CANCELLED
            case 6:
                return 'Đã hoàn tiền'; // REFUNDED
            default:
                return 'Không xác định'; // Unknown status
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
                {order.items.map((item: OrderItem) => (
                    <Grid size={{ xs: 12, sm: 10, md: 5 }} key={item.id} className="product-item">
                        <Box display="flex" gap={2} alignItems="center">
                            <div className="product-image">
                                <Image
                                    src={item.productImage || '/images/default-product.png'}
                                    alt={item.productName}
                                    width={80}
                                    height={80}
                                    style={{ objectFit: 'contain' }}
                                />
                            </div>
                            <Box flex={1}>
                                <h4 className="product-name">{item.productName}</h4>
                                <p className="product-size">Size: {item.sizeName}</p>
                                <p className="product-quantity">Số lượng: {item.quantity}</p>
                                <p className="product-price">
                                    {currecncyFormatter.format(item.price)}
                                </p>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* Payment and Actions Section */}
            <div className="pay-contact-container">
                <div className="pay-contact">
                    {/* ... your JSX for price calculation ... */}

                    <div className="btn_contact">
                        {/* When order is pending → allow to confirm */}
                        {order.status === OrderStatus.PENDING && (
                            <button
                                onClick={() => handleUpdateStatus(OrderStatus.PROCESSING, "Đơn hàng đã được xác nhận và đang xử lý.")}
                                disabled={isLoading}
                            >
                                {isLoading ? "Đang xử lý..." : "Xác nhận đơn hàng"}
                            </button>
                        )}

                        {/* When order is processing → allow to mark as shipped */}
                        {order.status === OrderStatus.PROCESSING && (
                            <button
                                onClick={() => handleUpdateStatus(OrderStatus.SHIPPED, "Đơn hàng đã được gửi đi.")}
                                disabled={isLoading}
                            >
                                {isLoading ? "Đang xử lý..." : "Xác nhận Giao hàng"}
                            </button>
                        )}

                        {/* When order is shipped → allow to mark as delivered */}
                        {order.status === OrderStatus.SHIPPED && (
                            <button
                                onClick={() => handleUpdateStatus(OrderStatus.DELIVERED, "Đơn hàng đã được giao thành công.")}
                                disabled={isLoading}
                            >
                                {isLoading ? "Đang xử lý..." : "Xác nhận Giao thành công"}
                            </button>
                        )}

                        {/* When order is cancelled → allow to delete */}
                        {order.status === OrderStatus.CANCELLED && (
                            <button
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="delete-btn"
                            >
                                {isLoading ? "Đang xóa..." : "Xóa đơn hàng"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailClient;
