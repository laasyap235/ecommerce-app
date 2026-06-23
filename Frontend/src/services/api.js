import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7042/api',
});

export const getCategories = () => api.get('/category');
export const getProducts = () => api.get('/product');
export const getProductById = (id) => api.get(`/product/${id}`);
export const getProductsByCategory = (categoryId) => api.get(`/product/category/${categoryId}`);