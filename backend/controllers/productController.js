
// };
const Product = require('../models/product');

// ==============================
// PUBLIC: Get all products or search (Customer can use)
// GET /api/products/public?search=keyword
// ==============================
const getProducts = async (req, res) => {
  const search = req.query.search || '';

  try {
    const products = await Product.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { subcategory: { $regex: search, $options: 'i' } },
      ],
    });

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ==============================
// GET Seller Products / Search
// GET /api/products
// Protected
// ==============================
const getSellerProducts = async (req, res) => {
  try {
    const search = req.query.search || '';
    const sellerId = req.user._id; // protect middleware के बाद available

    const products = await Product.find({
      seller: sellerId,
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ],
    });

    res.json(products);
  } catch (error) {
    console.error("Error fetching seller products:", error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ==============================
// CREATE Product
// POST /api/products
// Protected
// ==============================
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, subcategory, stock } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      subcategory,
      stock,
      images: image ? [{ public_id: 'local', url: image }] : [],
      seller: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
};



// ==============================
// UPDATE Product
// PUT /api/products/:id
// Protected
// ==============================
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const product = await Product.findOne({ _id: id, seller: req.user._id });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    // if (image) product.image = image;
    if (image) product.images = [{ public_id: 'local', url: image }];

    await product.save();
    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
};

// ==============================
// DELETE Product
// DELETE /api/products/:id
// Protected
// ==============================
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOneAndDelete({ _id: id, seller: req.user._id });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(400).json({ message: 'Error deleting product', error: error.message });
  }
};
const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id); // assuming you're using Mongoose
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getProducts,         // ✅ Public search
  getSellerProducts,   // ✅ Seller search
  createProduct,       // ✅ Seller create
  updateProduct,       // ✅ Seller update
  deleteProduct,       // ✅ Seller delete
  getProductById,
};
// // const Product = require('../models/product');

// // // @desc Get all products or search
// // // @route GET /api/products?search=keyword
// // // @access Public
// // const getProducts = async (req, res) => {
// //   const search = req.query.search || '';

// //   try {
// //     const products = await Product.find({
// //       $or: [
// //         { name: { $regex: search, $options: 'i' } },
// //         { description: { $regex: search, $options: 'i' } },
// //       ],
// //     });
// //     res.json(products);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Server Error', error: error.message });
// //   }
// // };

// // // @desc Create new product (for testing / admin use)
// // // @route POST /api/products
// // // @access Public
// // const createProduct = async (req, res) => {
// //   try {
// //     const { name, description, price, image, category } = req.body;
// //     const product = new Product({ name, description, price, image, category });
// //     await product.save();
// //     res.status(201).json(product);
// //   } catch (error) {
// //     res.status(400).json({ message: 'Error creating product', error: error.message });
// //   }
// // };

// // module.exports = { getProducts, createProduct };
// //////////////


// const Product = require('../models/product');

// // ==============================
// // PUBLIC: Get all products or search (Customer can use)
// // ==============================
// const getProducts = async (req, res) => {
//   const search = req.query.search || '';

//   try {
//     const products = await Product.find({
//       $or: [
//         { name: { $regex: search, $options: 'i' } },
//         { description: { $regex: search, $options: 'i' } },
//         { category: { $regex: search, $options: 'i' } },
//       ],
//     });

//     res.json(products);
//   } catch (error) {
//     console.error("Error fetching products:", error.message);
//     res.status(500).json({ message: 'Server Error', error: error.message });
//   }
// };

// // ==============================
// // GET Seller Products / Search
// // ==============================
// const getSellerProducts = async (req, res) => {
//   try {
//     const search = req.query.search || '';
//     const sellerId = req.user._id; // protect middleware के बाद available

//     const products = await Product.find({
//       seller: sellerId,
//       $or: [
//         { name: { $regex: search, $options: 'i' } },
//         { description: { $regex: search, $options: 'i' } },
//         { category: { $regex: search, $options: 'i' } },
//       ],
//     });

//     res.json(products);
//   } catch (error) {
//     console.error("Error fetching seller products:", error.message);
//     res.status(500).json({ message: 'Server Error', error: error.message });
//   }
// };

// // ==============================
// // CREATE Product
// // ==============================
// const createProduct = async (req, res) => {
//   try {
//     const { name, description, price, category } = req.body;
//     const image = req.file ? `/uploads/${req.file.filename}` : null;

//     const product = await Product.create({
//       name,
//       description,
//       price,
//       category,
//       image,
//       seller: req.user._id,
//     });

//     res.status(201).json(product);
//   } catch (error) {
//     console.error("Error creating product:", error.message);
//     res.status(400).json({ message: 'Error creating product', error: error.message });
//   }
// };

// // ==============================
// // UPDATE Product
// // ==============================
// const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, description, price, category } = req.body;
//     const image = req.file ? `/uploads/${req.file.filename}` : undefined;

//     const product = await Product.findOne({ _id: id, seller: req.user._id });
//     if (!product) return res.status(404).json({ message: 'Product not found' });

//     product.name = name || product.name;
//     product.description = description || product.description;
//     product.price = price || product.price;
//     product.category = category || product.category;
//     if (image) product.image = image;

//     await product.save();
//     res.json(product);
//   } catch (error) {
//     console.error("Error updating product:", error.message);
//     res.status(400).json({ message: 'Error updating product', error: error.message });
//   }
// };

// // ==============================
// // DELETE Product
// // ==============================
// const deleteProduct = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const product = await Product.findOneAndDelete({ _id: id, seller: req.user._id });
//     if (!product) return res.status(404).json({ message: 'Product not found' });

//     res.json({ message: 'Product deleted successfully' });
//   } catch (error) {
//     console.error("Error deleting product:", error.message);
//     res.status(400).json({ message: 'Error deleting product', error: error.message });
//   }
// };

// module.exports = {
//   getProducts,         // ✅ Public search
//   getSellerProducts,   // ✅ Seller search
//   createProduct,       // ✅ Seller create
//   updateProduct,       // ✅ Seller update
//   deleteProduct,       // ✅ Seller delete