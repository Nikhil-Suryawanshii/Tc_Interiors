import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const Register = () => {
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try { await register(form.name, form.email, form.password); toast.success('Account created!'); navigate('/'); }
    catch(err) { toast.error(err.response?.data?.message || 'Registration failed'); } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo"><span className="logo-main">Luxe</span><span className="logo-sub">Interior Studio</span></div>
        <h1>Create Account</h1>
        <p>Join us and start designing your dream space</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group"><label>Full Name</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} required autoFocus/></div>
          <div className="form-group"><label>Email Address</label><input type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} required/></div>
          <div className="form-group"><label>Password</label><input type="password" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} required minLength={6}/></div>
          <button type="submit" className="btn-primary auth-btn" disabled={loading}>{loading?'Creating...':'Create Account'}</button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
};
export default Register;
