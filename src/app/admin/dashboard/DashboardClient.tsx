"use client";
import React from 'react';
import Grid from "@mui/material/Grid";
import Link from "next/link";
import Image from "next/image";

import RevenueChart from "@/components/Chart/Chart";// The chart is a client component
import { StatisticsResponse } from '@/types';
import "./page.scss";

const currencyFormatter = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

interface DashboardClientProps {
    statistics: StatisticsResponse;
    chartData: number[];
}

// A client-side helper to map status data to UI elements
const mapOrderStatusData = (statusData: any[]) => {
    return statusData.map((status) => {
        let img = "", to = "/admin/orders";
        switch (status.label) {
            case "Xác nhận": img = "/images/image-confirmed.png"; to = "/admin/orders?status=1"; break;
            case "Đang giao": img = "/images/image-shipping.png"; to = "/admin/orders?status=2"; break;
            case "Hoàn tất": img = "/images/image-completed.png"; to = "/admin/orders?status=3"; break;
            case "Đã hủy": img = "/images/image-cancelled.png"; to = "/admin/orders?status=0"; break;
        }
        return { ...status, img, to };
    });
};

const DashboardClient = ({ statistics, chartData }: DashboardClientProps) => {
    const allOrderStatus = mapOrderStatusData(statistics.allTotalOrder);
    const xLabels = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);

    return (
        <div className="admin-overview">
            {/* --- TOP STATISTIC CARDS --- */}
            <div className="statistic">
                <div className="statistic-item">
                    <Image height={94} width={103} src="/images/image-revenue.png" alt="Revenue" />
                    <div className="statistic-item-info">
                        <p className="text">Tổng doanh thu</p>
                        <p className="number">{currencyFormatter.format(statistics.totalIncome)}</p>
                    </div>
                </div>
                <div className="statistic-item">
                    <Image height={97} width={106} src="/images/image-orders.png" alt="Orders" />
                    <div className="statistic-item-info">
                        <p className="text">Tổng đơn hàng</p>
                        <p className="number">{statistics.totalOrder}</p>
                    </div>
                </div>
                {/* ... other statistic items ... */}
            </div>

            <div className="chart-container">
                <h1 className="text">THỐNG KÊ DOANH THU</h1>
                {/* Use the new, typed component */}
                <RevenueChart chartData={chartData} xLabels={xLabels} />
            </div>

            {/* --- ORDER STATUS SUMMARY --- */}
            <div className="order-status-container">
                <h1 className="order-status-heading">THỐNG KÊ TRẠNG THÁI ĐƠN HÀNG</h1>
                <Grid className="order-status-grid-container" container>
                    {allOrderStatus.map((item, index) => (
                        <React.Fragment key={index}>
                            <Grid className="order-status-item" item xs={6}>
                                <Image height={50} width={55} src={item.img} alt={item.label} />
                                <p>{item.label}</p>
                            </Grid>
                            <Grid className="order-status-item" item xs={6}>
                                <p>{item.quantity}</p>
                                <Link className="detail" href={item.to}>Xem chi tiết</Link>
                            </Grid>
                        </React.Fragment>
                    ))}
                </Grid>
            </div>
        </div>
    );
};

export default DashboardClient;
