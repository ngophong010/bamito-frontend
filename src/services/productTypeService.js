import axios from '../axios';

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

export {
    handleGetProductTypeService,
    handleGetAllProductTypeService,
    handleCreateProductTypeService,
    handleUpdateProductTypeService,
    handleDeleteProductTypeService,
};
