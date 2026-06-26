import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7042/api",
   headers: {
    'Content-Type': 'application/json'
  }
});

// Attach the JWT (if we have one) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is missing/expired, the API returns 401 — clear it locally
// so the app doesn't keep thinking the user is signed in.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

// Products
export const getProducts = () => api.get("/product");
export const getProductById = (id) => api.get(`/product/${id}`);
export const getProductsByCategory = (categoryId) => api.get(`/product/category/${categoryId}`);
export const createProduct = (product) => api.post("/product", product);
export const updateProduct = (id, product) => api.put(`/product/${id}`, product);
export const deleteProduct = (id) => api.delete(`/product/${id}`);

// Categories
export const getCategories = () => api.get("/category");
export const createCategory = (data) => api.post("/category", data);

// Auth
export const signupUser = (data) => api.post("/auth/signup", data);
export const loginUser = (data) => api.post("/auth/signin", data);
export const logoutUser = () => api.post("/auth/signout");
export const getCurrentUser = () => api.get("/auth/me");

// Cart
export const getCart = () => api.get("/cart");
export const addToCart = (data) => api.post("/cart", data);
export const updateCartItem = (itemId, data) => api.put(`/cart/${itemId}`, data);
export const removeCartItem = (itemId) => api.delete(`/cart/${itemId}`, {
  headers: { 'Content-Type': 'application/json' }
});
export const clearCart = () => api.delete("/cart", {
  headers: { 'Content-Type': 'application/json' }
});
export default api;