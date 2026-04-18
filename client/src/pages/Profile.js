import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyOrders, uploadAvatar, updateProfile } from '../utils/api';
import { FiCamera } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders]       = useState([]);
  const [uploading, setUploading] = useState(false);
  const [avatar, setAvatar]       = useState(user?.avatar || '');

  useEffect(() => { if (!user) navigate('/login'); }, [user, navigate]);
  useEffect(() => { if (user) getMyOrders().then(r=>setOrders(r.data)).catch(()=>{}); }, [user]);

  const handleAvatarUpload = async e => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const r = await uploadAvatar(fd);
      setAvatar(r.data.url);
      await updateProfile({ name: user.name, avatar: r.data.url });
      toast.success('Avatar updated ☁');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); e.target.value=''; }
  };

  if (!user) return null;

  const avatarSrc = avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1a1208&color=c9a96e&size=100`;

  return (
    <div className="profile-page">
      <div className="page-hero"><div className="container"><span className="section-label">My Account</span><h1>Hello, {user.name.split(' ')[0]}</h1></div></div>
      <div className="container profile-layout">
        <aside className="profile-sidebar">
          <div className="profile-avatar-wrap">
            <img src={avatarSrc} alt={user.name} className="profile-avatar-img"/>
            <label className="avatar-upload-btn" title="Change photo" style={{opacity:uploading?0.6:1}}>
              {uploading ? '…' : <FiCamera size={14}/>}
              <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} style={{display:'none'}}/>
            </label>
          </div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <nav className="profile-nav">
            <a href="#orders">My Orders</a>
            {user.role === 'admin' && <Link to="/admin/dashboard">Admin Panel</Link>}
            <button onClick={() => { logout(); navigate('/'); }}>Sign Out</button>
          </nav>
        </aside>

        <div className="profile-main">
          <h2 id="orders">My Orders</h2>
          {orders.length === 0
            ? <p style={{color:'var(--text-light)',marginTop:'1rem'}}>No orders yet. <Link to="/shop" style={{color:'var(--gold)'}}>Start shopping</Link></p>
            : (
              <div className="orders-list">
                {orders.map(o=>(
                  <div key={o._id} className="order-card">
                    <div><strong>#{o.orderNumber}</strong><span className={`order-status status-${o.orderStatus?.toLowerCase()}`}>{o.orderStatus}</span></div>
                    <p>{o.items?.length} item{o.items?.length!==1?'s':''} · ₹{o.totalPrice?.toLocaleString()}</p>
                    <p style={{fontSize:'0.8rem',color:'var(--text-light)'}}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};
export default Profile;
