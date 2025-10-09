"use client";
import React from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllInventoryRedux,
  fetchAllInventoryOfTheProductTypeRedux,
  loadingAdmin,
} from "@/redux-toolkit/adminSlice";
import { handleDeleteInventoryService } from "@/services/productService";
import GridData from "@/components/GridData/GridData";
import { LIMIT } from "@/utils";
import { handleChangePage } from "@/redux-toolkit/paginationSlice";
import { logOut } from "@/redux-toolkit/userSlice";

const InventoryAdmin = () => {
  const dispatch = useDispatch();
  const productData = useSelector((state) => state.admin?.productData);
  const page = useSelector((state) => state.pagination.page);
  const totalPage = useSelector(
    (state) => state.admin.allInventory?.totalPage
  );

  const handleDeleteInventory = async (inventory, isLast) => {
    try {
      dispatch(loadingAdmin(true));
      let res = await handleDeleteInventoryService(inventory.id);
      if (res && res.errCode === 0) {
        await dispatch(
          fetchAllInventoryRedux({
            productId: productData?.productId,
            limit: LIMIT,
            page: totalPage === page && isLast ? page - 1 : page,
          })
        );
        await dispatch(
          fetchAllInventoryOfTheProductTypeRedux(
            productData?.productTypeData?.productTypeId
          )
        );
        if (totalPage === page && isLast) dispatch(handleChangePage(page - 1));
        toast.success("Xóa kích cỡ sản phẩm thành công");
      }
    } catch (err) {
      if (err?.response?.data?.errCode === 2) {
        toast.error("Kích cỡ sản phẩm không tồn tại");
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
    { label: "TÊN SẢN PHẨM", key: "InventoryData" },
    { label: "KÍCH CỠ", key: "SizeData" },
    { label: "SỐ LƯỢNG", key: "quantity" },
    { label: "", key: "", style: { borderTopRightRadius: 15 } },
  ];

  return (
    <GridData
      tableColumns={tableColumns}
      handleDelete={handleDeleteInventory}
      headerString="Kích cỡ theo sản phẩm"
      gridType="inventory"
    />
  );
};

export default InventoryAdmin;
