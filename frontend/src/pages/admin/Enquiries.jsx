import { useState } from 'react';
import { enquiriesAPI } from '@services/api';
import { useEnquiries } from '@hooks/useQueries';
import toast from 'react-hot-toast';

const STATUS = { new:{ color:'#f59e0b', bg:'#1a1505' }, read:{ color:'#60a5fa', bg:'#050d1a' }, replied:{ color:'#10b981', bg:'#051a10' }, closed:{ color:'#6b7280', bg:'#111' } };
const fmtDate = d => d ? new Date(d).toLocaleString('en-US',{ month:'short', day:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '';

export default function AdminEnquiries() {
  const [filter, setFilter] = useState('all');
  const [page, setPage]     = useState(1);
  const [expanded, setExp]  = useState(null);
  const [actioning, setAct] = useState(null);
  const { data:res={}, refetch } = useEnquiries(filter!=='all'?{ status:filter, page, limit:20 }:{ page, limit:20 });
  const enquiries  = res.data || [];
  const pagination = res.pagination || {};

  const updateStatus = async (id, status) => {
    setAct(id); try { await enquiriesAPI.updateStatus(id,{ status }); toast.success(`Marked ${status}`); refetch(); } catch { toast.error('Failed'); } setAct(null);
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    setAct(id); try { await enquiriesAPI.delete(id); toast.success('Deleted'); refetch(); } catch { toast.error('Failed'); } setAct(null);
  };
  const newCount = enquiries.filter(e=>e.status==='new').length;

  return (
    <div style={{ color:'#e8d5a0', fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <div style={{ fontSize:24, fontWeight:800, fontFamily:'serif', color:'#b8860b' }}>Enquiries {newCount>0&&<span style={{ fontSize:13, background:'rgba(184,134,11,0.15)', color:'#b8860b', border:'1px solid rgba(184,134,11,0.3)', borderRadius:20, padding:'2px 10px', marginLeft:8 }}>{newCount} new</span>}</div>
          <div style={{ fontSize:13, color:'#5a4a2a', marginTop:2 }}>Product enquiries and cart requests</div>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:6, marginBottom:20, flexWrap:'wrap' }}>
        {['all','new','read','replied','closed'].map(f=>(
          <button key={f} onClick={()=>{ setFilter(f); setPage(1); }}
            style={{ padding:'6px 16px', borderRadius:8, fontSize:13, fontWeight:500, cursor:'pointer', fontFamily:'inherit', border:filter===f?'none':'1px solid #2e2a1a', background:filter===f?'linear-gradient(135deg,#b8860b,#8b6914)':'#0f0d08', color:filter===f?'#fff':'#8a7a5a', textTransform:'capitalize' }}>
            {f}
          </button>
        ))}
      </div>

      {enquiries.length===0 ? (
        <div style={{ textAlign:'center', padding:'60px 20px', color:'#5a4a2a' }}>
          <div style={{ fontSize:40, marginBottom:12 }}>📬</div>
          <div style={{ fontSize:15, color:'#8a7a5a' }}>No {filter!=='all'?filter:''} enquiries yet.</div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {enquiries.map(enq=>{
            const s = STATUS[enq.status]||STATUS.new;
            const isExp = expanded===enq._id;
            return (
              <div key={enq._id} style={{ background:'#0f0d08', border:'1px solid #1e1a0e', borderLeft:`3px solid ${s.color}`, borderRadius:14, overflow:'hidden' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr auto auto', gap:12, padding:'14px 18px', alignItems:'center', cursor:'pointer' }}
                  onClick={()=>setExp(isExp?null:enq._id)}>
                  <div style={{ minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom:3 }}>
                      <span style={{ fontWeight:600, fontSize:14, color:'#e8d5a0' }}>{enq.name}</span>
                      <span style={{ fontSize:11, color:s.color, background:s.bg, border:`1px solid ${s.color}40`, borderRadius:20, padding:'1px 8px', textTransform:'capitalize' }}>{enq.status}</span>
                      <span style={{ fontSize:11, color:'#8a7a5a', background:'#1a1505', border:'1px solid #2e2a1a', borderRadius:20, padding:'1px 8px', textTransform:'capitalize' }}>{enq.type}</span>
                    </div>
                    <div style={{ fontSize:12, color:'#5a4a2a' }}>{enq.email}{enq.phone?` · ${enq.phone}`:''} · {fmtDate(enq.createdAt)}</div>
                    {!isExp && <div style={{ fontSize:13, color:'#8a7a5a', marginTop:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{enq.message}</div>}
                  </div>
                  <span style={{ color:'#5a4a2a', fontSize:18 }}>{isExp?'▲':'▼'}</span>
                </div>
                {isExp && (
                  <div style={{ padding:'0 18px 16px', borderTop:'1px solid #1e1a0e' }}>
                    <div style={{ marginTop:14, fontSize:14, color:'#c4a84a', background:'#13110a', borderRadius:8, padding:'10px 14px', lineHeight:1.7, borderLeft:'2px solid #2e2a1a', marginBottom:12 }}>{enq.message}</div>
                    {enq.productName && <div style={{ fontSize:12, color:'#8a7a5a', marginBottom:8 }}>📦 Product: <span style={{ color:'#b8860b' }}>{enq.productName}</span></div>}
                    {enq.cartItems?.length>0 && (
                      <div style={{ fontSize:12, marginBottom:12 }}>
                        <div style={{ color:'#8a7a5a', marginBottom:6 }}>🛒 Cart Items:</div>
                        {enq.cartItems.map((ci,i)=>(
                          <div key={i} style={{ color:'#c4a84a', marginLeft:12 }}>• {ci.productName} ×{ci.quantity}</div>
                        ))}
                      </div>
                    )}
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      {enq.status!=='read'    && <button onClick={()=>updateStatus(enq._id,'read')}    disabled={!!actioning} style={{ padding:'5px 14px', borderRadius:7, fontSize:12, border:'none', cursor:'pointer', background:'#050d1a', color:'#60a5fa', fontFamily:'inherit', fontWeight:600 }}>Mark Read</button>}
                      {enq.status!=='replied' && <button onClick={()=>updateStatus(enq._id,'replied')} disabled={!!actioning} style={{ padding:'5px 14px', borderRadius:7, fontSize:12, border:'none', cursor:'pointer', background:'#051a10', color:'#10b981', fontFamily:'inherit', fontWeight:600 }}>Mark Replied</button>}
                      {enq.status!=='closed'  && <button onClick={()=>updateStatus(enq._id,'closed')}  disabled={!!actioning} style={{ padding:'5px 14px', borderRadius:7, fontSize:12, border:'none', cursor:'pointer', background:'#111', color:'#6b7280', fontFamily:'inherit', fontWeight:600 }}>Close</button>}
                      <a href={`mailto:${enq.email}`} style={{ padding:'5px 14px', borderRadius:7, fontSize:12, border:'1px solid #2e2a1a', background:'#1a1505', color:'#b8860b', textDecoration:'none', fontWeight:600 }}>Reply by Email</a>
                      <button onClick={()=>handleDelete(enq._id)} disabled={!!actioning} style={{ marginLeft:'auto', padding:'5px 14px', borderRadius:7, fontSize:12, border:'none', cursor:'pointer', background:'#1f1510', color:'#f87171', fontFamily:'inherit' }}>Delete</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {pagination.pages>1 && (
        <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:8, marginTop:20 }}>
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{ padding:'6px 14px', borderRadius:8, fontSize:13, border:'1px solid #2e2a1a', background:'#0f0d08', color:page===1?'#3a3020':'#b8860b', cursor:page===1?'not-allowed':'pointer', fontFamily:'inherit' }}>← Prev</button>
          <span style={{ fontSize:13, color:'#8a7a5a' }}>Page {page} of {pagination.pages}</span>
          <button onClick={()=>setPage(p=>Math.min(pagination.pages,p+1))} disabled={page===pagination.pages} style={{ padding:'6px 14px', borderRadius:8, fontSize:13, border:'1px solid #2e2a1a', background:'#0f0d08', color:page===pagination.pages?'#3a3020':'#b8860b', cursor:page===pagination.pages?'not-allowed':'pointer', fontFamily:'inherit' }}>Next →</button>
        </div>
      )}
    </div>
  );
}
