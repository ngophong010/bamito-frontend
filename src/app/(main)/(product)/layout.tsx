import { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'; // A component to generate breadcrumbs
import ProductFilterSidebar from '@/components/ProductFilterSidebar/ProductFilterSidebar'; // A shared sidebar

interface ProductLayoutProps {
  children: ReactNode;
}

export default function ProductLayout({ children }: ProductLayoutProps) {
  const pathname = usePathname();
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);

  useEffect(() => {
    // Logic to build breadcrumbs based on pathname
    // This is still complex, but it's now contained in the LAYOUT, not the component.
    const parts = pathname.split('/').filter(p => p);
    let newItems = [];
    if (parts[0] === 'search') {
        newItems = [{ label: 'Search Results', href: pathname }];
    }
    // ... more logic
    setBreadcrumbItems(newItems);
  }, [pathname]);
  
  return (
    <div className="product-layout-container">
      {/* Breadcrumb component can read the URL path and render itself dynamically */}
      <Breadcrumb items={breadcrumbItems} />
      {children}
      <main className="main-content">
        <aside className="sidebar">
          {/* This sidebar can be shared across category, search, and sale-off pages */}
          <ProductFilterSidebar />
        </aside>
        <div className="product-list-area">
          {children} {/* This will render the specific page.js content */}
        </div>
      </main>
    </div>
  );
}
