import React, { useState, useEffect } from 'react';
import { getProjects, createProject, updateProject, deleteProject, uploadProjectFiles, deleteCloudinaryAsset } from '../utils/api';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUploadCloud } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './AdminUpload.css';

const EMPTY = { title:'', description:'', shortDescription:'', client:'', location:'', area:'', duration:'', year: new Date().getFullYear(), style:'', category:'Residential', images:[], isFeatured:false, isPublished:true };

const CATEGORIES = ['Residential','Commercial','Hospitality','Office','Retail'];

const AdminProjects = () => {
  const [projects,  setProjects]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [modal,     setModal]     = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState(EMPTY);
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = () => { setLoading(true); getProjects({ limit:50 }).then(r => setProjects(r.data.projects)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openNew  = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = p => { setForm({ ...p, images: (p.images||[]).map(i => ({ url: i.url||i, caption: i.caption||'' })) }); setEditing(p._id); setModal(true); };

  const handleFilesUpload = async e => {
    const files = Array.from(e.target.files); if (!files.length) return;
    setUploading(true);
    try {
      const urls = await uploadProjectFiles(files);
      const newImages = urls.map(url => ({ url, caption: '' }));
      setForm(p => ({ ...p, images: [...(p.images||[]), ...newImages] }));
      toast.success(`${urls.length} file${urls.length>1?'s':''} uploaded to Cloudinary`);
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); e.target.value = ''; }
  };

  const removeImage = async (url, idx) => {
    setForm(p => ({ ...p, images: p.images.filter((_,i) => i!==idx) }));
    try { await deleteCloudinaryAsset(url); } catch {}
  };

  const updateCaption = (idx, caption) => {
    setForm(p => { const imgs = [...p.images]; imgs[idx] = { ...imgs[idx], caption }; return { ...p, images: imgs }; });
  };

  const handleSave = async e => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form };
      if (editing) await updateProject(editing, payload); else await createProject(payload);
      toast.success(editing ? 'Updated' : 'Created'); setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try { await deleteProject(id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Projects</h1><p>{projects.length} in portfolio</p></div>
        <button className="btn-admin btn-admin-primary" onClick={openNew}><FiPlus size={14}/> Add Project</button>
      </div>

      <div className="admin-card">
        {loading ? <div className="loading-center"><div className="spinner"/></div> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Cover</th><th>Title</th><th>Category</th><th>Location</th><th>Year</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {projects.map(p => {
                  const cover = p.images?.[0]?.url || p.images?.[0];
                  return (
                    <tr key={p._id}>
                      <td>{cover ? <img src={cover} alt="" style={{ width:56, height:40, objectFit:'cover' }}/> : <span style={{ color:'#8c7860', fontSize:'0.72rem' }}>—</span>}</td>
                      <td style={{ fontWeight:500 }}>{p.title}</td>
                      <td style={{ fontSize:'0.8rem' }}>{p.category || '—'}</td>
                      <td style={{ fontSize:'0.8rem' }}>{p.location || '—'}</td>
                      <td style={{ fontSize:'0.8rem' }}>{p.year || '—'}</td>
                      <td><span className={`badge-admin ${p.isPublished?'badge-published':'badge-draft'}`}>{p.isPublished?'Published':'Draft'}</span></td>
                      <td><div style={{ display:'flex', gap:'0.5rem' }}>
                        <button className="btn-admin btn-admin-outline btn-admin-sm" onClick={() => openEdit(p)}><FiEdit2 size={12}/></button>
                        <Link to={`/projects/${p.slug}`} target="_blank" className="btn-admin btn-admin-outline btn-admin-sm">View</Link>
                        <button className="btn-admin btn-admin-danger btn-admin-sm" onClick={() => handleDelete(p._id, p.title)}><FiTrash2 size={12}/></button>
                      </div></td>
                    </tr>
                  );
                })}
                {projects.length === 0 && <tr><td colSpan={7} style={{ textAlign:'center', color:'#8c7860', padding:'2rem' }}>No projects yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="admin-modal-backdrop" onClick={() => setModal(false)}>
          <div className="admin-modal" style={{ maxWidth:760 }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header"><h2>{editing ? 'Edit Project' : 'New Project'}</h2><button className="admin-modal-close" onClick={() => setModal(false)}><FiX/></button></div>
            <form onSubmit={handleSave}>
              <div className="admin-modal-body" style={{ maxHeight:'75vh', overflowY:'auto' }}>
                <div className="admin-form">
                  <div className="admin-form-row">
                    <div className="admin-field"><label>Title *</label><input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} required/></div>
                    <div className="admin-field"><label>Category</label>
                      <select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}>
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="admin-field"><label>Short Description</label><input value={form.shortDescription} onChange={e=>setForm(p=>({...p,shortDescription:e.target.value}))}/></div>
                  <div className="admin-field"><label>Full Description</label><textarea rows={4} value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))}/></div>
                  <div className="admin-form-row">
                    <div className="admin-field"><label>Client</label><input value={form.client} onChange={e=>setForm(p=>({...p,client:e.target.value}))}/></div>
                    <div className="admin-field"><label>Location</label><input value={form.location} onChange={e=>setForm(p=>({...p,location:e.target.value}))}/></div>
                  </div>
                  <div className="admin-form-row">
                    <div className="admin-field"><label>Area (sq ft)</label><input value={form.area} onChange={e=>setForm(p=>({...p,area:e.target.value}))}/></div>
                    <div className="admin-field"><label>Duration</label><input value={form.duration} onChange={e=>setForm(p=>({...p,duration:e.target.value}))}/></div>
                  </div>
                  <div className="admin-form-row">
                    <div className="admin-field"><label>Year</label><input type="number" value={form.year} onChange={e=>setForm(p=>({...p,year:Number(e.target.value)}))}/></div>
                    <div className="admin-field"><label>Style</label><input value={form.style} onChange={e=>setForm(p=>({...p,style:e.target.value}))} placeholder="Modern Organic"/></div>
                  </div>

                  {/* Cloudinary Images/Videos */}
                  <div className="upload-section">
                    <label className="upload-section-label">Project Images & Videos <span className="upload-badge">Cloudinary</span></label>
                    <label className={`upload-dropzone ${uploading?'uploading':''}`}>
                      <input type="file" accept="image/*,video/*,.gif" multiple onChange={handleFilesUpload} disabled={uploading} style={{ display:'none' }}/>
                      <FiUploadCloud size={26}/>
                      <span>{uploading ? 'Uploading to Cloudinary...' : 'Click or drag images, videos, GIFs here'}</span>
                      <small>JPG, PNG, WEBP, GIF, MP4, MOV — up to 100MB each</small>
                    </label>
                    {form.images?.length > 0 && (
                      <div style={{ marginTop:'0.75rem' }}>
                        {form.images.map((img, i) => (
                          <div key={i} style={{ display:'flex', gap:'0.75rem', alignItems:'center', marginBottom:'0.5rem', background:'#f5f0e8', padding:'0.5rem', border:'1px solid #e0d4c0' }}>
                            {img.url?.match(/\.(mp4|webm|mov)/) || img.url?.includes('/video/')
                              ? <video src={img.url} style={{ width:60, height:40, objectFit:'cover', flexShrink:0 }}/>
                              : <img src={img.url} alt="" style={{ width:60, height:40, objectFit:'cover', flexShrink:0 }}/>
                            }
                            <span className="preview-cdn-badge" style={{ position:'static', marginRight:'0.25rem' }}>CDN</span>
                            <input value={img.caption||''} onChange={e=>updateCaption(i,e.target.value)} placeholder="Caption (optional)" style={{ flex:1, border:'1px solid #e0d4c0', padding:'0.35rem 0.5rem', fontSize:'0.8rem', background:'#faf8f4', minWidth:0 }}/>
                            <button type="button" className="btn-admin btn-admin-danger btn-admin-sm" onClick={() => removeImage(img.url, i)} style={{ flexShrink:0 }}><FiTrash2 size={11}/></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ display:'flex', gap:'1.5rem', flexWrap:'wrap' }}>
                    <label style={{ display:'flex', alignItems:'center', gap:'0.5rem', fontSize:'0.85rem', cursor:'pointer' }}>
                      <input type="checkbox" checked={!!form.isFeatured} onChange={e=>setForm(p=>({...p,isFeatured:e.target.checked}))}/> Featured
                    </label>
                    <label style={{ display:'flex', alignItems:'center', gap:'0.5rem', fontSize:'0.85rem', cursor:'pointer' }}>
                      <input type="checkbox" checked={!!form.isPublished} onChange={e=>setForm(p=>({...p,isPublished:e.target.checked}))}/> Published
                    </label>
                  </div>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn-admin btn-admin-outline" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn-admin btn-admin-primary" disabled={saving || uploading}>{saving?'Saving...':editing?'Update Project':'Create Project'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminProjects;
