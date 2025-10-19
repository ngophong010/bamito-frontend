import { ReactNode } from 'react';
import ProductLayoutClient from './ProductLayoutClient'; // Import the new client wrapper

interface ProductLayoutProps {
  children: ReactNode;
}

// This is now a clean, compliant Server Component.
// Its only job is to provide the structure by rendering the client wrapper.
export default function ProductLayout({ children }: ProductLayoutProps) {
  return (
    <ProductLayoutClient>
      {children}
    </ProductLayoutClient>
  );
}