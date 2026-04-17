import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyOrders } from '../utils/api';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => { if (!user) navigate('/login'); }, [user]);
  useEffect(() => { if (user) getMyOrders().then(r=>setOrders(r.data)).catch(()=>{}); }, [user]);

  if (!user) return null;
  return (
    <div className="profile-page">
      <div className="page-hero"><div className="container"><span className="section-label">My Account</span><h1>Hello, {user.name.split(' ')[0]}</h1></div></div>
      <div className="container profile-layout">
        <aside className="profile-sidebar">
          <div className="profile-avatar">{user.name.charAt(0)}</div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <nav className="profile-nav">
            <a href="#orders">My Orders</a>
            {user.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
            <button onClick={() => { logout(); navigate('/'); }}>Sign Out</button>
          </nav>
        </aside>
        <div className="profile-main">
          <h2 id="orders">My Orders</h2>
          {orders.length === 0 ? <p style={{color:'var(--text-light)',marginTop:'1rem'}}>No orders yet. <Link to="/shop" style={{color:'var(--gold)'}}>Start shopping</Link></p> : (
            <div className="orders-list">
              {orders.map(o=>(
                <div key={o._id} className="order-card">
                  <div><strong>#{o.orderNumber}</strong><span className={`order-status status-${o.orderStatus.toLowerCase()}`}>{o.orderStatus}</span></div>
                  <p>{o.items.length} item{o.items.length!==1?'s':''} · ₹{o.totalPrice?.toLocaleString()}</p>
                  <p style={{fontSize:'0.8rem',color:'var(--text-light)'}}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Profile;
