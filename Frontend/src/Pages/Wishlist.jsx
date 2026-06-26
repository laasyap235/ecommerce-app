import { Heart } from "lucide-react";
import { useWishlist } from "../utils/WishlistContext";
import ProductCard from "../components/ProductCard";

const Wishlist = () => {
  const { wishlist, loading } = useWishlist();

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading wishlist...</div>;
  }

  if (!wishlist.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <Heart size={48} className="mb-4 text-gray-300" />
        <p className="text-lg">Your wishlist is empty</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Wishlist ({wishlist.length})</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;