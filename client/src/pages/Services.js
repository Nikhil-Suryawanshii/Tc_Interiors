import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { getServices } from '../utils/api';
import './Services.css';

const BASE = process.env.REACT_APP_API_URL?.replace('/api','') || '';

const STATIC_SERVICES = [
  { _id:'1', icon:'✦', name:'Interior Design', shortDescription:'Full-service interior design from initial concept through to the final reveal.', description:'Full-service interior design from initial concept through to the final reveal. We handle everything — space planning, material selection, furniture procurement, and on-site coordination.', features:['Space planning & layout optimization','Material and finish selection','Custom furniture design','Contractor coordination','Final styling and reveal'] },
  { _id:'2', icon:'◈', name:'Space Consultation', shortDescription:'Expert design direction you can implement at your own pace.', description:'Not ready for a full redesign? Our consultation service gives you expert design direction you can implement at your own pace, on your own budget.', features:['2-hour in-home consultation','Written design brief','Furniture and styling recommendations','Mood board and color palette','Follow-up support session'] },
  { _id:'3', icon:'⬡', name:'3D Visualization', shortDescription:'See your space before a single piece of furniture is moved.', description:'Our photorealistic 3D renders give you complete confidence in your design decisions before a single piece of furniture is moved or wall is painted.', features:['Photorealistic 3D renders','Virtual walk-through video','Multiple design options','Revision rounds included','High-resolution output files'] },
  { _id:'4', icon:'◇', name:'Project Execution', shortDescription:'End-to-end management ensuring your interior is built exactly as designed.', description:'From managing contractors to sourcing custom pieces, our project execution service ensures your interior is built exactly as designed — on time, on budget.', features:['Full project management','Contractor vetting and supervision','Procurement and logistics','Quality control inspections','Defect rectification support'] },
  { _id:'5', icon:'△', name:'Furniture Selection', shortDescription:'Access our network of premium furniture brands across India and internationally.', description:'Access our network of premium furniture brands and artisan workshops across India and internationally. We source pieces that are perfect for your space and budget.', features:['Premium brand access','Custom fabrication options','Import sourcing','Delivery and installation coordination','Styling and arrangement'] },
  { _id:'6', icon:'○', name:'Vastu Consultation', shortDescription:'Harmonize your space with Vastu principles without compromising on aesthetics.', description:'Harmonize your space with Vastu principles without compromising on contemporary aesthetics. Our Vastu consultants work alongside our designers seamlessly.', features:['Vastu compliance assessment','Direction and zone analysis','Remedial suggestions','Integration with design plan','Follow-up energy audit'] },
];

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getServices()
      .then(r => setServices(r.data?.length ? r.data : STATIC_SERVICES))
      .catch(() => setServices(STATIC_SERVICES))
      .finally(() => setLoading(false));
  }, []);

  const imgUrl = src => src ? (src.startsWith('http') ? src : `${BASE}${src}`) : null;

  return (
    <div className="services-page">
      <div className="page-hero">
        <div className="container">
          <span className="section-label">What We Offer</span>
          <h1>Our Services</h1>
          <p>Comprehensive interior solutions for every need and budget</p>
        </div>
      </div>

      <div className="container services-list">
        {loading
          ? <div className="loading-center"><div className="spinner"/></div>
          : services.map((s, i) => (
            <motion.div key={s._id||i}
              initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay: (i%2)*0.1 }}
              className={`service-item ${i%2!==0 ? 'reverse' : ''}`}>

              <div className="service-visual">
                {imgUrl(s.image)
                  ? <img src={imgUrl(s.image)} alt={s.name} className="service-img" />
                  : <div className="service-icon-large">{s.icon || '✦'}</div>
                }
              </div>

              <div className="service-content">
                <span className="section-label">0{i+1}</span>
                <h2>{s.name}</h2>
                <p>{s.description || s.shortDescription}</p>

                {s.features?.length > 0 && (
                  <ul className="service-features">
                    {s.features.map((f,j) => <li key={j}>{f}</li>)}
                  </ul>
                )}

                {s.pricing?.length > 0 && (
                  <div className="service-pricing">
                    {s.pricing.map((p,j) => (
                      <div key={j} className="price-tier">
                        <strong>{p.label}</strong>
                        <span className="tier-price">{p.price}</span>
                        {p.description && <p>{p.description}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {s.process?.length > 0 && (
                  <div className="service-process">
                    <h4>Our Process</h4>
                    {s.process.map((p,j) => (
                      <div key={j} className="process-step">
                        <span className="step-num">{p.step}</span>
                        <div><strong>{p.title}</strong><p>{p.description}</p></div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="service-footer">
                  {s.duration && <span className="service-duration">⏱ {s.duration}</span>}
                  <Link to="/contact" className="btn-outline">Enquire <FiArrowRight size={14}/></Link>
                </div>
              </div>
            </motion.div>
          ))
        }
      </div>

      <section className="cta-section">
        <div className="container cta-inner">
          <span className="section-label" style={{color:'var(--gold-light)',justifyContent:'center'}}>Get Started</span>
          <h2>Not Sure Which Service<br/><em>You Need?</em></h2>
          <p>Book a free call with our team and we'll guide you to the right solution.</p>
          <div className="cta-btns">
            <Link to="/contact" className="btn-primary">Book Free Call <FiArrowRight/></Link>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Services;
