import axios from '../axios';

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

export {
  handleCreateNewVoucher,
  handleUpdateVoucherService,
  handleDeleteVoucher,
  handleGetAllVoucher,
  handleGetAllVoucherUserService,
};