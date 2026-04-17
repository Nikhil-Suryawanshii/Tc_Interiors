import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider }     from './context/AuthContext';
import { CartProvider }     from './context/CartContext';
import { SettingsProvider } from './context/SettingsContext';

import Navbar     from './components/Navbar';
import Footer     from './components/Footer';
import CartDrawer from './components/CartDrawer';

import Home          from './pages/Home';
import About         from './pages/About';
import Services      from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Projects      from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Shop          from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Blog          from './pages/Blog';
import BlogDetail    from './pages/BlogDetail';
import Cart          from './pages/Cart';
import Checkout      from './pages/Checkout';
import Contact       from './pages/Contact';
import Login         from './pages/Login';
import Register      from './pages/Register';
import Profile       from './pages/Profile';
import OrderSuccess  from './pages/OrderSuccess';

import AdminLogin         from './admin/AdminLogin';
import AdminLayout        from './admin/AdminLayout';
import AdminGuard         from './admin/AdminGuard';
import AdminDashboard     from './admin/AdminDashboard';
import AdminProducts      from './admin/AdminProducts';
import AdminCategories    from './admin/AdminCategories';
import AdminOrders        from './admin/AdminOrders';
import AdminProjects      from './admin/AdminProjects';
import AdminBlog          from './admin/AdminBlog';
import AdminUsers         from './admin/AdminUsers';
import AdminConsultations from './admin/AdminConsultations';
import AdminReviews       from './admin/AdminReviews';
import AdminServices      from './admin/AdminServices';
import AdminSettings      from './admin/AdminSettings';

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <CartDrawer />
    <main>{children}</main>
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <SettingsProvider>
          <CartProvider>
            <Toaster position="top-right" toastOptions={{
              style: { fontFamily: 'Jost, sans-serif', fontSize: '0.85rem', background: '#1a1208', color: '#f5f0e8', borderRadius: '2px' }
            }} />
            <Routes>
              {/* ADMIN */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/*" element={<AdminGuard><AdminLayout /></AdminGuard>}>
                <Route path="dashboard"     element={<AdminDashboard />} />
                <Route path="products"      element={<AdminProducts />} />
                <Route path="categories"    element={<AdminCategories />} />
                <Route path="orders"        element={<AdminOrders />} />
                <Route path="projects"      element={<AdminProjects />} />
                <Route path="blog"          element={<AdminBlog />} />
                <Route path="users"         element={<AdminUsers />} />
                <Route path="consultations" element={<AdminConsultations />} />
                <Route path="reviews"       element={<AdminReviews />} />
                <Route path="services"      element={<AdminServices />} />
                <Route path="settings"      element={<AdminSettings />} />
              </Route>

              {/* PUBLIC */}
              <Route path="/"               element={<PublicLayout><Home /></PublicLayout>} />
              <Route path="/about"          element={<PublicLayout><About /></PublicLayout>} />
              <Route path="/services"       element={<PublicLayout><Services /></PublicLayout>} />
              <Route path="/services/:slug" element={<PublicLayout><ServiceDetail /></PublicLayout>} />
              <Route path="/projects"       element={<PublicLayout><Projects /></PublicLayout>} />
              <Route path="/projects/:slug" element={<PublicLayout><ProjectDetail /></PublicLayout>} />
              <Route path="/shop"           element={<PublicLayout><Shop /></PublicLayout>} />
              <Route path="/shop/:slug"     element={<PublicLayout><ProductDetail /></PublicLayout>} />
              <Route path="/blog"           element={<PublicLayout><Blog /></PublicLayout>} />
              <Route path="/blog/:slug"     element={<PublicLayout><BlogDetail /></PublicLayout>} />
              <Route path="/cart"           element={<PublicLayout><Cart /></PublicLayout>} />
              <Route path="/checkout"       element={<PublicLayout><Checkout /></PublicLayout>} />
              <Route path="/contact"        element={<PublicLayout><Contact /></PublicLayout>} />
              <Route path="/login"          element={<PublicLayout><Login /></PublicLayout>} />
              <Route path="/register"       element={<PublicLayout><Register /></PublicLayout>} />
              <Route path="/profile"        element={<PublicLayout><Profile /></PublicLayout>} />
              <Route path="/order-success/:id" element={<PublicLayout><OrderSuccess /></PublicLayout>} />
            </Routes>
          </CartProvider>
        </SettingsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
