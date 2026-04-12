// PATH: frontend/src/pages/admin/AdminProjects.jsx
import { useState, useRef } from 'react';
import { projectsAPI } from '@services/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const S = { background:'#1a1505', border:'1px solid #2e2a1a', borderRadius:8, padding:'9px 12px', color:'#e8d5a0', fontSize:14, outline:'none', fontFamily:'inherit', width:'100%', boxSizing:'border-box' };
const fo = e => e.target.style.borderColor = '#b8860b';
const fb = e => e.target.style.borderColor = '#2e2a1a';
const EMPTY = { title:'', category:'', location:'', description:'', client:'', area:'', year:'', featured:false, published:true };

const useAdminProjects = () => useQuery({
  queryKey: ['admin-projects'],
  queryFn: () => projectsAPI.getAll({ limit: 200 }).then(r => r.data?.data?.projects || r.data?.data || []),
});

export default function AdminProjects() {
  const qc = useQueryClient();
  const { data: projects = [], isLoading } = useAdminProjects();
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const fileRef = useRef();

  const inp = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const openNew = () => { setForm(EMPTY); setEditing(null); setShowForm(true); };
  const openEdit = (p) => { setForm({ ...EMPTY, ...p }); setEditing(p._id); setShowForm(true); };
  const cancel = () => { setShowForm(false); setEditing(null); setForm(EMPTY); setImageFile(null); };

  const save = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      let res;
      if (editing) {
        res = await projectsAPI.update(editing, form);
      } else {
        res = await projectsAPI.create(form);
      }
      // Upload image if selected
      if (imageFile && res?.data?.data?._id) {
        const fd = new FormData(); fd.append('image', imageFile);
        await projectsAPI.uploadImage(res.data.data._id, fd).catch(() => {});
      }
      toast.success(editing ? 'Project updated' : 'Project created');
      qc.invalidateQueries({ queryKey: ['admin-projects'] });
      cancel();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Save failed');
    }
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await projectsAPI.delete(id);
      toast.success('Deleted');
      qc.invalidateQueries({ queryKey: ['admin-projects'] });
    } catch { toast.error('Delete failed'); }
  };

  const card = { background:'#0f0f1a', border:'1px solid #1e1e2e', borderRadius:14, padding:'20px 22px' };
  const GOLD = '#b8860b';

  return (
    <div style={{ color:'#e8d5a0', fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&display=swap');`}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <div style={{ fontFamily:'Syne,sans-serif', fontSize:24, fontWeight:800, letterSpacing:'-0.5px' }}>Projects</div>
          <div style={{ fontSize:13, color:'#4a4a2a', marginTop:3 }}>{projects.length} project{projects.length !== 1 ? 's' : ''}</div>
        </div>
        <button onClick={openNew}
          style={{ padding:'10px 20px', background:`linear-gradient(135deg,${GOLD},#8b6914)`, border:'none', borderRadius:10, color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
          + New Project
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ ...card, marginBottom:24, border:`1px solid ${GOLD}40` }}>
          <div style={{ fontSize:14, fontWeight:700, color:GOLD, marginBottom:16 }}>{editing ? 'Edit Project' : 'New Project'}</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
            <div>
              <label style={{ fontSize:11, color:'#6a6a2a', display:'block', marginBottom:4 }}>Title *</label>
              <input style={S} value={form.title} onFocus={fo} onBlur={fb} onChange={e => inp('title', e.target.value)} placeholder="e.g. Modern Living Room" />
            </div>
            <div>
              <label style={{ fontSize:11, color:'#6a6a2a', display:'block', marginBottom:4 }}>Category</label>
              <input style={S} value={form.category} onFocus={fo} onBlur={fb} onChange={e => inp('category', e.target.value)} placeholder="e.g. Residential" />
            </div>
            <div>
              <label style={{ fontSize:11, color:'#6a6a2a', display:'block', marginBottom:4 }}>Location</label>
              <input style={S} value={form.location} onFocus={fo} onBlur={fb} onChange={e => inp('location', e.target.value)} placeholder="e.g. Nagpur, Maharashtra" />
            </div>
            <div>
              <label style={{ fontSize:11, color:'#6a6a2a', display:'block', marginBottom:4 }}>Client</label>
              <input style={S} value={form.client} onFocus={fo} onBlur={fb} onChange={e => inp('client', e.target.value)} placeholder="Client name (optional)" />
            </div>
            <div>
              <label style={{ fontSize:11, color:'#6a6a2a', display:'block', marginBottom:4 }}>Area (sq ft)</label>
              <input style={S} value={form.area} onFocus={fo} onBlur={fb} onChange={e => inp('area', e.target.value)} placeholder="e.g. 2400" />
            </div>
            <div>
              <label style={{ fontSize:11, color:'#6a6a2a', display:'block', marginBottom:4 }}>Year</label>
              <input style={S} value={form.year} onFocus={fo} onBlur={fb} onChange={e => inp('year', e.target.value)} placeholder="e.g. 2024" />
            </div>
          </div>
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:11, color:'#6a6a2a', display:'block', marginBottom:4 }}>Description</label>
            <textarea style={{ ...S, minHeight:90, resize:'vertical' }} value={form.description} onFocus={fo} onBlur={fb}
              onChange={e => inp('description', e.target.value)} placeholder="Project overview..." />
          </div>
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:11, color:'#6a6a2a', display:'block', marginBottom:4 }}>Project Image</label>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => setImageFile(e.target.files[0])} />
            <button onClick={() => fileRef.current?.click()}
              style={{ padding:'8px 16px', background:'#1a1505', border:`1px solid #2e2a1a`, borderRadius:8, color:'#e8d5a0', fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
              {imageFile ? `✓ ${imageFile.name}` : 'Choose Image'}
            </button>
          </div>
          <div style={{ display:'flex', gap:12, marginBottom:12 }}>
            <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'#8a8a6a', cursor:'pointer' }}>
              <input type="checkbox" checked={form.published} onChange={e => inp('published', e.target.checked)} /> Published
            </label>
            <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'#8a8a6a', cursor:'pointer' }}>
              <input type="checkbox" checked={form.featured} onChange={e => inp('featured', e.target.checked)} /> Featured
            </label>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={save} disabled={saving}
              style={{ padding:'9px 22px', background:`linear-gradient(135deg,${GOLD},#8b6914)`, border:'none', borderRadius:8, color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'inherit', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
            </button>
            <button onClick={cancel}
              style={{ padding:'9px 18px', background:'transparent', border:'1px solid #2e2a1a', borderRadius:8, color:'#8a8a6a', fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Projects list */}
      {isLoading ? (
        <div style={{ display:'grid', gap:10 }}>
          {[1,2,3].map(i => <div key={i} style={{ height:70, background:'#0f0f1a', borderRadius:12, opacity:0.4 }} />)}
        </div>
      ) : projects.length === 0 ? (
        <div style={{ ...card, textAlign:'center', padding:'48px 24px' }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🏠</div>
          <div style={{ fontSize:14, color:'#4a4a2a' }}>No projects yet</div>
          <button onClick={openNew} style={{ marginTop:16, padding:'8px 20px', background:GOLD, border:'none', borderRadius:8, color:'#fff', fontWeight:600, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
            Add First Project
          </button>
        </div>
      ) : (
        <div style={{ display:'grid', gap:10 }}>
          {projects.map(p => (
            <div key={p._id} style={{ ...card, display:'flex', alignItems:'center', gap:16 }}>
              {/* Thumb */}
              {p.images?.[0] ? (
                <img src={p.images[0]} alt="" style={{ width:56, height:56, borderRadius:8, objectFit:'cover', flexShrink:0 }} />
              ) : (
                <div style={{ width:56, height:56, borderRadius:8, background:'#1a1505', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>🏠</div>
              )}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:600, color:'#e8d5a0', marginBottom:2 }}>{p.title}</div>
                <div style={{ fontSize:12, color:'#6a6a2a' }}>
                  {[p.category, p.location, p.year].filter(Boolean).join(' · ')}
                </div>
              </div>
              <div style={{ display:'flex', gap:6, alignItems:'center', flexShrink:0 }}>
                <span style={{ fontSize:11, padding:'3px 8px', borderRadius:6, background: p.published ? '#1a3a1a' : '#2a2a1a', color: p.published ? '#34d399' : '#8a8a6a' }}>
                  {p.published ? 'Live' : 'Draft'}
                </span>
                <button onClick={() => openEdit(p)}
                  style={{ padding:'6px 14px', background:'#1a1505', border:`1px solid #2e2a1a`, borderRadius:7, color:'#b8860b', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>
                  Edit
                </button>
                <button onClick={() => del(p._id)}
                  style={{ padding:'6px 12px', background:'#2a0a0a', border:'1px solid #3a1a1a', borderRadius:7, color:'#f87171', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>
                  Del
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
