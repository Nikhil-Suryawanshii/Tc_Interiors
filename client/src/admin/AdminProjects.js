import React, { useState, useEffect } from 'react';
import { getProjects, deleteProject } from '../utils/api';
import { Link } from 'react-router-dom';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE = process.env.REACT_APP_API_URL?.replace('/api','') || 'http://localhost:5000';

  const load = () => { getProjects({limit:50}).then(r=>setProjects(r.data.projects)).catch(()=>{}).finally(()=>setLoading(false)); };
  useEffect(load,[]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try { await deleteProject(id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  const imgUrl = src => { const u = src?.url||src; return u?.startsWith('http') ? u : `${BASE}${u}`; };

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Projects</h1><p>{projects.length} projects in portfolio</p></div>
        <p style={{fontSize:'0.8rem',color:'#8c7860',background:'#f0ede6',padding:'0.5rem 1rem',border:'1px solid #e0d4c0'}}>Use the API or MongoDB to add projects. Full UI coming in next update.</p>
      </div>
      <div className="admin-card">
        {loading ? <div className="loading-center"><div className="spinner"/></div> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Image</th><th>Title</th><th>Category</th><th>Location</th><th>Year</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {projects.map(p=>(
                  <tr key={p._id}>
                    <td><img src={p.images?.[0] ? imgUrl(p.images[0]) : 'https://via.placeholder.com/48'} alt="" style={{width:48,height:48,objectFit:'cover'}}/></td>
                    <td style={{fontWeight:500}}>{p.title}</td>
                    <td style={{fontSize:'0.8rem'}}>{p.category||'—'}</td>
                    <td style={{fontSize:'0.8rem'}}>{p.location||'—'}</td>
                    <td style={{fontSize:'0.8rem'}}>{p.year||'—'}</td>
                    <td><span className={`badge-admin ${p.isPublished?'badge-published':'badge-draft'}`}>{p.isPublished?'Published':'Draft'}</span></td>
                    <td>
                      <div style={{display:'flex',gap:'0.5rem'}}>
                        <Link to={`/projects/${p.slug}`} target="_blank" className="btn-admin btn-admin-outline btn-admin-sm">View</Link>
                        <button className="btn-admin btn-admin-danger btn-admin-sm" onClick={()=>handleDelete(p._id,p.title)}><FiTrash2 size={12}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {projects.length===0&&<tr><td colSpan={7} style={{textAlign:'center',color:'#8c7860',padding:'2rem'}}>No projects yet</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminProjects;
