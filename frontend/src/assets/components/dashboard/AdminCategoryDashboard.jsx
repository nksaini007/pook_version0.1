import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import API from "../../api/api"; // Axios instance
import Nev from "../Nev";

const AdminCategoryDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [subName, setSubName] = useState("");
  const [editingSub, setEditingSub] = useState({ catId: null, subId: null, name: "" });

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data } = await API.get("/categories");
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  // Category CRUD
  const handleAddOrEditCategory = async () => {
    if (!categoryName.trim()) return alert("Category name is required");
    try {
      if (editingCategoryId) {
        await API.put(`/categories/${editingCategoryId}`, { name: categoryName });
        setEditingCategoryId(null);
      } else {
        await API.post("/categories", { name: categoryName });
      }
      setCategoryName("");
      fetchCategories();
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await API.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  const handleEditCategory = (cat) => {
    setCategoryName(cat.name);
    setEditingCategoryId(cat._id);
  };

  // Subcategory CRUD
  const handleAddSubcategory = async (categoryId) => {
    if (!subName.trim()) return alert("Subcategory name is required");
    try {
      await API.post(`/categories/${categoryId}/subcategories`, { name: subName });
      setSubName("");
      fetchCategories();
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  const handleEditSubcategory = (catId, sub) => {
    setEditingSub({ catId, subId: sub._id, name: sub.name });
  };

  const handleSaveSubcategory = async () => {
    const { catId, subId, name } = editingSub;
    if (!name.trim()) return alert("Subcategory name is required");
    try {
      await API.put(`/categories/${catId}/subcategories/${subId}`, { name });
      setEditingSub({ catId: null, subId: null, name: "" });
      fetchCategories();
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  const handleDeleteSubcategory = async (catId, subId) => {
    if (!window.confirm("Delete this subcategory?")) return;
    try {
      await API.delete(`/categories/${catId}/subcategories/${subId}`);
      fetchCategories();
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  return (
    <>
      <Nev />
      <div className="min-h-screen bg-gray-900 text-gray-200 py-10 px-6">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Category Dashboard</h1>

        {/* Add/Edit Category */}
        <div className="flex gap-3 mb-10">
          <input
            type="text"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="p-3 rounded-lg w-full bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            onClick={handleAddOrEditCategory}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            {editingCategoryId ? <><FaSave /> Save</> : <><FaPlus /> Add</>}
          </button>
          {editingCategoryId && (
            <button
              onClick={() => { setCategoryName(""); setEditingCategoryId(null); }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FaTimes /> Cancel
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-gray-800 shadow-lg rounded-xl p-5 transition-transform hover:scale-105">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold text-white">{cat.name}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditCategory(cat)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-3 py-1 rounded-lg flex items-center gap-1"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {/* Add/Edit Subcategory */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Subcategory Name"
                  value={editingSub.catId === cat._id ? editingSub.name : subName}
                  onChange={(e) => {
                    if (editingSub.catId === cat._id) {
                      setEditingSub({ ...editingSub, name: e.target.value });
                    } else setSubName(e.target.value);
                  }}
                  className="p-2 border rounded-lg w-full bg-gray-700 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                {editingSub.catId === cat._id ? (
                  <>
                    <button
                      onClick={handleSaveSubcategory}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-1"
                    >
                      <FaSave />
                    </button>
                    <button
                      onClick={() => setEditingSub({ catId: null, subId: null, name: "" })}
                      className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-1"
                    >
                      <FaTimes />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleAddSubcategory(cat._id)}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg flex items-center gap-1"
                  >
                    <FaPlus />
                  </button>
                )}
              </div>

              {/* Subcategories */}
              <div className="flex flex-wrap gap-2">
                {cat.subcategories.map((sub) => (
                  <div key={sub._id} className="bg-gray-700 px-3 py-1 rounded-lg flex items-center gap-2 shadow-sm">
                    <span className="text-white">{sub.name}</span>
                    <button
                      onClick={() => handleEditSubcategory(cat._id, sub)}
                      className="text-yellow-400 hover:text-yellow-300"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteSubcategory(cat._id, sub._id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && <p className="text-gray-400 mt-10 text-center">No categories found.</p>}
      </div>
    </>
  );
};

export default AdminCategoryDashboard;
