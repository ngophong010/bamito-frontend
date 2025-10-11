import { PropsWithChildren } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // This would require a client component wrapper
import ReportTabs from './ReportTabs'; // A dedicated client component for navigation

// A simple layout for the reports section
export default function ReportsLayout({ children }: PropsWithChildren) {
  return (
    <div className="reports-section-layout">
      <header className="reports-header">
        {/* You could have a consistent header for all report pages here */}
        <h1>Báo cáo & Thống kê</h1>
        {/*
          The component below would be a Client Component to handle active tab state
          based on the current URL.
        */}
        <ReportTabs />
      </header>
      
      <main className="report-content">
        {children} {/* This is where the specific page (e.g., revenue/page.tsx) will be rendered */}
      </main>
    </div>
  );
}
