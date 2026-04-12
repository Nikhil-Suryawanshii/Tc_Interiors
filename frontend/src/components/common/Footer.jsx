// TC Interior — Footer
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiLinkedin, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { useSettings } from '@contexts/SiteSettingsContext';

/* TC Logo for Footer */
const TCLogoFooter = () => (
  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
    <svg width="32" height="32" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="18" height="5" fill="white"/>
      <rect x="10" y="4" width="5" height="22" fill="white"/>
      <circle cx="28" cy="26" r="14" fill="#d4f500"/>
      <circle cx="28" cy="26" r="8" fill="#111"/>
      <rect x="26" y="12" width="16" height="28" fill="#111"/>
    </svg>
    <div style={{ display:'flex', flexDirection:'column', lineHeight:1 }}>
      <div>
        <span style={{ fontFamily:'Impact,"Arial Black",sans-serif', fontWeight:900, fontSize:16, color:'white', textTransform:'uppercase' }}>THE </span>
        <span style={{ fontFamily:'Impact,"Arial Black",sans-serif', fontWeight:900, fontSize:16, color:'#d4f500', textTransform:'uppercase' }}>CONCEPT</span>
      </div>
      <span style={{ fontFamily:'Georgia,serif', fontSize:10, color:'#d4f500', fontStyle:'italic', marginTop:1 }}>Interiors</span>
    </div>
  </div>
);

