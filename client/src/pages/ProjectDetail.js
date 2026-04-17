import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiPlay } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { getProject } from '../utils/api';
import './ProjectDetail.css';

const BASE = process.env.REACT_APP_API_URL?.replace('/api','') || 'http://localhost:5000';

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    getProject(slug).then(r => setProject(r.data)).catch(() => setProject(STATIC)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="loading-center" style={{marginTop:'120px'}}><div className="spinner"/></div>;
  if (!project) return <div style={{padding:'120px 2rem',textAlign:'center'}}>Project not found</div>;

  const images = project.images || [];
  const imgUrl = (img) => { const u = img?.url || img; return u?.startsWith('http') ? u : `${BASE}${u}`; };

  return (
    <div className="project-detail-page">
      {/* Hero */}
      <div className="project-hero" style={{ backgroundImage: `url(${imgUrl(images[0])})` }}>
        <div className="project-hero-overlay"/>
        <div className="container project-hero-content">
          <span className="section-label" style={{color:'var(--gold-light)'}}>{project.category}</span>
          <h1>{project.title}</h1>
          <div className="project-meta-row">
            {project.location && <span>{project.location}</span>}
            {project.year && <span>{project.year}</span>}
            {project.area && <span>{project.area}</span>}
            {project.duration && <span>{project.duration}</span>}
          </div>
        </div>
      </div>

      <div className="container project-body">
        {/* Description */}
        <div className="project-overview">
          <div>
            <span className="section-label">About the Project</span>
            <h2>{project.title}</h2>
            <p>{project.description || project.shortDescription}</p>
            {project.style && <p><strong>Design Style:</strong> {project.style}</p>}
          </div>
          <div className="project-facts">
            {[['Client', project.client],['Location', project.location],['Year', project.year],['Area', project.area],['Duration', project.duration]].filter(([,v])=>v).map(([k,v]) => (
              <div key={k} className="fact"><span>{k}</span><strong>{v}</strong></div>
            ))}
          </div>
        </div>

        {/* Gallery */}
        {images.length > 1 && (
          <div className="project-gallery">
            <div className="gallery-main"><img src={imgUrl(images[activeImg])} alt="" /></div>
            <div className="gallery-thumbs">
              {images.map((img, i) => (
                <div key={i} className={`g-thumb ${activeImg===i?'active':''}`} onClick={()=>setActiveImg(i)}>
                  <img src={imgUrl(img)} alt="" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Videos / GIFs */}
        {project.videos?.length > 0 && (
          <div className="project-videos">
            <h2>Project Videos</h2>
            <div className="videos-grid">
              {project.videos.map((v, i) => (
                <div key={i} className="video-item">
                  {v.type === 'gif' ? (
                    <img src={imgUrl(v.url)} alt={v.caption || `GIF ${i+1}`} style={{width:'100%'}} />
                  ) : v.type === 'youtube' || v.type === 'vimeo' ? (
                    <div className="embed-wrap"><iframe src={v.url} title={v.caption} allow="fullscreen" allowFullScreen /></div>
                  ) : (
                    <video controls poster={v.thumbnail ? imgUrl(v.thumbnail) : undefined} style={{width:'100%'}}>
                      <source src={imgUrl(v.url)} type="video/mp4" />
                    </video>
                  )}
                  {v.caption && <p className="media-caption">{v.caption}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products Used */}
        {project.productsUsed?.length > 0 && (
          <div className="project-products">
            <div className="section-head-row">
              <div><span className="section-label">Shop The Look</span><h2>Products Used in This Project</h2></div>
              <Link to="/shop" className="btn-outline">Shop All <FiArrowRight/></Link>
            </div>
            <div className="products-grid" style={{gridTemplateColumns:'repeat(4,1fr)',gap:'1.5rem'}}>
              {project.productsUsed.map((p,i)=><ProductCard key={i} product={p}/>)}
            </div>
          </div>
        )}

        {/* Testimonial */}
        {project.testimonial?.text && (
          <div className="project-testimonial">
            <div className="quote-mark">"</div>
            <p>{project.testimonial.text}</p>
            <div className="testimonial-author">
              {project.testimonial.avatar && <img src={imgUrl(project.testimonial.avatar)} alt="" />}
              <div><strong>{project.testimonial.author}</strong><span>{project.testimonial.designation}</span></div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="project-cta">
          <h2>Like What You See?</h2>
          <p>Book a free consultation and let us design your dream space.</p>
          <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap',marginTop:'1.5rem'}}>
            <Link to="/contact" className="btn-primary">Book Consultation <FiArrowRight/></Link>
            <Link to="/projects" className="btn-outline">View More Projects <FiArrowRight/></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const STATIC = {
  title:'The Bandra Residence', category:'Residential', location:'Mumbai', year:2024, area:'2400 sq ft', duration:'4 months', client:'Private Client',
  description:'A serene 4BHK apartment that masterfully blends warmth and minimalism. We used a palette of warm whites, natural oak and hand-woven textiles to create a home that feels both luxurious and lived-in.',
  style:'Modern Organic',
  images:[{url:'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80'},{url:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80'},{url:'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=80'}],
  testimonial:{text:'The team truly understood our vision and delivered beyond expectations. Our home is now a sanctuary we never want to leave.',author:'Mr. & Mrs. Kapoor',designation:'Homeowners, Mumbai'}
};

export default ProjectDetail;
