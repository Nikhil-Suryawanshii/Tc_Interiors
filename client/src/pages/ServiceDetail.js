import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
const ServiceDetail = () => (
  <div style={{paddingTop:'120px',minHeight:'60vh',textAlign:'center',padding:'120px 2rem 4rem'}}>
    <span style={{fontFamily:'var(--font-body)',fontSize:'0.7rem',letterSpacing:'0.3em',textTransform:'uppercase',color:'var(--gold)'}}>Our Services</span>
    <h1 style={{fontFamily:'var(--font-display)',fontSize:'3rem',margin:'1rem 0'}}>Service Detail</h1>
    <p style={{color:'var(--text-light)',marginBottom:'2rem'}}>Detailed service information coming soon.</p>
    <Link to="/contact" className="btn-primary">Book Consultation <FiArrowRight/></Link>
  </div>
);
export default ServiceDetail;
