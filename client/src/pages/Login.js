import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const Login = () => {
  const [form, setForm] = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try { await login(form.email, form.password); toast.success('Welcome back!'); navigate(from); }
    catch(err) { toast.error(err.response?.data?.message || 'Login failed'); } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo"><span className="logo-main">Luxe</span><span className="logo-sub">Interior Studio</span></div>
        <h1>Welcome Back</h1>
        <p>Sign in to your account to continue</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group"><label>Email Address</label><input type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} required autoFocus/></div>
          <div className="form-group"><label>Password</label><input type="password" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} required/></div>
          <button type="submit" className="btn-primary auth-btn" disabled={loading}>{loading?'Signing in...':'Sign In'}</button>
        </form>
        <p className="auth-switch">Don't have an account? <Link to="/register">Create one</Link></p>
      </div>
    </div>
  );
};
export default Login;
