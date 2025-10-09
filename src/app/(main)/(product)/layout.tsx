import { ReactNode } from 'react';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'; // A component to generate breadcrumbs
import ProductFilterSidebar from '@/components/ProductFilterSidebar/ProductFilterSidebar'; // A shared sidebar

interface ProductLayoutProps {
  children: ReactNode;
}

export default function ProductLayout({ children }: ProductLayoutProps) {
  return (
    <div className="product-layout-container">
      {/* Breadcrumb component can read the URL path and render itself dynamically */}
      <Breadcrumb />
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
