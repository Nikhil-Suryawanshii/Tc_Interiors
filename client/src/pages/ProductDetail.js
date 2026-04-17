import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiHeart, FiArrowRight, FiStar, FiMinus, FiPlus, FiPlay } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { getProduct, getReviews } from '../utils/api';
import toast from 'react-hot-toast';
import './ProductDetail.css';

const BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    getProduct(slug)
      .then(r => { setProduct(r.data); setSelectedColor(r.data.colors?.[0] || ''); getReviews({ product: r.data._id }).then(rev => setReviews(rev.data)).catch(() => {}); })
      .catch(() => setProduct(STATIC_PRODUCT))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="loading-center" style={{ marginTop: '100px' }}><div className="spinner" /></div>;
  if (!product) return <div>Product not found</div>;

  const images = product.images?.length ? product.images : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'];
  const imgUrl = (src) => src?.startsWith('http') ? src : `${BASE}${src}`;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="product-detail-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span>{product.name}</span>
        </nav>

        <div className="product-layout">
          {/* GALLERY */}
          <div className="product-gallery">
            <div className="main-image">
              <img src={imgUrl(images[activeImg])} alt={product.name} />
              {product.isNew && <span className="badge badge-new" style={{ position: 'absolute', top: '1rem', left: '1rem' }}>New</span>}
            </div>
            {images.length > 1 && (
              <div className="thumbnail-strip">
                {images.map((img, i) => (
                  <div key={i} className={`thumb ${activeImg === i ? 'active' : ''}`} onClick={() => setActiveImg(i)}>
                    <img src={imgUrl(img)} alt={`View ${i + 1}`} />
                  </div>
                ))}
              </div>
            )}
            {product.videos?.length > 0 && (
              <div className="video-thumbs">
                {product.videos.map((v, i) => (
                  <a key={i} href={v} target="_blank" rel="noreferrer" className="video-thumb">
                    <FiPlay size={20} />
                    <span>Video {i + 1}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* INFO */}
          <motion.div className="product-info" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            {product.category?.name && <span className="product-category">{product.category.name}</span>}
            <h1>{product.name}</h1>

            {product.rating > 0 && (
              <div className="product-rating">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} size={14} fill={i < Math.round(product.rating) ? 'var(--gold)' : 'none'} stroke="var(--gold)" />
                ))}
                <span>{product.rating} ({product.numReviews} reviews)</span>
              </div>
            )}

            <div className="product-price">
              {product.discountPrice ? (
                <>
                  <span className="price-main">₹{product.discountPrice.toLocaleString()}</span>
                  <span className="price-strike">₹{product.price.toLocaleString()}</span>
                  <span className="price-save">Save {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%</span>
                </>
              ) : (
                <span className="price-main">₹{product.price.toLocaleString()}</span>
              )}
            </div>

            <p className="product-short-desc">{product.shortDescription || product.description?.slice(0, 150)}</p>

            {product.colors?.length > 0 && (
              <div className="option-group">
                <label>Color: <strong>{selectedColor}</strong></label>
                <div className="color-options">
                  {product.colors.map(c => (
                    <button key={c} className={`color-btn ${selectedColor === c ? 'active' : ''}`} onClick={() => setSelectedColor(c)}>{c}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="option-group">
              <label>Quantity</label>
              <div className="qty-row">
                <div className="qty-controls">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}><FiMinus size={14} /></button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)}><FiPlus size={14} /></button>
                </div>
                <span className="stock-info">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
              </div>
            </div>

            <div className="product-actions">
              <button className="btn-primary add-to-cart" onClick={handleAddToCart} disabled={product.stock === 0}>
                <FiShoppingBag size={16} /> Add to Cart
              </button>
              <button className="btn-outline wishlist"><FiHeart size={16} /></button>
            </div>

            <div className="product-meta">
              {product.sku && <div><span>SKU:</span> {product.sku}</div>}
              {product.materials?.length > 0 && <div><span>Materials:</span> {product.materials.join(', ')}</div>}
              {product.dimensions?.length && <div><span>Dimensions:</span> {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} {product.dimensions.unit}</div>}
            </div>
          </motion.div>
        </div>

        {/* TABS */}
        <div className="product-tabs">
          <div className="tab-nav">
            {['description', 'details', 'reviews'].map(tab => (
              <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab === 'reviews' ? `Reviews (${reviews.length})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="tab-content">
            {activeTab === 'description' && <div className="description-text"><p>{product.description || 'No description available.'}</p></div>}
            {activeTab === 'details' && (
              <div className="details-grid">
                {product.dimensions?.length && <div><strong>Dimensions</strong><p>{product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} {product.dimensions.unit}</p></div>}
                {product.materials?.length > 0 && <div><strong>Materials</strong><p>{product.materials.join(', ')}</p></div>}
                {product.colors?.length > 0 && <div><strong>Available Colors</strong><p>{product.colors.join(', ')}</p></div>}
                {product.sku && <div><strong>SKU</strong><p>{product.sku}</p></div>}
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="reviews-list">
                {reviews.length === 0 ? <p>No reviews yet. Be the first to review this product.</p> : reviews.map((r, i) => (
                  <div key={i} className="review-item">
                    <div className="review-header">
                      <div className="reviewer-avatar">{r.user?.name?.charAt(0) || 'U'}</div>
                      <div><strong>{r.user?.name}</strong><div className="stars">{[...Array(5)].map((_,j) => <FiStar key={j} size={12} fill={j < r.rating ? 'var(--gold)' : 'none'} stroke="var(--gold)" />)}</div></div>
                    </div>
                    <p>{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* USED IN PROJECTS */}
        {product.usedInProjects?.length > 0 && (
          <div className="used-in-projects">
            <h2>See This Product In Action</h2>
            <div className="projects-row">
              {product.usedInProjects.map((proj, i) => (
                <Link key={i} to={`/projects/${proj.slug}`} className="project-mini">
                  <img src={proj.images?.[0]?.url || proj.images?.[0] || ''} alt={proj.title} />
                  <div><h4>{proj.title}</h4></div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const STATIC_PRODUCT = {
  _id: '1', name: 'Palazzo Sofa', slug: 'palazzo-sofa', price: 145000, discountPrice: 125000,
  description: 'The Palazzo Sofa is a masterpiece of Italian-inspired craftsmanship. Its generous proportions and sumptuous upholstery invite you to sink in and stay. The solid teak frame ensures decades of use, while the hand-stitched linen fabric ages gracefully.',
  shortDescription: 'Italian-inspired luxury sofa with solid teak frame and hand-stitched linen upholstery.',
  images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80','https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80'],
  colors: ['Sand Linen', 'Charcoal Grey', 'Ivory White'], materials: ['Teak Wood', 'Linen', 'High-Density Foam'],
  dimensions: { length: 240, width: 95, height: 85, unit: 'cm' }, stock: 5, sku: 'SOF-PAL-001',
  rating: 4.8, numReviews: 24, category: { name: 'Living Room' }, isFeatured: true
};

export default ProductDetail;
