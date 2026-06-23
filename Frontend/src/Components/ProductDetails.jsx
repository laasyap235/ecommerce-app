import React, { useState } from 'react';
import { ChevronDown, ShoppingCart, Star, Heart, ArrowLeft, Check } from 'lucide-react';
import {useParams, useNavigate} from 'react-router-dom'

const ProductDetailsPage = ({ productId = 1, onBack }) => {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const { id } = useParams()  // Get ID from URL
  const navigate = useNavigate()  // For back button

  // Mock product details data
  const productDetails = {
    1: {
      name: 'Premium Wireless Headphones',
      price: 199.99,
      rating: 4.5,
      category: 'Electronics',
      stock: 45,
      image: '🎧',
      description: 'Experience crystal-clear audio with our premium wireless headphones. Designed for comfort and performance, featuring active noise cancellation, 30-hour battery life, and premium sound quality.'
    }
  };

  const product = productDetails[productId];

  if (!product) {
    return <div className="text-center py-20">Product not found</div>;
  }


  const handleAddToCart = () => {
    alert(`Added ${quantity} item(s) to cart!`);
    setQuantity(1);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button 
          onClick={onBack}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-6"
        >
          <ArrowLeft size={20} />
          Back to Products
        </button>
      </div>

      {/* Product Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="flex flex-col gap-4">
            <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center relative">
              <span className="text-9xl">{product.image}</span>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Category */}
            <span className="text-sm font-semibold text-teal-600 uppercase tracking-wide mb-2">
              {product.category}
            </span>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>


            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-gray-200">
              <span className="text-4xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              {product.stock > 10 ? (
                <>
                  <Check size={20} className="text-green-600" />
                  <span className="text-green-600 font-medium">In Stock ({product.stock} available)</span>
                </>
              ) : product.stock > 0 ? (
                <>
                  <Check size={20} className="text-orange-600" />
                  <span className="text-orange-600 font-medium">Limited Stock ({product.stock} left)</span>
                </>
              ) : (
                <span className="text-red-600 font-medium">Out of Stock</span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-700 font-medium">Quantity:</span>
              <select
                value={quantity}
                onChange={handleQuantityChange}
                className="border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-teal-600 focus:outline-none"
              >
                {[...Array(Math.min(10, product.stock))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition duration-200"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`px-6 py-3 rounded-lg font-semibold transition duration-200 border-2 ${
                  isWishlisted
                    ? 'bg-red-50 border-red-300 text-red-600'
                    : 'border-gray-300 text-gray-700 hover:border-red-300'
                }`}
              >
                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Key Features */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-4">Key Features</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default ProductDetailsPage;