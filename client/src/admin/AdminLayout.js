import React, { useState } from 'react';
import { Link, NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid, FiPackage, FiShoppingBag, FiFolder, FiFileText,
  FiUsers, FiMessageSquare, FiStar, FiUpload, FiSettings,
  FiMenu, FiX, FiLogOut, FiExternalLink, FiBell, FiTag
} from 'react-icons/fi';
import './AdminLayout.css';

const NAV = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: FiGrid },
  { label: 'Products', path: '/admin/products', icon: FiPackage },
  { label: 'Categories', path: '/admin/categories', icon: FiTag },
  { label: 'Orders', path: '/admin/orders', icon: FiShoppingBag },
  { label: 'Projects', path: '/admin/projects', icon: FiFolder },
  { label: 'Blog Posts', path: '/admin/blog', icon: FiFileText },
  { label: 'Customers', path: '/admin/users', icon: FiUsers },
  { label: 'Consultations', path: '/admin/consultations', icon: FiMessageSquare },
  { label: 'Reviews', path: '/admin/reviews', icon: FiStar },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/admin'); };

  return (
    <div className={`admin-shell ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <span className="brand-icon">L</span>
            {sidebarOpen && (
              <div>
                <span className="brand-name">Luxe</span>
                <span className="brand-sub">Admin Panel</span>
              </div>
            )}
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(({ label, path, icon: Icon }) => (
            <NavLink key={path} to={path} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} />
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <a href="/" target="_blank" rel="noreferrer" className="sidebar-link">
            <FiExternalLink size={18} />
            {sidebarOpen && <span>View Site</span>}
          </a>
          <button onClick={handleLogout} className="sidebar-link sidebar-logout">
            <FiLogOut size={18} />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-left">
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <FiMenu size={20} />
            </button>
          </div>
          <div className="topbar-right">
            <button className="topbar-icon"><FiBell size={18} /></button>
            <div className="topbar-user">
              <div className="user-av">{user?.name?.charAt(0)}</div>
              <div>
                <span className="user-name">{user?.name}</span>
                <span className="user-role">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
