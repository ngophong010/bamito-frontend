"use client";
import React from "react";
import GridData from "@/components/GridData/GridData";

function OrderAdmin({ params }) {
  let headerString = null;
  let orderStatus = null;
  if (params.orderType === "order-waiting") {
    headerString = "Xác nhận đơn hàng";
    orderStatus = 1;
  } else if (params.orderType === "order-delivery") {
    headerString = "Đơn hàng đang giao";
    orderStatus = 2;
  } else if (params.orderType === "order-done") {
    headerString = "Đơn hàng đã giao";
    orderStatus = 3;
  } else if (params.orderType === "order-canceled") {
    headerString = "Đơn hàng đã hủy";
    orderStatus = 0;
  }

  const tableColumns = [
    {
      label: "STT",
      key: "",
      style: { borderTopLeftRadius: 15, paddingLeft: "2rem" },
    },
    { label: "MÃ ĐƠN HÀNG", key: "orderId" },
    { label: "NGÀY ĐẶT", key: "createdAt" },
    { label: "TỔNG TIỀN", key: "totalPrice" },
    { label: "", key: "", style: { borderTopRightRadius: 15 } },
  ];

  return (
    <GridData
      headerString={headerString}
      orderStatus={{
        data: orderStatus,
        orderType: params.orderType,
      }}
      tableColumns={tableColumns}
      gridType={"order-admin"}
    />
  );
}

export default OrderAdmin;
