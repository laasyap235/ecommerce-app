import { useEffect, useState } from "react";
import {
  getProducts, getCategories, createProduct,
  updateProduct, deleteProduct, createCategory, uploadImage,
} from "../services/api";

const emptyForm = {
  name: "", description: "", price: "",
  stock: "", imageUrl: "", categoryId: "",
};

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        getProducts(1, 1000),
        getCategories(),
      ]);
      setProducts(productsRes.data.items);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  const openAdd = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setIsNewCategory(false);
    setNewCategory("");
    setNewCategoryDescription("");
    setShowForm(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl,
      categoryId: parseInt(product.categoryId),
    });
    setIsNewCategory(false);
    setNewCategory("");
    setNewCategoryDescription("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setIsNewCategory(false);
    setNewCategory("");
    setNewCategoryDescription("");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: res.data.url }));
    } catch {
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let categoryId = formData.categoryId;
      if (isNewCategory) {
        if (!newCategory.trim()) return alert("Please enter a category name.");
        const res = await createCategory({ categoryName: newCategory, description: newCategoryDescription });
        categoryId = res.data.categoryId;
      }
      const payload = { ...formData, categoryId };
      editingProduct
        ? await updateProduct(editingProduct.productId, payload)
        : await createProduct(payload);
      closeForm();
      loadData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteProduct(id);
    loadData();
  };

  const field = (placeholder, key, type = "text") => (
    <input
      placeholder={placeholder}
      type={type}
      className="w-full border p-3 rounded"
      value={formData[key]}
      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
    />
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto p-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-2 gap-6 mb-8">
          {[["Products", products.length], ["Categories", categories.length]].map(([label, count]) => (
            <div key={label} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500">{label}</h3>
              <p className="text-4xl font-bold mt-2">{count}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-bold">Products</h2>
            <button onClick={openAdd} className="bg-teal-600 text-white px-4 py-2 rounded-lg">
              Add Product
            </button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b">
                {["Name", "Category", "Price", "Stock", "Actions"].map(h => (
                  <th key={h} className="text-left py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.productId} className="border-b">
                  <td className="py-4">{p.name}</td>
                  <td>{p.categoryName}</td>
                  <td>${p.price}</td>
                  <td>{p.stock}</td>
                  <td className="flex gap-4 py-4">
                    <button onClick={() => openEdit(p)} className="text-blue-600">Edit</button>
                    <button onClick={() => handleDelete(p.productId)} className="text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center overflow-y-auto py-8">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {field("Name", "name")}
              <textarea
                placeholder="Description"
                className="w-full border p-3 rounded"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              {field("Price", "price", "number")}
              {field("Stock", "stock", "number")}

              <div className="border rounded p-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-gray-500" />
                {uploading && <p className="text-sm text-teal-600 mt-2">Uploading...</p>}
                {formData.imageUrl && !uploading && (
                  <div className="mt-3 flex items-center gap-3">
                    <img src={formData.imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded-lg border" />
                    <p className="text-xs text-gray-400 truncate flex-1">{formData.imageUrl}</p>
                  </div>
                )}
              </div>

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
                {categories.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                ))}
                <option value="new">+ Add New Category</option>
              </select>

              {isNewCategory && (
                <>
                  <input
                    type="text"
                    placeholder="Category Name"
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
                <button type="submit" disabled={uploading} className="bg-teal-600 text-white px-4 py-2 rounded disabled:opacity-60">
                  Save
                </button>
                <button type="button" onClick={closeForm} className="border px-4 py-2 rounded">
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