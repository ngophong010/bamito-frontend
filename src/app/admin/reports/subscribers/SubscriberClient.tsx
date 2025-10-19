"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Button } from '@mui/material';

import GridData from '@/components/GridData/GridData';
import PaginatedItems from '@/components/Pagination/Pagination';
import { PaginatedApiResponse, Subscriber } from '@/types';
// Import the new, clean service functions
import { subscriberService } from '@/services/subscriberService';
import './page.scss';

interface SubscriberClientProps {
  initialSubscriberData: PaginatedApiResponse<Subscriber>;
}

const SubscriberClient = ({ initialSubscriberData }: SubscriberClientProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // --- ACTION HANDLERS NOW LIVE IN THE SMART PARENT ---
    const handleDelete = async (subscriber: Subscriber) => {
        if (window.confirm(`Bạn có chắc muốn xóa email "${subscriber.email_address}"?`)) {
            try {
                setIsLoading(true);
                await subscriberService.deleteSubscriber(subscriber.email_address);
                toast.success("Xóa email thành công!");
                router.refresh(); // Re-fetch Server Component data
            } catch (error: any) {
                toast.error(error.message || "Xóa email thất bại.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSendMail = async () => {
        if (window.confirm("Bạn có chắc chắn muốn gửi email marketing đến tất cả người đăng ký?")) {
            setIsLoading(true);
            try {
                await sendCampaign();
                toast.success("Chiến dịch email đã được bắt đầu!");
            } catch (error: any) {
                toast.error(error.message || "Gửi mail thất bại.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleExport = async () => {
        setIsLoading(true);
        try {
            const blob = await exportSubscribersAsCsv();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            toast.success("Xuất danh sách thành công.");
        } catch (error: any) {
            toast.error(error.message || "Xuất danh sách thất bại.");
        } finally {
            setIsLoading(false);
        }
    };

    // Define how to render the columns for SUBSCRIBERS
    const tableColumns = [
        { label: "STT", render: (item: Subscriber, index: number) => <span>{(initialSubscriberData.currentPage - 1) * 15 + index + 1}</span> },
        { label: "EMAIL", render: (item: Subscriber) => <span>{item.email_address}</span> },
        { label: "NGƯỜI DÙNG", render: (item: Subscriber) => <span>{item.bamito_status}</span> },
    ];
    
    return (
        <div className="admin-subscriber-page">
            <div className="page-header">
                <h1>Email Marketing</h1>
                {/* --- ACTION BUTTONS ARE NOW HERE --- */}
                <div className="action-buttons">
                    <Button variant="contained" onClick={handleSendMail} disabled={isLoading}>
                        {isLoading ? 'Đang gửi...' : 'Gửi Mail Marketing'}
                    </Button>
                    <Button variant="outlined" onClick={handleExport} disabled={isLoading}>
                        {isLoading ? 'Đang xuất...' : 'Xuất File CSV'}
                    </Button>
                </div>
            </div>

            <GridData
                headerString={`Danh sách người đăng ký (${initialSubscriberData.totalItems})`}
                tableData={initialSubscriberData.items}
                tableColumns={tableColumns}
                onDelete={handleDelete}
            />
            
            <PaginatedItems
                currentPage={initialSubscriberData.currentPage}
                totalPages={initialSubscriberData.totalPages}
                onPageChange={(page) => router.push(`?page=${page}`)}
            />
        </div>
    );
};

export default SubscriberClient;
