import { toast } from 'react-toastify';
import { AppDispatch } from '../store';
import { logOut } from '../features/user/userSlice';

export const createErrorHandler = (dispatch: AppDispatch) => 
  (error: any, defaultMessage: string = 'Operation failed') => {
    const message = error?.response?.data?.message || error?.message || defaultMessage;
    
    if (error?.response?.status === 401) {
      toast.error("Session expired, please login again");
      dispatch(logOut());
    } else {
      toast.error(message);
    }
    
    return message;
  };

export const handleAsyncError = (error: any, defaultMessage: string = 'Operation failed') => {
  return error?.response?.data?.message || error?.message || defaultMessage;
};
