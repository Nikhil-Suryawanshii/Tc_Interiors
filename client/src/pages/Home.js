import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiPlay } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { getProducts, getProjects, getServices } from '../utils/api';
import './Home.css';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } } };
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

const STATIC_CATEGORIES = [
  { name: 'Living Room', slug: 'living-room', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80' },
  { name: 'Bedroom', slug: 'bedroom', image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80' },
  { name: 'Lighting', slug: 'lighting', image: 'https://images.unsplash.com/photo-1513506003901-1e6a35f4f7f7?w=600&q=80' },
  { name: 'Decor', slug: 'decor', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80' },
];
const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'Homeowner, Mumbai', text: 'Luxe transformed our 3BHK into a dream space. Every detail was thoughtfully curated. Professional, punctual and incredibly talented.', avatar: 'PS' },
  { name: 'Rohit & Anita Mehta', role: 'Villa Owners, Pune', text: 'From concept to execution, the entire process was seamless. Our villa looks like it belongs in a design magazine. Absolutely worth it.', avatar: 'RM' },
  { name: 'Kavya Reddy', role: 'Café Owner, Hyderabad', text: 'They designed our café from scratch and the response from customers has been phenomenal. Footfall increased 40% in the first month!', avatar: 'KR' },
];
const STATIC_SERVICES = [
  { name: 'Interior Design', slug: 'interior-design', icon: '✦', shortDescription: 'Full-service interior design from concept to completion, tailored to your lifestyle and aesthetic.' },
  { name: 'Space Consultation', slug: 'space-consultation', icon: '◈', shortDescription: 'Expert advice on space planning, color palettes, furniture selection and styling for your home.' },
  { name: 'Project Execution', slug: 'project-execution', icon: '⬡', shortDescription: 'End-to-end project management ensuring flawless execution on time and on budget.' },
];
const STATIC_PRODUCTS = [
  { _id: '1', name: 'Palazzo Sofa', slug: 'palazzo-sofa', price: 145000, images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80'], isFeatured: true, category: { name: 'Living Room' } },
  { _id: '2', name: 'Travertine Side Table', slug: 'travertine-side-table', price: 38000, discountPrice: 32000, images: ['https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=400&q=80'], isNew: true, category: { name: 'Living Room' } },
  { _id: '3', name: 'Rattan Floor Lamp', slug: 'rattan-floor-lamp', price: 18500, images: ['https://images.unsplash.com/photo-1513506003901-1e6a35f4f7f7?w=400&q=80'], isBestSeller: true, category: { name: 'Lighting' } },
  { _id: '4', name: 'Linen Accent Chair', slug: 'linen-accent-chair', price: 52000, discountPrice: 44000, images: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&q=80'], category: { name: 'Living Room' } },
];
const STATIC_PROJECTS = [
  { title: 'The Bandra Residence', slug: 'bandra-residence', category: 'Residential', images: [{ url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80' }], location: 'Mumbai' },
  { title: 'Azul Café, Colaba', slug: 'azul-cafe', category: 'Commercial', images: [{ url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80' }], location: 'Mumbai' },
  { title: 'Skyline Penthouse', slug: 'skyline-penthouse', category: 'Residential', images: [{ url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80' }], location: 'Pune' },
];
const STATIC_BLOG = [
  { slug: 'biophilic-design-trends', title: '7 Biophilic Design Trends Dominating 2025', excerpt: 'Bringing nature indoors has never been more refined.', tag: 'Trends', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80' },
  { slug: 'small-space-luxury', title: 'Luxury in Small Spaces: A Complete Guide', excerpt: "A compact apartment can feel just as grand as a villa.", tag: 'Tips', image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=600&q=80' },
  { slug: 'material-guide-2025', title: 'The Material Guide: Marble, Cane & Terrazzo', excerpt: 'We break down the hottest materials of the season.', tag: 'Guide', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80' },
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    getProducts({ featured: true, limit: 4 }).then(r => setFeaturedProducts(r.data.products)).catch(() => {});
    getProjects({ featured: true, limit: 3 }).then(r => setProjects(r.data.projects)).catch(() => {});
    getServices().then(r => setServices(r.data.slice(0, 3))).catch(() => {});
  }, []);

  const displayProducts = featuredProducts.length ? featuredProducts : STATIC_PRODUCTS;
  const displayProjects = projects.length ? projects : STATIC_PROJECTS;
  const displayServices = services.length ? services : STATIC_SERVICES;

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1800&q=85)` }}>
        <div className="hero-overlay" />
        <div className="container hero-content">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="hero-text">
            <motion.span variants={fadeUp} className="hero-label">Premium Interior Design Studio</motion.span>
            <motion.h1 variants={fadeUp} className="hero-title">Spaces That<br /><em>Speak Your Story</em></motion.h1>
            <motion.p variants={fadeUp} className="hero-desc">We craft exceptional interiors — from bespoke furniture to complete home transformations. Luxury design, thoughtfully executed across India.</motion.p>
            <motion.div variants={fadeUp} className="hero-btns">
              <Link to="/projects" className="btn-primary">Explore Work <FiArrowRight /></Link>
              <Link to="/shop" className="btn-hero-outline">Shop Now <FiArrowRight /></Link>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="hero-stats">
            {[['250+','Projects'],['12+','Years'],['98%','Satisfaction'],['50+','Awards']].map(([n,l]) => (
              <div className="hero-stat" key={l}><strong>{n}</strong><span>{l}</span></div>
            ))}
          </motion.div>
        </div>
        <button className="hero-scroll" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
          <span>Scroll</span><div className="scroll-line" />
        </button>
      </section>

      {/* INTRO STRIP */}
      <section className="intro-strip">
        <div className="container"><p>"Design is not just what it looks like — design is how it works." We make yours work beautifully.</p></div>
      </section>

      {/* SERVICES */}
      <section className="section services-section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="section-head">
            <motion.span variants={fadeUp} className="section-label">What We Do</motion.span>
            <motion.h2 variants={fadeUp} className="section-title">Our Interior Services</motion.h2>
            <motion.p variants={fadeUp} className="section-desc">From concept to completion, we handle every aspect of your interior transformation.</motion.p>
          </motion.div>
          <div className="services-grid">
            {displayServices.map((s, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }} className="service-card">
                <div className="service-icon">{s.icon || '✦'}</div>
                <h3>{s.name}</h3>
                <p>{s.shortDescription || 'Exceptional design crafted for your lifestyle.'}</p>
                <Link to={`/services`} className="service-link">Learn More <FiArrowRight size={14} /></Link>
              </motion.div>
            ))}
          </div>
          <div className="section-cta"><Link to="/services" className="btn-outline">View All Services <FiArrowRight /></Link></div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-head-row">
            <div><span className="section-label">Curated Collection</span><h2 className="section-title">Featured Products</h2></div>
            <Link to="/shop" className="btn-outline">Shop All <FiArrowRight /></Link>
          </div>
          <div className="products-grid">
            {displayProducts.map((p, i) => (
              <motion.div key={p._id || i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-head"><span className="section-label">Browse By Room</span><h2 className="section-title">Shop By Category</h2></div>
          <div className="categories-grid">
            {STATIC_CATEGORIES.map((cat, i) => (
              <motion.div key={cat.slug} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link to={`/shop?search=${cat.name}`} className="category-card">
                  <img src={cat.image} alt={cat.name} loading="lazy" />
                  <div className="category-overlay"><h3>{cat.name}</h3><span>Explore <FiArrowRight size={14} /></span></div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="section projects-section">
        <div className="container">
          <div className="section-head-row">
            <div><span className="section-label">Our Portfolio</span><h2 className="section-title">Recent Projects</h2></div>
            <Link to="/projects" className="btn-outline">View All <FiArrowRight /></Link>
          </div>
          <div className="projects-masonry">
            {displayProjects.map((p, i) => (
              <motion.div key={p._id || i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`project-item ${i === 0 ? 'project-large' : ''}`}>
                <Link to={`/projects/${p.slug || '#'}`} className="project-card">
                  <img src={p.images?.[0]?.url || p.images?.[0] || ''} alt={p.title} loading="lazy" />
                  <div className="project-overlay">
                    <span className="project-tag">{p.category || 'Residential'}</span>
                    <h3>{p.title}</h3>
                    <p>{p.location}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO SECTION */}
      <section className="video-section" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800&q=80)` }}>
        <div className="video-overlay" />
        <div className="container video-content">
          <span className="section-label" style={{ color: 'var(--gold-light)', justifyContent: 'center' }}>See Our Process</span>
          <h2>Watch How We Transform<br /><em>Spaces Into Experiences</em></h2>
          <button className="play-btn" onClick={() => setVideoOpen(true)}><FiPlay size={24} fill="currentColor" /><span>Watch Showreel</span></button>
        </div>
        {videoOpen && (
          <div className="video-modal" onClick={() => setVideoOpen(false)}>
            <div className="video-modal-inner" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setVideoOpen(false)}>✕</button>
              <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" title="Showreel" allow="autoplay; fullscreen" allowFullScreen />
            </div>
          </div>
        )}
      </section>

      {/* TESTIMONIALS */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-head" style={{ textAlign: 'center' }}>
            <span className="section-label" style={{ justifyContent: 'center' }}>Client Love</span>
            <h2 className="section-title">What Our Clients Say</h2>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="testimonial-card">
                <div className="quote-mark">"</div>
                <p>{t.text}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.avatar}</div>
                  <div><strong>{t.name}</strong><span>{t.role}</span></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG PREVIEW */}
      <section className="section blog-preview-section">
        <div className="container">
          <div className="section-head-row">
            <div><span className="section-label">Design Journal</span><h2 className="section-title">From Our Blog</h2></div>
            <Link to="/blog" className="btn-outline">All Articles <FiArrowRight /></Link>
          </div>
          <div className="blog-preview-grid">
            {STATIC_BLOG.map((post, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="blog-preview-card">
                <Link to={`/blog/${post.slug}`} className="blog-image"><img src={post.image} alt={post.title} loading="lazy" /></Link>
                <div className="blog-body">
                  <span className="blog-tag">{post.tag}</span>
                  <h3><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3>
                  <p>{post.excerpt}</p>
                  <Link to={`/blog/${post.slug}`} className="read-more">Read Article <FiArrowRight size={13} /></Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container cta-inner">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.span variants={fadeUp} className="section-label" style={{ color: 'var(--gold-light)', justifyContent: 'center' }}>Ready to Start?</motion.span>
            <motion.h2 variants={fadeUp}>Let's Design Your<br /><em>Perfect Space</em></motion.h2>
            <motion.p variants={fadeUp}>Book a free 30-minute consultation with our expert designers. No obligation, just inspiration.</motion.p>
            <motion.div variants={fadeUp} className="cta-btns">
              <Link to="/contact" className="btn-primary">Book Free Consultation <FiArrowRight /></Link>
              <Link to="/shop" className="btn-outline-light">Shop Products <FiArrowRight /></Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
