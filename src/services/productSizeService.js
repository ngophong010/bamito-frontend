import axios from "../axios";

const handleGetAllProductSizeService = ({productId, limit, page}) => {
  return axios.get(
    `/api/product-size/get-all-product-size`,
    { params: { productId, limit, page } }
  );
};

const handleGetAllSizeOfTheProductType = ({productTypeId}) => {
  return axios.get(
    `/api/size/get-all-size-product-type`,
    { params: { productTypeId } }
  );
};

const handleCreateProductSizeService = (data) => {
  return axios.post(`/api/product-size/create-product-size`, data);
};

const handleDeleteProductSizeService = ({id}) => {
  return axios.delete(`/api/product-size/delete-product-size`, {
    params: { id },
  });
};

const handleUpdateProductSizeService = (data) => {
  return axios.put(`/api/product-size/update-product-size`, data);
};

export {
  handleGetAllProductSizeService,
  handleGetAllSizeOfTheProductType,
  handleCreateProductSizeService,
  handleDeleteProductSizeService,
  handleUpdateProductSizeService,
};
