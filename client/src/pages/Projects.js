import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProjects } from '../utils/api';
import './Projects.css';

const CATEGORIES = ['All', 'Residential', 'Commercial', 'Hospitality', 'Office'];

const STATIC = [
  { title: 'The Bandra Residence', slug: 'bandra-residence', category: 'Residential', location: 'Mumbai', year: 2024, images: [{ url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80' }], shortDescription: 'A serene 4BHK apartment that blends warmth and minimalism.' },
  { title: 'Azul Café', slug: 'azul-cafe', category: 'Commercial', location: 'Mumbai', year: 2024, images: [{ url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80' }], shortDescription: 'Mediterranean-inspired café with handcrafted tiles and rattan accents.' },
  { title: 'Skyline Penthouse', slug: 'skyline-penthouse', category: 'Residential', location: 'Pune', year: 2023, images: [{ url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80' }], shortDescription: 'A dramatic penthouse with panoramic city views and bespoke furniture.' },
  { title: 'The Green Office', slug: 'green-office', category: 'Office', location: 'Bangalore', year: 2023, images: [{ url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' }], shortDescription: 'Biophilic office design with living walls and natural light optimization.' },
  { title: 'Retreat by the Lake', slug: 'retreat-lake', category: 'Hospitality', location: 'Lonavala', year: 2024, images: [{ url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80' }], shortDescription: 'A boutique retreat where luxury meets the natural landscape.' },
  { title: 'Urban Loft, Delhi', slug: 'urban-loft-delhi', category: 'Residential', location: 'Delhi', year: 2023, images: [{ url: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80' }], shortDescription: 'Industrial loft transformed into a vibrant urban home.' },
];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const params = activeCategory !== 'All' ? { category: activeCategory } : {};
    getProjects(params).then(r => setProjects(r.data.projects)).catch(() => setProjects(STATIC)).finally(() => setLoading(false));
  }, [activeCategory]);

  const display = projects.length ? projects : STATIC.filter(p => activeCategory === 'All' || p.category === activeCategory);

  return (
    <div className="projects-page">
      <div className="page-hero">
        <div className="container">
          <span className="section-label">Our Work</span>
          <h1>Portfolio</h1>
          <p>A curated selection of our finest interior transformations</p>
        </div>
      </div>
      <div className="container">
        <div className="filter-tabs">
          {CATEGORIES.map(c => (
            <button key={c} className={`filter-tab ${activeCategory === c ? 'active' : ''}`} onClick={() => setActiveCategory(c)}>{c}</button>
          ))}
        </div>
        {loading ? <div className="loading-center"><div className="spinner" /></div> : (
          <div className="portfolio-grid">
            {display.map((p, i) => (
              <motion.div key={p._id || i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className={`portfolio-item ${i % 5 === 0 ? 'wide' : ''}`}>
                <Link to={`/projects/${p.slug}`} className="portfolio-card">
                  <img src={p.images?.[0]?.url || p.images?.[0] || ''} alt={p.title} loading="lazy" />
                  <div className="portfolio-overlay">
                    <span>{p.category}</span>
                    <h3>{p.title}</h3>
                    <p>{p.location} · {p.year}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Projects;
