import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { useAuth } from '@contexts/AuthContext';

/* TC Interiors Logo for Login */
const TCLogoLogin = () => (
  <div style={{ display:'flex', alignItems:'center', gap:12, justifyContent:'center' }}>
    <div style={{ position:'relative', width:48, height:48, flexShrink:0 }}>
      <svg width="48" height="48" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="18" height="5" fill="white"/>
        <rect x="10" y="4" width="5" height="22" fill="white"/>
        <circle cx="28" cy="26" r="14" fill="#d4f500"/>
        <circle cx="28" cy="26" r="8" fill="black"/>
        <rect x="26" y="12" width="16" height="28" fill="black"/>
      </svg>
    </div>
    <div style={{ display:'flex', flexDirection:'column', lineHeight:1 }}>
      <div style={{ display:'flex', alignItems:'baseline' }}>
        <span style={{ fontFamily:'Impact,"Arial Black",sans-serif', fontWeight:900, fontSize:20, color:'white', textTransform:'uppercase' }}>THE </span>
        <span style={{ fontFamily:'Impact,"Arial Black",sans-serif', fontWeight:900, fontSize:20, color:'#d4f500', textTransform:'uppercase' }}>CONCEPT</span>
      </div>
      <span style={{ fontFamily:'Georgia,serif', fontSize:13, color:'#d4f500', fontStyle:'italic', marginTop:2 }}>Interiors</span>
    </div>
  </div>
);

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(formData);
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error || 'Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'32px 16px', background:'#050500' }}>
      {/* Background glow */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'20%', left:'20%', width:400, height:400, background:'rgba(212,245,0,0.06)', borderRadius:'50%', filter:'blur(80px)' }}/>
        <div style={{ position:'absolute', bottom:'20%', right:'20%', width:300, height:300, background:'rgba(212,245,0,0.04)', borderRadius:'50%', filter:'blur(60px)' }}/>
      </div>

      <div style={{ position:'relative', width:'100%', maxWidth:420 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <TCLogoLogin />
          <h1 style={{ color:'white', fontSize:24, fontWeight:800, margin:'16px 0 4px', fontFamily:'DM Sans,sans-serif' }}>Admin Login</h1>
          <p style={{ color:'#6a6a4a', fontSize:14, margin:0 }}>Sign in to manage your interiors platform</p>
        </div>

        {/* Card */}
        <div style={{ background:'#0a0a02', border:'1px solid #2a2a10', borderRadius:20, padding:32, boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}>
          {error && (
            <div style={{ marginBottom:20, display:'flex', alignItems:'flex-start', gap:10, padding:14, background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:12 }}>
              <FiAlertCircle style={{ color:'#f87171', marginTop:2, flexShrink:0 }} size={15}/>
              <p style={{ color:'#f87171', fontSize:13, margin:0 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
            <div>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#b0b090', marginBottom:8 }}>Email Address</label>
              <div style={{ position:'relative' }}>
                <FiMail style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#6a6a4a' }} size={15}/>
                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required disabled={loading} placeholder="admin@theconcept.com"
                  style={{ width:'100%', paddingLeft:42, paddingRight:16, paddingTop:12, paddingBottom:12, border:'1px solid #2a2a10', borderRadius:12, background:'#050500', color:'white', fontSize:14, outline:'none', boxSizing:'border-box', transition:'border-color 0.2s', fontFamily:'inherit' }}
                  onFocus={e=>e.target.style.borderColor='#d4f500'}
                  onBlur={e=>e.target.style.borderColor='#2a2a10'}
                />
              </div>
            </div>
            <div>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#b0b090', marginBottom:8 }}>Password</label>
              <div style={{ position:'relative' }}>
                <FiLock style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#6a6a4a' }} size={15}/>
                <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                  required disabled={loading} placeholder="••••••••"
                  style={{ width:'100%', paddingLeft:42, paddingRight:48, paddingTop:12, paddingBottom:12, border:'1px solid #2a2a10', borderRadius:12, background:'#050500', color:'white', fontSize:14, outline:'none', boxSizing:'border-box', transition:'border-color 0.2s', fontFamily:'inherit' }}
                  onFocus={e=>e.target.style.borderColor='#d4f500'}
                  onBlur={e=>e.target.style.borderColor='#2a2a10'}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#6a6a4a', cursor:'pointer', padding:0 }}>
                  {showPassword ? <FiEyeOff size={15}/> : <FiEye size={15}/>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              style={{ width:'100%', padding:'13px', background: loading ? '#a8c400' : '#d4f500', color:'#000', borderRadius:12, fontWeight:700, fontSize:15, border:'none', cursor: loading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontFamily:'inherit', transition:'background 0.2s', marginTop:4 }}
              onMouseEnter={e=>{ if(!loading) e.target.style.background='#c8e800'; }}
              onMouseLeave={e=>{ if(!loading) e.target.style.background='#d4f500'; }}
            >
              {loading ? <><FiLoader style={{ animation:'spin 1s linear infinite' }} size={15}/> Signing in...</> : 'Sign In →'}
            </button>
          </form>

          <div style={{ marginTop:20, textAlign:'center' }}>
            <Link to="/" style={{ fontSize:13, color:'#6a6a4a', textDecoration:'none', transition:'color 0.2s' }}
              onMouseEnter={e=>e.target.style.color='#d4f500'}
              onMouseLeave={e=>e.target.style.color='#6a6a4a'}>← Back to Website</Link>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
};

export default LoginPage;
