import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminPage from "./Pages/AdminPage";
// import HomePage from "./pages/HomePage";
import HomePage from "./Pages/HomePage";
import ProductPage from "./Pages/ProductPage";
import SignInPage from "./Pages/SignInPage";
import SignUpPage from "./Pages/SignUpPage";
import CartPage from "./Pages/CartPage";
import Wishlist from "./Pages/Wishlist";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/wishlist" element={<Wishlist />} />
    </Routes>
  );
}

export default App;