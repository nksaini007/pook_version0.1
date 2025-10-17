import { useState } from 'react'
import Home from './assets/components/Home'
import './App.css'
import React from 'react'
import { CartProvider } from "./assets/context/CartContext";
import { Routes, Route } from 'react-router-dom'
import Login from './assets/components/Login'
import Signup from './assets/components/Signup'
import NotFound404 from './assets/components/NotFound404'
import CategoryPage from './assets/components/CategoryPage'
import ItemPage from './assets/components/ItemPage'
import ItemList from './assets/components/ItemList'
import ProductPage from './assets/components/ProductPage'
import Cart from './assets/components/Cart'
import ScrollToTop from './assets/components/ScrollToTop';
import Dashboardloader from './assets/components/dashboard/Dashboardloader';
import Profile from './assets/components/Profile';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <ScrollToTop/>
     <CartProvider>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/signup' element={<Signup />} />
         <Route path='/dashboard' element={<Dashboardloader />} />
         <Route path='/cart' element={<Cart />} />
        <Route path="*" element={<NotFound404 />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/category/:categoryName/:itemName" element={<ItemPage />} />
        <Route path="/category/:categoryName/:itemName/:itemList" element={<ItemList />} />
        <Route path="/category/:categoryName/:itemName/:itemList/:productName" element={<ProductPage />} />


      </Routes>

    </CartProvider>
    </>
  )
}

export default App
