import { ArrowLeft, Heart, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { addToCart } from "../services/cartService";

const ProductDetails = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const handleAddToCart = async () => {
        try {
            await addToCart({ productId: product.productId, quantity: 1 });
            alert("Added to cart!");
        } catch (err) {
            console.error(err);
            alert("Failed to add to cart. Are you logged in?");
        }
        };

  return (
    <>
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-6"
      >
        <ArrowLeft size={18} />
        Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Product Image */}
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/600x600?text=Product";
            }}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Product Information */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            {product.name}
          </h1>

          <p className="text-gray-600 mt-4 leading-relaxed">
            {product.description}
          </p>

          <p className="text-3xl font-bold mt-6 text-gray-900">
            ${Number(product.price).toFixed(2)}
          </p>

          <div className="mt-6 space-y-2">
            <p>
              <span className="font-semibold">Stock Available:</span>
              <span className="ml-2 text-gray-700">{product.stock}</span>
            </p>
            <p>
              <span className="font-semibold">Category:</span>
              <span className="ml-2 text-gray-700">{product.categoryName}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">

            <button
              onClick={handleAddToCart}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>

            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`px-5 py-3 rounded-lg border-2 transition ${
                isWishlisted
                  ? "bg-red-50 border-red-300 text-red-500"
                  : "border-gray-300 text-gray-600 hover:border-red-300"
              }`}
            >
              <Heart size={22} fill={isWishlisted ? "currentColor" : "none"} />
            </button>

          </div>
        </div>

      </div>
    </>
  );
};

export default ProductDetails;