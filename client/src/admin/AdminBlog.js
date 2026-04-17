import React, { useState, useEffect } from 'react';
import { getBlogs, createBlog, updateBlog, deleteBlog } from '../utils/api';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const EMPTY = { title:'', excerpt:'', content:'', category:'Design', tags:'', isPublished:false };

const AdminBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  const load = () => { getBlogs({limit:50}).then(r=>setPosts(r.data.blogs)).catch(()=>{}).finally(()=>setLoading(false)); };
  useEffect(load,[]);

  const openEdit = (p) => { setForm({...p, tags: p.tags?.join(',')||''}); setEditing(p._id); setModal(true); };
  const openNew = () => { setForm(EMPTY); setEditing(null); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = {...form, tags: form.tags ? form.tags.split(',').map(s=>s.trim()) : [], publishedAt: form.isPublished ? new Date() : null };
      if (editing) await updateBlog(editing, payload); else await createBlog(payload);
      toast.success(editing?'Post updated':'Post created'); setModal(false); load();
    } catch(err) { toast.error(err.response?.data?.message||'Failed'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try { await deleteBlog(id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Blog Posts</h1><p>{posts.length} posts</p></div>
        <button className="btn-admin btn-admin-primary" onClick={openNew}><FiPlus size={14}/> New Post</button>
      </div>
      <div className="admin-card">
        {loading ? <div className="loading-center"><div className="spinner"/></div> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Views</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {posts.map(p=>(
                  <tr key={p._id}>
                    <td style={{fontWeight:500,maxWidth:280}}>{p.title}</td>
                    <td style={{fontSize:'0.8rem'}}>{p.category||'—'}</td>
                    <td><span className={`badge-admin ${p.isPublished?'badge-published':'badge-draft'}`}>{p.isPublished?'Published':'Draft'}</span></td>
                    <td>{p.views||0}</td>
                    <td style={{fontSize:'0.8rem',color:'#8c7860'}}>{new Date(p.createdAt).toLocaleDateString('en-IN')}</td>
                    <td><div style={{display:'flex',gap:'0.5rem'}}>
                      <button className="btn-admin btn-admin-outline btn-admin-sm" onClick={()=>openEdit(p)}><FiEdit2 size={12}/></button>
                      <button className="btn-admin btn-admin-danger btn-admin-sm" onClick={()=>handleDelete(p._id)}><FiTrash2 size={12}/></button>
                    </div></td>
                  </tr>
                ))}
                {posts.length===0&&<tr><td colSpan={6} style={{textAlign:'center',color:'#8c7860',padding:'2rem'}}>No posts yet</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {modal && (
        <div className="admin-modal-backdrop" onClick={()=>setModal(false)}>
          <div className="admin-modal" style={{maxWidth:760}} onClick={e=>e.stopPropagation()}>
            <div className="admin-modal-header"><h2>{editing?'Edit Post':'New Post'}</h2><button className="admin-modal-close" onClick={()=>setModal(false)}><FiX/></button></div>
            <form onSubmit={handleSave}>
              <div className="admin-modal-body">
                <div className="admin-form">
                  <div className="admin-field"><label>Title *</label><input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} required/></div>
                  <div className="admin-form-row">
                    <div className="admin-field"><label>Category</label><input value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}/></div>
                    <div className="admin-field"><label>Tags (comma separated)</label><input value={form.tags} onChange={e=>setForm(p=>({...p,tags:e.target.value}))}/></div>
                  </div>
                  <div className="admin-field"><label>Excerpt</label><textarea rows={2} value={form.excerpt} onChange={e=>setForm(p=>({...p,excerpt:e.target.value}))}/></div>
                  <div className="admin-field"><label>Content (HTML supported)</label><textarea rows={10} value={form.content} onChange={e=>setForm(p=>({...p,content:e.target.value}))} required/></div>
                  <label style={{display:'flex',alignItems:'center',gap:'0.5rem',fontSize:'0.85rem',cursor:'pointer'}}>
                    <input type="checkbox" checked={form.isPublished} onChange={e=>setForm(p=>({...p,isPublished:e.target.checked}))}/> Publish immediately
                  </label>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn-admin btn-admin-outline" onClick={()=>setModal(false)}>Cancel</button>
                <button type="submit" className="btn-admin btn-admin-primary" disabled={saving}>{saving?'Saving...':editing?'Update Post':'Create Post'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminBlog;
