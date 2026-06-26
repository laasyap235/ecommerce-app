import { useEffect, useState } from "react";
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
} from "../services/api";

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    categoryId: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const productsRes = await getProducts(1, 1000);
      const categoriesRes = await getCategories();
      setProducts(productsRes.data.items);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteProduct(id);
    loadData();
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsNewCategory(false);
    setNewCategory("");
    setNewCategoryDescription("");
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl,
      categoryId: parseInt(product.categoryId),
    });
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setIsNewCategory(false);
    setNewCategory("");
    setNewCategoryDescription("");
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      imageUrl: "",
      categoryId: "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let categoryId = formData.categoryId;

      if (isNewCategory) {
        if (!newCategory.trim()) {
          alert("Please enter a category name.");
          return;
        }
        const res = await createCategory({
          categoryName: newCategory,
          description: newCategoryDescription,
        });
        categoryId = res.data.categoryId;
      }

      const payload = { ...formData, categoryId };

      if (editingProduct) {
        await updateProduct(editingProduct.productId, payload);
      } else {
        await createProduct(payload);
      }

      setShowForm(false);
      setIsNewCategory(false);
      setNewCategory("");
      setNewCategoryDescription("");
      loadData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto p-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500">Products</h3>
            <p className="text-4xl font-bold mt-2">{products.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500">Categories</h3>
            <p className="text-4xl font-bold mt-2">{categories.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-bold">Products</h2>
            <button
              onClick={handleAdd}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg"
            >
              Add Product
            </button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Name</th>
                <th className="text-left py-3">Category</th>
                <th className="text-left py-3">Price</th>
                <th className="text-left py-3">Stock</th>
                <th className="text-left py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.productId} className="border-b">
                  <td className="py-4">{product.name}</td>
                  <td>{product.categoryName}</td>
                  <td>${product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.productId)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                placeholder="Name"
                className="w-full border p-3 rounded"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <textarea
                placeholder="Description"
                className="w-full border p-3 rounded"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <input
                placeholder="Price"
                type="number"
                className="w-full border p-3 rounded"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />

              <input
                placeholder="Stock"
                type="number"
                className="w-full border p-3 rounded"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />

              <input
                placeholder="Image URL"
                className="w-full border p-3 rounded"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />

              <select
                className="w-full border p-3 rounded"
                value={isNewCategory ? "new" : formData.categoryId}
                onChange={(e) => {
                  if (e.target.value === "new") {
                    setIsNewCategory(true);
                  } else {
                    setIsNewCategory(false);
                    setFormData({ ...formData, categoryId: parseInt(e.target.value) });
                  }
                }}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
                <option value="new">+ Add New Category</option>
              </select>

              {isNewCategory && (
                <>
                  <input
                    type="text"
                    placeholder="Enter New Category Name"
                    className="w-full border p-3 rounded"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Category Description (optional)"
                    className="w-full border p-3 rounded"
                    value={newCategoryDescription}
                    onChange={(e) => setNewCategoryDescription(e.target.value)}
                  />
                </>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-teal-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="border px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;