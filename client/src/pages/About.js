import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import './About.css';

const TEAM = [
  { name:'Aisha Kapoor', role:'Principal Designer', image:'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80' },
  { name:'Rahul Mehta', role:'Project Director', image:'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80' },
  { name:'Priya Sharma', role:'Senior Interior Designer', image:'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80' },
  { name:'Vikram Nair', role:'3D Visualization Lead', image:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
];

const About = () => (
  <div className="about-page">
    <div className="about-hero">
      <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800&q=80" alt="Studio" />
      <div className="about-hero-overlay"/>
      <div className="container about-hero-content">
        <motion.span initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="section-label" style={{color:'var(--gold-light)'}}>Our Story</motion.span>
        <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>Designing with<br/><em>Purpose & Passion</em></motion.h1>
      </div>
    </div>
    <div className="container about-intro">
      <div>
        <span className="section-label">Who We Are</span>
        <h2>A Studio Built on Belief That Good Design Changes Lives</h2>
      </div>
      <div>
        <p>Founded in 2012, Luxe Interior Studio has grown from a two-person team in Mumbai to a full-service design practice with over 250 completed projects across India. We believe that exceptional design is not a luxury — it's a necessity.</p>
        <p>Our approach is rooted in listening. We spend time understanding how you live, how you work, what you love — and then we design spaces that feel unmistakably, uniquely yours.</p>
        <Link to="/contact" className="btn-outline" style={{marginTop:'1.5rem'}}>Work With Us <FiArrowRight/></Link>
      </div>
    </div>
    <div className="about-stats">
      <div className="container stats-row">
        {[['250+','Projects Completed'],['12+','Years of Experience'],['98%','Client Satisfaction'],['50+','Design Awards']].map(([n,l])=>(
          <div key={l} className="about-stat"><strong>{n}</strong><span>{l}</span></div>
        ))}
      </div>
    </div>
    <div className="container team-section">
      <div className="section-head"><span className="section-label">The People</span><h2 className="section-title">Meet Our Team</h2></div>
      <div className="team-grid">
        {TEAM.map((m,i)=>(
          <motion.div key={i} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}} className="team-card">
            <div className="team-img"><img src={m.image} alt={m.name} loading="lazy"/></div>
            <h3>{m.name}</h3><span>{m.role}</span>
          </motion.div>
        ))}
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
export default About;
