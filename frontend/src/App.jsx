// TC Interior — App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import { ThemeProvider }        from '@contexts/ThemeContext';
import { AuthProvider }         from '@contexts/AuthContext';
import { SiteSettingsProvider } from '@contexts/SiteSettingsContext';
import { CartProvider }         from '@contexts/CartContext';
import { SocketProvider }       from '@contexts/SocketContext';
import { queryClient }          from '@lib/queryClient';
import ProtectedRoute           from '@components/common/ProtectedRoute';
import { CursorGlow, ScrollProgressBar } from '@components/common/AnimationKit';
import { ActivityToasts, LiveVisitorDot } from '@components/common/LiveWidgets';
import WhatsAppButton    from '@components/common/WhatsAppButton';
import ExitIntentPopup   from '@components/common/ExitIntentPopup';

// Admin pages
import AdminLayout    from '@components/admin/AdminLayout';
import AdminDashboard from '@pages/admin/Dashboard';
import AdminAnalytics from '@pages/admin/Analytics';
import AdminSettings  from '@pages/admin/Settings';
import AdminProfile   from '@pages/admin/Profile';
import AdminBlog      from '@pages/admin/Blog';
import AdminTestimonials from '@pages/admin/Testimonials';
import AdminContacts  from '@pages/admin/Contacts';
import AdminServices  from '@pages/admin/Services';
import AdminAuditLog  from '@pages/admin/AuditLog';
// New TC Interior admin pages
import AdminProducts    from '@pages/admin/Products';
import AdminCategories  from '@pages/admin/Categories';
import AdminEnquiries   from '@pages/admin/Enquiries';
import AdminGallery     from '@pages/admin/Gallery';
import AdminProjectsMgr from '@pages/admin/AdminProjects';
import AdminSkills      from '@pages/admin/AdminSkills';
import AdminExperience  from '@pages/admin/AdminExperience';

// Public pages
import HomePage        from '@pages/Home';
import ProductsPage    from '@pages/Products';
import ProductDetailPage from '@pages/ProductDetail';
import GalleryPage     from '@pages/Gallery';
import CartPage        from '@pages/Cart';
import ServicesPage    from '@pages/Services';
import BlogListPage    from '@pages/BlogList';
import BlogPostPage    from '@pages/BlogPost';
import AboutPage       from '@pages/About';
import ContactPage     from '@pages/Contact';
import LoginPage       from '@pages/Login';
import NotFound        from '@pages/NotFound';
import ProjectsPage    from '@pages/Projects';
import ExperiencePage  from '@pages/Experience';

function AnimatedRoutes({ children }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={location.pathname}
        initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
        transition={{ duration:0.25, ease:[0.16,1,0.3,1] }}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <SocketProvider>
              <SiteSettingsProvider>
                <CartProvider>
                  <Router>
                    <AnimatedRoutes>
                      <Routes>
                        {/* Public */}
                        <Route path="/"              element={<HomePage/>} />
                        <Route path="/products"      element={<ProductsPage/>} />
                        <Route path="/products/:slug" element={<ProductDetailPage/>} />
                        <Route path="/gallery"       element={<GalleryPage/>} />
                        <Route path="/cart"          element={<CartPage/>} />
                        <Route path="/services"      element={<ServicesPage/>} />
                        <Route path="/blog"          element={<BlogListPage/>} />
                        <Route path="/blog/:slug"    element={<BlogPostPage/>} />
                        <Route path="/about"         element={<AboutPage/>} />
                        <Route path="/contact"       element={<ContactPage/>} />
                        <Route path="/login"         element={<LoginPage/>} />
                        <Route path="/projects"      element={<ProjectsPage/>} />
                        <Route path="/experience"    element={<ExperiencePage/>} />

                        {/* Admin */}
                        <Route path="/admin" element={<ProtectedRoute><AdminLayout/></ProtectedRoute>}>
                          <Route index                    element={<AdminDashboard/>} />
                          <Route path="products"          element={<AdminProducts/>} />
                          <Route path="categories"        element={<AdminCategories/>} />
                          <Route path="enquiries"         element={<AdminEnquiries/>} />
                          <Route path="gallery"           element={<AdminGallery/>} />
                          <Route path="projects"          element={<AdminProjectsMgr/>} />
                          <Route path="skills"            element={<AdminSkills/>} />
                          <Route path="experience"        element={<AdminExperience/>} />
                          <Route path="services"          element={<AdminServices/>} />
                          <Route path="blog"              element={<AdminBlog/>} />
                          <Route path="testimonials"      element={<AdminTestimonials/>} />
                          <Route path="contacts"          element={<AdminContacts/>} />
                          <Route path="analytics"         element={<AdminAnalytics/>} />
                          <Route path="settings"          element={<AdminSettings/>} />
                          <Route path="profile"           element={<AdminProfile/>} />
                          <Route path="audit-log"         element={<AdminAuditLog/>} />
                        </Route>
                        <Route path="*" element={<NotFound/>} />
                      </Routes>
                    </AnimatedRoutes>
                  </Router>
                  <Toaster position="top-right" toastOptions={{ duration:4000 }}/>
                  <CursorGlow/>
                  <ScrollProgressBar/>
                  <ActivityToasts/>
                  <LiveVisitorDot/>
                  <WhatsAppButton/>
                  <ExitIntentPopup/>
                </CartProvider>
              </SiteSettingsProvider>
            </SocketProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
