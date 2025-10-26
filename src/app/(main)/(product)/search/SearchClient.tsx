"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Grid } from "@mui/material";
import Rating from "@mui/material/Rating";
import FavoriteBorderTwoToneIcon from "@mui/icons-material/FavoriteBorderTwoTone";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setFavourites } from "@/lib/redux/features/user/userSlice";

import { ProductListItem, PaginatedApiResponse } from "@/types";
import { addFavourite, removeFavourite, getMyFavouriteIds } from "@/services/favouriteService";
import PaginatedItems from "@/components/Pagination/Pagination";
import { createSlug } from "@/lib/utils/slug";
import "./page.scss";

const currencyFormatter = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

interface SearchClientProps {
  initialProductData: PaginatedApiResponse<ProductListItem>;
  searchTerm: string;
}

const SearchClient = ({ initialProductData, searchTerm }: SearchClientProps) => {
  const dispatch = useAppDispatch();

  // Get the global list of favourite IDs from the user slice
  const favouriteProductIds = useAppSelector((state) => state.user.favouriteProductIds);
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);

  const handleLikeToggle = async (productId: number, isFavourited: boolean) => {
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để sử dụng tính năng này.");
      return;
    }
    try {
      if (isFavourited) {
        await removeFavourite(productId);
      } else {
        await addFavourite(productId);
      }
      const updatedFavouriteIds = await getMyFavouriteIds();
      dispatch(setFavourites(updatedFavouriteIds));
      toast.success("Cập nhật danh sách yêu thích thành công!");
    } catch (error) {
      toast.error("Đã xảy ra lỗi, vui lòng thử lại.");
    }
  };

  // Derive the final list to render by combining server data with live Redux state
  const productsWithFavouriteStatus = initialProductData.items.map(product => ({
    ...product,
    isFavourited: favouriteProductIds.includes(product.id),
  }));

  return (
    <div className="search-container">
      <div className="search-header">
        <h1>
          {searchTerm 
            ? `Kết quả tìm kiếm cho "${searchTerm}"`
            : "Tìm kiếm sản phẩm"}
        </h1>
        <p>{initialProductData.totalItems} sản phẩm được tìm thấy</p>
      </div>

      {productsWithFavouriteStatus.length > 0 ? (
        <Grid container spacing={5}>
          {productsWithFavouriteStatus.map((item) => (
            <Grid item xs={3} key={item.id}>
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
                  <button
                    className="favorite"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLikeToggle(item.id, item.isFavourited);
                    }}
                  >
                    {item.isFavourited ? (
                      <FavoriteTwoToneIcon style={{ color: "red" }} />
                    ) : (
                      <FavoriteBorderTwoToneIcon />
                    )}
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
          <h1>Không có sản phẩm nào phù hợp với tìm kiếm của bạn.</h1>
        </div>
      )}

      <div style={{ marginTop: 50 }}>
        <PaginatedItems
          currentPage={initialProductData.currentPage}
          totalPages={initialProductData.totalPages}
          onPageChange={(newPage) => {
            // Logic to update URL params and navigate
          }}
        />
      </div>
    </div>
  );
};

export default SearchClient;