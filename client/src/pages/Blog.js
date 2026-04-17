import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiArrowRight } from 'react-icons/fi';
import { getBlogs } from '../utils/api';
import './Blog.css';

const STATIC = [
  { slug:'biophilic-design-trends', title:'7 Biophilic Design Trends Dominating 2025', excerpt:'Bringing nature indoors has never been more refined. Here are the top trends shaping green interiors.', tags:['Trends'], readTime:5, coverImage:'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80', author:{name:'Aisha Kapoor'} },
  { slug:'small-space-luxury', title:'Luxury in Small Spaces: A Complete Guide', excerpt:"A compact apartment can feel as grand as a villa — if you know the tricks our designers swear by.", tags:['Tips'], readTime:7, coverImage:'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=600&q=80', author:{name:'Rahul Mehta'} },
  { slug:'material-guide-2025', title:'The Material Guide: Marble, Cane & Terrazzo', excerpt:'We break down the hottest materials of the season and how to incorporate them tastefully.', tags:['Guide'], readTime:6, coverImage:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', author:{name:'Priya Sharma'} },
  { slug:'color-palettes-2025', title:'10 Color Palettes That Will Define Homes in 2025', excerpt:'From dusty rose to terracotta, discover which shades will dominate interiors this year.', tags:['Colors'], readTime:4, coverImage:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', author:{name:'Aisha Kapoor'} },
  { slug:'lighting-design-101', title:'Lighting Design 101: Layers That Transform Spaces', excerpt:'The right lighting strategy can make any room feel magical. Here is how to layer it correctly.', tags:['Lighting'], readTime:8, coverImage:'https://images.unsplash.com/photo-1513506003901-1e6a35f4f7f7?w=600&q=80', author:{name:'Rahul Mehta'} },
  { slug:'sustainable-interiors', title:'Sustainable Interior Design: Where to Start', excerpt:'Eco-conscious design does not mean sacrificing aesthetics. Here is how we approach sustainability.', tags:['Sustainability'], readTime:6, coverImage:'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=600&q=80', author:{name:'Priya Sharma'} },
];

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const p = {}; if (search) p.search = search;
    getBlogs(p).then(r => setBlogs(r.data.blogs)).catch(() => setBlogs(STATIC)).finally(() => setLoading(false));
  }, [search]);

  const BASE = process.env.REACT_APP_API_URL?.replace('/api','') || 'http://localhost:5000';
  const img = (src) => src?.startsWith('http') ? src : `${BASE}${src}`;
  const display = blogs.length ? blogs : STATIC.filter(b => !search || b.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="blog-page">
      <div className="page-hero">
        <div className="container">
          <span className="section-label">Design Journal</span>
          <h1>The Blog</h1>
          <p>Ideas, guides and stories from our design studio</p>
          <div className="blog-search">
            <FiSearch size={16} />
            <input type="text" placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="container blog-container">
        {loading ? <div className="loading-center"><div className="spinner"/></div> : (
          <div className="blog-grid">
            {display.map((post, i) => (
              <motion.article key={i} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.06 }} className={`blog-card ${i===0?'featured':''}`}>
                <Link to={`/blog/${post.slug}`} className="blog-card-image">
                  <img src={img(post.coverImage)} alt={post.title} loading="lazy"/>
                  {post.tags?.[0] && <span className="blog-tag-badge">{post.tags[0]}</span>}
                </Link>
                <div className="blog-card-body">
                  <div className="blog-card-meta">
                    {post.author?.name && <span>{post.author.name}</span>}
                    {post.readTime && <span>{post.readTime} min read</span>}
                  </div>
                  <h2><Link to={`/blog/${post.slug}`}>{post.title}</Link></h2>
                  <p>{post.excerpt}</p>
                  <Link to={`/blog/${post.slug}`} className="read-more">Read Article <FiArrowRight size={13}/></Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Blog;
