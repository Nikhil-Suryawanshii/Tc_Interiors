import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid, FiPackage, FiShoppingBag, FiFolder, FiFileText,
  FiUsers, FiMessageSquare, FiStar, FiSettings,
  FiMenu, FiX, FiLogOut, FiExternalLink, FiBell, FiTag, FiTool
} from 'react-icons/fi';
import './AdminLayout.css';

const NAV_GROUPS = [
  { label: 'Overview', items: [
    { label: 'Dashboard',     path: '/admin/dashboard',     icon: FiGrid },
  ]},
  { label: 'Commerce', items: [
    { label: 'Products',      path: '/admin/products',      icon: FiPackage },
    { label: 'Categories',    path: '/admin/categories',    icon: FiTag },
    { label: 'Orders',        path: '/admin/orders',        icon: FiShoppingBag },
  ]},
  { label: 'Content', items: [
    { label: 'Services',      path: '/admin/services',      icon: FiTool },
    { label: 'Projects',      path: '/admin/projects',      icon: FiFolder },
    { label: 'Blog Posts',    path: '/admin/blog',          icon: FiFileText },
  ]},
  { label: 'CRM', items: [
    { label: 'Customers',     path: '/admin/users',         icon: FiUsers },
    { label: 'Consultations', path: '/admin/consultations', icon: FiMessageSquare },
    { label: 'Reviews',       path: '/admin/reviews',       icon: FiStar },
  ]},
  { label: 'Config', items: [
    { label: 'Site Settings', path: '/admin/settings',      icon: FiSettings },
  ]},
];

const AdminLayout = () => {
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen]             = useState(false);
  const [isMobile, setIsMobile]                 = useState(window.innerWidth < 768);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Track screen size
  useEffect(() => {
    const fn = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false); // close mobile drawer when resizing up
    };
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  // Close mobile sidebar on route change
  const handleLinkClick = () => { if (isMobile) setMobileOpen(false); };

  const toggleSidebar = () => {
    if (isMobile) setMobileOpen(o => !o);
    else setDesktopCollapsed(c => !c);
  };

  const sidebarExpanded = isMobile ? true : !desktopCollapsed; // on mobile sidebar is always full-width when open
  const shellClass = `admin-shell ${desktopCollapsed && !isMobile ? 'sidebar-collapsed' : ''}`;
  const sidebarClass = `admin-sidebar ${isMobile ? (mobileOpen ? 'mobile-open' : 'mobile-hidden') : ''}`;

  return (
    <div className={shellClass}>
      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div className="admin-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={sidebarClass}>
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <span className="brand-icon">L</span>
            {sidebarExpanded && (
              <div className="brand-text">
                <span className="brand-name">Luxe</span>
                <span className="brand-sub">Admin Panel</span>
              </div>
            )}
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
            <FiX size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_GROUPS.map(group => (
            <div key={group.label} className="nav-group">
              {sidebarExpanded && <span className="nav-group-label">{group.label}</span>}
              {group.items.map(({ label, path, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={handleLinkClick}
                  title={!sidebarExpanded ? label : undefined}
                >
                  <Icon size={17} />
                  {sidebarExpanded && <span>{label}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <a href="/" target="_blank" rel="noreferrer" className="sidebar-link" title={!sidebarExpanded ? 'View Site' : undefined}>
            <FiExternalLink size={17} />
            {sidebarExpanded && <span>View Site</span>}
          </a>
          <button
            className="sidebar-link sidebar-logout"
            onClick={() => { logout(); navigate('/admin'); }}
            title={!sidebarExpanded ? 'Sign Out' : undefined}
          >
            <FiLogOut size={17} />
            {sidebarExpanded && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-left">
            <button className="topbar-menu-btn" onClick={toggleSidebar} aria-label="Toggle menu">
              <FiMenu size={20} />
            </button>
            <span className="topbar-title">Admin Panel</span>
          </div>
          <div className="topbar-right">
            <button className="topbar-icon" aria-label="Notifications"><FiBell size={18} /></button>
            <a href="/" target="_blank" rel="noreferrer" className="topbar-site-link">View Site</a>
            <div className="topbar-user">
              <div className="user-av">{user?.name?.charAt(0)?.toUpperCase()}</div>
              <div className="user-info">
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
