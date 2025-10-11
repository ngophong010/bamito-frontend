"use client";
import React, { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

import GridData from '@/components/GridData/GridData';
import PaginatedItems from '@/components/Pagination/Pagination';
import { PaginatedApiResponse, OrderItem } from '@/types'; // Assuming OrderItem is the type for report items
import './page.scss';

const currencyFormatter = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });
const formatterDate = (date: string) => dayjs(date).format("DD/MM/YYYY");

interface ReportClientProps {
  initialReportData: PaginatedApiResponse<OrderItem>;
}

const ReportClient = ({ initialReportData }: ReportClientProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // --- LOCAL UI STATE for the date pickers ---
    // Initialize state from the URL's search parameters
    const [timeStart, setTimeStart] = useState<Dayjs | null>(
        dayjs(searchParams.get('timeStart') || dayjs().startOf('month'))
    );
    const [timeEnd, setTimeEnd] = useState<Dayjs | null>(
        dayjs(searchParams.get('timeEnd') || dayjs().endOf('month'))
    );

    // --- EVENT HANDLERS ---
    const handleFilter = () => {
        const params = new URLSearchParams();
        if (timeStart) params.set('timeStart', timeStart.toISOString());
        if (timeEnd) params.set('timeEnd', timeEnd.toISOString());
        params.set('page', '1'); // Always reset to page 1 on a new filter
        router.push(`${pathname}?${params.toString()}`);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    // Define HOW to render the columns for a REPORT ITEM
    const tableColumns = [
        { label: "STT", render: (item: OrderItem, index: number) => <span>{(initialReportData.currentPage - 1) * 15 + index + 1}</span> },
        { label: "TÊN SẢN PHẨM", render: (item: OrderItem) => <span>{item.productName}</span> },
        { label: "KÍCH CỠ", render: (item: OrderItem) => <span>{item.sizeName}</span> },
        { label: "GIÁ", render: (item: OrderItem) => <span>{currencyFormatter.format(item.price)}</span> },
        { label: "SỐ LƯỢNG", render: (item: OrderItem) => <span>{item.quantity}</span> },
        { label: "TỔNG TIỀN", render: (item: OrderItem) => <span>{currencyFormatter.format(item.price * item.quantity)}</span> },
        { label: "NGÀY MUA", render: (item: OrderItem) => <span>{formatterDate(item.order.createdAt)}</span> },
    ];
    
    return (
        <div className="admin-report-page">
            <h1>Báo cáo Doanh thu</h1>

            {/* Filter Controls */}
            <div className="report-filters">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker label="Từ ngày" value={timeStart} onChange={(newValue) => setTimeStart(newValue)} />
                    <DatePicker label="Đến ngày" value={timeEnd} onChange={(newValue) => setTimeEnd(newValue)} />
                </LocalizationProvider>
                <Button variant="contained" onClick={handleFilter}>Lọc Báo cáo</Button>
            </div>

            {/* The "Dumb" GridData component receives the data and column definitions */}
            <GridData
                headerString="Kết quả Báo cáo"
                tableData={initialReportData.items}
                tableColumns={tableColumns}
                // No edit/delete actions on a report
            />
            
            {/* The "Dumb" Pagination component */}
            <PaginatedItems
                currentPage={initialReportData.currentPage}
                totalPages={initialReportData.totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default ReportClient;
