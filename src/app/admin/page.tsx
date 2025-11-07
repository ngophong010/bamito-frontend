
import { Grid, Alert, AlertTitle, Box } from '@mui/material';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { orderService } from '@/services/orderService';
import { DashboardStatistics, ChartTimeRange } from '@/types/dashboard';

import StatisticCard from '@/components/Admin/Dashboard/StatisticCard';
import RevenueChart from '@/components/Admin/Dashboard/RevenueChart';

const currencyFormatter = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

// Helper function to process chart data on the server
const processChartData = (revenueData: any[]) => {
    const monthlyData = Array(12).fill(0);
    const currentYear = new Date().getFullYear();

    revenueData?.forEach((item) => {
        const date = new Date(item.time); // Assuming 'time' is a valid date string
        if (date.getFullYear() === currentYear) {
            const month = date.getMonth(); // 0-indexed (0 for January)
            monthlyData[month] += item.totalPrice;
        }
    });
    return monthlyData;
};

// Helper to map order status data on the server
const mapOrderStatusData = (statusData: any[]) => {
    return statusData.map((status) => {
        let img = "/images/image_placeholder.png";
        let to = "/admin/orders";
        switch (status.label) {
            case "Xác nhận":
                img = "/images/image 37.png";
                to = "/admin/orders?status=1";
                break;
            case "Đang giao":
                img = "/images/image 36.png";
                to = "/admin/orders?status=2";
                break;
            case "Hoàn tất":
                img = "/images/image 34.png";
                to = "/admin/orders?status=3";
                break;
            case "Đã hủy":
                img = "/images/image 35.png";
                to = "/admin/orders?status=0";
                break;
        }
        return { ...status, img, to };
    });
};


export default async function AdminDashboardPage() {
  // --- DATA FETCHING ON THE SERVER ---
  let statistics, monthlyRevenue;
  try {
    // Fetch the main statistics and the detailed revenue report in parallel
    [statistics, monthlyRevenue] = await Promise.all([
        orderService.getStatistics(),
        orderService.getSalesReport({ 
            fromDate: new Date(new Date().getFullYear(), 0, 1).toISOString(),
            toDate: new Date(new Date().getFullYear(), 11, 31).toISOString(),
            // No limit/page to get all data for the year for the chart
        })
    ]);
  } catch (error) {
    console.error("Failed to load admin dashboard data:", error);
    return <div>Error loading dashboard data. Please try again later.</div>;
  }

  // --- DATA TRANSFORMATION ON THE SERVER ---
  const chartData = processChartData(monthlyRevenue.items);
  const allOrderStatus = mapOrderStatusData(statistics.allTotalOrder);
  const xLabels = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="admin-overview">
      <div className="statistic">
        <div className="statistic-item">
          {/* ... UI ... */}
          <div className="statistic-item-info">
            <p className="text">Tổng doanh thu</p>
            <p className="number">{currencyFormatter.format(statistics.totalIncome)}</p>
          </div>
        </div>
        <div className="statistic-item">
          {/* ... UI ... */}
          <div className="statistic-item-info">
            <p className="text">Tổng đơn hàng</p>
            <p className="number">{statistics.totalOrder}</p>
          </div>
        </div>
        <div className="statistic-item">
          {/* ... UI ... */}
          <div className="statistic-item-info">
            <p className="text">Tổng sản phẩm</p>
            <p className="number">{statistics.totalProduct}</p>
          </div>
        </div>
      </div>

      {/* Pass server-processed data as props to the Client Component */}
      <RevenueChart chartData={chartData} xLabels={xLabels} />

      <div className="order-status-container">
        <h1 className="order-status-heading">THỐNG KÊ TRẠNG THÁI ĐƠN HÀNG</h1>
        <Grid className="order-status-grid-container" container>
          {/* ... Grid headers ... */}
          {allOrderStatus.map((item, index) => (
            <React.Fragment key={index}>
              <Grid className="order-status-item order-item-left" item xs={6}>
                <Image height={50} width={55} src={item.img} alt={item.label} />
                <p>{item.label}</p>
              </Grid>
              <Grid className="order-status-item order-item-right" item xs={6}>
                <p>{item.quantity}</p>
                <Link className="detail" href={item.to}>
                  Xem chi tiết
                </Link>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </div>
    </div>
  );
}
