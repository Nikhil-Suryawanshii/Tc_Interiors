import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiStar } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import './ProductCard.css';

const BASE_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const imageUrl = product.images?.[0]
    ? product.images[0].startsWith('http') ? product.images[0] : `${BASE_URL}${product.images[0]}`
    : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80';

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null;

  return (
    <div className="product-card">
      <Link to={`/shop/${product.slug}`} className="card-image-wrap">
        <img src={imageUrl} alt={product.name} loading="lazy" />
        <div className="card-badges">
          {product.isNew && <span className="badge badge-new">New</span>}
          {product.isBestSeller && <span className="badge badge-best">Best Seller</span>}
          {discount && <span className="badge badge-sale">-{discount}%</span>}
        </div>
        <div className="card-actions">
          <button className="action-btn wishlist-btn" aria-label="Wishlist"><FiHeart size={16} /></button>
          <button className="action-btn add-cart-btn" onClick={handleAddToCart} aria-label="Add to cart">
            <FiShoppingBag size={16} />
            <span>Add to Cart</span>
          </button>
        </div>
      </Link>
      <div className="card-body">
        {product.category?.name && <span className="card-category">{product.category.name}</span>}
        <h3 className="card-name"><Link to={`/shop/${product.slug}`}>{product.name}</Link></h3>
        {product.rating > 0 && (
          <div className="card-rating">
            <FiStar size={12} fill="currentColor" />
            <span>{product.rating}</span>
            <span className="review-count">({product.numReviews})</span>
          </div>
        )}
        <div className="card-price">
          {product.discountPrice ? (
            <>
              <span className="price-current">₹{product.discountPrice.toLocaleString()}</span>
              <span className="price-original">₹{product.price.toLocaleString()}</span>
            </>
          ) : (
            <span className="price-current">₹{product.price.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
