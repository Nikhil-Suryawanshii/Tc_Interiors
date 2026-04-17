import React, { useState, useEffect } from 'react';
import API, { approveReview, deleteReview } from '../utils/api';
import { FiCheck, FiTrash2, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      // Get all reviews including unapproved for admin
      const r = await API.get('/reviews?all=true');
      setReviews(r.data);
    } catch { setReviews([]); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    try { await approveReview(id); toast.success('Review approved'); load(); } catch { toast.error('Failed'); }
  };
  const remove = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try { await deleteReview(id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="admin-page-header"><div><h1>Reviews</h1><p>{reviews.length} total reviews</p></div></div>
      <div className="admin-card">
        {loading ? <div style={{display:'flex',justifyContent:'center',padding:'3rem'}}><div className="spinner"/></div> : reviews.length === 0 ? (
          <p style={{color:'#8c7860',textAlign:'center',padding:'2rem'}}>No reviews yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Customer</th><th>Rating</th><th>Comment</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {reviews.map(r => (
                  <tr key={r._id}>
                    <td style={{fontWeight:500}}>{r.user?.name || '—'}</td>
                    <td>
                      <div style={{display:'flex',gap:2}}>
                        {[1,2,3,4,5].map(i => <FiStar key={i} size={12} fill={i<=r.rating?'#c9a96e':'none'} stroke="#c9a96e"/>)}
                      </div>
                    </td>
                    <td style={{maxWidth:250,fontSize:'0.85rem'}}>{r.comment}</td>
                    <td><span className={`badge-admin ${r.isApproved?'badge-published':'badge-draft'}`}>{r.isApproved?'Approved':'Pending'}</span></td>
                    <td>
                      <div style={{display:'flex',gap:'0.5rem'}}>
                        {!r.isApproved && <button className="btn-admin btn-admin-gold btn-admin-sm" onClick={()=>approve(r._id)}><FiCheck size={12}/></button>}
                        <button className="btn-admin btn-admin-danger btn-admin-sm" onClick={()=>remove(r._id)}><FiTrash2 size={12}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminReviews;
