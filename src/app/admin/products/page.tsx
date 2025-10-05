"use client";
import React from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProductRedux,
  fetchAllBrandRedux,
  fetchAllProductTypeRedux,
  loadingAdmin,
} from "@/redux-toolkit/adminSlice";
import { handleDeleteProductService } from "@/services/productService";
import GridData from "@/components/GridData/GridData";
import { LIMIT } from "@/utils";
import { handleChangePage } from "@/redux-toolkit/paginationSlice";
import { logOut } from "@/redux-toolkit/userSlice";

function ProductAdmin() {
  const dispatch = useDispatch();
  const page = useSelector((state) => state.pagination.page);
  const totalPage = useSelector((state) => state.admin.allProduct?.totalPage);

  const handleDeleteProduct = async (product, isLast) => {
    try {
      dispatch(loadingAdmin(true));
      let res = await handleDeleteProductService(product.id);
      if (res && res.errCode === 0) {
        await dispatch(
          fetchAllProductRedux({
            limit: LIMIT,
            page: totalPage === page && isLast ? page - 1 : page,
          })
        );
        await dispatch(
          fetchAllBrandRedux({
            pagination: false,
          })
        );
        await dispatch(
          fetchAllProductTypeRedux({
            pagination: false,
          })
        );
        if (totalPage === page && isLast) dispatch(handleChangePage(page - 1));
        toast.success("Xóa sản phẩm thành công");
      }
    } catch (err) {
      if (err?.response?.data?.errCode === 2) {
        toast.error("Sản phẩm không tồn tại");
      } else if (err?.response?.data?.errCode === -4) {
        toast.error("Phiên bản đăng nhập hết hạn");
        dispatch(logOut());
      } else {
        toast.error(err?.response?.data?.message);
      }
    } finally {
      dispatch(loadingAdmin(false));
    }
  };

  const tableColumns = [
    {
      label: "STT",
      key: "",
      style: { borderTopLeftRadius: 15, paddingLeft: "2rem" },
    },
    { label: "MÃ SẢN PHẨM", key: "productId" },
    { label: "TÊN SẢN PHẨM", key: "name" },
    { label: "LOẠI SẢN PHẨM", key: "productTypeData" },
    { label: "ĐƠN GIÁ", key: "price" },
    { label: "GIẢM GIÁ", key: "discount" },
    { label: "", key: "", style: { borderTopRightRadius: 15 } },
  ];

  return (
    <GridData
      tableColumns={tableColumns}
      handleDelete={handleDeleteProduct}
      headerString="Quản lý sản phẩm"
      gridType="product"
    />
  );
}

export default ProductAdmin;
