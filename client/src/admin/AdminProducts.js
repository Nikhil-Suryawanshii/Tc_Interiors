import React, { useState, useEffect } from 'react';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct, uploadProductImages, deleteCloudinaryAsset } from '../utils/api';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiUpload, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';

const EMPTY = {
  name:'', description:'', shortDescription:'', price:'', discountPrice:'',
  category:'', stock:'', sku:'', materials:'', colors:'', tags:'',
  isFeatured:false, isBestSeller:false, isNew:false, images:[], videos:[]
};

const AdminProducts = () => {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [form,       setForm]       = useState(EMPTY);
  const [search,     setSearch]     = useState('');
  const [saving,     setSaving]     = useState(false);
  const [uploading,  setUploading]  = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([getProducts({ limit:100 }), getCategories()])
      .then(([p, c]) => { setProducts(p.data.products); setCategories(c.data); })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew  = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = p => {
    setForm({
      ...p,
      price: p.price||'', discountPrice: p.discountPrice||'',
      stock: p.stock||'', category: p.category?._id||p.category||'',
      materials: p.materials?.join(',')||'', colors: p.colors?.join(',')||'',
      tags: p.tags?.join(',')||'',
      images: p.images||[], videos: p.videos||[],
    });
    setEditing(p._id); setModal(true);
  };

  // Upload images to Cloudinary → products/ folder
  const handleImageUpload = async e => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('files', f));
      const r = await uploadProductImages(fd);
      setForm(p => ({ ...p, images: [...(p.images||[]), ...(r.data.urls||[])] }));
      toast.success(`${files.length} image${files.length>1?'s':''} uploaded to Cloudinary`);
    } catch { toast.error('Image upload failed'); }
    finally { setUploading(false); e.target.value = ''; }
  };

  // Remove image from form + optionally delete from Cloudinary
  const removeImage = async (url, idx) => {
    setForm(p => ({ ...p, images: p.images.filter((_,i) => i !== idx) }));
    if (url?.startsWith('https://res.cloudinary.com')) {
      try { await deleteCloudinaryAsset(url); } catch {}
    }
  };

  const handleSave = async e => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = {
        ...form,
        price:        Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
        stock:        Number(form.stock)||0,
        materials:    form.materials ? form.materials.split(',').map(s=>s.trim()).filter(Boolean) : [],
        colors:       form.colors    ? form.colors.split(',').map(s=>s.trim()).filter(Boolean) : [],
        tags:         form.tags      ? form.tags.split(',').map(s=>s.trim()).filter(Boolean) : [],
      };
      if (editing) await updateProduct(editing, payload);
      else         await createProduct(payload);
      toast.success(editing ? 'Product updated' : 'Product created');
      setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message||'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try { await deleteProduct(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const filtered = products.filter(p => !search || p.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Products</h1><p>{products.length} products · images stored on Cloudinary</p></div>
        <button className="btn-admin btn-admin-primary" onClick={openNew}><FiPlus size={14}/> Add Product</button>
      </div>

      <div className="admin-card">
        <div style={{marginBottom:'1rem'}}>
          <div className="admin-search">
            <FiSearch size={13} color="#8c7860"/>
            <input placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
        </div>
        {loading ? <div className="loading-center"><div className="spinner"/></div> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Flags</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p._id}>
                    <td>
                      {p.images?.[0]
                        ? <img src={p.images[0]} alt={p.name} style={{width:48,height:48,objectFit:'cover'}}/>
                        : <div style={{width:48,height:48,background:'#e0d4c0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.65rem',color:'#8c7860'}}>No img</div>
                      }
                    </td>
                    <td><div style={{fontWeight:500}}>{p.name}</div><div style={{fontSize:'0.72rem',color:'#8c7860'}}>{p.sku||'—'}</div></td>
                    <td style={{fontSize:'0.8rem'}}>{p.category?.name||'—'}</td>
                    <td>
                      <div style={{fontWeight:500}}>₹{(p.discountPrice||p.price)?.toLocaleString()}</div>
                      {p.discountPrice && <div style={{fontSize:'0.72rem',color:'#8c7860',textDecoration:'line-through'}}>₹{p.price?.toLocaleString()}</div>}
                    </td>
                    <td><span style={{color:p.stock>0?'#155724':'#721c24',fontWeight:500}}>{p.stock}</span></td>
                    <td style={{fontSize:'0.72rem'}}>
                      {p.isFeatured  && <span className="badge-admin badge-admin-role" style={{marginRight:3}}>Featured</span>}
                      {p.isNew       && <span className="badge-admin badge-new">New</span>}
                      {p.isBestSeller && <span className="badge-admin badge-published" style={{marginLeft:3}}>Best</span>}
                    </td>
                    <td>
                      <div style={{display:'flex',gap:'0.4rem'}}>
                        <button className="btn-admin btn-admin-outline btn-admin-sm" onClick={()=>openEdit(p)}><FiEdit2 size={12}/></button>
                        <button className="btn-admin btn-admin-danger btn-admin-sm" onClick={()=>handleDelete(p._id,p.name)}><FiTrash2 size={12}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length===0 && <tr><td colSpan={7} style={{textAlign:'center',color:'#8c7860',padding:'2rem'}}>No products found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {modal && (
        <div className="admin-modal-backdrop" onClick={()=>setModal(false)}>
          <div className="admin-modal" style={{maxWidth:700}} onClick={e=>e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editing?'Edit Product':'New Product'}</h2>
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
                  <div className="admin-field full"><label>Full Description *</label><textarea rows={3} value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} required/></div>
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

                  {/* ── Cloudinary Image Upload ── */}
                  <div className="admin-field">
                    <label>Product Images (stored on Cloudinary)</label>
                    <label className="cloudinary-upload-btn" style={{opacity: uploading?0.6:1}}>
                      {uploading ? <><FiLoader size={14} className="spin-icon"/> Uploading...</> : <><FiUpload size={14}/> Choose Images</>}
                      <input type="file" accept="image/*,image/gif" multiple onChange={handleImageUpload} disabled={uploading} style={{display:'none'}}/>
                    </label>
                    <span style={{fontSize:'0.72rem',color:'#8c7860',marginTop:'0.3rem'}}>
                      JPG, PNG, WebP, GIF · Max 20MB each · Stored in Cloudinary /products/
                    </span>
                  </div>
                  {form.images?.length > 0 && (
                    <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',marginTop:'-0.5rem'}}>
                      {form.images.map((img, i) => (
                        <div key={i} style={{position:'relative',flexShrink:0}}>
                          <img src={img} alt="" style={{width:72,height:72,objectFit:'cover',border:'1px solid #e0d4c0'}}/>
                          <button type="button" onClick={()=>removeImage(img,i)}
                            style={{position:'absolute',top:-7,right:-7,background:'#c0392b',color:'#fff',border:'none',borderRadius:'50%',width:20,height:20,fontSize:'0.7rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',lineHeight:1}}>
                            ✕
                          </button>
                          {img.startsWith('https://res.cloudinary.com') && (
                            <div style={{position:'absolute',bottom:0,left:0,right:0,background:'rgba(0,0,0,0.55)',fontSize:'0.55rem',color:'#c9a96e',textAlign:'center',padding:'1px'}}>☁ CDN</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn-admin btn-admin-outline" onClick={()=>setModal(false)}>Cancel</button>
                <button type="submit" className="btn-admin btn-admin-primary" disabled={saving||uploading}>
                  {saving?'Saving...':editing?'Update Product':'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminProducts;
