import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Adminlogin from './pages/admin/Adminlogin'
import Dashboard from './pages/admin/Dashboard'
import Product from './pages/admin/Product'
import Category from './pages/admin/Category'
import Orders from './pages/admin/Orders'
import Inventory from './pages/admin/Inventory'
import Users from './pages/admin/Users'
import Complaint from './pages/admin/Complaint'
import AddCategory from './pages/admin/AddCategory'
import AddProduct from './pages/admin/AddProduct'
import Register from './pages/user/Register'
import UserLogin from './pages/user/UserLogin'
import Products from './pages/Products'
import About from './pages/About'
import Contact from './pages/ContactUs'
import MyOrders from './pages/user/MyOrders'
import Cart from './pages/user/Cart'
import ChangePassword from './pages/user/ChangePassword'
import UserDashboard from './pages/user/UserDashboard'
import ProductDetails from './pages/ProductDetails'
import Address from './pages/user/Address'
import UserDashboardHome from './pages/user/UserDashboardHome'
import CategoryDetails from './pages/CategoryDetails'
import MyProfile from './pages/user/MyProfile'
import AdminOverview from './pages/admin/AdminOverview'
import Errorpage from './components/Errorpage'

/* ── Protected Route — login nahi hai to /login pe bhejo ── */
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('id')
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return children
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/admin/login' element={<Adminlogin />} />
          <Route path='/admin/dashboard' element={<Dashboard />}>
            <Route index element={<AdminOverview />} />
            <Route path='product' element={<Product />} />
            <Route path='addproduct' element={<AddProduct />} />
            <Route path='addproduct/:id' element={<AddProduct />} />
            <Route path='category' element={<Category />} />
            <Route path='add-category' element={<AddCategory />} />
            <Route path='add-category/:id' element={<AddCategory />} />
            <Route path='orders' element={<Orders />} />
            <Route path='inventory' element={<Inventory />} />
            <Route path='users' element={<Users />} />
            <Route path='complaint' element={<Complaint />} />
          </Route>

          {/* user auth routes */}
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<UserLogin />} />

          {/* public routes */}
          <Route path='/about' element={<About />} />
          <Route path='/products' element={<Products />} />
          <Route path='/product/:id' element={<ProductDetails />} />
          <Route path='/category/:id' element={<CategoryDetails />} />
          <Route path='/contact' element={<Contact />} />

          {/* Protected Dashboard routes */}
          <Route path="/user/dashboard" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }>
            <Route index element={<UserDashboardHome />} />
            <Route path='orders' element={<MyOrders />} />
            <Route path='cart' element={<Cart />} />
            <Route path='profile' element={<MyProfile />} />
            <Route path='changepassword' element={<ChangePassword />} />
            <Route path='address' element={<Address />} />
          </Route>

          {/* 404 Error Page */}
          <Route path="*" element={<Errorpage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App