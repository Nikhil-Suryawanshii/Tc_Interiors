import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => { API.get('/admin/users').then(r=>setUsers(r.data)).catch(()=>{}).finally(()=>setLoading(false)); };
  useEffect(load,[]);

  const toggleRole = async (id, role) => {
    const newRole = role === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change role to ${newRole}?`)) return;
    try { await API.put(`/admin/users/${id}/role`, {role: newRole}); toast.success('Role updated'); load(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="admin-page-header"><div><h1>Customers</h1><p>{users.length} registered users</p></div></div>
      <div className="admin-card">
        {loading ? <div className="loading-center"><div className="spinner"/></div> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Action</th></tr></thead>
              <tbody>
                {users.map(u=>(
                  <tr key={u._id}>
                    <td style={{fontWeight:500}}><div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}><div style={{width:32,height:32,borderRadius:'50%',background:'#1a1208',color:'#faf8f4',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.8rem',fontWeight:600,flexShrink:0}}>{u.name?.charAt(0)}</div>{u.name}</div></td>
                    <td>{u.email}</td>
                    <td><span className={`badge-admin badge-${u.role==='admin'?'admin-role':'user'}`}>{u.role}</span></td>
                    <td style={{fontSize:'0.8rem',color:'#8c7860'}}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                    <td><button className="btn-admin btn-admin-outline btn-admin-sm" onClick={()=>toggleRole(u._id,u.role)}>Toggle Role</button></td>
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
export default AdminUsers;
