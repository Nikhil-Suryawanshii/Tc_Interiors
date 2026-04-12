// PATH: frontend/src/pages/admin/AdminSkills.jsx
import { useState } from 'react';
import { skillsAPI } from '@services/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const S = { background:'#1a1505', border:'1px solid #2e2a1a', borderRadius:8, padding:'9px 12px', color:'#e8d5a0', fontSize:14, outline:'none', fontFamily:'inherit', width:'100%', boxSizing:'border-box' };
const fo = e => e.target.style.borderColor = '#b8860b';
const fb = e => e.target.style.borderColor = '#2e2a1a';
const EMPTY = { name:'', category:'', level:80, icon:'', visible:true };
const CATS = ['Design','Materials','Tools','Software','Consultation','Management','Other'];

const useAdminSkills = () => useQuery({
  queryKey: ['admin-skills'],
  queryFn: () => skillsAPI.getAll().then(r => r.data?.data || r.data || []),
});

export default function AdminSkills() {
  const qc = useQueryClient();
  const { data: skills = [], isLoading } = useAdminSkills();
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const inp = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const openNew = () => { setForm(EMPTY); setEditing(null); setShowForm(true); };
  const openEdit = (s) => { setForm({ ...EMPTY, ...s }); setEditing(s._id); setShowForm(true); };
  const cancel = () => { setShowForm(false); setEditing(null); setForm(EMPTY); };

  const save = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      if (editing) await skillsAPI.update(editing, form);
      else await skillsAPI.create(form);
      toast.success(editing ? 'Skill updated' : 'Skill added');
      qc.invalidateQueries({ queryKey: ['admin-skills'] });
      cancel();
    } catch (e) { toast.error(e?.response?.data?.message || 'Save failed'); }
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm('Delete this skill?')) return;
    try {
      await skillsAPI.delete(id);
      toast.success('Deleted');
      qc.invalidateQueries({ queryKey: ['admin-skills'] });
    } catch { toast.error('Delete failed'); }
  };

  const card = { background:'#0f0f1a', border:'1px solid #1e1e2e', borderRadius:14, padding:'20px 22px' };
  const GOLD = '#b8860b';

  // Group by category
  const grouped = skills.reduce((acc, s) => {
    const cat = s.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div style={{ color:'#e8d5a0', fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&display=swap');`}</style>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <div style={{ fontFamily:'Syne,sans-serif', fontSize:24, fontWeight:800, letterSpacing:'-0.5px' }}>Skills</div>
          <div style={{ fontSize:13, color:'#4a4a2a', marginTop:3 }}>{skills.length} skill{skills.length !== 1 ? 's' : ''} across {Object.keys(grouped).length} categories</div>
        </div>
        <button onClick={openNew}
          style={{ padding:'10px 20px', background:`linear-gradient(135deg,${GOLD},#8b6914)`, border:'none', borderRadius:10, color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
          + Add Skill
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ ...card, marginBottom:24, border:`1px solid ${GOLD}40` }}>
          <div style={{ fontSize:14, fontWeight:700, color:GOLD, marginBottom:16 }}>{editing ? 'Edit Skill' : 'New Skill'}</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
            <div>
              <label style={{ fontSize:11, color:'#6a6a2a', display:'block', marginBottom:4 }}>Skill Name *</label>
              <input style={S} value={form.name} onFocus={fo} onBlur={fb} onChange={e => inp('name', e.target.value)} placeholder="e.g. AutoCAD" />
            </div>
            <div>
              <label style={{ fontSize:11, color:'#6a6a2a', display:'block', marginBottom:4 }}>Category</label>
              <select style={{ ...S, cursor:'pointer' }} value={form.category} onFocus={fo} onBlur={fb} onChange={e => inp('category', e.target.value)}>
                <option value="">Select category</option>
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:11, color:'#6a6a2a', display:'block', marginBottom:4 }}>Icon / Emoji</label>
              <input style={S} value={form.icon} onFocus={fo} onBlur={fb} onChange={e => inp('icon', e.target.value)} placeholder="🎨 or URL" />
            </div>
            <div>
              <label style={{ fontSize:11, color:'#6a6a2a', display:'block', marginBottom:4 }}>Proficiency: {form.level}%</label>
              <input type="range" min="10" max="100" step="5" value={form.level}
                onChange={e => inp('level', Number(e.target.value))}
                style={{ width:'100%', accentColor: GOLD, marginTop:4 }} />
            </div>
          </div>
          <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'#8a8a6a', cursor:'pointer', marginBottom:14 }}>
            <input type="checkbox" checked={form.visible} onChange={e => inp('visible', e.target.checked)} /> Visible on site
          </label>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={save} disabled={saving}
              style={{ padding:'9px 22px', background:`linear-gradient(135deg,${GOLD},#8b6914)`, border:'none', borderRadius:8, color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'inherit', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Saving…' : editing ? 'Update' : 'Add Skill'}
            </button>
            <button onClick={cancel}
              style={{ padding:'9px 18px', background:'transparent', border:'1px solid #2e2a1a', borderRadius:8, color:'#8a8a6a', fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Skills grouped by category */}
      {isLoading ? (
        <div style={{ display:'grid', gap:10 }}>
          {[1,2,3].map(i => <div key={i} style={{ height:60, background:'#0f0f1a', borderRadius:12, opacity:0.4 }} />)}
        </div>
      ) : skills.length === 0 ? (
        <div style={{ ...card, textAlign:'center', padding:'48px 24px' }}>
          <div style={{ fontSize:40, marginBottom:12 }}>⚡</div>
          <div style={{ fontSize:14, color:'#4a4a2a' }}>No skills yet</div>
          <button onClick={openNew} style={{ marginTop:16, padding:'8px 20px', background:GOLD, border:'none', borderRadius:8, color:'#fff', fontWeight:600, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
            Add First Skill
          </button>
        </div>
      ) : (
        Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, textTransform:'uppercase', letterSpacing:'2px', color:'#4a4a2a', marginBottom:10 }}>{cat}</div>
            <div style={{ display:'grid', gap:8 }}>
              {items.map(s => (
                <div key={s._id} style={{ ...card, display:'flex', alignItems:'center', gap:14, padding:'14px 18px' }}>
                  {s.icon && <span style={{ fontSize:20, flexShrink:0 }}>{s.icon}</span>}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:'#e8d5a0', marginBottom:4 }}>{s.name}</div>
                    <div style={{ height:4, background:'#1a1505', borderRadius:2, overflow:'hidden' }}>
                      <div style={{ height:4, borderRadius:2, background:`linear-gradient(90deg,${GOLD},#8b6914)`, width:`${s.level || 80}%`, transition:'width 0.4s' }} />
                    </div>
                  </div>
                  <span style={{ fontSize:12, color:GOLD, fontWeight:700, minWidth:36, textAlign:'right' }}>{s.level || 80}%</span>
                  <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                    <button onClick={() => openEdit(s)}
                      style={{ padding:'5px 12px', background:'#1a1505', border:`1px solid #2e2a1a`, borderRadius:7, color:GOLD, fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>
                      Edit
                    </button>
                    <button onClick={() => del(s._id)}
                      style={{ padding:'5px 10px', background:'#2a0a0a', border:'1px solid #3a1a1a', borderRadius:7, color:'#f87171', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>
                      Del
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
