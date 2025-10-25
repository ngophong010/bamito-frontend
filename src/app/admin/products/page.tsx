"use client";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchProducts as fetchAllProductRedux,
  fetchBrands as fetchAllBrandRedux,
  fetchCategories as fetchAllCategoryRedux,
  loadingAdmin,
} from "@/redux/adminSlice";
import { productService } from "@/services/productService";
import GridData from "@/components/GridData/GridData";
import { PAGINATION_LIMIT } from "@/utils/constants";
import { logOut } from "@/redux/features/user/userSlice";
import { ApiError } from "@/repositories/errors";
import { RootState } from "@/redux/store";
import { ProductListItem as Product } from "@/types/product";

function ProductAdmin() {
  const dispatch = useAppDispatch();
  const { 
    items: products = [], 
    currentPage: page = 1,
  } = useAppSelector((state: RootState) => state.admin.allProduct ?? {});

  useEffect(() => {
    // Initial data fetch
    dispatch(fetchAllProductRedux({ 
      limit: PAGINATION_LIMIT.PRODUCTS, 
      page: 1 
    }));
  }, [dispatch]);

  const handleDelete = async (product: Product) => {
    try {
      dispatch(loadingAdmin(true));

      await productService.deleteProduct(product.id);
      
      // Fetch updated data
      const isLastItem = products.length === 1 && page > 1;
      const newPage = isLastItem ? page - 1 : page;

      await Promise.all([
        dispatch(fetchAllProductRedux({
          limit: PAGINATION_LIMIT.PRODUCTS,
          page: newPage,
        })),
        dispatch(fetchAllBrandRedux({
          limit: PAGINATION_LIMIT.BRANDS
        })),
        dispatch(fetchAllCategoryRedux({
          limit: PAGINATION_LIMIT.CATEGORIES
        }))
      ]);

      toast.success("Xóa sản phẩm thành công");
    } catch (err) {
      const error = err as ApiError;
      if (error.code === 'PRODUCT_NOT_FOUND') {
        toast.error("Sản phẩm không tồn tại");
      } else if (error.code === 'SESSION_EXPIRED') {
        toast.error("Phiên bản đăng nhập hết hạn");
        dispatch(logOut());
      } else {
        toast.error(error.message || "Có lỗi xảy ra");
      }
    } finally {
      dispatch(loadingAdmin(false));
    }
  };

  const tableColumns = [
    {
      label: "STT",
      render: (_: Product, index: number) => index + 1,
    },
    { 
      label: "MÃ SẢN PHẨM", 
      render: (item: Product) => item.productId 
    },
    { 
      label: "TÊN SẢN PHẨM", 
      render: (item: Product) => item.name 
    },
    { 
      label: "LOẠI SẢN PHẨM", 
      render: (item: Product) => item.category.name
    },
    { 
      label: "THƯƠNG HIỆU",
      render: (item: Product) => item.brand.name
    },
    { 
      label: "XẾP HẠNG",
      render: (item: Product) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>{item.rating.toFixed(1)}</span>
          <span style={{ fontSize: '14px', marginLeft: '4px' }}>★</span>
        </div>
      )
    },
    { 
      label: "ĐƠN GIÁ", 
      render: (item: Product) => item.price.toLocaleString('vi-VN') + ' ₫'
    },
    { 
      label: "GIẢM GIÁ", 
      render: (item: Product) => item.discount + '%'
    }
  ];

  return (
    <GridData
      headerString="Quản lý sản phẩm"
      tableColumns={tableColumns}
      tableData={products}
      onDelete={handleDelete}
    />
  );
}

export default ProductAdmin;
