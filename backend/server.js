const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const categoryRoutes = require('./routes/categoryRoutes');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve uploaded images
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
connectDB();

// Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes'); // ✅ added

//categry routes 
app.use('/api/categories', categoryRoutes);


app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes); // ✅ added

// Test Route
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT,  '0.0.0.0',() => console.log(`🚀 Server running on port ${PORT}`));
