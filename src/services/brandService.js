import axios from "../axios";

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

export {
    handleGetAllBrandService,
    handleCreateBrandService,
    handleUpdateBrandService,
    handleDeleteBrandService,
}