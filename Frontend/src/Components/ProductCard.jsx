import { ShoppingCart, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div
      onClick={() =>
        navigate(`/product/${product.productId}`)
      }
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative bg-gray-100 aspect-square flex items-center justify-center overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/300x300?text=Product";
          }}
          className="w-full h-full object-cover"
        />

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition"
        >
          <Heart
            size={18}
            className={
              isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-gray-500"
            }
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">
          {product.name}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          {product.category?.categoryName}
        </p>

        <div className="flex justify-between items-center mt-4">
          <span className="font-bold text-xl">
            ${Number(product.price).toFixed(2)}
          </span>

          <button
            onClick={(e) => e.stopPropagation()}
            className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-lg transition"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;