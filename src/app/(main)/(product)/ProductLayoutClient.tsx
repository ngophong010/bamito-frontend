"use client";

import { ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Breadcrumb, { BreadcrumbItem } from '@/components/Breadcrumb/Breadcrumb';
import ProductFilterSidebar from '@/components/ProductFilterSidebar/ProductFilterSidebar';

// This component now handles all client-side logic
export default function ProductLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([]);

  useEffect(() => {
    // This logic now runs safely in the client browser
    const parts = pathname.split('/').filter(p => p);
    
    // Example of a more robust breadcrumb builder
    const newItems: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

    if (parts.length > 0) {
        // You can build up the path, e.g., for /category/product-name
        let currentPath = '';
        parts.forEach((part, index) => {
            currentPath += `/${part}`;
            // A real implementation would fetch the name for the slug 'part'
            const label = part.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            // The last item is the current page and shouldn't be a link
            if (index === parts.length - 1) {
                newItems.push({ label });
            } else {
                newItems.push({ label, href: currentPath });
            }
        });
    }

    setBreadcrumbItems(newItems);
  }, [pathname]);

  return (
    <div className="product-layout-container">
      <Breadcrumb items={breadcrumbItems} />
      <main className="main-content" style={{ display: 'flex', gap: '2rem' }}>
        <aside className="sidebar">
          <ProductFilterSidebar />
        </aside>
        <div className="product-list-area" style={{ flex: 1 }}>
          {children} {/* Renders the actual page content */}
        </div>
      </main>
    </div>
  );
}
