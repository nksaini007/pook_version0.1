const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * ====================================================
 *  Get All Users
 * ====================================================
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // don’t send passwords
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * ====================================================
 *  Get Single User by ID
 * ====================================================
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * ====================================================
 *  Create New User (Signup)
 *  Supports: customer, seller, delivery, admin
 * ====================================================
 */
exports.createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      address,
      pincode,

      // Seller fields
      gstNumber,
      businessName,
      panNumber,
      businessAddress,
      businessCategory,
      bankAccount,
      ifscCode,

      // Delivery fields
      vehicleType,
      licenseNumber,
      deliveryAreaPincode,

      // Admin fields
      adminAccessCode,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    // Validate role
    const allowedRoles = ["customer", "seller", "delivery", "admin"];
    if (!allowedRoles.includes(role))
      return res.status(400).json({ message: "Invalid role" });

    // Admin code check
    if (role === "admin" && adminAccessCode !== process.env.ADMIN_ACCESS_CODE) {
      return res.status(403).json({ message: "Invalid Admin Access Code" });
    }

    // Password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Base user data
    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      address,
      pincode,
    };

    // Add role-specific fields
    if (role === "seller") {
      Object.assign(userData, {
        gstNumber,
        businessName,
        panNumber,
        businessAddress,
        businessCategory,
        bankAccount,
        ifscCode,
      });
    } else if (role === "delivery") {
      Object.assign(userData, {
        vehicleType,
        licenseNumber,
        deliveryAreaPincode,
      });
    }

    // Create user
    const newUser = new User(userData);
    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({ message: "Signup successful", user: userResponse });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * ====================================================
 *  Login User
 * ====================================================
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found. Please signup." });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid password" });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: "Login successful",
      token,
      user: userResponse,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * ====================================================
 *  Update User
 * ====================================================
 */
exports.updateUser = async (req, res) => {
  try {
    const updateData = req.body;

    // If password is being updated, hash it again
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * ====================================================
 *  Delete User
 * ====================================================
 */
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// const User = require('../models/userModel');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// // const bcrypt = require('bcrypt')
// // @desc    Get all users
// exports.getUsers = async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// // @desc    Get single user by ID
// exports.getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.json(user);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// //login user
// // exports.loginuser = async (req, res) => {
// //   try {
// //     const { email, password } = req.body;
// //     const user = await User.findOne({ email });
// //     if (!user || !password) return res.status(404).json({ message: 'login fail' });
// //     const ispassEqual = await bcrypt.compare(password, user.password);
// //     if (!ispassEqual) {

// //       return res.status(404).json({ message: 'login fail password not match' })
// //     } else {
// //       const jwtToken = jwt.sign(
// //         {email:user.email , id:user.id},
// //         process.env.JWT_SECRET,
// //         {expiresIn:'24h'}
      
// //       )
// //       res.status(200)
// //       .json({
// //         message:"login success",
// //         jwtToken,
// //         email,
// //         name:user.name,
// //         user
// //       });

// //       console.log(user)
// //     }



// //   } catch (err) {
// //     res.status(400).json({ error: err.message });
// //   }
// // };
// /////////////
// exports.loginuser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // ✅ Check for email and password
//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password required' });
//     }

//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     // ✅ Compare passwords
//     const isPassEqual = await bcrypt.compare(password, user.password);
//     if (!isPassEqual) {
//       return res.status(401).json({ message: 'Invalid password' });
//     }

//     // ✅ Generate JWT token
//     const jwtToken = jwt.sign(
//       { id: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     // ✅ Remove password from response
//     const userResponse = user.toObject();
//     delete userResponse.password;

//     // ✅ Send token and user info
//     res.status(200).json({
//       message: 'Login successful',
//       token: jwtToken,
//       user: userResponse,
//     });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.createUser = async (req, res) => {
//   try {
//     const userData = req.body;

//     // Validate required fields
//     if (!userData.password || !userData.email) {
//       return res.status(400).json({ message: 'Email and password are required' });
//     }

//     // Hash the password
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

//     // Replace plain password with hashed one
//     userData.password = hashedPassword;

//     // Create and save user
//     const newUser = new User(userData);
//     const savedUser = await newUser.save();

//     // Remove password before sending response
//     const userResponse = savedUser.toObject();
//     delete userResponse.password;

//     res.status(201).json({ message: 'Signup successful', user: userResponse });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };
// // @desc    Update a user
// exports.updateUser = async (req, res) => {
//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!updatedUser) return res.status(404).json({ message: 'User not found' });
//     res.json(updatedUser);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// // @desc    Delete a user
// exports.deleteUser = async (req, res) => {
//   try {
//     const deletedUser = await User.findByIdAndDelete(req.params.id);
//     if (!deletedUser) return res.status(404).json({ message: 'User not found' });
//     res.json({ message: 'User deleted successfully' });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };
