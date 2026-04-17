import React, { useState, useEffect } from 'react';
import { getConsultations, updateConsultation } from '../utils/api';
import toast from 'react-hot-toast';

const STATUSES = ['New','Contacted','Scheduled','Completed','Cancelled'];

const AdminConsultations = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => { getConsultations().then(r=>setItems(r.data)).catch(()=>{}).finally(()=>setLoading(false)); };
  useEffect(load,[]);

  const changeStatus = async (id, status) => {
    try { await updateConsultation(id, {status}); toast.success('Updated'); load(); } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="admin-page-header"><div><h1>Consultations</h1><p>{items.filter(i=>i.status==='New').length} new requests</p></div></div>
      <div className="admin-card">
        {loading ? <div className="loading-center"><div className="spinner"/></div> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Contact</th><th>Service</th><th>Budget</th><th>Location</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {items.map(c=>(
                  <tr key={c._id}>
                    <td style={{fontWeight:500}}>{c.name}</td>
                    <td><div>{c.email}</div><div style={{fontSize:'0.75rem',color:'#8c7860'}}>{c.phone}</div></td>
                    <td style={{fontSize:'0.8rem'}}>{c.serviceType||'—'}</td>
                    <td style={{fontSize:'0.8rem'}}>{c.budget||'—'}</td>
                    <td style={{fontSize:'0.8rem'}}>{c.location||'—'}</td>
                    <td>
                      <select value={c.status} onChange={e=>changeStatus(c._id,e.target.value)}
                        style={{border:'1px solid #e0d4c0',padding:'0.3rem 0.5rem',fontFamily:'Jost,sans-serif',fontSize:'0.78rem',background:'#f5f0e8',outline:'none'}}>
                        {STATUSES.map(s=><option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td style={{fontSize:'0.8rem',color:'#8c7860'}}>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
                {items.length===0&&<tr><td colSpan={7} style={{textAlign:'center',color:'#8c7860',padding:'2rem'}}>No consultations yet</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminConsultations;
