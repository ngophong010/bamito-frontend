"use client";
import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Grid } from '@mui/material';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setFavourites } from '@/lib/redux/features/user/userSlice';
import PaginatedItems from '@/components/Pagination/Pagination';
import { favouriteService } from '@/services/favouriteService';
import { PaginatedApiResponse, ProductListItem } from '@/types';
import { createSlug } from '@/lib/utils/slug';
import './page.scss';

interface FavouriteClientProps {
  initialFavouriteData: PaginatedApiResponse<ProductListItem>;
}

const FavouriteClient = ({ initialFavouriteData }: FavouriteClientProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();

    // --- ACTION HANDLER ---
    const handleUnlike = async (product: ProductListItem) => {
        // No need for window.confirm as the action is easily reversible.
        try {
            await favouriteService.removeFavourite(product.id);
            toast.success(`Đã xóa "${product.name}" khỏi danh sách yêu thích.`);
            
            // Re-fetch the global list of favourite IDs to update the userSlice
            const updatedFavouriteIds = await favouriteService.getMyFavouriteIds();
            dispatch(setFavourites(updatedFavouriteIds));

            // Use router.refresh() to re-fetch the server component's data and update the list
            router.refresh(); 
        } catch (error: any) {
            toast.error(error.message || "Xóa sản phẩm yêu thích thất bại.");
        }
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    };
    
    return (
        <div className="favourite-container">
            <h1>Sản phẩm Yêu thích</h1>
            
            {initialFavouriteData.items.length > 0 ? (
                <Grid container spacing={5}>
                    {initialFavouriteData.items.map((item) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.id}>
                            <Link
                                href={`/${createSlug(item.category.name)}/${createSlug(item.name)}-${item.productId}`}
                                className="productWrapper"
                            >
                                <div className="product-image-container">
                                    <Image
                                        src={item.image || '/placeholder.png'}
                                        fill
                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                        alt={item.name}
                                        className="productImg"
                                    />
                                    {/* Unlike button */}
                                    <button
                                        className="favorite"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleUnlike(item);
                                        }}
                                    >
                                        <FavoriteTwoToneIcon style={{ color: "red" }} />
                                    </button>
                                </div>
                                <div className="productInfo">
                                    <p className="productName">{item.name}</p>
                                    {/* ... Rating and Price display ... */}
                                </div>
                            </Link>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <div className="no-product">
                    <h1>Bạn chưa có sản phẩm yêu thích nào.</h1>
                </div>
            )}

            <div style={{ marginTop: 50 }}>
                <PaginatedItems
                    currentPage={initialFavouriteData.currentPage}
                    totalPages={initialFavouriteData.totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default FavouriteClient;
