import { useEffect, useState } from "react";

import {
  getProducts,
  getCategories,
} from "../services/api";

import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";

const HomePage = () => {
  const [products, setProducts] = useState([]);

  const [categories, setCategories] =
    useState([]);

  const [selectedCategory, setSelectedCategory] =
    useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const productsRes = await getProducts();
      const categoriesRes = await getCategories();

      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(
          (p) =>
            p.categoryId === Number(selectedCategory)
        );

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-12">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold">
            Discover Amazing Products
          </h1>

          <p className="text-gray-600 mt-3">
            Find everything you need in one place
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto p-8">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;