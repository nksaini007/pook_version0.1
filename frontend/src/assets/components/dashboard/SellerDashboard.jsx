import React, { useEffect, useState } from "react";
import { FaBox, FaPlus, FaEdit, FaTrash, FaChartBar, FaImage } from "react-icons/fa";
import API from "../../api/api"; // axios setup
import Nev from "../Nev";
const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    subcategory: "",
    image: null,
  });
  const [editing, setEditing] = useState(null);
  const [preview, setPreview] = useState(null);

  const categories = {
    "Kitchen Appliances": ["Mixer", "Toaster", "Microwave", "Refrigerator"],
    "Home Cleaning": ["Vacuum Cleaner", "Washing Machine", "Iron"],
    "Entertainment": ["TV", "Sound System", "Projector"],
  };

  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products");
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      if (editing) {
        await API.put(`/products/${editing._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await API.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        subcategory: "",
        image: null,
      });
      setEditing(null);
      setPreview(null);
      fetchProducts();
    } catch (err) {
      console.error("❌ Error saving product:", err.response?.data || err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      subcategory: product.subcategory,
      image: null,
    });
    setEditing(product);
    setPreview(product.images?.[0]?.url || null);
  };

  return (


    <><Nev />
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-20 px-6">
        {/* Dashboard Header */}

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">

            <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          </div>
          <button
            title="Analytics"
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 py-2 transition shadow"
          >
            <FaChartBar className="text-xl" />
            <span className="hidden md:inline">Analytics</span>
          </button>
        </div>

        {/* Product Management Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Product Form */}
          <div className="col-span-1 bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
            <h2 className="text-xl font-semibold mb-5 text-orange-700">
              {editing ? "Edit Product" : "Add Product"}
            </h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
              <input
                type="text"
                name="name"
                required
                placeholder="Product Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-orange-200 focus:border-orange-500 rounded-lg p-3 outline-none"
              />
              <textarea
                name="description"
                required
                placeholder="Product Description"
                value={form.description}
                onChange={handleChange}
                className="w-full border border-orange-200 focus:border-orange-500 rounded-lg p-3 outline-none"
              />

              <div className="flex gap-4">
                <input
                  type="number"
                  name="price"
                  required
                  placeholder="Price (₹)"
                  value={form.price}
                  onChange={handleChange}
                  className="w-1/2 border border-orange-200 focus:border-orange-500 rounded-lg p-3 outline-none"
                />
                <input
                  type="number"
                  name="stock"
                  required
                  placeholder="Stock"
                  value={form.stock}
                  onChange={handleChange}
                  className="w-1/2 border border-orange-200 focus:border-orange-500 rounded-lg p-3 outline-none"
                />
              </div>

              <select
                name="category"
                value={form.category}
                required
                onChange={(e) => setForm({ ...form, category: e.target.value, subcategory: "" })}
                className="w-full border border-orange-200 focus:border-orange-500 rounded-lg p-3 outline-none"
              >
                <option value="">Select Category</option>
                {Object.keys(categories).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                name="subcategory"
                value={form.subcategory}
                required
                onChange={handleChange}
                disabled={!form.category}
                className="w-full border border-orange-200 focus:border-orange-500 rounded-lg p-3 outline-none"
              >
                <option value="">Select Subcategory</option>
                {form.category &&
                  categories[form.category].map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
              </select>

              <div className="flex items-center gap-3">
                <FaImage className="text-orange-500 text-lg" />
                <input type="file" name="image" accept="image/*" onChange={handleImageChange} className="text-sm" />
              </div>
              {preview && (
                <div className="flex justify-center">
                  <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border shadow" />
                </div>
              )}
              <button
                type="submit"
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg mt-2 transition shadow"
              >
                {editing ? (
                  <>
                    <FaEdit className="inline mr-1" /> Update Product
                  </>
                ) : (
                  <>
                    <FaPlus className="inline mr-1" /> Add Product
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Product List Card Grid */}
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-6 text-orange-700">Product List</h2>
            {products.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No products found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((p) => (
                  <div
                    key={p._id}
                    className="flex flex-col sm:flex-row items-center justify-between bg-orange-50 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                  >
                    {/* Image */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img
                        src={p.images?.[0]?.url ? `http://localhost:5000${p.images[0].url}` : "https://via.placeholder.com/60x60.png?text=No+Image"}
                        alt={p.name}
                        className="w-20 h-20 object-cover rounded-lg border border-orange-200"
                      />

                      <div>
                        <h3 className="font-semibold text-gray-900">{p.name}</h3>
                        <p className="text-sm text-gray-600">{p.category} / {p.subcategory}</p>
                      </div>
                    </div>

                    {/* Price & Stock */}
                    <div className="flex flex-col items-end gap-1 text-right mt-3 sm:mt-0 sm:ml-4">
                      <span className="text-orange-600 font-semibold text-lg">₹{p.price}</span>
                      <span className="text-gray-700 text-sm">Stock: {p.stock}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-3 sm:mt-0">
                      <button
                        onClick={() => handleEdit(p)}
                        className="bg-white border border-orange-300 text-orange-600 hover:bg-orange-100 hover:text-orange-700 p-2 rounded-lg transition shadow-sm"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="bg-white border border-red-300 text-red-600 hover:bg-red-100 hover:text-red-700 p-2 rounded-lg transition shadow-sm"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Analytics Section (Optional) */}
        <div className="max-w-4xl mx-auto mt-14">
          <div className="bg-orange-100 rounded-lg p-6 shadow text-center border border-orange-200">
            <h3 className="text-lg font-semibold mb-2 text-orange-700">Quick Stats (Coming Soon)</h3>
            <p className="text-gray-700">View products sold, revenue, best sellers, and more!</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerDashboard;
