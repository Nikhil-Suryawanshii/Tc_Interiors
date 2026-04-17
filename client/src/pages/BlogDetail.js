import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlog } from '../utils/api';
import { FiArrowLeft } from 'react-icons/fi';
import './BlogDetail.css';

const STATIC = { slug:'biophilic-design-trends', title:'7 Biophilic Design Trends Dominating 2025', excerpt:'Bringing nature indoors has never been more refined.', content:`<h2>What Is Biophilic Design?</h2><p>Biophilic design is the practice of connecting people and nature within our built environments. From living walls to natural materials, this approach improves wellbeing and creates spaces that feel truly alive.</p><h2>1. Living Walls & Vertical Gardens</h2><p>Vertical gardens aren't just aesthetic — they improve air quality and reduce stress. We're seeing them in everything from residential lobbies to bedroom feature walls.</p><h2>2. Natural Stone Surfaces</h2><p>Travertine, limestone, and granite are making a major comeback — in their raw, unsealed forms. The imperfections are the point.</p><h2>3. Organic Forms & Curved Furniture</h2><p>Straight lines are stepping back. Curved sofas, rounded coffee tables, and organic shapes dominate the 2025 landscape.</p>`, tags:['Trends','Design'], readTime:5, coverImage:'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80', author:{name:'Aisha Kapoor',avatar:''}, publishedAt: new Date().toISOString() };

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const BASE = process.env.REACT_APP_API_URL?.replace('/api','') || 'http://localhost:5000';
  const img = src => src?.startsWith('http') ? src : `${BASE}${src}`;

  useEffect(() => { getBlog(slug).then(r=>setPost(r.data)).catch(()=>setPost(STATIC)).finally(()=>setLoading(false)); }, [slug]);

  if (loading) return <div className="loading-center" style={{marginTop:'120px'}}><div className="spinner"/></div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="blog-detail-page">
      <div className="blog-hero" style={{ backgroundImage:`url(${img(post.coverImage)})` }}>
        <div className="blog-hero-overlay"/>
        <div className="container blog-hero-content">
          <div className="blog-tags">{post.tags?.map(t=><span key={t} className="blog-tag">{t}</span>)}</div>
          <h1>{post.title}</h1>
          <div className="blog-meta">
            {post.author?.name && <span>By {post.author.name}</span>}
            {post.readTime && <span>{post.readTime} min read</span>}
            {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString('en-IN',{year:'numeric',month:'long',day:'numeric'})}</span>}
          </div>
        </div>
      </div>
      <div className="container">
        <div className="blog-layout">
          <article className="blog-article">
            <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>
          <aside className="blog-sidebar">
            <div className="sidebar-widget">
              <h3>About the Author</h3>
              <div className="author-card">
                <div className="author-av">{post.author?.name?.charAt(0)||'A'}</div>
                <div><strong>{post.author?.name}</strong><p>Interior Design Expert at Luxe Studio</p></div>
              </div>
            </div>
            <div className="sidebar-widget">
              <h3>Ready to Transform Your Space?</h3>
              <p>Book a free 30-min consultation with our design team.</p>
              <Link to="/contact" className="btn-primary" style={{marginTop:'1rem',width:'100%',justifyContent:'center'}}>Book Consultation</Link>
            </div>
          </aside>
        </div>
        <div style={{marginTop:'2rem'}}><Link to="/blog" className="btn-outline"><FiArrowLeft size={14}/> Back to Blog</Link></div>
      </div>
    </div>
  );
};
export default BlogDetail;
