import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory, uploadCategoryImage, deleteCloudinaryAsset } from '../utils/api';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminCategories = () => {
  const [cats,      setCats]      = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [modal,     setModal]     = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState({ name:'', description:'', image:'' });
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = () => { getCategories().then(r=>setCats(r.data)).catch(()=>{}).finally(()=>setLoading(false)); };
  useEffect(load, []);

  const openEdit = c => { setForm({ name:c.name, description:c.description||'', image:c.image||'' }); setEditing(c._id); setModal(true); };
  const openNew  = () => { setForm({ name:'', description:'', image:'' }); setEditing(null); setModal(true); };

  const handleImageUpload = async e => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const r = await uploadCategoryImage(fd);
      setForm(p => ({ ...p, image: r.data.url }));
      toast.success('Image uploaded ☁');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); e.target.value=''; }
  };

  const removeImage = async () => {
    if (form.image?.startsWith('https://res.cloudinary.com')) {
      try { await deleteCloudinaryAsset(form.image); } catch {}
    }
    setForm(p => ({ ...p, image:'' }));
  };

  const handleSave = async e => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) await updateCategory(editing, form); else await createCategory(form);
      toast.success(editing?'Updated':'Created'); setModal(false); load();
    } catch(err) { toast.error(err.response?.data?.message||'Failed'); } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try { await deleteCategory(id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Categories</h1><p>{cats.length} categories</p></div>
        <button className="btn-admin btn-admin-primary" onClick={openNew}><FiPlus size={14}/> Add Category</button>
      </div>

      <div className="admin-card">
        {loading ? <div className="loading-center"><div className="spinner"/></div> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Image</th><th>Name</th><th>Slug</th><th>Description</th><th>Actions</th></tr></thead>
              <tbody>
                {cats.map(c=>(
                  <tr key={c._id}>
                    <td>
                      {c.image
                        ? <img src={c.image} alt="" style={{width:44,height:44,objectFit:'cover'}}/>
                        : <div style={{width:44,height:44,background:'#e0d4c0'}}/>
                      }
                    </td>
                    <td style={{fontWeight:500}}>{c.name}</td>
                    <td style={{fontSize:'0.78rem',color:'#8c7860'}}>{c.slug}</td>
                    <td style={{fontSize:'0.83rem'}}>{c.description||'—'}</td>
                    <td><div style={{display:'flex',gap:'0.4rem'}}>
                      <button className="btn-admin btn-admin-outline btn-admin-sm" onClick={()=>openEdit(c)}><FiEdit2 size={12}/></button>
                      <button className="btn-admin btn-admin-danger btn-admin-sm" onClick={()=>handleDelete(c._id,c.name)}><FiTrash2 size={12}/></button>
                    </div></td>
                  </tr>
                ))}
                {cats.length===0 && <tr><td colSpan={5} style={{textAlign:'center',color:'#8c7860',padding:'2rem'}}>No categories yet</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="admin-modal-backdrop" onClick={()=>setModal(false)}>
          <div className="admin-modal" style={{maxWidth:440}} onClick={e=>e.stopPropagation()}>
            <div className="admin-modal-header"><h2>{editing?'Edit Category':'New Category'}</h2><button className="admin-modal-close" onClick={()=>setModal(false)}><FiX/></button></div>
            <form onSubmit={handleSave}>
              <div className="admin-modal-body">
                <div className="admin-form">
                  <div className="admin-field"><label>Name *</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} required autoFocus/></div>
                  <div className="admin-field"><label>Description</label><textarea rows={3} value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))}/></div>
                  <div className="admin-field">
                    <label>Category Image · Cloudinary /categories/</label>
                    {form.image && (
                      <div style={{position:'relative',display:'inline-block',marginBottom:'0.5rem'}}>
                        <img src={form.image} alt="" style={{height:70,objectFit:'cover',border:'1px solid #e0d4c0'}}/>
                        {form.image.startsWith('https://res.cloudinary.com') && (
                          <div style={{position:'absolute',top:0,right:0,background:'#c9a96e',color:'#1a1208',fontSize:'0.55rem',padding:'1px 4px'}}>☁</div>
                        )}
                        <button type="button" className="btn-admin btn-admin-danger btn-admin-sm" style={{display:'block',marginTop:'0.3rem'}} onClick={removeImage}>Remove</button>
                      </div>
                    )}
                    <label className="cloudinary-upload-btn" style={{opacity:uploading?0.6:1}}>
                      {uploading?'Uploading…':<><FiUpload size={13}/> Upload Image</>}
                      <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} style={{display:'none'}}/>
                    </label>
                  </div>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn-admin btn-admin-outline" onClick={()=>setModal(false)}>Cancel</button>
                <button type="submit" className="btn-admin btn-admin-primary" disabled={saving||uploading}>{saving?'Saving...':editing?'Update':'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminCategories;
