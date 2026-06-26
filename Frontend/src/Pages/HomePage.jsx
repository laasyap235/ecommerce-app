import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { getProducts, getCategories, getProductsByCategory, getCart } from "../services/api";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 8;

export const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    loadCategories();
    loadCartCount();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, page]);

  const loadCartCount = async () => {
    try {
      const res = await getCart();
      const count = res.data.cartItems?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadProducts = async () => {
      setLoading(true);
      try {
        const res = selectedCategory === "all"
          ? await getProducts(page, PAGE_SIZE)
          : await getProductsByCategory(selectedCategory, page, PAGE_SIZE);
        console.log('products response:', res.data); // ✅ add this
        setProducts(res.data.items ?? []);  // ✅ fallback to empty array
        setTotalCount(res.data.totalCount ?? 0);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <>
      <Navbar cartCount={cartCount} />
      <div className="min-h-screen bg-white">
        <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-12">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl font-bold">Discover Amazing Products</h1>
            <p className="text-gray-600 mt-3">Find everything you need in one place</p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto p-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={handleCategoryChange}
          />

          {loading ? (
            <div className="flex justify-center py-20">
              <p className="text-gray-400">Loading products...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setPage(p => p - 1)}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                        page === p
                          ? "bg-teal-600 text-white"
                          : "border border-gray-200 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;