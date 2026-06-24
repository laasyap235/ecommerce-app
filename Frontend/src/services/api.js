import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7042/api",  
});

export const getProducts = () => api.get("/product");
export const getProductById = (id) => api.get(`/product/${id}`);

export const getCategories = () => api.get("/category");
export const createCategory = (data) => api.post("/category", data); // ← add this

export const createProduct = (product) => api.post("/product", product);
export const updateProduct = (id, product) => api.put(`/product/${id}`, product);
export const deleteProduct = (id) => api.delete(`/product/${id}`);