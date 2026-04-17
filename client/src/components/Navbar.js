import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiSearch } from 'react-icons/fi';
import './Navbar.css';

const BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || '';

const Navbar = () => {
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout }            = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const { settings }                = useSettings();
  const navigate                    = useNavigate();

  const site = settings.site || {};
  const logoUrl = site.logo ? (site.logo.startsWith('http') ? site.logo : `${BASE}${site.logo}`) : null;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false); setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Home',     path: '/' },
    { label: 'About',    path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Projects', path: '/projects' },
    { label: 'Shop',     path: '/shop' },
    { label: 'Blog',     path: '/blog' },
    { label: 'Contact',  path: '/contact' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>

          <Link to="/" className="navbar-logo">
            {logoUrl
              ? <img src={logoUrl} alt={site.logoText || 'Logo'} className="logo-img" />
              : <>
                  <span className="logo-main">{site.logoText || 'Luxe'}</span>
                  <span className="logo-sub">{site.logoSubText || 'Interior Studio'}</span>
                </>
            }
          </Link>

          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {navLinks.map(link => (
              <li key={link.path}>
                <NavLink to={link.path} className={({ isActive }) => isActive ? 'active' : ''}
                  onClick={() => setMenuOpen(false)}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <button className="nav-icon-btn" onClick={() => setSearchOpen(s => !s)}><FiSearch size={18} /></button>
            <button className="nav-icon-btn cart-btn" onClick={() => setIsCartOpen(true)}>
              <FiShoppingBag size={18} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            {user ? (
              <div className="user-menu">
                <button className="nav-icon-btn"><FiUser size={18} /></button>
                <div className="user-dropdown">
                  <span className="user-name">{user.name}</span>
                  <Link to="/profile" onClick={() => setMenuOpen(false)}>My Profile</Link>
                  {user.role === 'admin' && <Link to="/admin/dashboard">Admin Panel</Link>}
                  <button onClick={logout}>Sign Out</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-primary nav-cta">Sign In</Link>
            )}
          </div>
        </div>

        {searchOpen && (
          <div className="search-bar">
            <form onSubmit={handleSearch}>
              <input type="text" placeholder="Search products, projects..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)} autoFocus />
              <button type="submit"><FiSearch size={18} /></button>
              <button type="button" onClick={() => setSearchOpen(false)}><FiX size={18} /></button>
            </form>
          </div>
        )}
      </nav>
      {menuOpen && <div className="nav-overlay" onClick={() => setMenuOpen(false)} />}
    </>
  );
};

export default Navbar;
