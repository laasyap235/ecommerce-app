import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7042/api",  // ← http not https
  withCredentials: true,
});

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
export const loginUser = (data) => api.post("/auth/signin", data);  // ← signin not login
export const logoutUser = () => api.post("/auth/signout");

// Cart
export const getCart = () => api.get("/cart");
export const addToCart = (data) => api.post("/cart", data);
export const updateCartItem = (itemId, data) => api.put(`/cart/${itemId}`, data);
export const removeCartItem = (itemId) => api.delete(`/cart/${itemId}`);
export const clearCart = () => api.delete("/cart");