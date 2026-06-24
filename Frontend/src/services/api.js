import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7042/api',
  withCredentials: true, // needed so the auth cookie is sent/stored on every request
});

export const getCategories = () => api.get('/category');
export const getProducts = () => api.get('/product');
export const getProductById = (id) => api.get(`/product/${id}`);
export const getProductsByCategory = (categoryId) => api.get(`/product/category/${categoryId}`);

export const signupUser = (data) => api.post('/auth/signup', data);
export const loginUser = (data) => api.post('/auth/signin', data);
export const logoutUser = () => api.post('/auth/signout');