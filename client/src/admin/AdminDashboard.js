import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../utils/api';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiMessageSquare, FiStar, FiArrowRight } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then(r => setStats(r.data))
      .catch(() => setStats(MOCK_STATS))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'60vh'}}><div className="spinner"/></div>;

  const s = stats;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening today.</p>
        </div>
        <Link to="/admin/products" className="btn-admin btn-admin-primary">
          <FiPackage size={14}/> Add Product
        </Link>
      </div>

      {/* STAT CARDS */}
      <div className="stats-grid">
        <div className="stat-card highlight">
          <div className="stat-icon">₹</div>
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">₹{(s.revenue/100000).toFixed(1)}L</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FiShoppingBag size={20}/></div>
          <div className="stat-label">Total Orders</div>
          <div className="stat-value">{s.orders}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FiPackage size={20}/></div>
          <div className="stat-label">Products</div>
          <div className="stat-value">{s.products}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FiUsers size={20}/></div>
          <div className="stat-label">Customers</div>
          <div className="stat-value">{s.users}</div>
        </div>
      </div>

      <div className="stats-grid" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
        {[
          { label:'Pending Consultations', value: s.consultations, icon:'📋', link:'/admin/consultations' },
          { label:'Pending Reviews', value: s.reviews, icon:'⭐', link:'/admin/reviews' },
          { label:'Projects', value: s.projects, icon:'🏠', link:'/admin/projects' },
          { label:'Blog Posts', value: s.blogs, icon:'✍️', link:'/admin/blog' },
        ].map(c => (
          <Link key={c.label} to={c.link} className="admin-card" style={{textDecoration:'none',display:'block'}}>
            <div style={{fontSize:'1.5rem',marginBottom:'0.5rem'}}>{c.icon}</div>
            <div className="stat-label">{c.label}</div>
            <div className="stat-value" style={{fontSize:'1.75rem',fontFamily:'Cormorant Garamond,serif',color:'#1a1208'}}>{c.value}</div>
          </Link>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem',marginTop:'0.5rem'}}>
        {/* Recent Orders */}
        <div className="admin-card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
            <h3 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.25rem',margin:0}}>Recent Orders</h3>
            <Link to="/admin/orders" className="btn-admin btn-admin-outline btn-admin-sm">View All</Link>
          </div>
          {s.recentOrders?.length > 0 ? (
            <table className="admin-table">
              <thead><tr><th>Order #</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {s.recentOrders.map(o => (
                  <tr key={o._id}>
                    <td style={{fontWeight:500}}>#{o.orderNumber?.slice(-6)}</td>
                    <td>{o.user?.name || '—'}</td>
                    <td>₹{o.totalPrice?.toLocaleString()}</td>
                    <td><span className={`badge-admin badge-${o.orderStatus?.toLowerCase()}`}>{o.orderStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p style={{color:'#8c7860',fontSize:'0.875rem'}}>No orders yet</p>}
        </div>

        {/* Recent Consultations */}
        <div className="admin-card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
            <h3 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.25rem',margin:0}}>New Consultations</h3>
            <Link to="/admin/consultations" className="btn-admin btn-admin-outline btn-admin-sm">View All</Link>
          </div>
          {s.recentConsultations?.length > 0 ? (
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Service</th><th>Status</th></tr></thead>
              <tbody>
                {s.recentConsultations.map(c => (
                  <tr key={c._id}>
                    <td><div style={{fontWeight:500}}>{c.name}</div><div style={{fontSize:'0.75rem',color:'#8c7860'}}>{c.email}</div></td>
                    <td style={{fontSize:'0.8rem'}}>{c.serviceType || '—'}</td>
                    <td><span className={`badge-admin badge-${c.status?.toLowerCase()}`}>{c.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p style={{color:'#8c7860',fontSize:'0.875rem'}}>No consultations yet</p>}
        </div>
      </div>
    </div>
  );
};

const MOCK_STATS = {
  revenue: 2450000, orders: 47, products: 84, users: 312,
  projects: 12, blogs: 8, consultations: 5, reviews: 3,
  recentOrders: [],
  recentConsultations: [],
};

export default AdminDashboard;
// export already present
