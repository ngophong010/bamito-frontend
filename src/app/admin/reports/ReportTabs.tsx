"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ReportTabs = () => {
    const pathname = usePathname();
    const tabs = [
        { name: 'Tổng quan', href: '/admin/reports' },
        { name: 'Doanh thu', href: '/admin/reports/revenue' },
        { name: 'Email Marketing', href: '/admin/reports/subscribers' },
    ];

    return (
        <nav className="report-tabs">
            {tabs.map(tab => (
                <Link 
                    key={tab.href} 
                    href={tab.href}
                    className={pathname === tab.href ? 'active' : ''}
                >
                    {tab.name}
                </Link>
            ))}
        </nav>
    );
};

export default ReportTabs;