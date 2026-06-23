import React, { useState } from 'react';
import { ChevronDown, ShoppingCart, Star } from 'lucide-react';
import {useNavigate} from 'react-router-dom'

const EcommercePage = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('all');

  
  // Mock product data
  const products = [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      category: 'electronics',
      price: 199.99,
      rating: 4.5,
      image: '🎧',
      badge: 'New'
    },
    {
      id: 2,
      name: 'Classic Leather Watch',
      category: 'accessories',
      price: 149.99,
      rating: 4.8,
      image: '⌚',
      badge: 'Sale'
    },
    {
      id: 3,
      name: 'Cotton T-Shirt',
      category: 'clothing',
      price: 29.99,
      rating: 4.3,
      image: '👕',
      badge: null
    },
    {
      id: 4,
      name: 'Running Shoes',
      category: 'shoes',
      price: 89.99,
      rating: 4.6,
      image: '👟',
      badge: 'Popular'
    },
    {
      id: 5,
      name: 'Designer Sunglasses',
      category: 'accessories',
      price: 179.99,
      rating: 4.7,
      image: '🕶️',
      badge: null
    },
    {
      id: 6,
      name: 'Smart Watch Pro',
      category: 'electronics',
      price: 299.99,
      rating: 4.9,
      image: '⌚',
      badge: 'New'
    },
    {
      id: 7,
      name: 'Denim Jeans',
      category: 'clothing',
      price: 69.99,
      rating: 4.4,
      image: '👖',
      badge: null
    },
    {
      id: 8,
      name: 'Winter Jacket',
      category: 'clothing',
      price: 149.99,
      rating: 4.5,
      image: '🧥',
      badge: 'Sale'
    },
  ];

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'shoes', label: 'Shoes' },
  ];

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-gray-900">ShopHub</div>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 text-gray-700 hover:text-teal-600 font-medium transition duration-200">
                Sign In
              </button>
              <button className="relative p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition">
                <ShoppingCart size={24} />
                <span className="absolute top-1 right-1 bg-teal-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Discover Amazing Products
            </h1>
            <p className="text-lg text-gray-600">Find everything you need in one place</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="mb-12 flex items-center gap-4">
          <label htmlFor="category" className="text-gray-700 font-semibold">
            Filter by Category:
          </label>
          <div className="relative">
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-white border-2 border-gray-300 text-gray-900 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 transition cursor-pointer font-medium"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <ChevronDown 
              size={20} 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>
          <span className="text-gray-600 text-sm">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-gray-300 transition duration-300 group cursor-pointer"
              >
                {/* Product Image Container */}
                <div className="relative bg-gray-100 aspect-square flex items-center justify-center overflow-hidden group-hover:bg-gray-200 transition">
                  <span className="text-6xl">{product.image}</span>
                  
                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-3 right-3 bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {product.badge}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-teal-600 transition">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
                  </div>

                  {/* Price and Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                    <button className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-lg transition duration-200 shadow-sm hover:shadow-md">
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No products found in this category.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-white mb-4">About</h4>
              <p className="text-sm">Your trusted online shopping destination for quality products.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Customer Service</h4>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition">Returns</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Follow</h4>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 ShopHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EcommercePage;