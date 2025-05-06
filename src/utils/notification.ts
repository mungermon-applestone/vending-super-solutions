
import { toast } from 'sonner';

export const showSuccess = (message: string, title = 'Success') => {
  return toast.success(title, {
    description: message,
    duration: 5000,
  });
};

export const showError = (message: string, title = 'Error') => {
  return toast.error(title, {
    description: message,
    duration: 8000,
  });
};

export const showInfo = (message: string, title = 'Information') => {
  return toast(title, {
    description: message,
    duration: 4000,
  });
};

export const showWarning = (message: string, title = 'Warning') => {
  return toast.warning(title, {
    description: message,
    duration: 6000,
  });
};

export const showLoading = (message: string, title = 'Loading') => {
  return toast.loading(title, {
    description: message,
  });
};

export default {
  success: showSuccess,
  error: showError,
  info: showInfo,
  warning: showWarning,
  loading: showLoading,
};
