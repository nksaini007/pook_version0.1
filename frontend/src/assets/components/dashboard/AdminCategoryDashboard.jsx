import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaLayerGroup } from "react-icons/fa";
import API from "../../api/api";
import Nev from "../Nev";

const AdminCategoryDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [subName, setSubName] = useState("");
  const [subImage, setSubImage] = useState(null);
  const [editingSub, setEditingSub] = useState({ catId: null, subId: null, name: "", image: null });

  const darkInputClass =
    "p-3 rounded-lg w-full bg-[#1E1E1E] border border-[#2F2F2F] text-[#E0E0E0] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF8C42] focus:border-[#FF8C42] transition-all duration-200";
  const primaryButtonClass =
    "bg-[#FF8C42] hover:bg-[#ff9c59] text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]";
  const secondaryButtonClass =
    "bg-[#2C2C2C] hover:bg-[#3A3A3A] text-gray-200 px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors";
  const dangerButtonClass =
    "bg-[#B91C1C] hover:bg-[#DC2626] text-white p-2 rounded-full transition-colors shadow-sm";
  const editButtonClass =
    "bg-[#EAB308] hover:bg-[#FACC15] text-black p-2 rounded-full transition-colors shadow-sm";

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data } = await API.get("/categories");
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --- Category CRUD ---
  const handleAddOrEditCategory = async () => {
    if (!categoryName.trim()) return alert("Category name is required");

    const formData = new FormData();
    formData.append("name", categoryName);
    if (categoryImage) formData.append("categoryImage", categoryImage);

    try {
      if (editingCategoryId) {
        await API.put(`/categories/${editingCategoryId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setEditingCategoryId(null);
      } else {
        await API.post("/categories", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setCategoryName("");
      setCategoryImage(null);
      fetchCategories();
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Operation failed.");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await API.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Deletion failed.");
    }
  };

  const handleEditCategory = (cat) => {
    setCategoryName(cat.name);
    setEditingCategoryId(cat._id);
    setCategoryImage(null);
    setEditingSub({ catId: null, subId: null, name: "", image: null });
  };

  // --- Subcategory CRUD ---
  const handleAddSubcategory = async (categoryId) => {
    if (!subName.trim()) return alert("Subcategory name is required");

    const formData = new FormData();
    formData.append("name", subName);
    if (subImage) formData.append("subcategoryImage", subImage);

    try {
      await API.post(`/categories/${categoryId}/subcategories`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSubName("");
      setSubImage(null);
      fetchCategories();
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Subcategory creation failed.");
    }
  };

  const handleSaveSubcategory = async () => {
    const { catId, subId, name, image } = editingSub;
    if (!name.trim()) return alert("Subcategory name is required");

    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("subcategoryImage", image);

    try {
      await API.put(`/categories/${catId}/subcategories/${subId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setEditingSub({ catId: null, subId: null, name: "", image: null });
      fetchCategories();
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Subcategory update failed.");
    }
  };

  const handleDeleteSubcategory = async (catId, subId) => {
    if (!window.confirm("Delete this subcategory?")) return;
    try {
      await API.delete(`/categories/${catId}/subcategories/${subId}`);
      fetchCategories();
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Subcategory deletion failed.");
    }
  };

  const handleEditSubcategory = (catId, sub) => {
    setEditingSub({ catId, subId: sub._id, name: sub.name, image: null });
  };

  // --- Image Helper ---
  const getImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    if (img.startsWith("/uploads")) return `http://localhost:5000${img}`;
    return `http://localhost:5000/uploads/categories/${img}`;
  };

  return (
    <>
      <Nev />
      <div className="min-h-screen bg-[#121212] text-[#E0E0E0] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-white mb-10 border-b border-[#2F2F2F] pb-4 flex items-center gap-3">
            <FaLayerGroup className="text-[#FF8C42]" /> Category Management Dashboard
          </h1>

          {/* Add/Edit Category */}
          <div className="bg-[#1E1E1E] p-6 rounded-xl shadow-lg mb-12 border border-[#2F2F2F]">
            <h2 className="text-2xl font-semibold mb-4 text-[#FF8C42]">
              {editingCategoryId ? "Edit Main Category" : "Create New Main Category"}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <input
                type="text"
                placeholder="Enter Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className={darkInputClass}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCategoryImage(e.target.files[0])}
                className="text-sm text-gray-400"
              />
              <button onClick={handleAddOrEditCategory} className={primaryButtonClass}>
                {editingCategoryId ? <><FaSave /> Save</> : <><FaPlus /> Add</>}
              </button>
              {editingCategoryId && (
                <button
                  onClick={() => {
                    setCategoryName("");
                    setCategoryImage(null);
                    setEditingCategoryId(null);
                  }}
                  className={secondaryButtonClass}
                >
                  <FaTimes /> Cancel
                </button>
              )}
            </div>
          </div>

          {/* Category Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <div key={cat._id} className="bg-[#1E1E1E] shadow-lg rounded-xl p-6 border-t-4 border-[#FF8C42] hover:shadow-[#FF8C42]/30 transition-all duration-300">
                <div className="flex justify-between items-start mb-4 border-b border-[#2F2F2F] pb-3">
                  <div className="flex items-center gap-3">
                    {cat.image && (
                      <img
                        src={getImageUrl(cat.image)}
                        alt={cat.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    )}
                    <h2 className="text-2xl font-bold text-white capitalize">{cat.name}</h2>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditCategory(cat)} className={editButtonClass}><FaEdit /></button>
                    <button onClick={() => handleDeleteCategory(cat._id)} className={dangerButtonClass}><FaTrash /></button>
                  </div>
                </div>

                {/* Subcategory Input */}
                <div className="bg-[#2C2C2C] p-4 rounded-lg mb-6">
                  <p className="text-sm font-semibold text-gray-400 mb-2">
                    {editingSub.catId === cat._id ? "Editing Subcategory" : "Add Subcategory"}
                  </p>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Subcategory Name"
                      value={editingSub.catId === cat._id ? editingSub.name : subName}
                      onChange={(e) => {
                        if (editingSub.catId === cat._id)
                          setEditingSub({ ...editingSub, name: e.target.value });
                        else setSubName(e.target.value);
                      }}
                      className="p-2 border rounded-lg w-full bg-[#1E1E1E] border-[#3A3A3A] text-white focus:outline-none focus:ring-1 focus:ring-[#FF8C42]"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (editingSub.catId === cat._id)
                          setEditingSub({ ...editingSub, image: e.target.files[0] });
                        else setSubImage(e.target.files[0]);
                      }}
                      className="text-sm text-gray-400"
                    />
                    {editingSub.catId === cat._id ? (
                      <>
                        <button onClick={handleSaveSubcategory} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg"><FaSave /></button>
                        <button onClick={() => setEditingSub({ catId: null, subId: null, name: "", image: null })} className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded-lg"><FaTimes /></button>
                      </>
                    ) : (
                      <button onClick={() => handleAddSubcategory(cat._id)} className="bg-[#3B82F6] hover:bg-[#2563EB] text-white p-2 rounded-lg"><FaPlus /></button>
                    )}
                  </div>
                </div>

                {/* Subcategories List */}
                <h3 className="text-lg font-semibold text-gray-400 mb-3">Subcategories ({cat.subcategories.length})</h3>
                <div className="flex flex-wrap gap-3 max-h-40 overflow-y-auto custom-scrollbar-dark">
                  {cat.subcategories.map((sub) => (
                    <div key={sub._id} className="bg-[#2C2C2C] px-3 py-1.5 rounded-full flex items-center gap-2 text-sm border border-[#3A3A3A]">
                      {sub.image && (
                        <img
                          src={getImageUrl(sub.image)}
                          alt={sub.name}
                          className="w-6 h-6 object-cover rounded-full"
                        />
                      )}
                      <span className="text-white capitalize">{sub.name}</span>
                      <button onClick={() => handleEditSubcategory(cat._id, sub)} className="text-[#EAB308] hover:text-yellow-300"><FaEdit className="w-3 h-3" /></button>
                      <button onClick={() => handleDeleteSubcategory(cat._id, sub._id)} className="text-red-500 hover:text-red-400"><FaTimes className="w-3 h-3" /></button>
                    </div>
                  ))}
                  {cat.subcategories.length === 0 && <p className="text-gray-500 italic text-sm">No subcategories defined.</p>}
                </div>
              </div>
            ))}
          </div>

          {categories.length === 0 && <p className="text-gray-500 mt-16 text-center text-xl">No categories found. Use the form above to get started.</p>}
        </div>
      </div>
    </>
  );
};

export default AdminCategoryDashboard;
