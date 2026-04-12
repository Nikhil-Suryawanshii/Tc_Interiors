// PATH: frontend/src/pages/admin/AdminExperience.jsx
import { useState } from 'react';
import { experienceAPI } from '@services/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const S = { background:'#1a1505', border:'1px solid #2e2a1a', borderRadius:8, padding:'9px 12px', color:'#e8d5a0', fontSize:14, outline:'none', fontFamily:'inherit', width:'100%', boxSizing:'border-box' };
const fo = e => e.target.style.borderColor = '#b8860b';
const fb = e => e.target.style.borderColor = '#2e2a1a';
const EMPTY = { role:'', company:'', period:'', location:'', description:'', highlights:'' };

const useAdminExperience = () => useQuery({
  queryKey: ['admin-experience'],
  queryFn: () => experienceAPI.getAll().then(r => r.data?.data || r.data || []),
});

export default function AdminExperience() {
  const qc = useQueryClient();
  const { data: items = [], isLoading } = useAdminExperience();
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const inp = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const openNew = () => { setForm(EMPTY); setEditing(null); setShowForm(true); };
  const openEdit = (item) => {
    setForm({ ...EMPTY, ...item, highlights: Array.isArray(item.highlights) ? item.highlights.join('\n') : (item.highlights || '') });
    setEditing(item._id); setShowForm(true);
  };
  const cancel = () => { setShowForm(false); setEditing(null); setForm(EMPTY); };

  const save = async () => {
    if (!form.role.trim()) { toast.error('Role is required'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        highlights: form.highlights ? form.highlights.split('\n').map(s => s.trim()).filter(Boolean) : [],
      };
      if (editing) await experienceAPI.update(editing, payload);
      else await experienceAPI.create(payload);
      toast.success(editing ? 'Experience updated' : 'Experience added');
      qc.invalidateQueries({ queryKey: ['admin-experience'] });
      cancel();
    } catch (e) { toast.error(e?.response?.data?.message || 'Save failed'); }
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm('Delete this entry?')) return;
    try {
      await experienceAPI.delete(id);
      toast.success('Deleted');
      qc.invalidateQueries({ queryKey: ['admin-experience'] });
    } catch { toast.error('Delete failed'); }
  };

  const card = { background:'#0f0f1a', border:'1px solid #1e1e2e', borderRadius:14, padding:'20px 22px' };
  const GOLD = '#b8860b';

  return (
    <div style={{ color:'#e8d5a0', fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&display=swap');`}</style>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <div style={{ fontFamily:'Syne,sans-serif', fontSize:24, fontWeight:800, letterSpacing:'-0.5px' }}>Experience</div>
          <div style={{ fontSize:13, color:'#4a4a2a', marginTop:3 }}>{items.length} experience entr{items.length !== 1 ? 'ies' : 'y'}</div>
        </div>
        <button onClick={openNew}
          style={{ padding:'10px 20px', background:`linear-gradient(135deg,${GOLD},#8b6914)`, border:'none', borderRadius:10, color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
          + Add Experience
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ ...card, marginBottom:24, border:`1px solid ${GOLD}40` }}>
          <div style={{ fontSize:14, fontWeight:700, color:GOLD, marginBottom:16 }}>{editing ? 'Edit Entry' : 'New Entry'}</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
            <div>
              <label style={{ fontSize:11, color:'#6a6a2a', display:'block', marginBottom:4 }}>Role / Title *</label>
              <input style={S} value={form.role} onFocus={fo} onBlur={fb} onChange={e => inp('role', e.target.value)} placeholder="e.g. Lead Interior Designer" />
            </div>
            <div>
              <label style={{ fontSize:11, color:'#6a6a2a', display:'block', marginBottom:4 }}>Company / Organisation</label>
              <input style={S} value={form.company} onFocus={fo} onBlur={fb} onChange={e => inp('company', e.target.value)} placeholder="e.g. TC Interior" />
            </div>
            <div>
              <label style={{ fontSize:11, color:'#6a6a2a', display:'block', marginBottom:4 }}>Period</label>
              <input style={S} value={form.period} onFocus={fo} onBlur={fb} onChange={e => inp('period', e.target.value)} placeholder="e.g. 2020 – Present" />
            </div>
            <div>
              <label style={{ fontSize:11, color:'#6a6a2a', display:'block', marginBottom:4 }}>Location</label>
              <input style={S} value={form.location} onFocus={fo} onBlur={fb} onChange={e => inp('location', e.target.value)} placeholder="e.g. Nagpur, Maharashtra" />
            </div>
          </div>
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:11, color:'#6a6a2a', display:'block', marginBottom:4 }}>Description</label>
            <textarea style={{ ...S, minHeight:80, resize:'vertical' }} value={form.description} onFocus={fo} onBlur={fb}
              onChange={e => inp('description', e.target.value)} placeholder="What did you do in this role?" />
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:11, color:'#6a6a2a', display:'block', marginBottom:4 }}>Key Highlights (one per line)</label>
            <textarea style={{ ...S, minHeight:80, resize:'vertical' }} value={form.highlights} onFocus={fo} onBlur={fb}
              onChange={e => inp('highlights', e.target.value)} placeholder={'50+ projects completed\nManaged team of 10\nWon Best Design 2023'} />
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={save} disabled={saving}
              style={{ padding:'9px 22px', background:`linear-gradient(135deg,${GOLD},#8b6914)`, border:'none', borderRadius:8, color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'inherit', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Saving…' : editing ? 'Update' : 'Add Entry'}
            </button>
            <button onClick={cancel}
              style={{ padding:'9px 18px', background:'transparent', border:'1px solid #2e2a1a', borderRadius:8, color:'#8a8a6a', fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div style={{ display:'grid', gap:10 }}>
          {[1,2,3].map(i => <div key={i} style={{ height:80, background:'#0f0f1a', borderRadius:12, opacity:0.4 }} />)}
        </div>
      ) : items.length === 0 ? (
        <div style={{ ...card, textAlign:'center', padding:'48px 24px' }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🏢</div>
          <div style={{ fontSize:14, color:'#4a4a2a' }}>No experience entries yet</div>
          <button onClick={openNew} style={{ marginTop:16, padding:'8px 20px', background:GOLD, border:'none', borderRadius:8, color:'#fff', fontWeight:600, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
            Add First Entry
          </button>
        </div>
      ) : (
        <div style={{ display:'grid', gap:12 }}>
          {items.map((item, idx) => (
            <div key={item._id} style={{ ...card }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                    <span style={{ fontSize:14, fontWeight:700, color:'#e8d5a0' }}>{item.role}</span>
                    {item.period && (
                      <span style={{ fontSize:11, padding:'2px 8px', background:'#1a1505', border:`1px solid ${GOLD}40`, borderRadius:6, color:GOLD }}>{item.period}</span>
                    )}
                  </div>
                  {item.company && <div style={{ fontSize:13, color:GOLD, marginBottom:2 }}>{item.company}</div>}
                  {item.location && <div style={{ fontSize:11, color:'#4a4a2a', marginBottom:6 }}>📍 {item.location}</div>}
                  {item.description && <div style={{ fontSize:12, color:'#6a6a4a', lineHeight:1.6 }}>{item.description}</div>}
                  {Array.isArray(item.highlights) && item.highlights.length > 0 && (
                    <ul style={{ marginTop:8, paddingLeft:0, listStyle:'none', display:'flex', flexWrap:'wrap', gap:6 }}>
                      {item.highlights.map((h, i) => (
                        <li key={i} style={{ fontSize:11, color:'#6a6a4a', background:'#1a1505', padding:'3px 10px', borderRadius:6 }}>• {h}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                  <button onClick={() => openEdit(item)}
                    style={{ padding:'6px 14px', background:'#1a1505', border:`1px solid #2e2a1a`, borderRadius:7, color:GOLD, fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>
                    Edit
                  </button>
                  <button onClick={() => del(item._id)}
                    style={{ padding:'6px 12px', background:'#2a0a0a', border:'1px solid #3a1a1a', borderRadius:7, color:'#f87171', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>
                    Del
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
