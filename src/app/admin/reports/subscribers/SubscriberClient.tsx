"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Button } from '@mui/material';

import GridData from '@/components/GridData/GridData';
import PaginatedItems from '@/components/Pagination/Pagination';
import { PaginatedApiResponse } from '@/types';
import { Subscriber } from '@/types/models/subscriber';
import { subscriberService } from '@/services/subscriberService';
import { CampaignComposerModal } from '@/components/CampaignComposerModal/CampaignComposerModal';
import './page.scss';

interface SubscriberClientProps {
  initialSubscriberData: PaginatedApiResponse<Subscriber>;
}

const SubscriberClient = ({ initialSubscriberData }: SubscriberClientProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- ACTION HANDLERS NOW LIVE IN THE SMART PARENT ---
    const handleDelete = async (subscriber: Subscriber) => {
        if (window.confirm(`Bạn có chắc muốn xóa email "${subscriber.email}"?`)) {
            try {
                setIsLoading(true);
                await subscriberService.deleteSubscriber(subscriber.email);
                toast.success("Xóa email thành công!");
                router.refresh(); // Re-fetch Server Component data
            } catch (error: any) {
                toast.error(error.message || "Xóa email thất bại.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSendMail = async (data: { subject: string; content: string }) => {
        if (window.confirm("Bạn có chắc chắn muốn gửi email marketing đến tất cả người đăng ký?")) {
            setIsLoading(true);
            try {
                await subscriberService.sendCampaign(data);
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
            const blob = await subscriberService.exportSubscribersAsCsv();
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
        { label: "EMAIL", render: (item: Subscriber) => <span>{item.email}</span> },
        { label: "NGƯỜI DÙNG", render: (item: Subscriber) => <span>{item.status}</span> },
    ];
    
    return (
        <div className="admin-subscriber-page">
            <div className="page-header">
                <h1>Email Marketing</h1>
                {/* --- ACTION BUTTONS ARE NOW HERE --- */}
                <div className="action-buttons">
                    {/* This button now OPENS THE MODAL instead of sending the email directly */}
                    <Button variant="contained" onClick={() => setIsModalOpen(true)} disabled={isLoading}>
                        Gửi Mail Marketing
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

            {/* Render the modal and pass the necessary props */}
            <CampaignComposerModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSend={handleSendMail}
            />
        </div>
    );
};

export default SubscriberClient;
