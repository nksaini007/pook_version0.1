
const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getProducts,
  getSellerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} = require("../controllers/productController");

const { protect, sellerOnly, adminOnly } = require("../middlewares/authMiddleware");

/* ============================================================
   📦 Multer Setup for Image Upload
============================================================ */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

/* ============================================================
   🔓 Public Routes (Anyone can access)
============================================================ */

// ✅ Get all products or search
// Example: GET /api/products/public?search=chair
router.get("/public", getProducts);

// ✅ Get single product by ID
router.get("/:id", getProductById);

/* ============================================================
   🔐 Protected Routes (Require Token)
============================================================ */

// ✅ Get all products of logged-in seller
router.get("/", protect, getSellerProducts);

// ✅ Create new product (Seller)
router.post("/", protect, upload.single("image"), createProduct);

// ✅ Update product (Seller)
router.put("/:id", protect, upload.single("image"), updateProduct);

// ✅ Delete product (Seller)
router.delete("/:id", protect, deleteProduct);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const { protect, sellerOnly } = require('../middlewares/authMiddleware');
// const {
//   getProducts,           // public search
//   getSellerProducts,     // seller products
//   createProduct,
//   updateProduct,
//   deleteProduct,
//    getProductById
// } = require('../controllers/productController');

// // ------------------------
// // Multer setup for image upload
// // ------------------------
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });
// const upload = multer({ storage });

// // ------------------------
// // Public routes (Customer can search products)
// // ------------------------
// router.get('/public', getProducts);  // GET /api/products/public?search=keyword
// router.get('/:id', getProductById);  // <-- GET product by ID
// // ------------------------
// // Seller routes (Protected)
// // ------------------------
// router.get('/', protect, sellerOnly, getSellerProducts);             
// router.post('/', protect, sellerOnly, upload.single('image'), createProduct);
// router.put('/:id', protect, sellerOnly, upload.single('image'), updateProduct);
// router.delete('/:id', protect, sellerOnly, deleteProduct);

// module.exports = router;
