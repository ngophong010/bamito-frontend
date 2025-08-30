import axios from '../axios';

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

export {
  handleGetAllProductFeedback,
  handleCreateFeedbackService,
  handleAllFeedbackService,
  handleUpdateFeedbackService,
  handleDeleteFeedbackService,
};