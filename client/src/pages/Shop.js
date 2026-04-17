import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFilter, FiSearch, FiX, FiChevronDown } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { getProducts, getCategories } from '../utils/api';
import './Shop.css';

const SORT_OPTIONS = [
  { value: '', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '',
    featured: searchParams.get('featured') || '',
  });

  useEffect(() => { getCategories().then(r => setCategories(r.data)).catch(() => {}); }, []);

  useEffect(() => {
    setLoading(true);
    const params = { ...filters, page, limit: 12 };
    Object.keys(params).forEach(k => !params[k] && delete params[k]);
    getProducts(params)
      .then(r => { setProducts(r.data.products); setTotal(r.data.total); setPages(r.data.pages); })
      .catch(() => setProducts(STATIC_PRODUCTS))
      .finally(() => setLoading(false));
  }, [filters, page]);

  const handleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => { setFilters({ search: '', category: '', minPrice: '', maxPrice: '', sort: '', featured: '' }); setPage(1); };

  return (
    <div className="shop-page">
      <div className="page-hero">
        <div className="container">
          <span className="section-label">Our Collection</span>
          <h1>The Shop</h1>
          <p>Curated furniture, lighting and decor for exceptional spaces</p>
        </div>
      </div>

      <div className="container shop-layout">
        {/* SIDEBAR */}
        <aside className={`shop-sidebar ${filterOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3>Filters</h3>
            <button onClick={clearFilters} className="clear-btn">Clear All</button>
          </div>

          <div className="filter-group">
            <label>Search</label>
            <div className="search-input">
              <FiSearch size={14} />
              <input type="text" placeholder="Search products..." value={filters.search}
                onChange={e => handleFilter('search', e.target.value)} />
            </div>
          </div>

          <div className="filter-group">
            <label>Category</label>
            {categories.map(cat => (
              <div key={cat._id} className={`filter-option ${filters.category === cat._id ? 'active' : ''}`}
                onClick={() => handleFilter('category', filters.category === cat._id ? '' : cat._id)}>
                {cat.name}
              </div>
            ))}
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-inputs">
              <input type="number" placeholder="Min ₹" value={filters.minPrice} onChange={e => handleFilter('minPrice', e.target.value)} />
              <span>–</span>
              <input type="number" placeholder="Max ₹" value={filters.maxPrice} onChange={e => handleFilter('maxPrice', e.target.value)} />
            </div>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            {SORT_OPTIONS.map(opt => (
              <div key={opt.value} className={`filter-option ${filters.sort === opt.value ? 'active' : ''}`}
                onClick={() => handleFilter('sort', opt.value)}>{opt.label}</div>
            ))}
          </div>
        </aside>

        {/* MAIN */}
        <div className="shop-main">
          <div className="shop-toolbar">
            <div className="results-info">
              {loading ? 'Loading...' : `${total} products found`}
            </div>
            <button className="filter-toggle-btn" onClick={() => setFilterOpen(!filterOpen)}>
              <FiFilter size={14} /> Filters
            </button>
          </div>

          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try adjusting your filters</p>
              <button onClick={clearFilters} className="btn-outline">Clear Filters</button>
            </div>
          ) : (
            <div className="shop-grid">
              {products.map((p, i) => (
                <motion.div key={p._id || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          )}

          {pages > 1 && (
            <div className="pagination">
              {Array.from({ length: pages }, (_, i) => (
                <button key={i} className={`page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const STATIC_PRODUCTS = [
  { _id: '1', name: 'Palazzo Sofa', slug: 'palazzo-sofa', price: 145000, images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80'], category: { name: 'Living Room' } },
  { _id: '2', name: 'Travertine Side Table', slug: 'travertine-side-table', price: 38000, discountPrice: 32000, images: ['https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=400&q=80'], isNew: true, category: { name: 'Living Room' } },
  { _id: '3', name: 'Rattan Floor Lamp', slug: 'rattan-floor-lamp', price: 18500, images: ['https://images.unsplash.com/photo-1513506003901-1e6a35f4f7f7?w=400&q=80'], isBestSeller: true, category: { name: 'Lighting' } },
  { _id: '4', name: 'Linen Accent Chair', slug: 'linen-accent-chair', price: 52000, discountPrice: 44000, images: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&q=80'], category: { name: 'Living Room' } },
  { _id: '5', name: 'Marble Coffee Table', slug: 'marble-coffee-table', price: 72000, images: ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80'], category: { name: 'Living Room' } },
  { _id: '6', name: 'Woven Wall Art', slug: 'woven-wall-art', price: 12000, images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80'], category: { name: 'Decor' } },
];

export default Shop;
