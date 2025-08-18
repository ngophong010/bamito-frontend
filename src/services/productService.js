import axios from "../axios";

const handleGetAllProductService = ({limit, page, name}) => {
  return axios.get(
    `/api/product/get-all-product`,
    { params: { limit, page, name } }
  );
};

const handleCreateProductService = (data) => {
  return axios.post(`/api/product/create-product`, data);
};

const handleUpdateProductService = (data) => {
  return axios.put(`/api/product/update-product`, data);
};

const handleDeleteProductService = (id) => {
  return axios.delete(`/api/product/delete-product`, {
    params: { id },
  });
};
const handleGetProductService = ({productId}) => {
  return axios.get(`/api/product/get-product`, {
    params: { productId },
  });
};

const handleGetAllProductOfTheProductType = ({
  productTypeId,
  limit,
  page,
  sort,
  filter
}) => {
  return axios.get(
    `/api/product/get-all-product-of-the-product-type`,
    { params: { productTypeId, limit, page, sort, filter } }
  );
};

const handleGetAllProductSaleOffService = ({limit, page}) => {
  return axios.get(
    `/api/product/get-product-sale-off`,
    { params: { limit, page } },
  );
};

const handleGetAllProductFavorute = ({limit, page, userId}) => {
  return axios.get(
    `/api/product/get-product-favourite`,
    { params: { limit, page, userId } },
  );
};

const handleGetProductName = ({productId}) => {
  return axios.get(`/api/product/get-product-name`, {
    params: { productId },
  });
};

export {
  handleGetAllProductService,
  handleCreateProductService,
  handleUpdateProductService,
  handleDeleteProductService,
  handleGetProductService,

  handleGetAllProductOfTheProductType,
  handleGetAllProductSaleOffService,
  handleGetAllProductFavorute,
  handleGetProductName,
};
