import React, { useState, useEffect } from 'react';
import { getServices, createService, updateService, deleteService, uploadImage } from '../utils/api';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import toast from 'react-hot-toast';

const BASE = process.env.REACT_APP_API_URL?.replace('/api','') || '';
const EMPTY = { name:'', shortDescription:'', description:'', icon:'✦', image:'', features:[], process:[], pricing:[], duration:'', isFeatured:true, order:0 };

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [saving, setSaving]     = useState(false);
  const [featuresText, setFeaturesText] = useState('');

  const load = () => { setLoading(true); getServices().then(r=>setServices(r.data)).catch(()=>{}).finally(()=>setLoading(false)); };
  useEffect(load,[]);

  const openNew  = () => { setForm(EMPTY); setFeaturesText(''); setEditing(null); setModal(true); };
  const openEdit = s => {
    setForm({ ...s });
    setFeaturesText((s.features||[]).join('\n'));
    setEditing(s._id); setModal(true);
  };

  const handleImageUpload = async e => {
    const file = e.target.files[0]; if (!file) return;
    const fd = new FormData(); fd.append('file', file);
    try { const r = await uploadImage(fd); setForm(p=>({...p, image: r.data.url})); toast.success('Image uploaded'); }
    catch { toast.error('Upload failed'); }
  };

  const addProcess = () => setForm(p => ({ ...p, process: [...(p.process||[]), { step:(p.process||[]).length+1, title:'', description:'' }] }));
  const setProcess = (i, key, val) => { const arr = [...(form.process||[])]; arr[i]={...arr[i],[key]:val}; setForm(p=>({...p,process:arr})); };
  const removeProcess = i => setForm(p=>({...p, process: p.process.filter((_,j)=>j!==i)}));

  const addPricing = () => setForm(p => ({ ...p, pricing: [...(p.pricing||[]), { label:'', price:'', description:'' }] }));
  const setPricing = (i, key, val) => { const arr = [...(form.pricing||[])]; arr[i]={...arr[i],[key]:val}; setForm(p=>({...p,pricing:arr})); };
  const removePricing = i => setForm(p=>({...p, pricing: p.pricing.filter((_,j)=>j!==i)}));

  const handleSave = async e => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, features: featuresText.split('\n').map(s=>s.trim()).filter(Boolean) };
      if (editing) await updateService(editing, payload); else await createService(payload);
      toast.success(editing?'Updated':'Created'); setModal(false); load();
    } catch(err) { toast.error(err.response?.data?.message||'Failed'); } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try { await deleteService(id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  const imgUrl = src => src ? (src.startsWith('http') ? src : `${BASE}${src}`) : null;

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Services</h1><p>{services.length} services</p></div>
        <button className="btn-admin btn-admin-primary" onClick={openNew}><FiPlus size={14}/> Add Service</button>
      </div>

      <div className="admin-card">
        {loading ? <div className="loading-center"><div className="spinner"/></div> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Icon</th><th>Name</th><th>Short Description</th><th>Duration</th><th>Featured</th><th>Order</th><th>Actions</th></tr></thead>
              <tbody>
                {services.map(s=>(
                  <tr key={s._id}>
                    <td style={{fontSize:'1.4rem'}}>{s.icon}</td>
                    <td style={{fontWeight:500}}>{s.name}</td>
                    <td style={{fontSize:'0.82rem',color:'#5c4d38',maxWidth:240}}>{s.shortDescription}</td>
                    <td style={{fontSize:'0.82rem'}}>{s.duration||'—'}</td>
                    <td><span className={`badge-admin ${s.isFeatured?'badge-published':'badge-draft'}`}>{s.isFeatured?'Yes':'No'}</span></td>
                    <td>{s.order}</td>
                    <td><div style={{display:'flex',gap:'0.5rem'}}>
                      <button className="btn-admin btn-admin-outline btn-admin-sm" onClick={()=>openEdit(s)}><FiEdit2 size={12}/></button>
                      <button className="btn-admin btn-admin-danger btn-admin-sm" onClick={()=>handleDelete(s._id,s.name)}><FiTrash2 size={12}/></button>
                    </div></td>
                  </tr>
                ))}
                {services.length===0&&<tr><td colSpan={7} style={{textAlign:'center',color:'#8c7860',padding:'2rem'}}>No services yet. Add your first service.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="admin-modal-backdrop" onClick={()=>setModal(false)}>
          <div className="admin-modal" style={{maxWidth:760}} onClick={e=>e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editing?'Edit Service':'New Service'}</h2>
              <button className="admin-modal-close" onClick={()=>setModal(false)}><FiX/></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-modal-body" style={{maxHeight:'75vh',overflowY:'auto'}}>
                <div className="admin-form">
                  <div className="admin-form-row">
                    <div className="admin-field"><label>Service Name *</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} required/></div>
                    <div className="admin-field"><label>Icon (emoji or symbol)</label><input value={form.icon} onChange={e=>setForm(p=>({...p,icon:e.target.value}))} placeholder="✦"/></div>
                  </div>
                  <div className="admin-field"><label>Short Description</label><input value={form.shortDescription} onChange={e=>setForm(p=>({...p,shortDescription:e.target.value}))}/></div>
                  <div className="admin-field"><label>Full Description</label><textarea rows={4} value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))}/></div>
                  <div className="admin-form-row">
                    <div className="admin-field"><label>Duration</label><input value={form.duration} onChange={e=>setForm(p=>({...p,duration:e.target.value}))} placeholder="4–8 weeks"/></div>
                    <div className="admin-field"><label>Sort Order</label><input type="number" value={form.order} onChange={e=>setForm(p=>({...p,order:Number(e.target.value)}))}/></div>
                  </div>

                  {/* Image */}
                  <div className="admin-field">
                    <label>Service Image</label>
                    {imgUrl(form.image) && <img src={imgUrl(form.image)} alt="" style={{height:80,objectFit:'cover',marginBottom:'0.5rem'}}/>}
                    <input type="file" accept="image/*" onChange={handleImageUpload}/>
                  </div>

                  {/* Features */}
                  <div className="admin-field">
                    <label>Features (one per line)</label>
                    <textarea rows={5} value={featuresText} onChange={e=>setFeaturesText(e.target.value)} placeholder="Space planning & layout optimization&#10;Material and finish selection&#10;Custom furniture design"/>
                  </div>

                  {/* Process Steps */}
                  <div style={{marginBottom:'1rem'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.75rem'}}>
                      <label style={{fontSize:'0.7rem',fontWeight:500,letterSpacing:'0.15em',textTransform:'uppercase',color:'#5c4d38'}}>Process Steps</label>
                      <button type="button" className="btn-admin btn-admin-primary btn-admin-sm" onClick={addProcess}>+ Add Step</button>
                    </div>
                    {(form.process||[]).map((p,i)=>(
                      <div key={i} style={{display:'grid',gridTemplateColumns:'40px 1fr 2fr 32px',gap:'0.5rem',marginBottom:'0.5rem',alignItems:'start'}}>
                        <input type="number" value={p.step} onChange={e=>setProcess(i,'step',Number(e.target.value))} style={{border:'1px solid #e0d4c0',padding:'0.5rem',background:'#f5f0e8',textAlign:'center'}}/>
                        <input placeholder="Title" value={p.title} onChange={e=>setProcess(i,'title',e.target.value)} style={{border:'1px solid #e0d4c0',padding:'0.5rem',background:'#f5f0e8'}}/>
                        <input placeholder="Description" value={p.description} onChange={e=>setProcess(i,'description',e.target.value)} style={{border:'1px solid #e0d4c0',padding:'0.5rem',background:'#f5f0e8'}}/>
                        <button type="button" className="btn-admin btn-admin-danger btn-admin-sm" onClick={()=>removeProcess(i)} style={{height:36,alignSelf:'start'}}>✕</button>
                      </div>
                    ))}
                  </div>

                  {/* Pricing */}
                  <div style={{marginBottom:'1rem'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.75rem'}}>
                      <label style={{fontSize:'0.7rem',fontWeight:500,letterSpacing:'0.15em',textTransform:'uppercase',color:'#5c4d38'}}>Pricing Tiers</label>
                      <button type="button" className="btn-admin btn-admin-primary btn-admin-sm" onClick={addPricing}>+ Add Tier</button>
                    </div>
                    {(form.pricing||[]).map((p,i)=>(
                      <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr 2fr 32px',gap:'0.5rem',marginBottom:'0.5rem',alignItems:'start'}}>
                        <input placeholder="Label (e.g. Basic)" value={p.label} onChange={e=>setPricing(i,'label',e.target.value)} style={{border:'1px solid #e0d4c0',padding:'0.5rem',background:'#f5f0e8'}}/>
                        <input placeholder="Price (e.g. ₹50,000)" value={p.price} onChange={e=>setPricing(i,'price',e.target.value)} style={{border:'1px solid #e0d4c0',padding:'0.5rem',background:'#f5f0e8'}}/>
                        <input placeholder="Description" value={p.description} onChange={e=>setPricing(i,'description',e.target.value)} style={{border:'1px solid #e0d4c0',padding:'0.5rem',background:'#f5f0e8'}}/>
                        <button type="button" className="btn-admin btn-admin-danger btn-admin-sm" onClick={()=>removePricing(i)} style={{height:36,alignSelf:'start'}}>✕</button>
                      </div>
                    ))}
                  </div>

                  <label style={{display:'flex',alignItems:'center',gap:'0.5rem',fontSize:'0.85rem',cursor:'pointer'}}>
                    <input type="checkbox" checked={!!form.isFeatured} onChange={e=>setForm(p=>({...p,isFeatured:e.target.checked}))}/> Show on Homepage
                  </label>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn-admin btn-admin-outline" onClick={()=>setModal(false)}>Cancel</button>
                <button type="submit" className="btn-admin btn-admin-primary" disabled={saving}>{saving?'Saving...':editing?'Update Service':'Create Service'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminServices;
