import API from './axios.js';

export const getCart = async () => {
  const response = await API.get('/cart');
  return response.data;
};

export const addToCart = async (productId, quantity = 1, selectedColor = '', selectedSize = '', material = '') => {
  const response = await API.post('/cart/items', {
    productId,
    quantity,
    selectedColor,
    selectedSize,
    material
  });
  return response.data;
};

export const updateCartItem = async (productId, quantity, selectedColor = '', selectedSize = '') => {
  const response = await API.put(`/cart/items/${productId}`, {
    quantity,
    selectedColor,
    selectedSize
  });
  return response.data;
};

export const removeFromCart = async (productId, selectedColor = '', selectedSize = '') => {
  const params = new URLSearchParams();
  if (selectedColor) params.append('selectedColor', selectedColor);
  if (selectedSize) params.append('selectedSize', selectedSize);
  
  const response = await API.delete(`/cart/items/${productId}?${params.toString()}`);
  return response.data;
};

export const saveForLater = async (productId, selectedColor = '', selectedSize = '') => {
  const response = await API.post(`/cart/save-for-later/${productId}`, {
    selectedColor,
    selectedSize
  });
  return response.data;
};

export const moveToCart = async (productId) => {
  const response = await API.post(`/cart/move-to-cart/${productId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await API.delete('/cart');
  return response.data;
};

export const checkoutSession = async () => {
  const response = await API.post('/stripe/create-checkout-session');
  return response.data;
};
