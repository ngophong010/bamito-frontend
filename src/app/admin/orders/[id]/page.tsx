import { notFound } from "next/navigation";
import { Metadata } from "next";

import { orderService } from '@/services/orderService';
import OrderDetailClient from "./OrderDetailClient";

interface AdminOrderDetailPagesProps {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }: AdminOrderDetailPagesProps): Promise<Metadata> {
    try {
        const resolvedParams = await params;
        const order = await orderService.getOrderDetails(Number(resolvedParams.id));
        return {
            title: `Chi tiết Đơn hàn #${order.orderId}`,
        };
        
    } catch (error) {
        return {
            title: 'Không tìm thấy Đơn hàng'
        };
    }
}

export default async function AdminOrderDetailPage({params}: AdminOrderDetailPagesProps) {
    const resolvedParams = await params;
    const orderId = Number(resolvedParams.id);

    if (isNaN(orderId)) {
        notFound();
    }

    try {
        const orderData = await orderService.getOrderDetails(orderId);

        return <OrderDetailClient order={orderData} />;
    } catch (error) {
        console.error(`Fail to fetch order details for ID ${orderId}:`, error);
        notFound();
    }
}