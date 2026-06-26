import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { getProducts, getCategories, getProductsByCategory, getCart } from "../services/api";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearch } from "../utils/SearchContext";

const PAGE_SIZE = 8;

export const HomePage = () => {
  console.log("HomePage rendering");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { searchQuery } = useSearch();

  useEffect(() => {
    loadCategories();
    loadCartCount();
  }, []);

  // reset to page 1 whenever the search term or category changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, page, searchQuery]);

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
    console.log("loadProducts called, searchQuery is:", searchQuery);
    setLoading(true);
    try {
      let res;
      const trimmedSearch = searchQuery.trim();

      if (trimmedSearch) {
        res = await getProducts(page, PAGE_SIZE, trimmedSearch);
      } else if (selectedCategory === "all") {
        res = await getProducts(page, PAGE_SIZE);
      } else {
        res = await getProductsByCategory(selectedCategory, page, PAGE_SIZE);
      }

      setProducts(res.data.items ?? []);
      setTotalCount(res.data.totalCount ?? 0);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const isSearching = searchQuery.trim().length > 0;

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
          {isSearching ? (
            <p className="text-gray-500 mb-6">
              Showing results for "<span className="font-medium text-gray-800">{searchQuery}</span>"
            </p>
          ) : (
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={handleCategoryChange}
            />
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <p className="text-gray-400">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-400">No products found.</div>
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