export const getToken = () => localStorage.getItem("token");

export const clearToken = () => {
  localStorage.removeItem("token");
};

export const isAuthError = (error) =>
  error?.response?.status === 401 || error?.response?.status === 403;

export const getAuthHeaders = (extraHeaders = {}) => {
  const token = getToken();
  return {
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};
