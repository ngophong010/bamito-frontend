"use client";
import React from 'react';
import Image from "next/image";
import dayjs from 'dayjs';
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import { Voucher } from '@/types'; // Import your central Voucher type
import "./Voucher.scss";

const currencyFormatter = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

// A helper function to calculate and format the remaining time
const getRemainingTime = (timeEnd: string): string => {
    const endDate = dayjs(timeEnd);
    const now = dayjs();
    const hoursRemaining = endDate.diff(now, 'hour');

    if (hoursRemaining > 24) {
        const daysRemaining = Math.ceil(hoursRemaining / 24);
        return `Hết hạn trong ${daysRemaining} ngày`;
    }
    return `Hết hạn trong ${hoursRemaining} giờ`;
};


// 1. Define the props this component needs. It's now very clean.
interface VoucherSelectorProps {
  vouchers: Voucher[];
  onVoucherSelect: (voucher: Voucher) => void;
  onBack: () => void; // A function to tell the parent to close this view
}

const VoucherSelector = ({ vouchers, onVoucherSelect, onBack }: VoucherSelectorProps) => {
  
  const handleSelect = (voucher: Voucher) => {
    // 2. The component calls the single onVoucherSelect callback with the full voucher object.
    onVoucherSelect(voucher);
  };

  return (
    <div className="voucher-selector-container">
      <div className="voucher-selector-title">
        <button onClick={onBack} className="back-button">
          <ArrowBackIosIcon className="back-icon" />
        </button>
        <h2>Chọn Voucher</h2>
      </div>
      <div className="voucher-selector-content">
        {vouchers && vouchers.length > 0 ? (
          vouchers.map((item) => (
            <button
              className="voucher-item"
              key={item.id}
              onClick={() => handleSelect(item)}
            >
              <Image
                src={item.image || '/placeholder.png'}
                alt={item.voucherId}
                width={120}
                height={120}
                className="voucher-image"
              />
              <div className="voucher-info">
                <p className="voucher-price">
                  {currencyFormatter.format(item.voucherPrice)}
                </p>
                <p className="voucher-expiry">{getRemainingTime(item.timeEnd)}</p>
              </div>
            </button>
          ))
        ) : (
          <p>Bạn không có voucher nào khả dụng.</p>
        )}
      </div>
    </div>
  );
};

export default VoucherSelector;
