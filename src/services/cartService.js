import axios from "../axios";

let handleCreatCartService = (data) => {
  return axios.post("/api/cart/create-cart", data, { withCredentials: true });
};

let handleAddProductToCart = (data) => {
  return axios.post(`/api/cart/add-product-to-cart`, data, {
    withCredentials: true,
  });
};

let handleGetAllProductCart = (userId) => {
  return axios.get(`/api/cart/get-all-product-cart?userId=${userId}`, {
    withCredentials: true,
  });
};

let handleUpdateProductCartService = (data) => {
  return axios.put("/api/cart/update-product-cart", data, {
    withCredentials: true,
  });
};

let handleDeleteProductCartService = (productId, sizeId, userId) => {
  return axios.delete(
    `/api/cart/delete-product-cart?productId=${productId}&sizeId=${sizeId}&userId=${userId}`,
    { withCredentials: true }
  );
};

export {
  handleCreatCartService,
  handleAddProductToCart,
  handleGetAllProductCart,
  handleUpdateProductCartService,
  handleDeleteProductCartService,
};
