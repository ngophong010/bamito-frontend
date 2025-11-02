"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Slider from '@mui/material/Slider';
import { useDebounce } from '@/hooks/useDebounce';
import { Brand } from '@/types';
import { brandService } from '@/services/brandService';

const currencyFormatter = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });
const ProductFilterSidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // --- STATE MANAGEMENT ---
    // We initialize the filter state directly from the URL's search parameters.
    // This makes the component resilient to page refreshes and back/forward navigation.
    const [checkedBrands, setCheckedBrands] = useState<number[]>(() =>
        searchParams.get('brands')?.split(',').map(Number) || []
    );
    const [priceValue, setPriceValue] = useState<[number, number]>(() => [
        Number(searchParams.get('minPrice')) || 0,
        Number(searchParams.get('maxPrice')) || 10000000,
    ]);

    // State for the list of all available brands to display
    const [allBrands, setAllBrands] = useState<Brand[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Debounce the filter inputs to prevent firing a navigation on every single change.
    const debouncedBrands = useDebounce(checkedBrands, 500);
    const debouncedPrice = useDebounce(priceValue, 500);

    // --- DATA FETCHING ---
    // Fetch the list of all available brands when the component mounts.
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                setIsLoading(true);
                const brands = await brandService.getAllBrandsList();
                setAllBrands(brands);
            } catch (error) {
                console.error("Failed to fetch brands for filter sidebar:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBrands();
    }, []); // Runs only once on mount

    // --- EFFECT TO UPDATE URL ---
    // This effect runs when the debounced filter values change.
    // It constructs a new URL and pushes it, triggering a re-render of the parent Server Component.
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        // Update brands
        if (debouncedBrands.length > 0) {
            params.set('brands', debouncedBrands.join(','));
        } else {
            params.delete('brands');
        }

        // Update price
        if (debouncedPrice[0] > 0) {
            params.set('minPrice', debouncedPrice[0].toString());
        } else {
            params.delete('minPrice');
        }

        if (debouncedPrice[1] < 10000000) {
            params.set('maxPrice', debouncedPrice[1].toString());
        } else {
            params.delete('maxPrice');
        }

        // Always reset to the first page when filters change
        params.set('page', '1');

        // `pathname` ensures we stay on the correct page (e.g., /search or /vot-cau-long)
        // while updating the query parameters.
        router.push(`${pathname}?${params.toString()}`);

    }, [debouncedBrands, debouncedPrice, pathname, router, searchParams]);


    // --- EVENT HANDLERS ---
    const handleToggleBrand = (brandId: number) => {
        setCheckedBrands(prev =>
            prev.includes(brandId)
                ? prev.filter(id => id !== brandId)
                : [...prev, brandId]
        );
    };

    const handlePriceChange = (event: Event, newValue: number | number[]) => {
        if (Array.isArray(newValue)) {
            setPriceValue(newValue as [number, number]);
        }
    };

    if (isLoading) {
        return <aside className="sidebar">Loading filters...</aside>;
    }

    return (
        <aside className="product-sidebar">
            <div className="sidebar-item">
                <h3 className="sidebar-item-title">Thương hiệu</h3>
                <div className="sidebar-line"></div>
                <div className="sidebar-content">
                    {allBrands.map((brand) => (
                        <div className="brand-checkbox" key={brand.id}>
                            <input
                                type="checkbox"
                                id={`brand-${brand.id}`}
                                value={brand.id}
                                checked={checkedBrands.includes(brand.id)}
                                onChange={() => handleToggleBrand(brand.id)}
                            />
                            <label htmlFor={`brand-${brand.id}`}>{brand.name}</label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="sidebar-item">
                <h3 className="sidebar-item-title">Mức giá</h3>
                <div className="sidebar-line"></div>
                <div className="sidebar-content">
                    <Slider
                        value={priceValue}
                        onChange={handlePriceChange}
                        valueLabelDisplay="off"
                        min={0}
                        max={10000000}
                        step={500000}
                        className="price-slider"
                    />
                    <div className="price-slider-value">
                        <span>{currencyFormatter.format(priceValue[0])}</span>
                        <span>{currencyFormatter.format(priceValue[1])}</span>
                    </div>
                </div>
            </div>
        </aside>
    );

};

export default ProductFilterSidebar;
