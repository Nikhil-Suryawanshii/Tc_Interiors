import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import './Services.css';

const SERVICES = [
  { icon:'✦', name:'Interior Design', slug:'interior-design', desc:'Full-service interior design from initial concept through to the final reveal. We handle everything — space planning, material selection, furniture procurement, and on-site coordination.', features:['Space planning & layout optimization','Material and finish selection','Custom furniture design','Contractor coordination','Final styling and reveal'] },
  { icon:'◈', name:'Space Consultation', slug:'space-consultation', desc:'Not ready for a full redesign? Our consultation service gives you expert design direction you can implement at your own pace, on your own budget.', features:['2-hour in-home consultation','Written design brief','Furniture and styling recommendations','Mood board and color palette','Follow-up support session'] },
  { icon:'⬡', name:'3D Visualization', slug:'3d-visualization', desc:'See your space before a single piece of furniture is moved. Our photorealistic 3D renders give you complete confidence in your design decisions.', features:['Photorealistic 3D renders','Virtual walk-through video','Multiple design options','Revision rounds included','High-resolution output files'] },
  { icon:'◇', name:'Project Execution', slug:'project-execution', desc:'From managing contractors to sourcing custom pieces, our project execution service ensures your interior is built exactly as designed — on time, on budget.', features:['Full project management','Contractor vetting and supervision','Procurement and logistics','Quality control inspections','Defect rectification support'] },
  { icon:'△', name:'Furniture Selection', slug:'furniture-selection', desc:'Access our network of premium furniture brands and artisan workshops across India and internationally. We source pieces that are perfect for your space and budget.', features:['Premium brand access','Custom fabrication options','Import sourcing','Delivery and installation coordination','Styling and arrangement'] },
  { icon:'○', name:'Vastu Consultation', slug:'vastu-consultation', desc:'Harmonize your space with Vastu principles without compromising on contemporary aesthetics. Our Vastu consultants work alongside our designers seamlessly.', features:['Vastu compliance assessment','Direction and zone analysis','Remedial suggestions','Integration with design plan','Follow-up energy audit'] },
];

const Services = () => (
  <div className="services-page">
    <div className="page-hero"><div className="container"><span className="section-label">What We Offer</span><h1>Our Services</h1><p>Comprehensive interior solutions for every need and budget</p></div></div>
    <div className="container services-list">
      {SERVICES.map((s,i)=>(
        <motion.div key={i} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i%2*0.15}} className={`service-item ${i%2!==0?'reverse':''}`}>
          <div className="service-visual"><div className="service-icon-large">{s.icon}</div></div>
          <div className="service-content">
            <span className="section-label">0{i+1}</span>
            <h2>{s.name}</h2>
            <p>{s.desc}</p>
            <ul className="service-features">{s.features.map((f,j)=><li key={j}>{f}</li>)}</ul>
            <Link to="/contact" className="btn-outline" style={{marginTop:'1.5rem'}}>Enquire About This <FiArrowRight/></Link>
          </div>
        </motion.div>
      ))}
    </div>
    <section className="cta-section"><div className="container cta-inner">
      <span className="section-label" style={{color:'var(--gold-light)',justifyContent:'center'}}>Get Started</span>
      <h2>Not Sure Which Service You Need?</h2>
      <p>Book a free call with our team and we will guide you to the right solution.</p>
      <div className="cta-btns"><Link to="/contact" className="btn-primary">Book Free Call <FiArrowRight/></Link></div>
    </div></section>
  </div>
);
export default Services;
