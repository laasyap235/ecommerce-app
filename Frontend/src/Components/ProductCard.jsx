import { ShoppingCart, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { addToCart } from "../services/cartService";
import { useWishlist } from "../utils/WishlistContext";
import { useToast } from "../utils/ToastContext"; 

import { addToCart } from "../services/api";


const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast(); // 👈 add this
  const [adding, setAdding] = useState(false);

  const isWishlisted = isInWishlist(product.productId);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    alert("Added to cart!");
  };

  const handleToggleWishlist = async (e) => {
  e.stopPropagation();
  try {
    const message = await toggleWishlist(product);
    console.log("toggleWishlist returned:", message); // 👈 add this
    if (message) {
      showToast({
        message,
        actionLabel: "Go to wishlist",
        actionPath: "/wishlist",
      });
    }
  } catch (err) {
    console.error("Wishlist toggle failed:", err);
  }
};

  const handleAddToCart = async (e) => {
      e.stopPropagation();
      setAdding(true);
      try {
        await addToCart({ productId: product.productId, quantity: 1 });
        alert("Added to cart!");
      } catch (err) {
        alert("Failed to add to cart. Are you signed in?");
        console.log(err.response?.data);
      } finally {
        setAdding(false);
      }
    };

  return (
    <div
      onClick={() => navigate(`/product/${product.productId}`)}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
    >
      <div className="relative bg-gray-100 aspect-square flex items-center justify-center overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x300?text=Product";
          }}
          className="w-full h-full object-cover"
        />

        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition"
        >
          <Heart
            size={18}
            className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"}
          />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{product.categoryName}</p>

        <div className="flex justify-between items-center mt-4">
          <span className="font-bold text-xl">
            ${Number(product.price).toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white p-2 rounded-lg transition"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;