export default function Footer() {
  const { settings, footerText } = useSettings();
  const s = settings || {};

  return (
    <footer style={{ background:'#080800', borderTop:'1px solid #1a1a08', color:'#a0a080', paddingTop:64, paddingBottom:32, paddingLeft:16, paddingRight:16 }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <TCLogoFooter />
            <p style={{ color:'#6a6a4a', fontSize:14, lineHeight:1.6, marginBottom:20 }}>
              {s.tagline || 'Luxury Interior Design & Premium Furniture'}
            </p>
            <div style={{ display:'flex', gap:10 }}>
              {s.social?.instagram && (
                <a href={`https://instagram.com/${s.social.instagram}`} target="_blank" rel="noopener noreferrer"
                  style={{ width:36, height:36, background:'#111', border:'1px solid #2a2a10', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', color:'#6a6a4a', transition:'all 0.2s', textDecoration:'none' }}
                  onMouseEnter={e=>{e.currentTarget.style.background='#d4f500';e.currentTarget.style.color='#000';e.currentTarget.style.borderColor='#d4f500';}}
                  onMouseLeave={e=>{e.currentTarget.style.background='#111';e.currentTarget.style.color='#6a6a4a';e.currentTarget.style.borderColor='#2a2a10';}}
                ><FiInstagram size={14}/></a>
              )}
              {s.social?.facebook && (
                <a href={`https://facebook.com/${s.social.facebook}`} target="_blank" rel="noopener noreferrer"
                  style={{ width:36, height:36, background:'#111', border:'1px solid #2a2a10', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', color:'#6a6a4a', transition:'all 0.2s', textDecoration:'none' }}
                  onMouseEnter={e=>{e.currentTarget.style.background='#d4f500';e.currentTarget.style.color='#000';e.currentTarget.style.borderColor='#d4f500';}}
                  onMouseLeave={e=>{e.currentTarget.style.background='#111';e.currentTarget.style.color='#6a6a4a';e.currentTarget.style.borderColor='#2a2a10';}}
                ><FiFacebook size={14}/></a>
              )}
              {s.social?.linkedin && (
                <a href={`https://linkedin.com/company/${s.social.linkedin}`} target="_blank" rel="noopener noreferrer"
                  style={{ width:36, height:36, background:'#111', border:'1px solid #2a2a10', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', color:'#6a6a4a', transition:'all 0.2s', textDecoration:'none' }}
                  onMouseEnter={e=>{e.currentTarget.style.background='#d4f500';e.currentTarget.style.color='#000';e.currentTarget.style.borderColor='#d4f500';}}
                  onMouseLeave={e=>{e.currentTarget.style.background='#111';e.currentTarget.style.color='#6a6a4a';e.currentTarget.style.borderColor='#2a2a10';}}
                ><FiLinkedin size={14}/></a>
              )}
              {s.social?.youtube && (
                <a href={`https://youtube.com/${s.social.youtube}`} target="_blank" rel="noopener noreferrer"
                  style={{ width:36, height:36, background:'#111', border:'1px solid #2a2a10', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', color:'#6a6a4a', transition:'all 0.2s', textDecoration:'none' }}
                  onMouseEnter={e=>{e.currentTarget.style.background='#d4f500';e.currentTarget.style.color='#000';e.currentTarget.style.borderColor='#d4f500';}}
                  onMouseLeave={e=>{e.currentTarget.style.background='#111';e.currentTarget.style.color='#6a6a4a';e.currentTarget.style.borderColor='#2a2a10';}}
                ><FiYoutube size={14}/></a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div style={{ color:'white', fontWeight:700, fontSize:12, textTransform:'uppercase', letterSpacing:'2px', marginBottom:16 }}>Quick Links</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[['Home','/'],['Products','/products'],['Gallery','/gallery'],['Projects','/projects'],['Experience','/experience'],['Services','/services'],['About','/about'],['Contact','/contact']].map(([l,p])=>(
                <Link key={p} to={p} style={{ color:'#6a6a4a', fontSize:14, textDecoration:'none', transition:'color 0.2s' }}
                  onMouseEnter={e=>e.target.style.color='#d4f500'}
                  onMouseLeave={e=>e.target.style.color='#6a6a4a'}
                >{l}</Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <div style={{ color:'white', fontWeight:700, fontSize:12, textTransform:'uppercase', letterSpacing:'2px', marginBottom:16 }}>Our Services</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {['Interior Design','Custom Furniture','Space Planning','3D Visualization','Home Renovation','Commercial Interiors'].map(sv=>(
                <div key={sv} style={{ color:'#6a6a4a', fontSize:14 }}>{sv}</div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div style={{ color:'white', fontWeight:700, fontSize:12, textTransform:'uppercase', letterSpacing:'2px', marginBottom:16 }}>Get In Touch</div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {s.contactEmail && (
                <a href={`mailto:${s.contactEmail}`} style={{ display:'flex', alignItems:'center', gap:8, color:'#6a6a4a', fontSize:14, textDecoration:'none', transition:'color 0.2s' }}
                  onMouseEnter={e=>e.currentTarget.style.color='#d4f500'}
                  onMouseLeave={e=>e.currentTarget.style.color='#6a6a4a'}
                ><FiMail size={14}/>{s.contactEmail}</a>
              )}
              {s.phone && (
                <a href={`tel:${s.phone}`} style={{ display:'flex', alignItems:'center', gap:8, color:'#6a6a4a', fontSize:14, textDecoration:'none', transition:'color 0.2s' }}
                  onMouseEnter={e=>e.currentTarget.style.color='#d4f500'}
                  onMouseLeave={e=>e.currentTarget.style.color='#6a6a4a'}
                ><FiPhone size={14}/>{s.phone}</a>
              )}
              {s.location && (
                <div style={{ display:'flex', alignItems:'flex-start', gap:8, color:'#6a6a4a', fontSize:14 }}>
                  <FiMapPin size={14} style={{ marginTop:2, flexShrink:0 }}/>{s.location}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ paddingTop:28, borderTop:'1px solid #1a1a08', display:'flex', flexWrap:'wrap', justifyContent:'space-between', alignItems:'center', gap:16 }}>
          <p style={{ color:'#4a4a2a', fontSize:13, margin:0 }}>
            {footerText || `© ${new Date().getFullYear()} The Concept Interiors. All rights reserved.`}
          </p>
          <div style={{ display:'flex', gap:24 }}>
            <Link to="/about"   style={{ color:'#4a4a2a', fontSize:13, textDecoration:'none', transition:'color 0.2s' }}
              onMouseEnter={e=>e.target.style.color='#d4f500'} onMouseLeave={e=>e.target.style.color='#4a4a2a'}>About</Link>
            <Link to="/contact" style={{ color:'#4a4a2a', fontSize:13, textDecoration:'none', transition:'color 0.2s' }}
              onMouseEnter={e=>e.target.style.color='#d4f500'} onMouseLeave={e=>e.target.style.color='#4a4a2a'}>Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
