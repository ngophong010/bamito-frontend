import { Metadata } from 'next';
import Link from 'next/link';
import { BarChart, Mail } from 'lucide-react'; // Using a simple icon library for visuals

export const metadata: Metadata = {
    title: 'Báo cáo & Thống kê',
};

// This is a simple, static Server Component.
export default function ReportsHubPage() {
  return (
    <div className="reports-hub-container">
      <h1>Trung tâm Báo cáo</h1>
      <p>Chọn một báo cáo để xem chi tiết.</p>

      <div className="report-links-grid">
        <Link href="/admin/reports/revenue" className="report-link-card">
          <BarChart size={48} />
          <h2>Báo cáo Doanh thu</h2>
          <p>Xem chi tiết doanh thu, lợi nhuận, và các sản phẩm bán chạy theo khoảng thời gian.</p>
        </Link>

        <Link href="/admin/reports/subscribers" className="report-link-card">
          <Mail size={48} />
          <h2>Email Marketing</h2>
          <p>Quản lý danh sách người đăng ký, gửi chiến dịch email, và xuất dữ liệu.</p>
        </Link>
        
        {/* Add more links here as you create more reports */}
        {/*
        <Link href="/admin/reports/inventory" className="report-link-card">
          <Package size={48} />
          <h2>Báo cáo Tồn kho</h2>
          <p>Xem các sản phẩm sắp hết hàng, hàng tồn kho lâu ngày, và giá trị tồn kho.</p>
        </Link>
        */}
      </div>
    </div>
  );
}
