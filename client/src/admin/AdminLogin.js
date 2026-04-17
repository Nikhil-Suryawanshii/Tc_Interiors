import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './AdminLogin.css';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role !== 'admin') {
        toast.error('Access denied. Admin only.');
        localStorage.removeItem('token');
        return;
      }
      toast.success('Welcome, Admin!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-left">
        <div className="admin-brand">
          <div className="admin-logo-icon">L</div>
          <div>
            <h1>Luxe Interior</h1>
            <p>Admin Control Panel</p>
          </div>
        </div>
        <div className="admin-login-tagline">
          <h2>Manage Your Studio</h2>
          <p>Products, projects, orders, blog posts and more — all in one place.</p>
          <ul>
            <li>📦 Product & Inventory Management</li>
            <li>🏠 Project Portfolio Control</li>
            <li>🛒 Order Processing</li>
            <li>✍️ Blog Publishing</li>
            <li>📊 Revenue Dashboard</li>
            <li>👥 Customer Management</li>
          </ul>
        </div>
      </div>

      <div className="admin-login-right">
        <div className="admin-login-card">
          <div className="admin-lock-icon">🔐</div>
          <h2>Admin Sign In</h2>
          <p>Enter your admin credentials to continue</p>

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="admin-form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="admin@luxe.in"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                required autoFocus
              />
            </div>
            <div className="admin-form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                required
              />
            </div>
            <button type="submit" className="admin-login-btn" disabled={loading}>
              {loading ? (
                <span className="btn-loading"><span className="btn-spinner" />Signing in...</span>
              ) : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="admin-hint">
            <p>Default credentials after running seed:</p>
            <code>admin@luxe.in / Admin@1234</code>
          </div>

          <a href="/" className="back-to-site">← Back to main site</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
