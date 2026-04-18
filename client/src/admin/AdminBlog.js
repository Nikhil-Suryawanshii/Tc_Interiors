import React, { useState, useEffect } from 'react';
import { getBlogs, createBlog, updateBlog, deleteBlog, uploadBlogImages, deleteCloudinaryAsset } from '../utils/api';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload } from 'react-icons/fi';
import toast from 'react-hot-toast';

const EMPTY = { title:'', excerpt:'', content:'', category:'Design', tags:'', coverImage:'', isPublished:false };

const AdminBlog = () => {
  const [posts,    setPosts]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [uploading,setUploading]= useState(false);

  const load = () => { getBlogs({ limit:50 }).then(r=>setPosts(r.data.blogs)).catch(()=>{}).finally(()=>setLoading(false)); };
  useEffect(load, []);

  const openEdit = p => { setForm({ ...EMPTY, ...p, tags: p.tags?.join(',')||'' }); setEditing(p._id); setModal(true); };
  const openNew  = () => { setForm(EMPTY); setEditing(null); setModal(true); };

  const handleCoverUpload = async e => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('files', file);
      const r = await uploadBlogImages(fd);
      setForm(p => ({ ...p, coverImage: r.data.urls?.[0]||'' }));
      toast.success('Cover image uploaded ☁');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); e.target.value=''; }
  };

  const removeCover = async () => {
    if (form.coverImage?.startsWith('https://res.cloudinary.com')) {
      try { await deleteCloudinaryAsset(form.coverImage); } catch {}
    }
    setForm(p => ({ ...p, coverImage:'' }));
  };

  const handleSave = async e => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, tags: form.tags ? form.tags.split(',').map(s=>s.trim()) : [], publishedAt: form.isPublished ? new Date() : null };
      if (editing) await updateBlog(editing, payload); else await createBlog(payload);
      toast.success(editing?'Post updated':'Post created'); setModal(false); load();
    } catch(err) { toast.error(err.response?.data?.message||'Failed'); } finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this post?')) return;
    try { await deleteBlog(id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Blog Posts</h1><p>{posts.length} posts · cover images on Cloudinary</p></div>
        <button className="btn-admin btn-admin-primary" onClick={openNew}><FiPlus size={14}/> New Post</button>
      </div>

      <div className="admin-card">
        {loading ? <div className="loading-center"><div className="spinner"/></div> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Cover</th><th>Title</th><th>Category</th><th>Status</th><th>Views</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {posts.map(p=>(
                  <tr key={p._id}>
                    <td>
                      {p.coverImage
                        ? <img src={p.coverImage} alt="" style={{width:60,height:40,objectFit:'cover'}}/>
                        : <div style={{width:60,height:40,background:'#e0d4c0'}}/>
                      }
                    </td>
                    <td style={{fontWeight:500,maxWidth:260}}>{p.title}</td>
                    <td style={{fontSize:'0.8rem'}}>{p.category||'—'}</td>
                    <td><span className={`badge-admin ${p.isPublished?'badge-published':'badge-draft'}`}>{p.isPublished?'Published':'Draft'}</span></td>
                    <td>{p.views||0}</td>
                    <td style={{fontSize:'0.78rem',color:'#8c7860'}}>{new Date(p.createdAt).toLocaleDateString('en-IN')}</td>
                    <td><div style={{display:'flex',gap:'0.4rem'}}>
                      <button className="btn-admin btn-admin-outline btn-admin-sm" onClick={()=>openEdit(p)}><FiEdit2 size={12}/></button>
                      <button className="btn-admin btn-admin-danger btn-admin-sm" onClick={()=>handleDelete(p._id)}><FiTrash2 size={12}/></button>
                    </div></td>
                  </tr>
                ))}
                {posts.length===0 && <tr><td colSpan={7} style={{textAlign:'center',color:'#8c7860',padding:'2rem'}}>No posts yet</td></tr>}
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
              <div className="admin-modal-body" style={{maxHeight:'75vh',overflowY:'auto'}}>
                <div className="admin-form">
                  <div className="admin-field"><label>Title *</label><input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} required/></div>
                  <div className="admin-form-row">
                    <div className="admin-field"><label>Category</label><input value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}/></div>
                    <div className="admin-field"><label>Tags (comma separated)</label><input value={form.tags} onChange={e=>setForm(p=>({...p,tags:e.target.value}))}/></div>
                  </div>
                  <div className="admin-field"><label>Excerpt</label><textarea rows={2} value={form.excerpt} onChange={e=>setForm(p=>({...p,excerpt:e.target.value}))}/></div>
                  <div className="admin-field">
                    <label>Cover Image · Cloudinary /blog/</label>
                    {form.coverImage && (
                      <div style={{position:'relative',display:'inline-block',marginBottom:'0.5rem'}}>
                        <img src={form.coverImage} alt="" style={{height:80,maxWidth:240,objectFit:'cover',border:'1px solid #e0d4c0'}}/>
                        {form.coverImage.startsWith('https://res.cloudinary.com') && (
                          <div style={{position:'absolute',top:0,right:0,background:'#c9a96e',color:'#1a1208',fontSize:'0.55rem',padding:'1px 4px'}}>☁ CDN</div>
                        )}
                        <button type="button" className="btn-admin btn-admin-danger btn-admin-sm" style={{display:'block',marginTop:'0.3rem'}} onClick={removeCover}>Remove</button>
                      </div>
                    )}
                    <label className="cloudinary-upload-btn" style={{opacity:uploading?0.6:1}}>
                      {uploading?'Uploading…':<><FiUpload size={13}/> {form.coverImage?'Replace Cover':'Upload Cover Image'}</>}
                      <input type="file" accept="image/*" onChange={handleCoverUpload} disabled={uploading} style={{display:'none'}}/>
                    </label>
                  </div>
                  <div className="admin-field"><label>Content (HTML supported) *</label><textarea rows={12} value={form.content} onChange={e=>setForm(p=>({...p,content:e.target.value}))} required/></div>
                  <label style={{display:'flex',alignItems:'center',gap:'0.5rem',fontSize:'0.85rem',cursor:'pointer'}}>
                    <input type="checkbox" checked={form.isPublished} onChange={e=>setForm(p=>({...p,isPublished:e.target.checked}))}/> Publish immediately
                  </label>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn-admin btn-admin-outline" onClick={()=>setModal(false)}>Cancel</button>
                <button type="submit" className="btn-admin btn-admin-primary" disabled={saving||uploading}>{saving?'Saving...':editing?'Update Post':'Create Post'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminBlog;
