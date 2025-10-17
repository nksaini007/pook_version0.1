
// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: {
//     type: String,
//     enum: ['student', 'teacher', 'principal', 'admin'],
//     required: true
//   },

//   // Student
//   grade: String,
//   enrollmentYear: String,
//   major: String,

//   // Teacher
//   subjects: String,
//   experience: String,

//   // Principal
//   yearsAsPrincipal: String,
//   schoolName: String,

//   // Admin
//   department: String,
//   adminLevel: String,
// });

// module.exports = mongoose.model('User', userSchema);
//////
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["customer", "seller", "delivery", "admin"],
    default: "customer",
  },
  phone: String,

  // CUSTOMER fields
  address: String,
  pincode: String,

  // SELLER fields
  businessName: String,
  gstNumber: String,
  panNumber: String,
  businessAddress: String,
  businessCategory: String,
  bankAccount: String,
  ifscCode: String,

  // DELIVERY fields
  vehicleType: String,
  licenseNumber: String,
  deliveryAreaPincode: String,

  // ADMIN fields
  adminAccessCode: String,
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
