import axios from '../axios';

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

export {
    handleGetAllSizeService,
    handleCreateSizeService,
    handleUpdateSizeService,
    handleDeleteSizeService,
};