import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProductById } from "../services/api";

import ProductDetails from "../components/ProductDetails";

const ProductPage = () => {
  const { id } = useParams();

  const [product, setProduct] =
    useState(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response =
        await getProductById(id);

      setProduct(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!product)
    return (
      <div className="text-center mt-20">
        Loading...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-8">
      <ProductDetails product={product} />
    </div>
  );
};

export default ProductPage;