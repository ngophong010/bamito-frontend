import axios from "../axios";

const handleGetProductTypeService = ({id}) => {
  return axios.get(`/api/product-type/get-product-type`, {
    params: { id },
  });
};

const handleGetAllProductTypeService = ({limit, page, name, pagination}) => {
  return axios.get(
    `/api/product-type/get-all-product-type`,
    { params: { limit, page, name, pagination }, 
  });
};

const handleCreateProductTypeService = (data) => {
  return axios.post(`/api/product-type/create-product-type`, data);
};

const handleUpdateProductTypeService = (data) => {
  return axios.put(`/api/product-type/update-product-type`, data);
};

const handleDeleteProductTypeService = ({id}) => {
  return axios.delete(`/api/product-type/delete-product-type`, {
    params: { id },
  });
};

const handleGetAllBrandService = ({limit, page, name, pagination}) => {
  return axios.get(
    `/api/brand/get-all-brand`, {
      params: {
        limit,
        page,
        name,
        pagination
      },
    }
  );
};

const handleCreateBrandService = (data) => {
  return axios.post(`/api/brand/create-brand`, data);
};

const handleUpdateBrandService = (data) => {
  return axios.put(`/api/brand/update-brand`, data);
};

const handleDeleteBrandService = ({id}) => {
  return axios.delete(`/api/brand/delete-brand`, {
    params: { id },
  });
};

const handleGetAllSizeService = ({limit, page, name}) => {
  return axios.get(
    `/api/size/get-all-size`,
    { params: { limit, page, name }, }
  );
};

const handleCreateSizeService = (data) => {
  return axios.post(`/api/size/create-size`, data);
};

const handleUpdateSizeService = (data) => {
  return axios.put(`/api/size/update-size`, data);
};

const handleDeleteSizeService = ({id}) => {
  return axios.delete(`/api/size/delete-size`, {
    params: { id },
  });
};

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

const handleGetAllProductSizeService = ({productId, limit, page}) => {
  return axios.get(
    `/api/product-size/get-all-product-size`,
    { params: { productId, limit, page } }
  );
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

const handleGetAllSizeOfTheProductType = ({productTypeId}) => {
  return axios.get(
    `/api/size/get-all-size-product-type`,
    { params: { productTypeId } }
  );
};

const handleCreateProductSizeService = (data) => {
  return axios.post(`/api/product-size/create-product-size`, data);
};

const handleDeleteProductSizeService = (id) => {
  return axios.delete(`/api/product-size/delete-product-size?id=${id}`, {
    withCredentials: true,
  });
};

const handleUpdateProductSizeService = (data) => {
  return axios.put(`/api/product-size/update-product-size`, data);
};

const handleCreateNewVoucher = (data) => {
  return axios.post(`/api/voucher/create-voucher`, data);
};

const handleUpdateVoucherService = (data) => {
  return axios.put(`/api/voucher/update-voucher`, data);
};

const handleDeleteVoucher = (id) => {
  return axios.delete(`/api/voucher/delete-voucher?id=${id}`, {
    withCredentials: true,
  });
};
const handleGetAllVoucher = ({limit, page, pagination}) => {
  return axios.get(
    `/api/voucher/get-all-voucher`,
    { params: { limit, page, pagination } },
  );
};

const handleGetAllVoucherUserService = () => {
  return axios.get(`/api/voucher/get-all-voucher-user`);
};

const handleGetAllProductFeedback = ({userId}) => {
  return axios.get(`/api/product/get-product-feedback`, {
    params: { userId },
  });
};

const handleCreateFeedbackService = (data) => {
  return axios.post(`/api/feedback/create-feedback`, data);
};

const handleAllFeedbackService = ({productId}) => {
  return axios.get(`/api/feedback/get-all-feedback`, {
    params: { productId },
  });
};

const handleUpdateFeedbackService = (data) => {
  return axios.put(`/api/feedback/update-feedback`, data);
};

const handleDeleteFeedbackService = (id, userId) => {
  return axios.delete(
    `/api/feedback/delete-feedback`,
    { params: { id, userId } }
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
  handleGetProductTypeService,
  handleGetAllProductTypeService,
  handleCreateProductTypeService,
  handleUpdateProductTypeService,
  handleDeleteProductTypeService,
  handleGetAllBrandService,
  handleCreateBrandService,
  handleUpdateBrandService,
  handleDeleteBrandService,
  handleGetAllSizeService,
  handleCreateSizeService,
  handleUpdateSizeService,
  handleDeleteSizeService,
  handleGetAllProductService,
  handleCreateProductService,
  handleUpdateProductService,
  handleDeleteProductService,
  handleGetProductService,
  handleGetAllProductSizeService,
  handleGetAllSizeOfTheProductType,
  handleCreateProductSizeService,
  handleDeleteProductSizeService,
  handleUpdateProductSizeService,
  handleGetAllProductOfTheProductType,
  handleCreateNewVoucher,
  handleUpdateVoucherService,
  handleDeleteVoucher,
  handleGetAllVoucher,
  handleGetAllVoucherUserService,
  handleGetAllProductFeedback,
  handleCreateFeedbackService,
  handleAllFeedbackService,
  handleUpdateFeedbackService,
  handleDeleteFeedbackService,
  handleGetAllProductSaleOffService,
  handleGetAllProductFavorute,
  handleGetProductName,
};
