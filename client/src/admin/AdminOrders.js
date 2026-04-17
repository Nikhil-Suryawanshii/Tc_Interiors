import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../utils/api';
import toast from 'react-hot-toast';
import { FiSearch } from 'react-icons/fi';

const STATUSES = ['Placed','Confirmed','Processing','Shipped','Delivered','Cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  const load = () => { setLoading(true); getAllOrders({ status: filter||undefined }).then(r=>setOrders(r.data.orders)).catch(()=>{}).finally(()=>setLoading(false)); };
  useEffect(load, [filter]);

  const changeStatus = async (id, status) => {
    try { await updateOrderStatus(id, status); toast.success('Status updated'); load(); }
    catch { toast.error('Failed'); }
  };

  const filtered = orders.filter(o => !search || o.orderNumber?.includes(search) || o.user?.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="admin-page-header"><div><h1>Orders</h1><p>{orders.length} orders</p></div></div>
      <div className="admin-card">
        <div style={{display:'flex',gap:'1rem',marginBottom:'1rem',flexWrap:'wrap',alignItems:'center'}}>
          <div className="admin-search"><FiSearch size={14} color="#8c7860"/><input placeholder="Search by order # or customer..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
          <select value={filter} onChange={e=>setFilter(e.target.value)} style={{border:'1px solid #e0d4c0',padding:'0.5rem 0.875rem',fontFamily:'Jost,sans-serif',fontSize:'0.85rem',background:'#f5f0e8',color:'#1a1208',outline:'none'}}>
            <option value="">All Statuses</option>
            {STATUSES.map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
        {loading ? <div className="loading-center"><div className="spinner"/></div> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
              <tbody>
                {filtered.map(o=>(
                  <tr key={o._id}>
                    <td style={{fontWeight:500}}>#{o.orderNumber?.slice(-8)}</td>
                    <td><div style={{fontWeight:500}}>{o.user?.name||'—'}</div><div style={{fontSize:'0.75rem',color:'#8c7860'}}>{o.user?.email}</div></td>
                    <td>{o.items?.length} item{o.items?.length!==1?'s':''}</td>
                    <td style={{fontWeight:500}}>₹{o.totalPrice?.toLocaleString()}</td>
                    <td><span className={`badge-admin badge-${o.paymentStatus?.toLowerCase()}`}>{o.paymentStatus}</span></td>
                    <td>
                      <select value={o.orderStatus} onChange={e=>changeStatus(o._id,e.target.value)}
                        style={{border:'1px solid #e0d4c0',padding:'0.3rem 0.5rem',fontFamily:'Jost,sans-serif',fontSize:'0.78rem',background:'#f5f0e8',color:'#1a1208',outline:'none'}}>
                        {STATUSES.map(s=><option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td style={{fontSize:'0.8rem',color:'#8c7860'}}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                    <td><a href={`/profile`} className="btn-admin btn-admin-outline btn-admin-sm">View</a></td>
                  </tr>
                ))}
                {filtered.length===0&&<tr><td colSpan={8} style={{textAlign:'center',color:'#8c7860',padding:'2rem'}}>No orders found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminOrders;
