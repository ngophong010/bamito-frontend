import { notFound } from "next/navigation";
import { Metadata } from "next";

import { getOrderDetails } from '@services/orderService';
import OrderDetailClient from "./OrderDetailClient";

interface AdminOrderDetailPagesProps {
    params: {
        id: string;
    }
}

export async function generateMetadata({ params }: AdminOrderDetailPagesProps): Promise<Metadata> {
    try {
        const order = await getOrderDetails(Number(params.id));
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
    const orderId = Number(params.id);

    if (isNaN(orderId)) {
        notFound();
    }

    try {
        const orderData = await getOrderDetails(orderId);

        return <OrderDetailClient order={orderData} />;
    } catch (error) {
        console.error(`Fail to fetch order details for ID ${orderId}:`, error);
        notFound();
    }
}