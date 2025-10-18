"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@mui/material";
import Slider from "@mui/material/Slider";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import FavoriteBorderTwoToneIcon from "@mui/icons-material/FavoriteBorderTwoTone";
import PaginatedItems from "@/components/Pagination/Pagination";
import { toast } from "react-toastify";

// ... import all your UI components (Grid, Slider, Link, etc.)
import { ProductListItem, Brand, PaginatedApiResponse } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import { favouriteService } from "@/services/favouriteService";
import { useAppDispatch, useAppSelector } from '@/redux-toolkit/hooks';

interface CategoryClientProps {
    initialProductData: PaginatedApiResponse<ProductListItem>;
    allBrands: Brand[];
    categoryId: number;
}

export default function CategoryClient({ initialProductData, allBrands, categoryId }: CategoryClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();

    // The data and pagination state comes from props or Redux, not this component's logic
    const { items, currentPage, totalPages, status } = useAppSelector(state => state.products);

    // This is the function that will be passed to the pagination component
    const handlePageChange = (newPage: number) => {
        // Option A (URL-driven state, recommended for Next.js):
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        router.push(`?${params.toString()}`);

        // Option B (Redux-driven fetch):
        // dispatch(fetchProducts({ type: 'category', categoryId, params: { page: newPage } }));
    };

    // --- STATE MANAGEMENT ---
    // The "single source of truth" for the product list is now local state,
    // initialized by the server-fetched data.
    const [products, setProducts] = useState(initialProductData);

    // UI state for filters is managed locally.
    const [checkedBrands, setCheckedBrands] = useState<number[]>(() =>
        searchParams.get('brands')?.split(',').map(Number) || []
    );
    const [priceValue, setPriceValue] = useState<[number, number]>(() => [
        Number(searchParams.get('minPrice')) || 0,
        Number(searchParams.get('maxPrice')) || 10000000,
    ]);

    // Get favourite IDs from Redux to determine the "liked" status
    const favouriteProductIds = useAppSelector(state => state.user.favouriteProductIds);

    // Debounce filter inputs to avoid excessive URL changes
    const debouncedBrands = useDebounce(checkedBrands, 500);
    const debouncedPrice = useDebounce(priceValue, 500);

    // --- EFFECTS to update URL when filters change ---
    useEffect(() => {
        const params = new URLSearchParams(searchParams);

        if (debouncedBrands.length > 0) {
            params.set('brands', debouncedBrands.join(','));
        } else {
            params.delete('brands');
        }

        params.set('minPrice', debouncedPrice[0].toString());
        params.set('maxPrice', debouncedPrice[1].toString());

        // Reset to page 1 whenever filters change
        params.set('page', '1');

        // Push the new state to the URL. This will trigger a re-render of the parent Server Component.
        router.push(`?${params.toString()}`);
    }, [debouncedBrands, debouncedPrice, router]);

    // --- EVENT HANDLERS ---
    const handleToggleBrand = (brandId: number) => {
        setCheckedBrands(prev =>
            prev.includes(brandId) ? prev.filter(id => id !== brandId) : [...prev, brandId]
        );
    };

    const handleLikeToggle = async (productId: number, isFavourited: boolean) => {
        // Dispatch async actions directly from the service.
        try {
            if (isFavourited) {
                await favouriteService.removeFavourite(productId);
            } else {
                await favouriteService.addFavourite(productId);
            }
            // On success, update the Redux state for favourites
            // A better way would be a dedicated `fetchFavourites` thunk
            // dispatch(setFavourites(newListOfFavouriteIds));
            toast.success("Cập nhật yêu thích thành công!");
        } catch (error) {
            toast.error("Vui lòng đăng nhập để thực hiện.");
        }
    };

    // --- DERIVED DATA ---
    // Combine the product list with the live favourites state from Redux
    const productsWithFavouriteStatus = products.items.map(p => ({
        ...p,
        isFavourited: favouriteProductIds.includes(p.id)
    }));


    return (
        <div className="product-page">
            <div className="product-sidebar">
                {/* Filter UI */}
                <h1>Thương hiệu</h1>
                {allBrands.map(brand => (
                    <div key={brand.id}>
                        <p>{brand.name}</p>
                        <input
                            type="checkbox"
                            value={brand.id}
                            checked={checkedBrands.includes(brand.id)}
                            onChange={() => handleToggleBrand(brand.id)}
                        />
                    </div>
                ))}
                {/* Price Slider UI */}
                <Slider value={priceValue} onChange={(e, newValue) => setPriceValue(newValue as [number, number])} />
            </div>
            <div className="product-content">
                {/* Sorting UI */}
                {/* Product List Rendering */}
                <Grid container spacing={5}>
                    {productsWithFavouriteStatus.map(item => (
                        <Grid item xs={4} key={item.id}>
                            {/* ... your Link and Product Card UI ... */}
                            <button onClick={() => handleLikeToggle(item.id, item.isFavourited)}>
                                {item.isFavourited ? <FavoriteTwoToneIcon /> : <FavoriteBorderTwoToneIcon />}
                            </button>
                            {/* ... */}
                        </Grid>
                    ))}
                </Grid>
                {/* Pagination Component */}
                <PaginatedItems
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};
