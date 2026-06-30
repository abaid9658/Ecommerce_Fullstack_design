import API from './axios.js';

export const getProducts = async (filters = {}) => {
  const params = new URLSearchParams();
  
  Object.keys(filters).forEach((key) => {
    if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
      params.append(key, filters[key]);
    }
  });

  const response = await API.get(`/products?${params.toString()}`);
  return response.data;
};

export const getProductById = async (id) => {
  const response = await API.get(`/products/${id}`);
  return response.data;
};

export const getFeaturedProducts = async () => {
  const response = await API.get('/products/featured');
  return response.data;
};

export const getDealProducts = async () => {
  const response = await API.get('/products/deals');
  return response.data;
};

export const getRelatedProducts = async (id) => {
  const response = await API.get(`/products/${id}/related`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await API.post('/products', productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await API.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await API.delete(`/products/${id}`);
  return response.data;
};

export const sendProductInquiry = async (id, data) => {
  const response = await API.post(`/products/${id}/inquiry`, data);
  return response.data;
};
