import React from 'react';
import Link from 'next/link';
import { Grid } from '@mui/material';
import { ProductListItem } from '@/types';
import ProductCard from '@/components/ProductCard/ProductCard';

interface FeaturedData {
    title: string;
    id?: number;
    data: ProductListItem[];
}

// Add a default value for the featuredData prop
const Introduce = ({ featuredData = [] }: { featuredData: FeaturedData[] }) => {
  // Add a check to handle the case where the array might be empty
  if (!featuredData || featuredData.length === 0) {
    // Optionally, you can return a loading skeleton or null
    return null; 
  }

  return (
    <>
      {/* Use optional chaining (?.) as an extra layer of safety */}
      {featuredData?.map((categorySection) => (
        // Ensure categorySection itself is not null/undefined before proceeding
        categorySection && (
          <div className="introduce-badminton" key={categorySection.id}>
            <div className="introduce-badminton-header">
              <h1 className="introduce-badminton-header-title">{categorySection.title}</h1>
              <Link href={`/categories/${categorySection.id}`} className="introduce-badminton-header-more">
                Xem tất cả
              </Link>
            </div>
            <Grid container spacing={5}>
              {/* 
                CRITICAL FIX: Also add optional chaining here.
                This prevents a crash if an object in the array is missing the 'data' property.
              */}
              {categorySection.data?.map((product) => (
                <Grid size={{ xs: 3 }} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          </div>
        )
      ))}
    </>
  );
};

export default Introduce;