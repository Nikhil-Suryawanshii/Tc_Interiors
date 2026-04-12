// TC Interior Admin — Products
import { useState, useRef } from 'react';
import { productsAPI, categoriesAPI } from '@services/api';
import { useAdminProducts, useAdminCategories, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@hooks/useQueries';
import toast from 'react-hot-toast';

const S = { background:'#1a1505', border:'1px solid #2e2a1a', borderRadius:8, padding:'9px 12px', color:'#e8d5a0', fontSize:14, outline:'none', fontFamily:'inherit', width:'100%', boxSizing:'border-box' };
const fo = e=>e.target.style.borderColor='#b8860b';
const fb = e=>e.target.style.borderColor='#2e2a1a';
const EMPTY = { name:'', category:'', subcategory:'', price:0, priceUnit:'piece', priceOnRequest:false, shortDesc:'', description:'', materials:'', colors:'', finishes:'', features:'', inStock:true, featured:false, isNew:false, isBestseller:false, visible:true };

export default function AdminProducts() {
  const { data:products=[], refetch } = useAdminProducts();
  const { data:categories=[] }        = useAdminCategories();
  const createP  = useCreateProduct();
  const updateP  = useUpdateProduct();
  const deleteP  = useDeleteProduct();
  const [form, setForm]   = useState(EMPTY);
  const [editId, setEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(null);
  const fileRefs = useRef({});

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    const payload = {
      ...form,
      materials: form.materials ? form.materials.split(',').map(s=>s.trim()).filter(Boolean) : [],
      colors:    form.colors    ? form.colors.split(',').map(s=>s.trim()).filter(Boolean)    : [],
      finishes:  form.finishes  ? form.finishes.split(',').map(s=>s.trim()).filter(Boolean)  : [],
      features:  form.features  ? form.features.split('\n').map(s=>s.trim()).filter(Boolean) : [],
    };
    try {
      if (editId) { await updateP.mutateAsync({ id:editId, data:payload }); toast.success('Product updated!'); }
      else        { await createP.mutateAsync(payload);                      toast.success('Product created!'); }
      setForm(EMPTY); setEdit(null); setShowForm(false);
    } catch(err) { toast.error(err.response?.data?.error||'Error'); }
    setSaving(false);
  };

  const handleEdit = (p) => {
    setForm({ ...p, category:p.category?._id||p.category, materials:(p.materials||[]).join(', '), colors:(p.colors||[]).join(', '), finishes:(p.finishes||[]).join(', '), features:(p.features||[]).join('\n') });
    setEdit(p._id); setShowForm(true); window.scrollTo({top:0,behavior:'smooth'});
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await deleteP.mutateAsync(id); toast.success('Deleted!'); } catch { toast.error('Failed'); }
  };

  const handleImageUpload = async (productId, file) => {
    if (!file) return; setUploading(productId);
    try {
      const fd = new FormData(); fd.append('image', file);
      await productsAPI.addImage(productId, fd);
      refetch(); toast.success('Image uploaded!');
    } catch { toast.error('Upload failed'); }
    setUploading(null);
  };

  const handleImageDelete = async (productId, publicId) => {
    if (!window.confirm('Delete this image?')) return;
    try { await productsAPI.removeImage(productId, publicId); refetch(); toast.success('Image removed'); }
    catch { toast.error('Failed'); }
  };

  const inp = (label, key, type='text', opts={}) => (
    <div>
      <label style={{ fontSize:12, color:'#8a7a5a', display:'block', marginBottom:5, textTransform:'uppercase', letterSpacing:'1px' }}>{label}</label>
      {opts.textarea
        ? <textarea className="sk-inp" style={{...S,resize:'vertical',lineHeight:1.6,minHeight:80}} rows={opts.rows||3} value={form[key]||''} onChange={e=>set(key,e.target.value)} placeholder={opts.placeholder||''} onFocus={fo} onBlur={fb}/>
        : <input className="sk-inp" type={type} style={S} value={form[key]||''} onChange={e=>set(key,type==='number'?Number(e.target.value):e.target.value)} placeholder={opts.placeholder||''} onFocus={fo} onBlur={fb}/>
      }
    </div>
  );

  return (
    <div style={{ color:'#e8d5a0', fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`.sk-inp:focus{border-color:#b8860b!important}`}</style>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <div style={{ fontSize:24, fontWeight:800, fontFamily:'serif', color:'#b8860b' }}>Products</div>
          <div style={{ fontSize:13, color:'#5a4a2a', marginTop:2 }}>Manage your product catalogue</div>
        </div>
        <button onClick={()=>{ setForm(EMPTY); setEdit(null); setShowForm(!showForm); }}
          style={{ background:'linear-gradient(135deg,#b8860b,#8b6914)', border:'none', color:'#fff', padding:'10px 20px', borderRadius:10, cursor:'pointer', fontWeight:600, fontFamily:'inherit' }}>
          {showForm&&!editId?'✕ Cancel':'+ Add Product'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background:'#0f0d08', border:'1px solid #2e2a1a', borderRadius:14, padding:24, marginBottom:24 }}>
          <div style={{ fontSize:11, textTransform:'uppercase', letterSpacing:'2px', color:'#5a4a2a', marginBottom:18 }}>{editId?'Edit Product':'New Product'}</div>
          <form onSubmit={handleSubmit}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              {inp('Product Name *','name')}
              <div>
                <label style={{ fontSize:12, color:'#8a7a5a', display:'block', marginBottom:5, textTransform:'uppercase', letterSpacing:'1px' }}>Category *</label>
                <select className="sk-inp" style={{...S,cursor:'pointer'}} value={form.category||''} onChange={e=>set('category',e.target.value)} onFocus={fo} onBlur={fb} required>
                  <option value="">Select Category</option>
                  {categories.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              {inp('Subcategory','subcategory',undefined,{placeholder:'e.g. Sofas, Dining Tables'})}
              {inp('Short Description','shortDesc',undefined,{placeholder:'One-line summary (shown on cards)'})}
              <div>
                <label style={{ fontSize:12, color:'#8a7a5a', display:'block', marginBottom:5, textTransform:'uppercase', letterSpacing:'1px' }}>Price</label>
                <div style={{ display:'flex', gap:8 }}>
                  <input type="number" className="sk-inp" style={{...S,flex:1}} value={form.price||0} onChange={e=>set('price',Number(e.target.value))} onFocus={fo} onBlur={fb}/>
                  <select className="sk-inp" style={{...S,width:90,cursor:'pointer'}} value={form.priceUnit||'piece'} onChange={e=>set('priceUnit',e.target.value)} onFocus={fo} onBlur={fb}>
                    {['piece','sqft','meter','set','pair','unit'].map(u=><option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10, justifyContent:'flex-end' }}>
                {[['priceOnRequest','Price on Request'],['inStock','In Stock'],['featured','Featured'],['isNew','New Arrival'],['isBestseller','Bestseller'],['visible','Visible']].map(([k,l])=>(
                  <label key={k} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                    <input type="checkbox" checked={!!form[k]} onChange={e=>set(k,e.target.checked)} style={{ accentColor:'#b8860b', width:15, height:15 }}/> <span style={{ fontSize:13, color:'#8a7a5a' }}>{l}</span>
                  </label>
                ))}
              </div>
              {inp('Materials (comma separated)','materials',undefined,{placeholder:'Wood, Metal, Fabric'})}
              {inp('Colors (comma separated)','colors',undefined,{placeholder:'Walnut, Ivory, Navy'})}
              {inp('Finishes (comma separated)','finishes',undefined,{placeholder:'Matte, Gloss, Natural'})}
              <div style={{ gridColumn:'1/-1' }}>{inp('Full Description','description',undefined,{textarea:true,rows:4})}</div>
              <div style={{ gridColumn:'1/-1' }}>{inp('Key Features (one per line)','features',undefined,{textarea:true,rows:4,placeholder:'Feature 1\nFeature 2\nFeature 3'})}</div>
            </div>
            <div style={{ display:'flex', gap:10, marginTop:18 }}>
              <button type="submit" disabled={saving} style={{ background:saving?'#2e2a1a':'linear-gradient(135deg,#b8860b,#8b6914)', border:'none', color:'#fff', padding:'10px 24px', borderRadius:10, cursor:saving?'not-allowed':'pointer', fontWeight:600, fontFamily:'inherit' }}>
                {saving?'Saving...':editId?'Update':'Create'}
              </button>
              <button type="button" onClick={()=>{ setShowForm(false); setEdit(null); setForm(EMPTY); }}
                style={{ background:'#1a1505', border:'1px solid #2e2a1a', color:'#8a7a5a', padding:'10px 24px', borderRadius:10, cursor:'pointer', fontFamily:'inherit' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Products grid */}
      {products.length===0 ? (
        <div style={{ textAlign:'center', padding:'60px 20px', color:'#5a4a2a' }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🪑</div>
          <div style={{ fontSize:15, color:'#8a7a5a' }}>No products yet. Add your first product!</div>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
          {products.map(p=>{
            const img = p.images?.find(i=>i.isPrimary)||p.images?.[0];
            return (
              <div key={p._id} style={{ background:'#0f0d08', border:'1px solid #1e1a0e', borderRadius:14, overflow:'hidden' }}
                onMouseEnter={e=>e.currentTarget.style.borderColor='#2e2a1a'}
                onMouseLeave={e=>e.currentTarget.style.borderColor='#1e1a0e'}>
                {/* Image */}
                <div style={{ position:'relative', aspectRatio:'4/3', background:'#151205', overflow:'hidden' }}>
                  {img?.url
                    ? <img src={img.url} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                    : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:48 }}>🪑</div>
                  }
                  {!p.visible && <div style={{ position:'absolute', top:8, right:8, background:'#1f1510', color:'#f87171', fontSize:10, padding:'2px 8px', borderRadius:20, fontWeight:600 }}>Hidden</div>}
                  {p.featured && <div style={{ position:'absolute', top:8, left:8, background:'rgba(184,134,11,0.2)', color:'#b8860b', fontSize:10, padding:'2px 8px', borderRadius:20, fontWeight:600 }}>★ Featured</div>}
                </div>

                <div style={{ padding:16 }}>
                  <div style={{ fontSize:11, color:'#b8860b', marginBottom:3, textTransform:'uppercase', letterSpacing:'0.5px' }}>{p.category?.name}</div>
                  <div style={{ fontWeight:600, fontSize:15, color:'#e8d5a0', marginBottom:4 }}>{p.name}</div>
                  <div style={{ fontSize:13, color:'#8a7a5a', marginBottom:12 }}>
                    {p.priceOnRequest?'Price on Request':p.price>0?`₹${p.price.toLocaleString()}/${p.priceUnit}`:'No price set'}
                  </div>

                  {/* Image upload row */}
                  <div style={{ marginBottom:12 }}>
                    <div style={{ fontSize:11, color:'#5a4a2a', marginBottom:6 }}>Images ({p.images?.length||0})</div>
                    <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:6 }}>
                      {(p.images||[]).map((img,i)=>(
                        <div key={i} style={{ position:'relative', width:48, height:48 }}>
                          <img src={img.url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:6, border:img.isPrimary?'2px solid #b8860b':'2px solid #2e2a1a' }}/>
                          <button onClick={()=>handleImageDelete(p._id,img.publicId)} style={{ position:'absolute', top:-6, right:-6, width:16, height:16, borderRadius:'50%', background:'#f87171', border:'none', color:'#fff', fontSize:9, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
                        </div>
                      ))}
                    </div>
                    <input id={`img-${p._id}`} type="file" accept="image/*" style={{ display:'none' }}
                      ref={el=>fileRefs.current[p._id]=el}
                      onChange={e=>{ const f=e.target.files[0]; if(f) handleImageUpload(p._id,f); e.target.value=''; }}/>
                    <label htmlFor={`img-${p._id}`} style={{ display:'inline-block', padding:'4px 12px', background:'#1a1505', border:'1px dashed #2e2a1a', borderRadius:7, fontSize:11, color:'#8a7a5a', cursor:'pointer' }}>
                      {uploading===p._id?'Uploading...':'+ Add Image'}
                    </label>
                  </div>

                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={()=>handleEdit(p)} style={{ flex:1, background:'#1a1505', border:'1px solid #2e2a1a', color:'#b8860b', padding:'7px', borderRadius:8, cursor:'pointer', fontSize:13, fontFamily:'inherit' }}>Edit</button>
                    <button onClick={()=>handleDelete(p._id)} style={{ flex:1, background:'#1f1510', border:'1px solid #2e1a0e', color:'#f87171', padding:'7px', borderRadius:8, cursor:'pointer', fontSize:13, fontFamily:'inherit' }}>Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
