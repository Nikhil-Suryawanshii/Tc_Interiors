import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiSearch, FiChevronDown } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Projects', path: '/projects' },
    { label: 'Shop', path: '/shop' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
        <div className="navbar-inner">
          <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>

          <Link to="/" className="navbar-logo">
            <span className="logo-main">Luxe</span>
            <span className="logo-sub">Interior Studio</span>
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
            <button className="nav-icon-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
              <FiSearch size={18} />
            </button>
            <button className="nav-icon-btn cart-btn" onClick={() => setIsCartOpen(true)} aria-label="Cart">
              <FiShoppingBag size={18} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            {user ? (
              <div className="user-menu">
                <button className="nav-icon-btn"><FiUser size={18} /></button>
                <div className="user-dropdown">
                  <span className="user-name">{user.name}</span>
                  <Link to="/profile" onClick={() => setMenuOpen(false)}>My Profile</Link>
                  {user.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
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
              <input
                type="text" placeholder="Search products, projects..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                autoFocus />
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
