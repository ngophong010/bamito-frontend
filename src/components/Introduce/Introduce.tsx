import React from 'react';
import Link from 'next/link';
import { Grid } from '@mui/material';
import { ProductListItem } from '@/types';
import ProductCard from '@/components/ProductCard/ProductCard'; // A new, reusable component

interface FeaturedData {
    title: string;
    id?: number;
    data: ProductListItem[];
}

// This is now a "dumb" Server Component. It just receives data and maps over it.
const Introduce = ({ featuredData }: { featuredData: FeaturedData[] }) => {
  return (
    <>
      {featuredData.map((categorySection) => (
        <div className="introduce-badminton" key={categorySection.id}>
          <div className="introduce-badminton-header">
            <h1 className="introduce-badminton-header-title">{categorySection.title}</h1>
            <Link href={`/categories/${categorySection.id}`} className="introduce-badminton-header-more">
              Xem tất cả
            </Link>
          </div>
          <Grid container spacing={5}>
            {categorySection.data.map((product) => (
              <Grid item xs={3} key={product.id}>
                {/* Use a reusable ProductCard component */}
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </div>
      ))}
    </>
  );
};

export default Introduce;
