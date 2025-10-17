const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, sellerOnly } = require('../middlewares/authMiddleware');
const {
  getProducts,           // public search
  getSellerProducts,     // seller products
  createProduct,
  updateProduct,
  deleteProduct,
   getProductById
} = require('../controllers/productController');

// ------------------------
// Multer setup for image upload
// ------------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// ------------------------
// Public routes (Customer can search products)
// ------------------------
router.get('/public', getProducts);  // GET /api/products/public?search=keyword
router.get('/:id', getProductById);  // <-- GET product by ID
// ------------------------
// Seller routes (Protected)
// ------------------------
router.get('/', protect, sellerOnly, getSellerProducts);             
router.post('/', protect, sellerOnly, upload.single('image'), createProduct);
router.put('/:id', protect, sellerOnly, upload.single('image'), updateProduct);
router.delete('/:id', protect, sellerOnly, deleteProduct);

module.exports = router;
