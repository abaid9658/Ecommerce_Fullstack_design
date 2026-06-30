import API from './axios.js';

export const login = async (email, password) => {
  const response = await API.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (name, email, password) => {
  const response = await API.post('/auth/register', { name, email, password });
  return response.data;
};

export const logout = async () => {
  const response = await API.post('/auth/logout');
  return response.data;
};

export const getProfile = async () => {
  const response = await API.get('/auth/profile');
  return response.data;
};
