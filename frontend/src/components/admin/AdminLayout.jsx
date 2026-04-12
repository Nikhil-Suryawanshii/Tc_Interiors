// TC Interior Admin Layout
import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';

const nav = [
  { to:'/admin',            label:'Dashboard', exact:true, icon:<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { to:'/admin/products',   label:'Products',  icon:<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
  { to:'/admin/categories', label:'Categories',icon:<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="3" width="9" height="9" rx="1"/><rect x="13" y="3" width="9" height="9" rx="1"/><rect x="2" y="13" width="9" height="9" rx="1"/><rect x="13" y="13" width="9" height="9" rx="1"/></svg> },
  { to:'/admin/enquiries',  label:'Enquiries', icon:<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  { to:'/admin/gallery',    label:'Gallery',   icon:<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg> },
  { to:'/admin/projects',   label:'Projects',  icon:<svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { to:'/admin/skills',     label:'Skills',    icon:<svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { to:'/admin/experience', label:'Experience',icon:<svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg> },
  { to:'/admin/services',   label:'Services',  icon:<svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> },
  { to:'/admin/blog',       label:'Blog',      icon:<svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
  { to:'/admin/testimonials',label:'Reviews',  icon:<svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="9" y1="10" x2="15" y2="10"/></svg> },
  { to:'/admin/contacts',   label:'Contacts',  icon:<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.37 18a19.5 19.5 0 0 1-5.37-5.37 19.79 19.79 0 0 1-3.92-8.45A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg> },
  { to:'/admin/analytics',  label:'Analytics', icon:<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { to:'/admin/profile',    label:'Profile',   icon:<svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { to:'/admin/audit-log',  label:'Audit Log', icon:<svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
  { to:'/admin/settings',   label:'Settings',  icon:<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
];

const ACCENT = '#d4f500';

/* TC Interiors Admin Logo */
const AdminLogo = () => (
  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
    <div style={{ position:'relative', width:36, height:36, flexShrink:0 }}>
      <svg width="36" height="36" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="18" height="5" fill="white"/>
        <rect x="10" y="4" width="5" height="22" fill="white"/>
        <circle cx="28" cy="26" r="14" fill={ACCENT}/>
        <circle cx="28" cy="26" r="8" fill="black"/>
        <rect x="26" y="12" width="16" height="28" fill="black"/>
      </svg>
    </div>
    <div style={{ display:'flex', flexDirection:'column', lineHeight:1 }}>
      <div style={{ display:'flex', alignItems:'baseline' }}>
        <span style={{ fontFamily:'Impact,"Arial Black",sans-serif', fontWeight:900, fontSize:14, color:'white', textTransform:'uppercase' }}>THE </span>
        <span style={{ fontFamily:'Impact,"Arial Black",sans-serif', fontWeight:900, fontSize:14, color:ACCENT, textTransform:'uppercase' }}>CONCEPT</span>
      </div>
      <span style={{ fontFamily:'Georgia,serif', fontSize:10, color:ACCENT, fontStyle:'italic', marginTop:1 }}>Interiors</span>
    </div>
  </div>
);

export default function AdminLayout() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { logout, user } = useAuth ? useAuth() : { logout:()=>{}, user:{name:'Admin'} };
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);
  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 1024) setSidebarOpen(false); };
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const isActive = (to, exact) => exact ? location.pathname===to : location.pathname.startsWith(to);
  const handleLogout = () => { if (logout) logout(); navigate('/login'); };
  const currentLabel = nav.find(n=>isActive(n.to,n.exact))?.label || 'Dashboard';

  const SidebarContent = () => (
    <>
      <div style={{ padding:'20px 16px 16px', borderBottom:`1px solid #1a1a0a` }}>
        <AdminLogo />
        <div style={{ fontSize:10, color:'#4a4a2a', marginTop:6, textTransform:'uppercase', letterSpacing:'1.5px', paddingLeft:46 }}>Admin Panel</div>
      </div>
      <nav style={{ flex:1, padding:'16px 10px', display:'flex', flexDirection:'column', gap:2, overflowY:'auto' }}>
        {nav.map(item => (
          <Link key={item.to} to={item.to}
            style={{
              display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10,
              fontSize:13.5, fontWeight:500, textDecoration:'none',
              color: isActive(item.to,item.exact) ? ACCENT : '#6a6a4a',
              background: isActive(item.to,item.exact) ? 'rgba(212,245,0,0.10)' : 'none',
              borderLeft: isActive(item.to,item.exact) ? `2px solid ${ACCENT}` : '2px solid transparent',
              transition:'all 0.15s',
            }}
            onMouseEnter={e=>{ if (!isActive(item.to,item.exact)) { e.currentTarget.style.color='#b8d400'; e.currentTarget.style.background='rgba(212,245,0,0.06)'; } }}
            onMouseLeave={e=>{ if (!isActive(item.to,item.exact)) { e.currentTarget.style.color='#6a6a4a'; e.currentTarget.style.background='none'; } }}
          >
            {item.icon}<span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div style={{ padding:'14px 10px', borderTop:'1px solid #1a1a0a' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, marginBottom:6 }}>
          <div style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg, ${ACCENT}, #a8c400)`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:13, color:'#000', flexShrink:0 }}>{(user?.name||'A')[0]}</div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:600, color:'#e0e0c0', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.name||'Admin'}</div>
            <div style={{ fontSize:11, color:'#4a4a2a' }}>Administrator</div>
          </div>
        </div>
        <button onClick={handleLogout} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 14px', borderRadius:10, fontSize:13, color:'#6a6a4a', cursor:'pointer', border:'none', background:'none', width:'100%', fontFamily:'inherit', transition:'all 0.2s' }}
          onMouseEnter={e=>{ e.currentTarget.style.color='#f87171'; e.currentTarget.style.background='#1f0f0f'; }}
          onMouseLeave={e=>{ e.currentTarget.style.color='#6a6a4a'; e.currentTarget.style.background='none'; }}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');
        .tc-admin { font-family:'DM Sans',sans-serif; display:flex; min-height:100vh; background:#050500; color:#e0e0c0; }
        .tc-sidebar { width:230px; min-height:100vh; background:#080800; border-right:1px solid #1a1a08; display:flex; flex-direction:column; position:fixed; top:0; left:0; bottom:0; z-index:50; transition:transform 0.3s ease; }
        @media(max-width:1023px){ .tc-sidebar{ transform:translateX(-100%); box-shadow:4px 0 24px rgba(0,0,0,0.5); } .tc-sidebar.open{ transform:translateX(0); } }
        .tc-overlay{ display:none; position:fixed; inset:0; background:rgba(0,0,0,0.7); backdrop-filter:blur(2px); z-index:49; }
        .tc-overlay.show{ display:block; }
        .tc-main{ margin-left:230px; flex:1; display:flex; flex-direction:column; min-height:100vh; min-width:0; }
        @media(max-width:1023px){ .tc-main{ margin-left:0; } }
        .tc-topbar{ height:60px; border-bottom:1px solid #1a1a08; display:flex; align-items:center; padding:0 20px; background:#050500; position:sticky; top:0; z-index:40; gap:12px; }
        .tc-hamburger{ display:none; align-items:center; justify-content:center; width:36px; height:36px; border-radius:8px; border:1px solid #2a2a10; background:#080800; color:${ACCENT}; cursor:pointer; flex-shrink:0; }
        @media(max-width:1023px){ .tc-hamburger{ display:flex; } }
        .tc-content{ flex:1; padding:28px 32px; }
        @media(max-width:768px){ .tc-content{ padding:20px 16px; } }
        @media(max-width:480px){ .tc-content{ padding:16px 12px; } }
        .tc-close{ display:none; position:absolute; top:16px; right:16px; width:30px; height:30px; border-radius:6px; border:1px solid #2a2a10; background:#0a0a02; color:#6a6a4a; cursor:pointer; align-items:center; justify-content:center; }
        @media(max-width:1023px){ .tc-close{ display:flex; } }
      `}</style>

      <div className="tc-admin">
        <div className={`tc-overlay${sidebarOpen?' show':''}`} onClick={()=>setSidebarOpen(false)}/>
        <aside className={`tc-sidebar${sidebarOpen?' open':''}`}>
          <button className="tc-close" onClick={()=>setSidebarOpen(false)}>✕</button>
          <SidebarContent/>
        </aside>
        <main className="tc-main">
          <div className="tc-topbar">
            <button className="tc-hamburger" onClick={()=>setSidebarOpen(true)}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
            </button>
            <span style={{ fontSize:13, color:'#4a4a2a' }}>Admin / <span style={{ color:ACCENT, fontWeight:600 }}>{currentLabel}</span></span>
            <Link to="/" style={{ display:'flex', alignItems:'center', gap:6, marginLeft:'auto', padding:'7px 14px', borderRadius:8, fontSize:13, color:ACCENT, border:`1px solid #2a2a10`, textDecoration:'none' }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
              View Site
            </Link>
          </div>
          <div className="tc-content"><Outlet/></div>
        </main>
      </div>
    </>
  );
}
