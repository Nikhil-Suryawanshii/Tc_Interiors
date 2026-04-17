import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { useSettings } from '../context/SettingsContext';
import './About.css';

const BASE = process.env.REACT_APP_API_URL?.replace('/api','') || '';

const DEFAULT_TEAM = [
  { name:'Aisha Kapoor',  role:'Principal Designer',       image:'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80' },
  { name:'Rahul Mehta',   role:'Project Director',         image:'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80' },
  { name:'Priya Sharma',  role:'Senior Interior Designer', image:'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80' },
  { name:'Vikram Nair',   role:'3D Visualization Lead',    image:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
];
const DEFAULT_STATS = [
  { number:'250+', label:'Projects Completed' },
  { number:'12+',  label:'Years of Experience' },
  { number:'98%',  label:'Client Satisfaction' },
  { number:'50+',  label:'Design Awards' },
];

const About = () => {
  const { settings } = useSettings();
  const about = settings.about || {};
  const site  = settings.site  || {};

  const team  = about.team?.length  ? about.team  : DEFAULT_TEAM;
  const stats = about.stats?.length ? about.stats : DEFAULT_STATS;

  const heroImg = about.heroImage
    ? (about.heroImage.startsWith('http') ? about.heroImage : `${BASE}${about.heroImage}`)
    : 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800&q=80';

  const imgUrl = src => src ? (src.startsWith('http') ? src : `${BASE}${src}`) : null;

  return (
    <div className="about-page">
      <div className="about-hero" style={{ backgroundImage:`url(${heroImg})` }}>
        <div className="about-hero-overlay"/>
        <div className="container about-hero-content">
          <motion.span initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="section-label" style={{color:'var(--gold-light)'}}>Our Story</motion.span>
          <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>
            {about.heroTitle || 'Designing with'}<br/><em>{about.heroTitleEm || 'Purpose & Passion'}</em>
          </motion.h1>
        </div>
      </div>

      <div className="container about-intro">
        <div>
          <span className="section-label">Who We Are</span>
          <h2>A Studio Built on Belief That Good Design Changes Lives</h2>
        </div>
        <div>
          <p>{about.intro || `Founded in 2012, ${site.logoText||'Luxe Interior Studio'} has grown from a two-person team in Mumbai to a full-service design practice with over 250 completed projects across India.`}</p>
          <p>{about.mission || 'We believe that exceptional design is not a luxury — it\'s a necessity. Our approach is rooted in listening. We spend time understanding how you live, how you work, what you love — and then we design spaces that feel unmistakably, uniquely yours.'}</p>
          <Link to="/contact" className="btn-outline" style={{marginTop:'1.5rem'}}>Work With Us <FiArrowRight/></Link>
        </div>
      </div>

      <div className="about-stats">
        <div className="container stats-row">
          {stats.map((s,i) => (
            <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}} className="about-stat">
              <strong>{s.number}</strong><span>{s.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="container team-section">
        <div className="section-head">
          <span className="section-label">The People</span>
          <h2 className="section-title">Meet Our Team</h2>
        </div>
        <div className="team-grid">
          {team.map((m, i) => {
            const mImg = imgUrl(m.image) || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=1a1208&color=c9a96e&size=200`;
            return (
              <motion.div key={i} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}} className="team-card">
                <div className="team-img"><img src={mImg} alt={m.name} loading="lazy"/></div>
                <h3>{m.name}</h3>
                <span>{m.role}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <section className="cta-section">
        <div className="container cta-inner">
          <span className="section-label" style={{color:'var(--gold-light)',justifyContent:'center'}}>Start Today</span>
          <h2>Ready to Work With Us?</h2>
          <p>Book a free consultation and let's create something extraordinary together.</p>
          <div className="cta-btns">
            <Link to="/contact" className="btn-primary">Book Consultation <FiArrowRight/></Link>
            <Link to="/projects" className="btn-outline-light">View Portfolio <FiArrowRight/></Link>
          </div>
        </div>
      </section>
    </div>
  );
};
export default About;
