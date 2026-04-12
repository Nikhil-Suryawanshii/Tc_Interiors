import { useState, useRef } from 'react';
import { galleryAPI } from '@services/api';
import { useAdminGallery, useDeleteGallery } from '@hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const S = { background:'#1a1505', border:'1px solid #2e2a1a', borderRadius:8, padding:'9px 12px', color:'#e8d5a0', fontSize:14, outline:'none', fontFamily:'inherit', width:'100%', boxSizing:'border-box' };
const fo=e=>e.target.style.borderColor='#b8860b'; const fb=e=>e.target.style.borderColor='#2e2a1a';
const ROOM_CATS = ['Living Room','Bedroom','Kitchen','Bathroom','Office','Dining Room','Outdoor','Commercial','Hallway','Other'];

export default function AdminGallery() {
  const { data:items=[], refetch }  = useAdminGallery();
  const delGallery = useDeleteGallery();
  const [form, setForm] = useState({ title:'', description:'', category:'Living Room', tags:'', featured:false, visible:true, order:0 });
  const [editId, setEdit] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleCreate = async (e) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file && !editId) { toast.error('Please select an image'); return; }
    setSaving(true);
    try {
      if (editId) {
        await galleryAPI.update(editId, { ...form, tags:form.tags?form.tags.split(',').map(s=>s.trim()).filter(Boolean):[] });
        toast.success('Updated!'); setEdit(null);
      } else {
        const fd = new FormData();
        Object.entries({ ...form, tags:form.tags?form.tags.split(',').map(s=>s.trim()).filter(Boolean):[] }).forEach(([k,v])=> fd.append(k, Array.isArray(v)?JSON.stringify(v):v));
        fd.append('image', file);
        await galleryAPI.create(fd);
        toast.success('Photo added!');
        if (fileRef.current) fileRef.current.value='';
      }
      refetch(); setForm({ title:'', description:'', category:'Living Room', tags:'', featured:false, visible:true, order:0 });
    } catch(err) { toast.error(err.response?.data?.error||'Upload failed'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this photo?')) return;
    try { await delGallery.mutateAsync(id); toast.success('Deleted!'); } catch { toast.error('Failed'); }
  };

  return (
    <div style={{ color:'#e8d5a0', fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`.sk-inp:focus{border-color:#b8860b!important}`}</style>
      <div style={{ fontSize:24, fontWeight:800, fontFamily:'serif', color:'#b8860b', marginBottom:6 }}>Gallery</div>
      <div style={{ fontSize:13, color:'#5a4a2a', marginBottom:24 }}>Manage your interior portfolio photos</div>

      <div style={{ display:'grid', gridTemplateColumns:'320px 1fr', gap:24, alignItems:'start' }}>
        {/* Upload form */}
        <div style={{ background:'#0f0d08', border:'1px solid #2e2a1a', borderRadius:14, padding:20, position:'sticky', top:80 }}>
          <div style={{ fontSize:13, fontWeight:600, color:'#b8860b', marginBottom:16 }}>{editId?'Edit Photo Info':'Upload New Photo'}</div>
          <form onSubmit={handleCreate} style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {!editId && (
              <div>
                <label style={{ fontSize:12, color:'#8a7a5a', display:'block', marginBottom:5, textTransform:'uppercase', letterSpacing:'1px' }}>Photo *</label>
                <input ref={fileRef} type="file" accept="image/*" required={!editId} style={{ ...S, padding:'7px 10px', cursor:'pointer' }} onChange={()=>{}}/>
              </div>
            )}
            {[['Title *','title'],['Description','description']].map(([l,k])=>(
              <div key={k}><label style={{ fontSize:12, color:'#8a7a5a', display:'block', marginBottom:5, textTransform:'uppercase', letterSpacing:'1px' }}>{l}</label>
                <input className="sk-inp" style={S} required={k==='title'} value={form[k]||''} onChange={e=>set(k,e.target.value)} onFocus={fo} onBlur={fb}/></div>
            ))}
            <div><label style={{ fontSize:12, color:'#8a7a5a', display:'block', marginBottom:5, textTransform:'uppercase', letterSpacing:'1px' }}>Room Type</label>
              <select className="sk-inp" style={{...S,cursor:'pointer'}} value={form.category||''} onChange={e=>set('category',e.target.value)} onFocus={fo} onBlur={fb}>
                {ROOM_CATS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={{ fontSize:12, color:'#8a7a5a', display:'block', marginBottom:5, textTransform:'uppercase', letterSpacing:'1px' }}>Tags (comma separated)</label>
              <input className="sk-inp" style={S} value={form.tags||''} onChange={e=>set('tags',e.target.value)} placeholder="modern, luxury, minimal" onFocus={fo} onBlur={fb}/></div>
            <div style={{ display:'flex', gap:16 }}>
              {[['featured','Featured'],['visible','Visible']].map(([k,l])=>(
                <label key={k} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                  <input type="checkbox" checked={!!form[k]} onChange={e=>set(k,e.target.checked)} style={{ accentColor:'#b8860b', width:14, height:14 }}/> <span style={{ fontSize:13, color:'#8a7a5a' }}>{l}</span>
                </label>
              ))}
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button type="submit" disabled={saving} style={{ flex:1, background:'linear-gradient(135deg,#b8860b,#8b6914)', border:'none', color:'#fff', padding:'10px', borderRadius:10, cursor:'pointer', fontWeight:600, fontFamily:'inherit' }}>{saving?'Uploading...':editId?'Update':'Upload'}</button>
              {editId && <button type="button" onClick={()=>{ setEdit(null); setForm({ title:'', description:'', category:'Living Room', tags:'', featured:false, visible:true, order:0 }); }} style={{ flex:1, background:'#1a1505', border:'1px solid #2e2a1a', color:'#8a7a5a', padding:'10px', borderRadius:10, cursor:'pointer', fontFamily:'inherit' }}>Cancel</button>}
            </div>
          </form>
        </div>

        {/* Gallery grid */}
        {items.length===0 ? (
          <div style={{ textAlign:'center', padding:60, color:'#5a4a2a' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🖼️</div>
            <div style={{ fontSize:15, color:'#8a7a5a' }}>No photos uploaded yet.</div>
          </div>
        ) : (
          <div style={{ columns:'2', gap:12 }}>
            {items.map(item=>(
              <div key={item._id} style={{ marginBottom:12, breakInside:'avoid', background:'#0f0d08', border:'1px solid #1e1a0e', borderRadius:12, overflow:'hidden', position:'relative' }}>
                <img src={item.image?.url} alt={item.title} style={{ width:'100%', display:'block', objectFit:'cover' }}/>
                <div style={{ padding:'10px 12px' }}>
                  <div style={{ fontWeight:600, fontSize:13, color:'#e8d5a0', marginBottom:2 }}>{item.title}</div>
                  <div style={{ fontSize:11, color:'#5a4a2a', marginBottom:8 }}>{item.category}{item.featured?' · ⭐ Featured':''}</div>
                  <div style={{ display:'flex', gap:6 }}>
                    <button onClick={()=>{ setEdit(item._id); setForm({...item, tags:(item.tags||[]).join(', ')}); window.scrollTo({top:0,behavior:'smooth'}); }}
                      style={{ flex:1, padding:'5px', borderRadius:7, fontSize:11, border:'1px solid #2e2a1a', background:'#1a1505', color:'#b8860b', cursor:'pointer', fontFamily:'inherit' }}>Edit Info</button>
                    <button onClick={()=>handleDelete(item._id)}
                      style={{ flex:1, padding:'5px', borderRadius:7, fontSize:11, border:'none', background:'#1f1510', color:'#f87171', cursor:'pointer', fontFamily:'inherit' }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
