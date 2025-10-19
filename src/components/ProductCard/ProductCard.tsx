"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Rating from '@mui/material/Rating';
import FavoriteBorderTwoToneIcon from "@mui/icons-material/FavoriteBorderTwoTone";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import { toast } from 'react-toastify';

import { useAppSelector, useAppDispatch } from '@/redux-toolkit/hooks';
import { setFavourites } from '@/redux-toolkit/userSlice';
import { favouriteService } from '@/services/favouriteService';
import { ProductListItem } from '@/types';
import { createSlug } from '@/utils/slug';

const ProductCard = ({ product }: { product: ProductListItem }) => {
    const dispatch = useAppDispatch();
    const { isLoggedIn, favouriteProductIds } = useAppSelector((state) => state.user);

    // Derive the liked status from Redux state
    const isFavourited = favouriteProductIds.includes(product.id);

    const handleLikeToggle = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating when clicking the button
        if (!isLoggedIn) {
            toast.error("Vui lòng đăng nhập để sử dụng tính năng này.");
            return;
        }
        try {
            if (isFavourited) {
                await favouriteService.removeFavourite(product.id);
            } else {
                await favouriteService.addFavourite(product.id);
            }
            // Re-fetch the source of truth and update Redux
            const updatedIds = await favouriteService.getFavouriteIds();
            dispatch(setFavourites(updatedIds));
        } catch (error) {
            toast.error("Đã xảy ra lỗi.");
        }
    };

    return (
        <Link href={`/${createSlug(product.category.name)}/${createSlug(product.name)}-${product.productId}`} className="product-card">
            <div className="product-image-container">
                <Image src={product.image || '/placeholder.png'} alt={product.name} fill sizes="33vw" className="product-image" />
                <button className="favourite-btn" onClick={handleLikeToggle}>
                    {isFavourited ? <FavoriteTwoToneIcon style={{ color: 'red' }} /> : <FavoriteBorderTwoToneIcon />}
                </button>
            </div>
            <div className="product-info">
                <p className="product-name">{product.name}</p>
                <div className="product-rating">
                    <Rating value={product.rating} precision={0.5} readOnly />
                </div>
                {/* ... Price component ... */}
            </div>
        </Link>
    );
};

export default ProductCard;
