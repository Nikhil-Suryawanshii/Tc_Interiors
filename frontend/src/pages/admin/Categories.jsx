import { useState, useRef } from 'react';
import { categoriesAPI } from '@services/api';
import { useAdminCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@hooks/useQueries';
import toast from 'react-hot-toast';
const S = { background:'#1a1505', border:'1px solid #2e2a1a', borderRadius:8, padding:'9px 12px', color:'#e8d5a0', fontSize:14, outline:'none', fontFamily:'inherit', width:'100%', boxSizing:'border-box' };
const fo=e=>e.target.style.borderColor='#b8860b'; const fb=e=>e.target.style.borderColor='#2e2a1a';
const ICONS = ['🪑','🛋️','🛏️','🪞','🚪','🪴','💡','🍽️','🛁','🪟','🗄️','🖼️'];

export default function AdminCategories() {
  const { data:categories=[], refetch } = useAdminCategories();
  const create = useCreateCategory(); const update = useUpdateCategory(); const del = useDeleteCategory();
  const [form, setForm] = useState({ name:'', description:'', icon:'🪑', visible:true, order:0 });
  const [editId, setEdit] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);
  const fileRefs = useRef({});
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editId) { await update.mutateAsync({ id:editId, data:form }); toast.success('Updated!'); }
      else        { await create.mutateAsync(form);                      toast.success('Created!'); }
      setForm({ name:'', description:'', icon:'🪑', visible:true, order:0 }); setEdit(null);
    } catch(err) { toast.error(err.response?.data?.error||'Error'); }
    setSaving(false);
  };

  const handleImageUpload = async (catId, file) => {
    if (!file) return; setUploadingId(catId);
    try {
      const fd = new FormData(); fd.append('image', file);
      await categoriesAPI.uploadImage(catId, fd);
      refetch(); toast.success('Image uploaded!');
    } catch { toast.error('Upload failed'); }
    setUploadingId(null);
  };

  return (
    <div style={{ color:'#e8d5a0', fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`.sk-inp:focus{border-color:#b8860b!important}`}</style>
      <div style={{ fontSize:24, fontWeight:800, fontFamily:'serif', color:'#b8860b', marginBottom:6 }}>Categories</div>
      <div style={{ fontSize:13, color:'#5a4a2a', marginBottom:24 }}>Organise your product catalogue</div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, alignItems:'start' }}>
        {/* Form */}
        <div style={{ background:'#0f0d08', border:'1px solid #2e2a1a', borderRadius:14, padding:20 }}>
          <div style={{ fontSize:13, fontWeight:600, color:'#b8860b', marginBottom:16 }}>{editId?'Edit Category':'New Category'}</div>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div><label style={{ fontSize:12, color:'#8a7a5a', display:'block', marginBottom:5, textTransform:'uppercase', letterSpacing:'1px' }}>Name *</label>
              <input className="sk-inp" style={S} required value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Living Room" onFocus={fo} onBlur={fb}/></div>
            <div><label style={{ fontSize:12, color:'#8a7a5a', display:'block', marginBottom:5, textTransform:'uppercase', letterSpacing:'1px' }}>Description</label>
              <textarea className="sk-inp" style={{...S,resize:'vertical'}} rows={2} value={form.description||''} onChange={e=>set('description',e.target.value)} onFocus={fo} onBlur={fb}/></div>
            <div><label style={{ fontSize:12, color:'#8a7a5a', display:'block', marginBottom:8, textTransform:'uppercase', letterSpacing:'1px' }}>Icon</label>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {ICONS.map(ic=><button key={ic} type="button" onClick={()=>set('icon',ic)} style={{ fontSize:22, padding:6, borderRadius:8, border:form.icon===ic?'2px solid #b8860b':'2px solid #2e2a1a', background:'#1a1505', cursor:'pointer' }}>{ic}</button>)}
              </div>
            </div>
            <div style={{ display:'flex', gap:16, alignItems:'center' }}>
              <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                <input type="checkbox" checked={!!form.visible} onChange={e=>set('visible',e.target.checked)} style={{ accentColor:'#b8860b', width:15, height:15 }}/> <span style={{ fontSize:13, color:'#8a7a5a' }}>Visible</span>
              </label>
              <div style={{ flex:1 }}><label style={{ fontSize:12, color:'#8a7a5a', display:'block', marginBottom:4, textTransform:'uppercase', letterSpacing:'1px' }}>Order</label>
                <input type="number" className="sk-inp" style={S} value={form.order||0} onChange={e=>set('order',Number(e.target.value))} onFocus={fo} onBlur={fb}/></div>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button type="submit" disabled={saving} style={{ flex:1, background:'linear-gradient(135deg,#b8860b,#8b6914)', border:'none', color:'#fff', padding:'10px', borderRadius:10, cursor:'pointer', fontWeight:600, fontFamily:'inherit' }}>{saving?'Saving...':editId?'Update':'Create'}</button>
              {editId && <button type="button" onClick={()=>{ setEdit(null); setForm({ name:'', description:'', icon:'🪑', visible:true, order:0 }); }} style={{ flex:1, background:'#1a1505', border:'1px solid #2e2a1a', color:'#8a7a5a', padding:'10px', borderRadius:10, cursor:'pointer', fontFamily:'inherit' }}>Cancel</button>}
            </div>
          </form>
        </div>

        {/* List */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {categories.length===0 ? <div style={{ textAlign:'center', padding:40, color:'#5a4a2a' }}>No categories yet.</div>
            : categories.map(cat=>(
              <div key={cat._id} style={{ display:'flex', alignItems:'center', gap:14, background:'#0f0d08', border:'1px solid #1e1a0e', borderRadius:12, padding:'12px 16px' }}>
                <div style={{ width:52, height:52, flexShrink:0, borderRadius:10, overflow:'hidden', background:'#151205', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {cat.image?.url ? <img src={cat.image.url} alt={cat.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : <span style={{ fontSize:26 }}>{cat.icon||'🪑'}</span>}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:600, color:'#e8d5a0', fontSize:14 }}>{cat.name}</div>
                  <div style={{ fontSize:12, color:'#5a4a2a' }}>{cat.visible?'Visible':'Hidden'} · Order {cat.order||0}</div>
                </div>
                <div style={{ display:'flex', gap:6, flexShrink:0, flexWrap:'wrap' }}>
                  <input id={`cimg-${cat._id}`} type="file" accept="image/*" style={{ display:'none' }} ref={el=>fileRefs.current[cat._id]=el}
                    onChange={e=>{ const f=e.target.files[0]; if(f) handleImageUpload(cat._id,f); e.target.value=''; }}/>
                  <label htmlFor={`cimg-${cat._id}`} style={{ padding:'4px 10px', borderRadius:7, fontSize:11, border:'1px solid #2e2a1a', background:'#1a1505', color:'#b8860b', cursor:'pointer', fontFamily:'inherit' }}>
                    {uploadingId===cat._id?'…':'🖼'}
                  </label>
                  <button onClick={()=>{ setForm({...cat}); setEdit(cat._id); }} style={{ padding:'4px 10px', borderRadius:7, fontSize:11, border:'1px solid #2e2a1a', background:'#1a1505', color:'#b8860b', cursor:'pointer', fontFamily:'inherit' }}>Edit</button>
                  <button onClick={async()=>{ if(window.confirm('Delete?')) { try { await del.mutateAsync(cat._id); toast.success('Deleted!'); } catch { toast.error('Failed'); } } }}
                    style={{ padding:'4px 10px', borderRadius:7, fontSize:11, border:'none', background:'#1f1510', color:'#f87171', cursor:'pointer', fontFamily:'inherit' }}>Del</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
