import React, { useState, useEffect } from 'react';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct, uploadImage } from '../utils/api';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const EMPTY = { name:'', description:'', shortDescription:'', price:'', discountPrice:'', category:'', stock:'', sku:'', materials:'', colors:'', tags:'', isFeatured:false, isBestSeller:false, isNew:false, images:[] };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const BASE = process.env.REACT_APP_API_URL?.replace('/api','') || 'http://localhost:5000';

  const load = () => {
    setLoading(true);
    Promise.all([getProducts({ limit: 100 }), getCategories()])
      .then(([p, c]) => { setProducts(p.data.products); setCategories(c.data); })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = (p) => {
    setForm({ ...p, price: p.price||'', discountPrice: p.discountPrice||'', stock: p.stock||'', category: p.category?._id||p.category||'', materials: p.materials?.join(',')||'', colors: p.colors?.join(',')||'', tags: p.tags?.join(',')||'' });
    setEditing(p._id); setModal(true);
  };

  const handleImg = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      const fd = new FormData(); fd.append('file', file);
      try { const r = await uploadImage(fd); setForm(p => ({ ...p, images: [...(p.images||[]), r.data.url] })); }
      catch { toast.error('Image upload failed'); }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined, stock: Number(form.stock)||0, materials: form.materials ? form.materials.split(',').map(s=>s.trim()).filter(Boolean) : [], colors: form.colors ? form.colors.split(',').map(s=>s.trim()).filter(Boolean) : [], tags: form.tags ? form.tags.split(',').map(s=>s.trim()).filter(Boolean) : [] };
      if (editing) await updateProduct(editing, payload);
      else await createProduct(payload);
      toast.success(editing ? 'Product updated' : 'Product created');
      setModal(false); load();
    } catch(err) { toast.error(err.response?.data?.message || 'Save failed'); } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try { await deleteProduct(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const filtered = products.filter(p => !search || p.name?.toLowerCase().includes(search.toLowerCase()));
  const imgUrl = src => src?.startsWith('http') ? src : `${BASE}${src}`;

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Products</h1><p>{products.length} products total</p></div>
        <button className="btn-admin btn-admin-primary" onClick={openNew}><FiPlus size={14}/> Add Product</button>
      </div>

      <div className="admin-card">
        <div style={{marginBottom:'1rem'}}>
          <div className="admin-search">
            <FiSearch size={14} color="#8c7860"/>
            <input placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
        </div>
        {loading ? <div className="loading-center"><div className="spinner"/></div> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p._id}>
                    <td><img src={p.images?.[0] ? imgUrl(p.images[0]) : 'https://via.placeholder.com/48'} alt={p.name} style={{width:48,height:48,objectFit:'cover'}}/></td>
                    <td><div style={{fontWeight:500}}>{p.name}</div><div style={{fontSize:'0.75rem',color:'#8c7860'}}>{p.sku||'—'}</div></td>
                    <td style={{fontSize:'0.8rem'}}>{p.category?.name||'—'}</td>
                    <td>
                      <div style={{fontWeight:500}}>₹{p.discountPrice?.toLocaleString()||p.price?.toLocaleString()}</div>
                      {p.discountPrice && <div style={{fontSize:'0.75rem',color:'#8c7860',textDecoration:'line-through'}}>₹{p.price?.toLocaleString()}</div>}
                    </td>
                    <td><span style={{color: p.stock>0?'#155724':'#721c24',fontWeight:500}}>{p.stock}</span></td>
                    <td style={{fontSize:'0.75rem'}}>
                      {p.isFeatured && <span className="badge-admin badge-admin-role" style={{marginRight:4}}>Featured</span>}
                      {p.isNew && <span className="badge-admin badge-new">New</span>}
                    </td>
                    <td>
                      <div style={{display:'flex',gap:'0.5rem'}}>
                        <button className="btn-admin btn-admin-outline btn-admin-sm" onClick={()=>openEdit(p)}><FiEdit2 size={12}/></button>
                        <button className="btn-admin btn-admin-danger btn-admin-sm" onClick={()=>handleDelete(p._id,p.name)}><FiTrash2 size={12}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={7} style={{textAlign:'center',color:'#8c7860',padding:'2rem'}}>No products found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {modal && (
        <div className="admin-modal-backdrop" onClick={()=>setModal(false)}>
          <div className="admin-modal" onClick={e=>e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editing ? 'Edit Product' : 'New Product'}</h2>
              <button className="admin-modal-close" onClick={()=>setModal(false)}><FiX/></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-modal-body">
                <div className="admin-form">
                  <div className="admin-form-row">
                    <div className="admin-field"><label>Product Name *</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} required/></div>
                    <div className="admin-field"><label>SKU</label><input value={form.sku} onChange={e=>setForm(p=>({...p,sku:e.target.value}))}/></div>
                  </div>
                  <div className="admin-field full"><label>Short Description</label><input value={form.shortDescription} onChange={e=>setForm(p=>({...p,shortDescription:e.target.value}))}/></div>
                  <div className="admin-field full"><label>Full Description *</label><textarea rows={4} value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} required/></div>
                  <div className="admin-form-row">
                    <div className="admin-field"><label>Price (₹) *</label><input type="number" value={form.price} onChange={e=>setForm(p=>({...p,price:e.target.value}))} required/></div>
                    <div className="admin-field"><label>Discount Price (₹)</label><input type="number" value={form.discountPrice} onChange={e=>setForm(p=>({...p,discountPrice:e.target.value}))}/></div>
                  </div>
                  <div className="admin-form-row">
                    <div className="admin-field"><label>Category</label>
                      <select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}>
                        <option value="">Select category</option>
                        {categories.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="admin-field"><label>Stock</label><input type="number" value={form.stock} onChange={e=>setForm(p=>({...p,stock:e.target.value}))}/></div>
                  </div>
                  <div className="admin-form-row">
                    <div className="admin-field"><label>Materials (comma separated)</label><input value={form.materials} onChange={e=>setForm(p=>({...p,materials:e.target.value}))}/></div>
                    <div className="admin-field"><label>Colors (comma separated)</label><input value={form.colors} onChange={e=>setForm(p=>({...p,colors:e.target.value}))}/></div>
                  </div>
                  <div className="admin-field"><label>Tags (comma separated)</label><input value={form.tags} onChange={e=>setForm(p=>({...p,tags:e.target.value}))}/></div>
                  <div style={{display:'flex',gap:'1.5rem',flexWrap:'wrap'}}>
                    {[['isFeatured','Featured'],['isBestSeller','Best Seller'],['isNew','New Arrival']].map(([k,l])=>(
                      <label key={k} style={{display:'flex',alignItems:'center',gap:'0.5rem',fontSize:'0.85rem',cursor:'pointer'}}>
                        <input type="checkbox" checked={!!form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.checked}))}/>{l}
                      </label>
                    ))}
                  </div>
                  <div className="admin-field"><label>Upload Images</label><input type="file" accept="image/*" multiple onChange={handleImg}/></div>
                  {form.images?.length > 0 && (
                    <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
                      {form.images.map((img,i)=>(
                        <div key={i} style={{position:'relative'}}>
                          <img src={imgUrl(img)} alt="" style={{width:64,height:64,objectFit:'cover'}}/>
                          <button type="button" onClick={()=>setForm(p=>({...p,images:p.images.filter((_,j)=>j!==i)}))} style={{position:'absolute',top:-6,right:-6,background:'#c0392b',color:'#fff',border:'none',borderRadius:'50%',width:18,height:18,fontSize:'0.7rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn-admin btn-admin-outline" onClick={()=>setModal(false)}>Cancel</button>
                <button type="submit" className="btn-admin btn-admin-primary" disabled={saving}>{saving?'Saving...':editing?'Update Product':'Create Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminProducts;
