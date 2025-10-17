const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
} = require("../controllers/userController");

const { protect, adminOnly } = require("../middlewares/authMiddleware");

/* ============================================================
   🔓 Public Routes (Anyone can access)
============================================================ */

// ✅ Register (Signup)
router.post("/signup", createUser);

// ✅ Login
router.post("/login", loginUser);

/* ============================================================
   🔐 Protected Routes (Require Token)
============================================================ */

// ✅ Get all users (Admin Only)
router.get("/", protect, adminOnly, getUsers);

// ✅ Get single user by ID (Owner or Admin)
router.get("/:id", protect, getUserById);

// ✅ Update user (Owner or Admin)
router.put("/:id", protect, updateUser);

// ✅ Delete user (Admin Only)
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const {
//   getUsers,
//   getUserById,
//   createUser,
//   updateUser,
//   deleteUser,
//   loginuser
// } = require('../controllers/userController');

// const protect = require('../middlewares/authMiddleware'); // ✅ import JWT middleware

// // ========================
// // 🔓 Public Routes
// // ========================

// // Register (Signup)
// router.post('/', createUser);

// // Login
// router.post('/login', loginuser);

// // ========================
// // 🔐 Protected Routes
// // ========================

// // Get all users
// router.get('/', protect, getUsers);

// // Get single user by ID
// router.get('/:id', protect, getUserById);

// // Update user
// router.put('/:id', protect, updateUser);

// // Delete user
// router.delete('/:id', protect, deleteUser);

// module.exports = router;
